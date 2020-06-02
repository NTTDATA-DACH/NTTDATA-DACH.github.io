# Technology Blog

This is a [gohugo.io](https://gohugo.io/) project. If you have never heard of
gohugo before you should go read some of the [documentation](https://gohugo.io/documentation/).

## Current

Currently i have set up an s3 Bucket in aws.

https://cps-tech-blog-draft.s3-website.eu-central-1.amazonaws.com/



## Development Setup

Gohugo ist written in golang. So you will need to have golang installed first.
See https://golang.org/doc/install

To install hugo see https://gohugo.io/getting-started/installing/

After that you should be able to run the hugo cli

    $ hugo version
    Hugo Static Site Generator v0.72.0/extended darwin/amd64 BuildDate: unknown

Clone this repository to your local environment.

    git clone git@github.com:NTTDATA-EMEA/tech-blog.git

## Directory structure

A quick explanation on the directories/files:

**config.toml**

The sites config lives in [config.toml](config.toml). There are a whole lot more
options provied that allow for various different features. See https://gohugo.io/getting-started/configuration/

**archectypes/**

Holds the content template files for the `hugo new`  command. You can always
create the content files (and their metadata) by hand but archetypes provide
a way to automate content file creation. See https://gohugo.io/content-management/archetypes/

**content/**

This is where the content lives (written in markdown). Think of this directory
structure like you would when creating a static html website by hand. Hugo
assumes your website will want use the same structure of html files as
your markdown source files do. See https://gohugo.io/content-management/

**public/**

When hugo builts the static website it will place the generated html into this
folder. This folder will be the one that is going to be served as static html content.

**themes**

The themes folder allows for multiple themes to be installed. The setting
which is to be used is done in the config.toml file.

**resources**

The resources/ folder is automatically created when generating the static output.

> There are more directories that enable other features. I hjave removed them for now
> since we currently dont use these features. See the documentation
> https://gohugo.io/getting-started/directory-structure/


## AWS Setup

Currently there is a bucket on the Cloud Platform Services AWS Account.
That is obviously temporary and should be decided upon where to
put this page at a alter stage.

The Name of the Bucket is s3://cps-tech-blog-draft/ and it lives  in the
256279413964 account.
