#!/bin/bash
set -e

sync_chapter() {
    local v=$1
    local chapter="chapter-$v"

    [ -d "$chapter" ] || return

    # echo "Syncing $chapter to Bunny CDN..."

    rclone copy "$chapter" "bunny:$chapter" \
        --inplace \
        --size-only \
        --transfers 8 \
        --no-traverse \
        -v \
        --stats-one-line
}

export -f sync_chapter

# Run multiple chapters in parallel (adjust -P for CPU / network)
for d in chapter-*/; do printf '%s\n' "${d#chapter-}" | tr -d '/'; done \
    | xargs -n1 -P4 -I{} bash -c 'sync_chapter "$@"' _ {}