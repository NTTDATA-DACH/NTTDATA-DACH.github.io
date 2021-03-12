# Technology Blog

This is a [hugo.io](https://gohugo.io/) project. Hugo is a static website generator
written in golang. If you have never heard of hugo before you should go read some
of the [documentation](https://gohugo.io/documentation/).

* Golang installation https://golang.org/doc/install
* Hugo installation https://gohugo.io/getting-started/installing/

After you have installed both you should be able to run the hugo cli

    $ hugo version
    Hugo Static Site Generator v0.72.0/extended darwin/amd64 BuildDate: unknown

## Development setup

Clone this repository to your local environment.

    git clone git@github.com:NTTDATA-EMEA/tech-blog.git

Now you

In order to publish to github pages (nttdata-emea.github.io) you need to
set up a git remote to the repository where the static files live.

    git remote add -f nttdata-emea git@github.com:NTTDATA-EMEA/nttdata-emea.github.io.git


Currently i have set up an s3 Bucket in aws.

http://cps-tech-blog-draft.s3-website.eu-central-1.amazonaws.com/



git subtree pull --prefix .vim/bundle/tpope-vim-surround https://bitbucket.org/vim-plugins-mirror/vim-surround.git master --squash


## Development Setup

## AWS Setup

Currently there is a bucket on the Cloud Platform Services AWS Account.
That is obviously temporary and should be decided upon where to
put this page at a alter stage.

The Name of the Bucket is s3://cps-tech-blog-draft/ and it lives  in the
256279413964 account.

## Content Editing

- Add plogposts by adding new files to content/posts
- To create a new author add a file unter content/authors. The name of the file is the urlified name (use dashes instead of spaces). Add the data in the file.
