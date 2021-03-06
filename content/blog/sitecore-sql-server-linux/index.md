---
title: Sitecore 8.2 and SQL Server Linux
date: '2017-08-06T00:00:00.000Z'
excerpt: true
---

A few weeks ago, I ran into a problem with my work computer. For some reason, I could not install SQL Server Express, or any other version available from Microsoft. I kept receiving an error about some internal service not being set up correctly during the installation. I spent some time trying to find a solution, but I could not come up with any answers.

I decided to attempt something else, so I tried to run the MSSQL Server Docker image on my computer as a Windows container. That did not work either. I followed the setup instructions provided, checked the Docker logs, and I did as much Google research as I could to get it working.

<!--more-->

I wanted to setup a SQL Server instance in order to install Sitecore 8.2 on my machine, and I was running out of options. In the end, I chose to try to run the MSSQL Server Linux Docker image and install the Sitecore DBs on it. There was no guarantee this would work, but I felt it should.

I started by pulling the latest version of the Docker image:

```bash
> docker pull microsoft/mssql-server-linux
```

Once that was completed, I ran the container, following the instructions from the Docker Hub page:

```bash
> docker run --name ms-sql-linux -e 'ACCEPT_EULA=Y' \
    -e 'SA_PASSWORD=Password$1' -p 1433:1433 \
    -v F:/database/sqlserverlinux:/var/opt/mssql -d microsoft/mssql-server-linux
```

The options `-e 'ACCEPT\_EULA=Y'` and `-e 'SA\_PASSWORD=Password$1'` set up two environment flags that are required to start the container: one to accept the End User Agreement and the other to create an SA account password. Using -p 1433:1433 publishes the container's 1433 port to the host's 1433 port.

Finally, `-v F:/database/sqlserverlinux:/var/opt/mssql` will map the container's `/var/opt/mssql` folder to a folder in the host machine, in this case, a folder in the F drive. We need this to persist the Sitecore databases from my machine in the container.

With the container running, I connected to the database using SQL Server Management Studio.

![SQL Server Management Studio login screen](./ssms.png)

The next step was to obtain the Sitecore DBs, in order to attach them to the SQL Server Linux container. At the time of this writing, the latest Sitecore XP version is 8.2 Update-3 (rev. 170614). I downloaded the ZIP archive of the root folder and obtained the separate .mdf and .ldf files <a href="https://dev.sitecore.net/~/media/168DCCAD06C947F69BA015F3A0238F29.ashx" alt="Sitecore 8.2 download link">here</a>

I extracted the contents of the ZIP archive and copied the databases to the folder location mapped to the container.

![Folder Explorer](./folder.png)

After that, it was just a few clicks to attach each DB file to the server running in the container.

![Attach Database dialog](./attach-db.png)

Once this step was completed, I needed to install the Sitecore XP website on the host machine. Even though I already had the root folder contents from the ZIP archive, I preferred to use the <a href="https://dev.sitecore.net/~/media/C7FF1EFE55EF42428CA178E3B74FA75D.ashx" alt="Sitecore Web Application Installer download link">Web Application Installer</a>. There is no need to do a full Sitecore installation, so I selected Client Only.

![Sitecore Installation Type dialog](./client-install.png)

During the installation a screen will request information about the SQL Server connection details. I decided to fill in this information manually in the config file. However, in order to prevent the installer from attempting the connection, you will need to open the Advanced options and uncheck the "Verify that the wizard can connect to the database server".

![Sitecore Database Server dialog](./database-install.png)

Once the installation of the Sitecore Client was complete, it was time to modify the connection strings from the installation to point to our databases server from the SQL Server Linux container. The server name is used for the installation was sc82v170614

I opened the ConnectionStrings.config file inside the App_Config folder of the Sitecore client installation and made the following changes to the core, master, and web connection details:

```xml
<appSettings>
    <add name="core" connectionString="user id=sa;password=Password$1;Data Source=127.0.0.1;Database=Sitecore_Core"/>
    <add name="master" connectionString="user id=sa;password=Password$1;Data Source=127.0.0.1;Database=Sitecore_Master"/>
    <add name="web" connectionString="user id=sa;password=Password$1;Data Source=127.0.0.1;Database=Sitecore_Web"/>
    ...
</appSettings>
```

I used the connection details for the SQL Server Linux container running in my machine, then I loaded the browser and accessed the index of my local install, http://sc82v170614/

![Sitecore local install start page](./browser.png)

And that's Sitecore 8.2 running on an SQL Server Linux Docker container in a Windows machine. Looks like it worked!
