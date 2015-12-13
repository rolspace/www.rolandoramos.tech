---
layout: post
published: true
title: 'IQueryable: All() vs. Any() vs. SingleOrDefault()'
date: 2014-11-03
categories:
- Uncategorized
tags:
- c#
- code
---
A few days ago, I came across some code that was throwing a Timeout Exception on an <code>if</code> statement with a condition being evaluated by the <code>IQueryable.All()</code> method.

The condition being tested was pretty straightforward, the code just needed to determine if the value of a variable matched with an existing ID in the SQL Server database.

The code was similar to this:

{% highlight c# %}
//Assume we have a table in the database called Customer
//with approx. 200.000 records.

//Determine if ALL the records in the table have a
//CustomerID that is not equal to the value of the variable
if (context.Customer.All(c => c.CustomerID != customerId))
{
   //Execute code...
}
{% endhighlight %}

<!--more-->

The Exception was being when executing the *worst case scenario* for this condition, that is, there were no values in the database that matched the variable being tested. Thus, the query had to evaluate all the records in the table.

Since this was the cause of the timeout, it seemed like a good option to change the condition in order to use the <code>IQueryable.Any()</code> method.

The statement had to be rewritten in a way that the condition would match the logic of the previous statement in order to produce the same result:

{% highlight c# %}
//Determine if ANY of the records in the table have a
//CustomerID that is equal to the value of the variable
if (!context.Customer.Any(c => c.CustomerID == customerId))
{
   //Execute code...
}
{% endhighlight %}

The <code>if</code> statement could be rewritten in such a way that the <code>IQueryable.SingleOrDefault()</code> method could be used instead:

{% highlight c# %}
//Determine if there is a record in the Customer table
//that has a CustomerID that is equal to the customerId variable
if (context.Customer.FirstOrDefault(c => c.CustomerID == customerId) == null)
{
   //Execute code...
}
{% endhighlight %}

**So which is the right method to use?** Using <code>IQueryable.Any()</code> or <code>IQueryable.SingleOrDefault()</code> made the Exceptions go away. However, the best way to find out is the best approach is to measure the execution time for the SQL queries generated through these <code>IQueryable</code> methods.

To do this, I wrote a small program that would execute each method a total of 1.000 times and log the results using a custom class inheriting from the <a href="http:&#47;&#47;msdn.microsoft.com&#47;en-us&#47;library&#47;system.data.entity.infrastructure.interception.databaselogformatter(v=vs.113).aspx" target="_blank">DatabaseLogFormatter</a> class. This way I could obtain information about the average execution time of these methods.

The test table in the database contains approximately 200.000 records. Both the database and the executable are in the same machine.

In the first run, I executed the program assuming that there is no match in the table:

<div class="table-responsive">
<table>
<thead>
<tr>
<th>&nbsp;No Match<&#47;th></p>
<th>SingleOrDefault()<&#47;th></p>
<th>Any()<&#47;th></p>
<th>All()<&#47;th><br />
<&#47;tr><br />
<&#47;thead></p>
<tbody>
<tr>
<td>Average (ms)<&#47;td></p>
<td>6.25<&#47;td></p>
<td>5.45<&#47;td></p>
<td>25.37<&#47;td><br />
<&#47;tr></p>
<tr>
<td>Minimum (ms)<&#47;td></p>
<td>6<&#47;td></p>
<td>5<&#47;td></p>
<td>23<&#47;td><br />
<&#47;tr></p>
<tr>
<td>Maximum (ms)<&#47;td></p>
<td>13<&#47;td></p>
<td>8<&#47;td></p>
<td>32<&#47;td><br />
<&#47;tr><br />
<&#47;tbody><br />
<&#47;table><br />
<&#47;div><br />
In the second run, I executed the program assuming that there is a match in the table:</p>
<div class="table-responsive">
<table>
<thead>
<tr>
<th>&nbsp;Match<&#47;th></p>
<th>SingleOrDefault()<&#47;th></p>
<th>Any()<&#47;th></p>
<th>All()<&#47;th><br />
<&#47;tr><br />
<&#47;thead></p>
<tbody>
<tr>
<td>Average (ms)<&#47;td></p>
<td>6.21<&#47;td></p>
<td>5.49<&#47;td></p>
<td>14.90<&#47;td><br />
<&#47;tr></p>
<tr>
<td>Minimum (ms)<&#47;td></p>
<td>6<&#47;td></p>
<td>5<&#47;td></p>
<td>14<&#47;td><br />
<&#47;tr></p>
<tr>
<td>Maximum (ms)<&#47;td></p>
<td>16<&#47;td></p>
<td>19<&#47;td></p>
<td>27<&#47;td><br />
<&#47;tr><br />
<&#47;tbody><br />
<&#47;table><br />
<&#47;div><br />
The results show that the <em>IQueryable.All()<&#47;em> method is not the best option for any of the scenarios tested. Using <em>Any()<&#47;em> or <em>SingleOrDefault()<&#47;em> will provide much faster results using&nbsp;less time in either case. Clearly the time difference is accentuated when comparing the <em>worst case<&#47;em> results.</p>
<p>If you take a look at the SQL code generated from the <em>IQueryable.All()<&#47;em> and <em>IQueryable.Any()<&#47;em>&nbsp;methods&nbsp;you can immediately notice the difference between them. For my specific scenario, using <em>All()&nbsp;<&#47;em>was the incorrect choice from the beginning...the logic should have been written with <em>Any().<&#47;em></p>
<pre class="striped:false lang:tsql mark:7-15,24-25 decode:true ">DECLARE @Id INT;<br />
SET @Id = 0;</p>
<p>--IQueryable.All()<br />
SELECT<br />
   CASE<br />
      WHEN (NOT EXISTS (SELECT 1 AS [C1] FROM Customer<br />
         WHERE (CustomerID = @Id)<br />
         OR<br />
         (CASE<br />
            WHEN (CustomerID <> @Id)<br />
               THEN cast(1 as bit)<br />
            WHEN (CustomerID = @Id)<br />
               THEN cast(0 as bit)<br />
         END IS NULL)))<br />
      THEN cast(1 as bit)<br />
      ELSE cast(0 as bit)<br />
   END AS [C1]<br />
FROM ( SELECT 1 AS X ) AS [SingleRowTable1]</p>
<p>--IQueryable.Any()<br />
SELECT<br />
   CASE<br />
      WHEN (EXISTS (SELECT 1 AS [C1] FROM Customer<br />
         WHERE CustomerID = @Id))<br />
      THEN cast(1 as bit)<br />
      ELSE cast(0 as bit)<br />
   END AS [C1]<br />
FROM ( SELECT 1 AS X ) AS [SingleRowTable1]<&#47;pre><br />
There will be some specific cases in which <em>IQueryable.All()<&#47;em>&nbsp;must be used in order to verify a condition on all the elements of a sequence. It important to recognize these situations and plan accordingly, in order to minimize the impact of this call on the performance of an application.</p>
