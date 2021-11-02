---
title: "Building Container Images Dockerless and Rootless with Buildah"
type: article
date: 2021-07-12
publishdate: 2021-07-12
image: "/posts/img/buildah.png"
draft: false
tags: ["development", "container", "buildah", "docker", "cowsay", "rootless", "ci"]
authors:
- Adam Boczek
summary: "“You cannot use Docker in our enterprise CI platform, now way! It needs root rights, thus is not secure; forget it!”, said our DevOps Chief some months ago… So we had a problem."
---

_“You cannot use Docker in our enterprise CI platform, now way! It needs root rights, thus is not secure; forget it!”_,
said our DevOps Chief some months ago… So we had a problem.

At the beginning of this year, our customer started the initiative to move the entire on-premise CICD platform to the cloud.
One of the first tasks we got as the CI team was to create a new pipeline, still using our on-premise solution, 
for building container images for the tests of the build agents running in the containers. However rootless, thus without docker…

# Before We Start
For the demonstration purposes for this post I created a simple [Dockerfile](https://github.com/NTTDATA-EMEA/tech-blog-aboczek/blob/main/202010-building-container-images-with-buildah/Dockerfile), 
which creates a container image running program `cowsay`, 
which is as we all know ["The Most Important Unix-like Command Ever”](https://medium.com/@jasonrigden/cowsay-is-the-most-important-unix-like-command-ever-35abdbc22b7f#:~:text=cowsay%20is%20a%20classic%20program,It%20just%20provides%20amusment.):
```
FROM library/debian:latest
LABEL maintainer="Adam Boczek"
LABEL version="1.0.0"
LABEL description="Blog post example image. Uses 'cowsay' 
application to demonstrate Buildah."
RUN apt-get update && \                              
    apt-get install -y cowsay                          
                          
COPY entrypoint.sh /                          
                          
ENTRYPOINT ["/entrypoint.sh"]
```
As you can see it uses a popular pattern with an external [entrypoint.sh](https://github.com/NTTDATA-EMEA/tech-blog-aboczek/blob/main/202010-building-container-images-with-buildah/entrypoint.sh) script to make this example a little more complicated 
(it may happen that the entrypoint.sh will need execution rights in the container; you can set these with the help of `chmod +x entrypoint.sh` as the last RUN command):

```
#!/bin/bash
if [ $# -eq 0 ]; then
  /usr/games/cowsay "Moo Buildah!"
else
  /usr/games/cowsay "$@"
fi
```

So, if we run the container with no parameter, our cow should say “Moo Buildah!”. When we provide some text as a parameter, it will say exactly that.

The above example is not the perfect one, it’s true. According to the [“Best practices for writing Dockerfiles”](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) it can be improved at some places 
(e.g. by replacing `:latest` tag with specific version or introducing the `USER` command etc.), but for the sake of simplicity let us use it as it is defined now.

Additionally, we omit configuration parameters typical for an enterprise environment like setting proxy, registry mirrors, etc.

# Building Container Image with Docker
## The Procedure
Having [Dockerfile](https://github.com/NTTDATA-EMEA/tech-blog-aboczek/blob/main/202010-building-container-images-with-buildah/Dockerfile) defined, we can build our container image using Docker:

```
$ docker build -t test/cowsay:1.0.0 .
Sending build context to Docker daemon   16.9kB
Step 1/7 : FROM library/debian:latest
 ---> 1510e8501783
Step 2/7 : LABEL maintainer="Adam Boczek"
 ---> Running in 7af53635b00d
Removing intermediate container 7af53635b00d
 ---> f82a93bf267c
Step 3/7 : LABEL version="1.0.0"
 ---> Running in ec46b27e4500
[...]
```

If you analyze the `docker build` output (it may look slightly different on your computer, depending on the operating system and Docker version you are running), 
you will notice the first line informing us about sending of the build context to the Docker daemon. 
Then follow lines notifying about creation of some intermediate images 
(lines like `---> 1510e8501783`), which are used to avoid altering of the state of the image being build. Some commands like `LABEL`, 
`RUN` or `ENTRYPOINT` cause creation of an intermediate container (lines like `---> Running in 7af53635b00d`) 
using latest intermediate image. Such container is then committed as the next intermediate image and removed 
(e.g. `Removing intermediate container 7af53635b00d`) if not explicitly suppressed by `--rm=false` option.

Let us run a container based on the created image to check if it works as expected:

```
$ docker run test/cowsay:1.0.0 'Moo Docker!'
 _____________
< Moo Docker! >
 -------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## The Root Problem
As stated above the Docker daemon sometimes creates intermediate images with help of committing of the intermediate containers where various commands run. 
The problem with this solution is that the Docker daemon runs in context of the root user on the host system, thus also all intermediate containers it starts. Try this:

```
$ ps -ef | grep dockerd
root     15805     1  0 Oct26 ?        00:01:32 /usr/bin/dockerd
```

In case of a CI platform it is a serious security flaw, because the design of a `Dockerfile` is out of scope of the platform, 
so we cannot control what e.g. a `RUN` command does during the build process.

## The Solution
The Docker developers know that the problem described above is an unacceptable requirement for many projects or organisations. 
Even if since Docker 20.10.0 there is a possibility to run docker daemon in non-root mode this 
feature has still some limitations (see [“Run the Docker daemon as a non-root user”](https://docs.docker.com/engine/security/rootless/) for more).

The solution to the problem is not to use Docker at all and to switch to other tool which can build a container image without the need for the root rights. 
The most interesting alternative at the time of writing is in my opinion the [Buildah](https://buildah.io/) tool.

# Building Container Image with Buildah
## The Procedure
The neat thing about Buildah is that it understands Dockerfile syntax so we can use it to build a container image with no modifications. However, 
the command line commands and parameters are different compared to these used by Docker. 
There is a special `command build-using-dockerfile` (or `bud` as an alias) in case we want to build a container image from a Dockerfile:

```
$ buildah bud -t test/cowsay:1.0.0
STEP 1: FROM library/debian:latest
STEP 2: RUN apt-get update && apt-get install -y cowsay
Get:1 http://deb.debian.org/debian buster InRelease [121 kB]
[...]
Reading package lists... Done
Building dependency tree
Reading state information... Done
[...]
STEP 4: ENTRYPOINT ["/entrypoint.sh"]
STEP 5: COMMIT test/cowsay:1.0.0
Getting image source signatures
Copying blob 9780f6d83e45 skipped: already exists
Copying blob da1ee50a72e8 done
Copying config 0f21c6d578 done
Writing manifest to image destination
Storing signatures
0f21c6d5783d8ebd954511d563ffb7f97b18ac934f022a6196c74d21d7157a70
```

Buildah uses a similar concept for building container images as Docker does. 
It starts an intermediate container where the requires modifications are made. 
Finally, it commits the container as an image and finally deletes the intermediate container. 
You can observe this if you run `buildah ps` during the image is being built:

```
$ buildah ps
CONTAINER ID  BUILDER  IMAGE ID     IMAGE NAME                       CONTAINER NAME
36a47863c34e     *     1510e8501783 docker.io/library/debian:latest  debian-working-container
```

## The Non-existing Root Problem
In the above scenario where we build a container image using Dockerfile, 
Buildah’s primary advantage over Docker is that it does not require root rights. 
We can prove it during the build process, with help of a second terminal session, as follows:

```
$ ps -ef | grep buildah
adam     22753 24432  5 09:19 pts/1    00:00:00 buildah bud -t test/cowsay:1.0.0
adam     22761 22753 99 09:19 pts/1    00:00:01 buildah-in-a-user-namespace bud -t test/cowsay:1.0.0
```

As we can see Buildah starts two processes on the host, both in the context of logged user. 
This behaviour allows us to define in the CI platform a technical user with exactly these rights that are needed to build container images, but nothing more.

As Buildah is a tool for building container images only we need another tool to run and test our image. 
Luckily we can use Docker for it, because images built with Buildah are [OCI compliant](https://opencontainers.org/), thus can be used by Docker with no modifications. 
However, if we list images using Docker, we will not find any image built by Buildah:

```
$ buildah images
REPOSITORY                 TAG      IMAGE ID       CREATED          SIZE
localhost/test/cowsay      1.0.0    0f21c6d5783d   36 minutes ago   184 MB
docker.io/library/debian   latest   1510e8501783   2 weeks ago      119 MB
$ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
test/cowsay         1.0.0               8c71301ca77f        5 seconds ago       179MB
debian              latest              1510e8501783        2 weeks ago         114MB
```

The reason for that is the Buildah’s rootless nature. 
It stores images in user context and not in daemon’s local container store as Docker does. 
To solve this problem, Buildah provides `push` command which allows, among other targets, pushing images to this Docker’s local store:

```
$ buildah push localhost/test/cowsay:1.0.0 docker-daemon:test/cowsay-buildah:1.0.0
Getting image source signatures
Copying blob 9780f6d83e45 done
Copying blob da1ee50a72e8 done
Copying config 0f21c6d578 done
Writing manifest to image destination
Storing signatures
$ docker images
REPOSITORY            TAG                 IMAGE ID            CREATED             SIZE
test/cowsay           1.0.0               8c71301ca77f        9 minutes ago       179MB
test/cowsay-buildah   1.0.0               0f21c6d5783d        44 minutes ago      178MB
debian                latest              1510e8501783        2 weeks ago         114MB
```

As we can see the `IMAGE ID` is identical `0f21c6d5783d` for both commands `buildah images` and `docker images`, 
thus both stored images are exactly the same. Now we can check our Buildah image running a container using Docker:

```
$ docker run test/cowsay-buildah:1.0.0
 ______________
< Moo Buildah! >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## What about Podman?
Using Docker to run a test container based on an image built by Buildah is not the only solution we have. 
The developers of Buildah provide a very interesting tool [Podman](https://podman.io/) which allows to run containers (and even pods with multiple containers inside) 
based on the OCI compliant images. We can even build images with Podman, but it uses under the hood Buildah as listed by `podman info` command below:

```
$ podman info
host:
  arch: amd64
  buildahVersion: 1.19.8
  cgroupManager: cgroupfs
  cgroupVersion: v1
  conmon:
    package: conmon-2.0.26-3.module+el8.4.0+11311+9da8acfb.x86_64
[...]
```

Podman operates on the same local image storage as Buildah does, so we do not need any transformation of the stored images.

Podman’s command line syntax is same as Docker, so the test of the image is easy as follows:
```
$ podman images
REPOSITORY                              TAG      IMAGE ID       CREATED          SIZE
localhost/test/cowsay-buildah-by-hand   1.0.0    a0d5154f2894   25 minutes ago   184 MB
docker.io/library/debian                latest   1510e8501783   2 weeks ago      119 MB
$ podman run localhost/test/cowsay-buildah-by-hand:1.0.0 'Hallo Podman!'
 _______________
< Hallo Podman! >
 ---------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## Dockerfile-less
Buildah’s capability to build container images without root right is really great and, as we saw, quite easy to implement. 
However, Buildah provides more than just being “better” build image tool. With Buildah,
we can create container images from the command line without using a Dockerfile! 
So let’s convert our Dockerfile to a set of Buildah commands. Here our Dockerfile again:

```
FROM library/debian:latest
LABEL maintainer="Adam Boczek"
LABEL version="1.0.0"
LABEL description="Blog post example image. Uses 'cowsay' application to demonstrate Buildah."
RUN apt-get update && \                              
    apt-get install -y cowsay                          
                          
COPY entrypoint.sh /                          
                          
ENTRYPOINT ["/entrypoint.sh"]
```

We can convert the first statement as follows:

```
$ buildah from library/debian:latest
Getting image source signatures
Copying blob e4c3d3e4f7b0 done
Copying config 1510e85017 done
Writing manifest to image destination
Storing signatures
debian-working-container
```

Buildah creates an intermediate container based on the image provided. 
This container runs now, and we can extend it with additional configuration and tools. 
We can even connect to it if we e.g. need to check its state “inside”:
```
$ buildah ps
CONTAINER ID  BUILDER  IMAGE ID     IMAGE NAME                       CONTAINER NAME
b9fc73f7cd91     *     1510e8501783 docker.io/library/debian:latest  debian-working-container
```

Let us set a variable with the name of the container, as we will need it for every Buildah command:
```
$ cont=debian-working-container
```

Now we can connect to the container and list the files in the root folder:
```
$ buildah run $cont /bin/bash
root@adams-host:/# ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@adams-host:/# exit
```

According to our Dockerfile, the next step is to create three labels:
```
$ buildah config --label maintainer="Adam Boczek" $cont
$ buildah config --label version="1.0.0" $cont
$ buildah config --label description="Blog post example image. Uses 'cowsay' application to demonstrate Buildah." $cont
```

Running `apt-get update` and `apt-get install -y cowsay` is as simple as this:
```
$ buildah run $cont apt-get update                   
Get:1 http://security.debian.org/debian-security buster/updates InRelease [65.4 kB]
[...]
Packages [7856 B]
Fetched 8396 kB in 2s (3924 kB/s)
Reading package lists... Done
$ buildah run $cont apt-get install -y cowsay
Reading package lists... Done
Building dependency tree
[...]
Setting up cowsay (3.03+dfsg2-6) ...
Processing triggers for libc-bin (2.28-10) ...
```

Having `cowsay` installed, we can copy the `entrypoint.sh` into container:
```
$ buildah copy $cont entrypoint.sh
```

One advantage of this way of building container images is the possibility to check the container if everything works as expected at any given time:
```
$ buildah run $cont ./entrypoint.sh
 ______________
< Moo Buildah! >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

The last command from the Dockerfile is the definition of the `ENTRYPOINT`:
```
buildah config --entrypoint '["./entrypoint.sh"]' $cont
```
However, before we commit the container as an image, we need to “reset” the `CMD` command from its default `bash` value:
```
$ buildah inspect $cont | grep -i -C1 cmd\"
            ],
            "Cmd": [
                "bash"
[...]
$ buildah config --cmd '' $cont
$ buildah inspect $cont | grep -i -C1 cmd\"
            ],
            "Cmd": [],
            "ArgsEscaped": true,
[...]
```
Now we are ready to commit the container and check if the image works as expected:
```
$ buildah commit debian-working-container test/cowsay-buildah-by-hand:1.0.0
Getting image source signatures
Copying blob 9780f6d83e45 skipped: already exists
Copying blob d838492054b4 done
Copying config a0d5154f28 done
Writing manifest to image destination
Storing signatures
a0d5154f2894cb8b93bb2ad4a0f0066b0fcb4b5ab3c097759100a85f73ebe967
$ buildah images
REPOSITORY                              TAG      IMAGE ID       CREATED              SIZE
localhost/test/cowsay-buildah-by-hand   1.0.0    a0d5154f2894   About a minute ago   184 MB
docker.io/library/debian                latest   1510e8501783   2 weeks ago          119 MB
$ podman run localhost/test/cowsay-buildah-by-hand:1.0.0 -p 'Moo Podman!'
 _____________
< Moo Podman! >
 -------------
        \   ^__^
         \  (@@)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## Beyond Buildah
This is of course not the end of the story. As stated at the beginning of this post, our customer decided to move the entire platform to the cloud. 
It means that also the container images have to be built in a containerized environment like Kubernetes. 
Is Buildah the right solution for this scenario is still an open question. 
There are already solutions on the market which sound to be a better solution for such environments, e.g. [Kaniko](https://github.com/GoogleContainerTools/kaniko).

# Conclusion
Using Buildah as the replacement for Docker in a CI platform seems to be a perfect solution for the problem with the root rights. 
Ability to build container images without Dockerfile directly from a CLI or using a shell script, give us flexibility that Docker does not provide. 
However, a new tool comes with its own problems, like different configuration or lack of support by other tools or plugins (e.g. Artifactory Jenkins plugin). 
So before you decide to use Buildah instead of Docker, it is important to test this solution with all relevant components of your CI platform.
