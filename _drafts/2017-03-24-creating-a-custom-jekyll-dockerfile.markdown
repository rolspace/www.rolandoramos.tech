---
layout: v1/post
title: Creating a custom Jekyll dockerfile&#58; Part I
date: 2017-03-28
tags:
- code
---
Docker has been on my ToDo list for a long time. I took it for a spin briefly a few months ago, but I had not had the opportunity to play with it on a specific project.

I finally decided to use my own website to build a custom dockerfile, this way I could get up a running quickly on any of my 3 machines (Windows 10, Mac, Linux) without worrying about keeping Jekyll up to date, especially on Windows.

Following the instructions from the [Docker website](https://docs.docker.com/engine/getstarted/step_four/#step-1-write-a-dockerfile), the first thing I do is to create a new file, and give it the name <code>Dockerfile</code>. Then, I include this line in my Dockerfile:

{% highlight bash %}
FROM jekyll/jekyll:latest
{% endhighlight %}

<!--more-->

That's easy enough, the first line in the Dockerfile makes certain that the Docker image will use the latest version of the Jekyll Docker image. Using the [Jekyll Docker wiki](https://github.com/jekyll/docker/wiki/Usage:-Running), I built my local image from the terminal, running the command at the path where the Dockerfile is located:

{% highlight bash %}
docker build . -t jekyll-rolspace
{% endhighlight %}

This command creates a Docker image with the tag "jekyll-rolspace". Note you do not have to specify the name of the file as long as your file is named "Dockerfile". I can use the tag to refer to the custom image in order to create a container later:

{% highlight bash %}
docker run --name=rolspace --label=jekyll --volume=/path/to/code:/srv/jekyll -it --publish 127.0.0.1:4000:4000 jekyll-rolspace /bin/bash
{% endhighlight %}

This command creates a container with the name "rolspace". Using the volume mapping option: <code>--volume</code>, I can make the contents of the path at <code>/path/to/code</code> available to the container locally. In this way, the container will have access to the files needed to build the website. Using the publish option: <code>--publish</code>, I will be able to access the pages with localhost and port 4000, once the site is running through the container.

By adding <code>/bin/bash</code> at the end of the command, I will have access to the container's shell once it is running. This will allow me to run commands like <code>jekyll serve</code>.

Unfortunately, I ran into my first problem rather quickly:

<img class="center-block lazyload" data-src="/assets/170328/jekyll-container-error-1.png" width="770" height="163" />

It seems I need to include the pygments highlighter as a dependency using a Gemfile. I do not recall having to do this the first time I started using Jekyll. A quick search gave me the [reason](https://jekyllrb.com/docs/upgrading/2-to-3/#syntax-highlighter-changed).

<img class="center-block lazyload" data-src="/assets/170328/jekyll-container-error-2.png" width="770" height="186" />

I added pygments into the Gemfile and, then...I realized I was missing more dependencies...Good thing I had decided to do this. I created the Gemfile with the missing dependencies:

{% highlight ruby %}
source 'https://rubygems.org'
gem 'jekyll'
gem 'jekyll-paginate', group: :jekyll_plugins
gem 'kramdown', group: :jekyll_plugins
gem 'pygments.rb', group: :jekyll_plugins
{% endhighlight %}

This time docker ran successfully, and I was able to trigger the <code>jekyll serve</code> from the container's shell:

<img class="center-block lazyload" data-src="/assets/170328/jekyll-container-success-1.png" width="770" height="481" />

My personal setup just needs an extra element to run. Since the default Jekyll image already has nodejs v6.9.2 installed, all I needed was to make sure the gulp-cli would be installed:

{% highlight bash %}
FROM jekyll/jekyll:latest

RUN npm install -g gulp-cli
{% endhighlight %}

I rebuild my custom image and setup the container. On the bash prompt I entered the gulp command for the debug version of the site:

<img width="770" height="413" data-src="/assets/170328/jekyll-container-success-2.png" class="center-block lazyload" />

That's enough to get my site running on a local container. The next test is to make sure I could use the resulting container on my Windows machine. I pushed my code to the repository, and built the image on the Windows machine:

<img class="center-block lazyload" data-src="/assets/170328/jekyll-container-windows.png" />

In the next part, we will take a look at running a Jekyll website from a container on various cloud platforms.