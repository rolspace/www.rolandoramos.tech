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

Once that was completed, I ran the container, following the instructions in the image's Docker Hub page:

<pre>
> docker run --name ms-sql-linux -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Password$1' -p 1433:1433 -v F:/database/sqlserverlinux:/var/opt/mssql -d microsoft/mssql-server-linux
</pre>

The options -e 'ACCEPT_EULA=Y' and -e 'SA_PASSWORD=Password$1' set up two environment flags that are required to start the container: accept the End User Agreement and create an SA account password.  Using -p 1433:1433 publishes the container's 1433 port to the host's 1433 port. Finally, -v F:/database/sqlserverlinux:/var/opt/mssql will map the container's /var/opt/mssql folder to the host's location in the F drive. We need this to persist the Sitecore databases from my machine in the container.

With the container running, I connected to it using the SQL Server Management Studio.

[Add SSMS Image]

The next step was to obtain the Sitecore DBs, in order to attach them to the SQL Server Linux container. At the time of this writing, the latest Sitecore XP version is 8.2 Update-3 (rev. 170417). By downloading the ZIP archive of the root folder, we could obtain the separate .mdf and .ldf files needed: https://dev.sitecore.net/~/media/203A8170D4664A41A8900E7AFEFC803F.ashx.

I extracted the contents of the ZIP archive and copied the databases to the location mapped to the container.

[Add folder location image]

After that, it was just necessary to attach each DB file to the server running in the container.

[Add db attach video/gif?]

Once this was completed, I needed to install the Sitecore XP website on the host machine. Even though I already had the root folder contents from the ZIP archive, I preferred to use the Executable installer. I 