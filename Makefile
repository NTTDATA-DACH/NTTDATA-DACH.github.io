#
#


# Fetch upstream changes from nttdata-emea.github.io
# Note that thes changes will be copied
fetchgithub:
	git subtree pull --prefix nttdata-emea.github.io git@github.com:NTTDATA-EMEA/nttdata-emea.github.io.git master --squash

pubs3:
	hugo -D
	aws s3 sync ./nttdata-emea.github.io/ s3://cps-tech-blog-draft/

pubgithub:
	aws s3
