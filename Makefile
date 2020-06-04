#
# Some Examnples for using this project
#

dev:
	# Uses only _default config
	hugo serve

s3:
	rm -rf publish/s3/*
	hugo --environment s3 -D

github:
	hugo --environment github -D

# Publish static content to s3 bucket
publish_s3:
	aws s3 sync ./publish/s3/ s3://cps-tech-blog-draft/

# Push changes to the remote repository using subtree push
publish_github:
	git subtree push --prefix=publish/github/ git@github.com:NTTDATA-EMEA/nttdata-emea.github.io.git master

# If you want to fetch changes from the remote github subtree:
fetch_github:
	git subtree pull --prefix=./publish/github/ git@github.com:NTTDATA-EMEA/nttdata-emea.github.io.git master --squash
