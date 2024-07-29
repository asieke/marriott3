#!/bin/bash

# Find all index.ts files in the current directory and subdirectories
find . -name 'index.ts' | while read -r index_file; do
  # Get the directory containing the index.ts file
  dir=$(dirname "$index_file")

  # Initialize content variable
  content=""

  # Loop through all files in the directory except index.ts
  for file in "$dir"/*; do
    if [[ "$(basename "$file")" != "index.ts" && -f "$file" ]]; then
      # Get the filename without extension and the extension
      filename=$(basename "$file")
      filename_without_ext=$(basename "$file" .${file##*.})

      # Append the export line to the content
      content+="export { default as $filename_without_ext } from './$filename';"$'\n'
    fi
  done

  # Overwrite index.ts with the generated content
  echo -e "$content" > "$index_file"
done
