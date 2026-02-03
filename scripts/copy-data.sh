#!/bin/bash
# Copy opportunities data into the project for deployment

SOURCE_DIR="${DATA_PATH:-/home/hcai/grants/hcai-grant-flow/ai-model/03_outputs/opportunities-v2}"
DEST_DIR="./data/opportunities"

echo "Copying data from $SOURCE_DIR to $DEST_DIR"

# Create destination directory
mkdir -p "$DEST_DIR"

# Copy CSV file
cp "$SOURCE_DIR/ENRICHED-OPPORTUNITIES.csv" "$DEST_DIR/" 2>/dev/null || echo "Warning: No CSV found"

# Copy opportunity folders
for dir in "$SOURCE_DIR"/[0-9][0-9][0-9]-*; do
  if [ -d "$dir" ]; then
    folder_name=$(basename "$dir")
    echo "Copying $folder_name..."
    cp -r "$dir" "$DEST_DIR/"
  fi
done

# Copy global files
cp "$SOURCE_DIR/GLOBAL-INDEX.md" "$DEST_DIR/" 2>/dev/null || echo "No GLOBAL-INDEX.md"
cp "$SOURCE_DIR/TIMELINE.md" "$DEST_DIR/" 2>/dev/null || echo "No TIMELINE.md"
cp "$SOURCE_DIR/PRIOR-RELATIONSHIPS.md" "$DEST_DIR/" 2>/dev/null || echo "No PRIOR-RELATIONSHIPS.md"

echo "Data copy complete!"
ls -la "$DEST_DIR" | head -20
