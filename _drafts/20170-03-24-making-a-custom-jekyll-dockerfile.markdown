---
layout: v1/post
title: Making a custom Jekyll dockerfile
date: 2017-03-28
tags:
- code
---

Docker has been on my ToDo list for a long time. I took it for a spin briefly a few months ago, but I had not had the opportunity to play with it on a specific project.

I finally decided to use my own website to build a custom dockerfile, this way I could get up a running quickly on any of my 3 machines (Windows 10, Mac, Linux) without worrying about keeping Jekyll up to date, especially on Windows.

I started by following the instructions from the Docker website (https://docs.docker.com/engine/getstarted/step_four/#step-1-write-a-dockerfile). The first line I wrote into my Dockerfile was:

{% highlight bash %}
FROM jekyll/jekyll:latest
{% endhighlight %}

That's easy enough, this line would make sure I was using the latest version of Jekyll. Using the Jekyll Docker wiki (https://github.com/jekyll/docker/wiki/Usage:-Running), I wrote the command to load the website from the image:

{% highlight bash %}
docker run --name=rolspace --label=jekyll --volume=/path/to/code:/srv/jekyll -it -p 127.0.0.1:4000:4000 jekyll-rolspace /bin/bash
{% endhighlight %}

I ran into my first problem rather quickly:

<img class="center-block img-responsive" src="/assets/170328/jekyll-container-error-1.jpg" />

It seems I needed to include the pygments highlighter into my jekyll environment using a Gemfile. I do not recall having to do this the first time I started using Jekyll. A quick search gave me the reason (https://jekyllrb.com/docs/upgrading/2-to-3/#syntax-highlighter-changed).

<img class="center-block img-responsive" src="/assets/170328/jekyll-container-error-2.jpg" />

I added pygments into the Gemfile and then, I realized I was missing more stuff that would be needed in a proper Jekyll container setup...Good thing I had decided to do this.

This time docker ran successfully, and I was able to trigger the "jekyll serve" from the container's bash:

<img class="center-block img-responsive" src="/assets/170328/jekyll-container-success-1.jpg" />

My personal setup just needs an extra element to run. Since the Jekyll image already had nodejs v6.9.2 all I needed was to make sure the gulp-cli would be installed globally:

{% highlight bash %}
FROM jekyll/jekyll:latest

RUN npm install -g gulp-cli
{% endhighlight %}

I rebuild my custom image and ran the container using the command shown previously. On the bash prompt I entered the gulp command for the debug version of the site:

<img class="center-block img-responsive" src="/assets/170328/jekyll-container-success-2.jpg" />