---
layout: post
published: true
title: How to create a custom Jekyll Dockerfile&#58; Part I
date: 2017-05-06
tags:
- code
- docker
- jekyll
---
Docker has been on my ToDo list for a long time. I took it for a spin briefly a few months ago, but I had not had the opportunity to use with it on a specific project.

I finally decided to use my own website to build a custom Dockerfile, this way I could get up and running quickly on any of my 3 machines (Windows 10, Mac, Linux) without worrying about keeping Jekyll up to date, especially on Windows.

Following the instructions from the [Docker website](https://docs.docker.com/engine/getstarted/step_four/#step-1-write-a-dockerfile), the first thing I did was to create a new file named <code>Dockerfile</code>. Then, I included this line:

<pre>
#Dockerfile

FROM jekyll/jekyll:latest
</pre>

<!--more-->

That's easy enough, the first line in the Dockerfile makes certain that the Docker image will use the latest version of the Jekyll Docker image available [here](https://hub.docker.com/r/jekyll/jekyll/). Using the [Jekyll Docker wiki](https://github.com/jekyll/docker/wiki/Usage:-Running), I built my local image from the terminal, running the command from a terminal window at the path where the Dockerfile is located:

<pre id="build">$ docker build . -t jekyll-rolspace</pre>

This command creates a Docker image with the tag "jekyll-rolspace". Note you do not have to specify the name of the file as long as your file is named "Dockerfile". I can use the tag to refer to the custom image in order to create a container later:

<pre id="run">$ docker run --name=rolspace --label=jekyll --volume=/path/to/code:/srv/jekyll -it --publish 127.0.0.1:4000:4000 jekyll-rolspace /bin/bash</pre>

This command creates a container with the name "rolspace". Using the volume mapping option: <code>--volume</code>, I can make the contents of the path at <code>/path/to/code</code> available to the container locally. In this way, the container will have access to the files needed to build the website. Using the publish option: <code>--publish</code>, I will be able to access the pages with localhost and port 4000, once the site is running through the container.

By adding <code>/bin/bash</code> at the end of the command, I will have access to the container's shell once it is running. This will allow me to run commands, like <code>jekyll serve</code>.

Once the container is ready, it can be started with this command:

<pre>$ docker start rolspace -i</pre>

Unfortunately, I ran into my first problem rather quickly:

<img class="center-block img-fluid lazyload" data-src="/assets/170507/jekyll-container-error-1.png" alt= "First error when running the custom Jekyll container" />

It seems I needed to include the pygments highlighter as a dependency using a Gemfile. I do not recall having to do this the first time I started using Jekyll. A quick search gave me the [reason](https://jekyllrb.com/docs/upgrading/2-to-3/#syntax-highlighter-changed).

<img class="center-block img-fluid lazyload" data-src="/assets/170507/jekyll-container-error-2.png" alt="Second error when running the custom Jekyll container" />

I added pygments into the Gemfile and, then...I realized I was missing more dependencies...Good thing I had decided to do this. I created the Gemfile with the missing dependencies:

<pre>
#Gemfile

source 'https://rubygems.org'
gem 'jekyll'
gem 'jekyll-paginate', group: :jekyll_plugins
gem 'kramdown', group: :jekyll_plugins
gem 'pygments.rb', group: :jekyll_plugins
</pre>

This time Docker ran successfully, and I was able to trigger the <code>jekyll serve</code> command from the container's shell:

<img class="center-block img-fluid lazyload" data-src="/assets/170507/jekyll-container-success-1.png" alt="Successfully run 'jekyll server' command from container" />

My personal setup just needs an extra detail to run. Since the default Jekyll image already has nodejs v6.9.2 installed, all I need is to make sure the gulp-cli is installed:

<pre>
#Dockerfile

FROM jekyll/jekyll:latest

RUN npm install -g gulp-cli
</pre>

With this new step, I need to rebuild the Docker image and the container. I will get rid of the previous image by first stopping the container:

<pre>$ docker stop rolspace</pre>

Then, deleting the container and the image:

<pre>
$ docker container rm rolspace

$ docker image rm jekyll-rolspace
</pre>

I rebuild my custom image using the initial <a href="#build">build command</a> and <a href="#run">created the container</a>. On the bash prompt I entered the gulp command to build and host the debug version of the site:

<img class="center-block img-fluid lazyload" data-src="/assets/170507/jekyll-container-success-2.png" alt="Successfully run a custom gulp task in the Jekyll container" />

That's enough to get my site running on a local container. The next test is to make sure I could use the container on my Windows machine. I pushed my code to the repository, and built the image on the Windows machine:

<img class="center-block img-fluid lazyload" data-src="/assets/170507/jekyll-container-windows.png" width="770" height="274" alt="Successfully run the container in a Windows environment" />

In the next post, we will take a look at running a Jekyll website from a container on various cloud platforms.