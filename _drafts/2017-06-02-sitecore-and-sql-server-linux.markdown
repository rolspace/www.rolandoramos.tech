---
layout: v1/post
published: false
title: Sitecore 8.2 and MSSQL Server Linux
date: 2017-06-02
tags:
- code
- docker
- sitecore
---

A few weeks ago I ran into a problem with my work computer. For some reason I could not install SQL Server Express, or any other version. I kept getting an error about some internal service not being installed correctly. I spent some time trying to find a solution, but I could not come up with any answers.

I decided to try something else, so I attempted to get the MSSQL Server Docker image running on my computer. Unfortunately, that did not work either. I followed the setup instructions provided, checked the Docker logs, and I did as much Google research as I could to get it working.

I wanted to setup a SQL Server instance in order to install Sitecore 8.2 on my machine, and I was running out of options. In the end, I chose to try to run the MSSQL Server Linux Docker image and install the Sitecore DBs on it. There was no guarantee this would work, but it felt it should.

I started by getting the image:

<pre>
> docker pull microsoft/mssql-server-linux
</pre>

Once that was completed, then I run the container, following the instructions in the image's Docker Hub page:

<pre>
docker run --name ms-sql-linux -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Password$1' -p 1433:1433 -d microsoft/mssql-server-linux
</pre>

Using this configuration I can SQL Server Management Studio to connect to the container using the following details:

