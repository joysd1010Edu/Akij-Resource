#!/bin/bash

# Git commit and push with specific date/time (April 14, 2026 at 4:28 AM)
# This script creates a commit with a backdated timestamp

COMMIT_DATE="2026-04-14T04:28:00"
COMMIT_MESSAGE="${1:-Docker setup: Backend ready for Docker implementation}"

# Option 1: Commit with author date and committer date
git commit --allow-empty -m "$COMMIT_MESSAGE" \
  --date="$COMMIT_DATE" \
  -c user.name="Developer" \
  -c user.email="dev@example.com"

# Push to remote
git push origin main

echo "✓ Commit created with date: $COMMIT_DATE"
echo "✓ Changes pushed to remote repository"
