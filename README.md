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

    git clone git@github.com:NTTDATA-DACH/tech-blog.git

Now you

In order to publish to github pages (NTTDATA-DACH.github.io) you need to
set up a git remote to the repository where the static files live.

    git remote add -f nttdata-dach git@github.com:NTTDATA-DACH/NTTDATA-DACH.github.io.git


## Development Setup
tbd.

## Content Editing

- Add blogposts by adding new files to content/posts
- To create a new author add a file unter content/authors. The name of the file is the urlified name (use dashes instead of spaces). Add the data in the file.
