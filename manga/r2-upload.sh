#!/bin/bash
set -e

set -a
source ./.env
set +a

sync_chapter() {
    local c=$1
    local chapter="chapter-$c"

    [ -d "$chapter" ] || return

    aws s3 sync "$chapter" "s3://$BUCKET_NAME/$chapter" \
        --endpoint-url "https://"$ACCOUNT_ID".eu.r2.cloudflarestorage.com" \
        --size-only \
        --no-progress
}

export -f sync_chapter

# Run multiple chapters in parallel (adjust -P for CPU / network)
for d in chapter-*/; do printf '%s\n' "${d#chapter-}" | tr -d '/'; done \
    | xargs -n1 -P4 -I{} bash -c 'sync_chapter "$@"' _ {}