<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { modalShowing } from '$lib/stores';

	import { Mic } from 'lucide-svelte';

	let mediaRecorder: MediaRecorder;
	let audioContext: AudioContext;
	let analyser: AnalyserNode;
	let microphone: MediaStreamAudioSourceNode;
	let silenceInterval: NodeJS.Timeout;
	let mediaStream: MediaStream;
	const sampleRate = 44100; // Standard sample rate in Hz
	const duration = 1; // Duration to analyze in seconds
	const bufferLength = sampleRate * duration; // Number of samples to analyze
	const dataArray = new Uint8Array(bufferLength);

	let volumes: number[] = [];

	let audioElement: HTMLAudioElement;

	let recording = true;
	let output = '';

	onMount(() => {
		console.log('Hello');
		startRecording();
	});

	onDestroy(() => {
		console.log('Goodbye');
		stopRecording();
	});

	async function startRecording() {
		console.log('starting to record');
		try {
			mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
			audioContext = new AudioContext();
			analyser = audioContext.createAnalyser();
			microphone = audioContext.createMediaStreamSource(mediaStream);
			microphone.connect(analyser);
			analyser.fftSize = 2048;

			mediaRecorder = new MediaRecorder(mediaStream);
			mediaRecorder.ondataavailable = async (event) => {
				if (event.data.size > 0) {
					console.log('Recording data:', event.data);
					await sendAudioToServer(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				console.log('done');
			};

			mediaRecorder.start();

			silenceInterval = setInterval(() => {
				checkSilence();
			}, 200);
		} catch (err) {
			console.error('Error accessing microphone:', err);
		}
	}

	function stopRecording() {
		console.log('we are going to stop recording now');
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
		}
		if (audioContext) {
			audioContext.close();
		}
		if (mediaStream) {
			mediaStream.getTracks().forEach((track) => track.stop());
		}
		clearInterval(silenceInterval);
	}

	function checkSilence() {
		analyser.getByteTimeDomainData(dataArray);
		const maxVolume = Math.max(...dataArray);
		volumes.push(maxVolume);

		console.log('volumes', volumes);

		// if the user has already spoken and the last 10 volumes are <= 128 then stop recording
		if (Math.max(...volumes) > 130 && volumes.slice(-10).every((volume) => volume <= 130)) {
			stopRecording();
		}
	}

	async function sendAudioToServer(blob: Blob) {
		try {
			// ========================================
			// convert the audio to text
			// ========================================

			const responseText = await fetch('/app/api/ai/transcribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/octet-stream'
				},
				body: await blob.arrayBuffer()
			});
			const { text: dataText } = await responseText.json();
			console.log('[1] Transcribed Audio: ', dataText);

			// ========================================
			// convert the audio to text
			// ========================================

			const responseLLM = await fetch('/app/api/ai/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/octet-stream'
				},
				body: JSON.stringify({ role: 'user', content: dataText })
			});

			const { text: dataLLM } = await responseLLM.json();
			console.log('[2] Generated Text: ', dataLLM);

			// ========================================
			// convert the text to audio
			// ========================================

			const responseMP3 = await fetch('/app/api/ai/speak', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ text: dataLLM })
			});

			const audioData = await responseMP3.arrayBuffer();
			const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
			const audioUrl = URL.createObjectURL(audioBlob);
			audioElement.src = audioUrl;
			await audioElement.play();

			recording = false;
			output = dataLLM;

			console.log('[3] Generated MP3: ', responseMP3);
		} catch (error) {
			console.error('Error sending audio to server:', error);
		}
	}

	const handleAudioEnded = () => {
		modalShowing.set(false);
	};
</script>

<div class="absolute z-50 h-[100vh] w-[100vw] bg-black/80">
	<div class="ml-[20vw] mt-[15vh] h-[60vh] w-[60vw] rounded bg-slate-100 shadow-xl">
		<div
			class="flex h-full w-full items-center justify-center p-16 text-center text-4xl leading-relaxed text-slate-700"
		>
			{#if recording}
				<Mic class="h-1/4 w-1/4 animate-pulse stroke-red-700" />
			{:else}
				<p>{output}</p>
			{/if}
		</div>
	</div>
	<audio class="hidden" bind:this={audioElement} controls on:ended={handleAudioEnded}></audio>
</div>
