#
# Some Examnples for using this project
#

dev:
	# Uses only _default config
	hugo serve

gh:
	hugo --environment github -D

# Push changes to the remote repository using subtree push
pubgh:
	git subtree push --prefix=publish/github/ git@github.com:NTTDATA-DACH/NTTDATA-DACH.github.io.git main

# If you want to fetch changes from the remote github subtree:
fetch_github:
	git subtree pull --prefix=./publish/github/ git@github.com:NTTDATA-DACH/NTTDATA-DACH.github.io.git main --squash
