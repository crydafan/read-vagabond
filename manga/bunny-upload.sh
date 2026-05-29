#!/bin/bash
set -e

sync_chapter() {
    local v=$1
    local chapter="chapter-$v"

    [ -d "$chapter" ] || return

    rclone copy "$chapter" "bunny:$chapter" \
        --inplace \
        --size-only \
        --transfers 8 \
        --no-traverse
}

export -f sync_chapter

# Run multiple chapters in parallel (adjust -P for CPU / network)
seq -w 1 322 | xargs -n1 -P4 -I{} bash -c 'sync_chapter "$@"' _ {}
