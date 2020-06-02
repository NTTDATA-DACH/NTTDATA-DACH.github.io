#
#


# Fetch upstream changes from nttdata-emea.github.io
fetch_github:
	git subtree pull --prefix=./publish/github/ git@github.com:NTTDATA-EMEA/nttdata-emea.github.io.git master --squash


publish_s3:
	aws s3 sync ./publish/s3/ s3://cps-tech-blog-draft/

publish_github:
	git subtree push --prefix=publish/github/ git@github.com:NTTDATA-EMEA/nttdata-emea.github.io.git master
