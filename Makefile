# Simple make target to publish the site
#
#


pubs3:
	hugo -D
	aws s3 sync ./public/ s3://cps-tech-blog-draft/

pibgithub:
	aws s3
