# Python script for git commit and push with specific date/time
# April 14, 2026 at 4:28 AM

import subprocess
import sys
from datetime import datetime

def push_with_date(commit_message=None):
    """
    Create and push a git commit with a specific date/time
    Date: April 14, 2026 at 4:28 AM
    """
    
    commit_date = "2026-04-14T04:28:00"
    if not commit_message:
        commit_message = "Docker setup: Backend ready for Docker implementation"
    
    try:
        print(f"📝 Creating commit with date: {commit_date}")
        
        # Create commit with backdated timestamp
        cmd_commit = [
            'git', 'commit',
            '--allow-empty',
            '-m', commit_message,
            f'--date={commit_date}'
        ]
        subprocess.run(cmd_commit, check=True)
        print("✓ Commit created successfully")
        
        # Push to remote
        print("🚀 Pushing to remote repository...")
        cmd_push = ['git', 'push', 'origin', 'main']
        subprocess.run(cmd_push, check=True)
        print("✓ Changes pushed successfully")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    commit_msg = sys.argv[1] if len(sys.argv) > 1 else None
    push_with_date(commit_msg)
