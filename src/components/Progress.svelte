<script lang="ts">
	export let progress = 0;
</script>

<div class="w-full py-4">
	<div class="relative h-12 w-full rounded-lg bg-slate-200">
		<div class="absolute right-4 top-0 flex h-12 items-center">
			{isNaN(progress) ? 0 : progress}%
		</div>
		<div
			class="h-12 rounded-lg bg-blue-400"
			style={`width: ${isNaN(progress) ? 0 : progress}%`}
		></div>
	</div>
</div>
