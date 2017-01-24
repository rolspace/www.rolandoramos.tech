---
layout: v1/post
published: true
title: List unused Sitecore Templates with SPE
date: 2016-10-31
tags:
- code
- sitecore
---
[SPE]: https://sitecorepowershell.gitbooks.io/sitecore-powershell-extensions/ "Sitecore PowerShell Extensions"
[SPE Reports]: https://sitecorepowershell.gitbooks.io/sitecore-powershell-extensions/reports.html "SPE Reports"

This is a simple PowerShell script that you can use in Sitecore with the [SPE][SPE], in order to find all templates in a template path which are not being referenced. The script will remove __Standard Values from the referrers list, so any templates that are referred only by the __Standard Values will be ignored.

{% highlight powershell %}
#Get all templates that are not being referenced in a template path.

#Get the Templates, but exclude default Templates and __Standard Values
$templates = Get-ChildItem -Path 'master:\sitecore\templates\path\to\templates' -Recurse |`
    Where-Object { $_.TemplateName -ne 'Template Folder' `
    	-and $_.TemplateName -ne 'Template field' `
        -and $_.TemplateName -ne 'Template section' `
        -and $_.Name -ne '__Standard Values' }

$myArray = New-Object System.Collections.ArrayList

foreach ($template in $templates) {
    #Get Referrers, and exclude __Standard Values
    $links = $template | Get-ItemReferrer -ErrorAction SilentlyContinue | `
        Where-Object { $_.Paths.Path -notlike '*' + $_.Template.FullName + '*' }
    
    if ($links.Count -eq 0) {
        [void]$myArray.Add($template)
    }
}
    
$myArray | Format-Table Name, @{ Label = 'Path'; Expression={ $_.Paths.Path } }

{% endhighlight %}

This script can be used as a started for additional actions like archiving or deleting the unused templates, or even setting up [SPE Reports][SPE Reports] to filter the query with additional parameters.