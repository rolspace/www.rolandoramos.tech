---
layout: post
status: publish
published: true
title: 'SQL Server: the PIVOT operator'
date: 2014-09-24
tags:
- code
- sql server
---
 The SQL Server Pivot feature is quite useful in scenarios that require a slight manipulation of a table's structure in order to display unique column values as column headers.

 Suppose there was a table with the following schema:

{% highlight sql %}
CREATE TABLE [Employee] (
  [ID] [int] NOT NULL,
  [JobTitle] [nvarchar](50) NOT NULL,
  [Gender] [nchar](1) NOT NULL,
  [BirthDate] [date] NOT NULL,
  [HireDate] [date] NOT NULL)
{% endhighlight %}

<!--more-->

Here is some sample data for the Employee table:

<div class="table-responsive">
<table class="table table-bordered">
<thead>
<tr>
<th>ID</th>
<th>JobTitle</th>
<th>Gender</th>
<th>BirthDate</th>
<th>HireDate</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>Emperor</td>
<td>Male</td>
<td>1969-01-29</td>
<td>2009-01-14</td>
</tr>
<tr>
<td>2</td>
<td>Sith Lord</td>
<td>Male</td>
<td>1971-08-01</td>
<td>2008-01-31</td>
</tr>
<tr>
<td>3</td>
<td>Death Star Tech</td>
<td>Female</td>
<td>1987-05-23</td>
<td>2010-10-11</td>
</tr>
<tr>
<td>4</td>
<td>Stormtrooper</td>
<td>Male</td>
<td>1966-11-11</td>
<td>2005-07-20</td>
</tr>
<tr>
<td>5</td>
<td>Imperial Guard</td>
<td>Female</td>
<td>1975-06-05</td>
<td>2006-08-03</td>
</tr>
<tr>
<td>6</td>
<td>TIE Bomber Pilot</td>
<td>Female</td>
<td>1977-08-08</td>
<td>2011-04-25</td>
</tr>
<tr>
<td style="text-align: left;" colspan="5">etc, etc...</td>
</tr>
</tbody>
</table>
</div>

Now, let&acute;s say you wanted to obtain a result set that provides the average age of the employees broken down by hire year, using a query like this:

{% highlight sql %}
SELECT DATEPART(YEAR, HireDate) as HireYear,
  AVG(DATEDIFF(YEAR, BirthDate, GETDATE())) as AverageAge
FROM Employee
  GROUP BY DATEPART(YEAR, HireDate)
{% endhighlight %}

The results:
<div class="table-responsive">
<table class="table table-bordered">
<thead>
<tr>
<th>HireYear</th>
<th>AverageAge</th>
</tr>
</thead>
<tbody>
<tr>
<td>2010</td>
<td>29</td>
</tr>
<tr>
<td>2011</td>
<td>37</td>
</tr>
<tr>
<td>2012</td>
<td>33</td>
</tr>
<tr>
<td>2013</td>
<td>27</td>
</tr>
<tr>
<td style="text-align: left;" colspan="2">etc, etc...</td>
</tr>
</tbody>
</table>
</div>

This is a standard relational result set, but what if we needed to display the data a little differently? What if we needed to display the result set using the <code>HireYear</code> as the columns of the result set? This is where the Pivot command comes in.

 This feature provides a way to modify a result set from a query in a way that allows the unique values from a column to be displayed as the column headers in the pivoted data. In order to start writing a Pivot query, you need a source query expression. For our example, we can use the following query:

{% highlight sql %}
SELECT DATEPART(YEAR, HireDate) as HireYear
  DATEDIFF(YEAR, BirthDate, GETDATE()) as Age,
FROM Employee
{% endhighlight %}

This is a simplified version of the query in the previous section since it is not calculating the average of the age. It will display the <code>HireYear</code> and <code>Age</code> for every Employee, so there would be no average calculation at first; that comes in later. This would be the source expression.

 Using the source expression, we need to tell the Pivot query the data that we want to use for our rows, as well as the values from the source that we want to use for our columns.

 In the example this is easy to spot, for the data rows we want to use the average Employee age based on the year they were hired, so we apply the AVG aggregate function to the <code>Age</code> values from the source query.

 For the column headers, we want to use the unique values from the <code>HireYear</code> column in the source query. Once this is ready, all that remains is to perform a SELECT on the pivoted data in order to display it.

{% highlight sql %}
SELECT 'AverageAge' AS HireYear,
  PVT.[2010], PVT.[2011],
  PVT.[2012], PVT.[2013]
FROM
  /* Source Query */
  (SELECT DATEPART(YEAR, HireDate) as HireYear
    DATEDIFF(YEAR, BirthDate, GETDATE()) as Age,
  FROM Employee) AS SOURCE
    PIVOT
    /* Data rows and pivoted columns */
    (AVG(Age)
    FOR HireYear IN ([2010],[2011],[2012],[2013])) as PVT
{% endhighlight %}

The result of this query is shown in the following table.

<div class="table-responsive">
<table class="table table-bordered table-post" style="table-layout: fixed;">
<thead>
<tr>
<th>HireYear</th>
<th>2010</th>
<th>2011</th>
<th>2012</th>
<th>2013</th>
</tr>
</thead>
<tbody>
<tr>
<td>AverageAge</td>
<td>29</td>
<td>37</td>
<td>33</td>
<td>27</td>
</tr>
</tbody>
</table>
</div>

As you can see, the Pivot command can be quite handy in order to manipulate the structure of a table for various purposes, this might be useful some day.