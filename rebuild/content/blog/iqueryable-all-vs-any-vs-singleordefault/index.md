---
title: 'IQueryable: All() vs. Any() vs. SingleOrDefault()'
date: '2014-11-03T00:00:00.000Z'
---

Recently, I came across some code that was throwing a Timeout Exception on an <em>if</em> statement being evaluated using the <code>IQueryable.All()</code> method.

The condition being tested was straightforward, the code just needed to determine if the value of a variable matched with an existing Id in the SQL Server database.

The code was similar to this:

```csharp
//Assume we have a table in the database called Customer with 200.000 records.

//Determine if ALL the records in the table have a
//CustomerId that is not equal to the customerId variable
if (context.Customer.All(c => c.CustomerId != customerId))
{
   //Execute code...
}
```

<!--more-->

The Exception was thrown when executing the <em>worst case scenario</em> for this condition, that is, there were no values in the database that matched the variable being tested. Thus, the query had to evaluate all the records in the table first, in order to return the result of the method.

Since this was the cause of the timeout, it seemed like a good option to change the condition in order to use the <code>IQueryable.Any()</code> method.

The statement had to be rewritten in a way that the condition would match the logic of the previous statement in order to produce the same result:

```csharp
//Determine if ANY of the records in the Customer table
//have a CustomerID that is equal to the customerId variable
if (!context.Customer.Any(c => c.CustomerID == customerId))
{
   //Execute code...
}
```

The <em>if</em> statement could also be rewritten in order to use the <code>IQueryable.SingleOrDefault()</code> instead:

```csharp
//Find the first record in the Customer table that
//has a CustomerID that is equal to the customerId variable
if (context.Customer.FirstOrDefault(c => c.CustomerID == customerId) == null)
{
   //Execute code...
}
```

**So which is the right method to use?** Using <code>IQueryable.Any()</code> or <code>IQueryable.SingleOrDefault()</code> made the Exceptions go away. However, the best way to find out the best approach is to measure the execution time for the SQL queries generated through these methods.

I wrote a small program that would execute each method a total of 1.000 times and log the results using a custom class inheriting from the <a href="http://msdn.microsoft.com/en-us/library/system.data.entity.infrastructure.interception.databaselogformatter(v=vs.113).aspx" target="_blank">DatabaseLogFormatter</a> class. This way I could obtain information about the average execution time of these methods.

The table in the database contains approximately 200.000 records. Both the database and the executable are in the same machine.

On the first run, I executed the program assuming that there is no match in the table:

<div class="table-responsive">
<table class="table table-bordered">
<thead>
<tr>
<th>No Match</th>
<th>SingleOrDefault()</th>
<th>Any()</th>
<th>All()</th>
</tr>
</thead>
<tbody>
<tr>
<td>Average (ms)</td>
<td>6.25</td>
<td>5.45</td>
<td>25.37</td>
</tr>
<tr>
<td>Minimum (ms)</td>
<td>6</td>
<td>5</td>
<td>23</td>
</tr>
<tr>
<td>Maximum (ms)</td>
<td>13</td>
<td>8</td>
<td>32</td>
</tr>
</tbody>
</table>
</div>

On the second run, I executed the program assuming that there is a match in the table:

<div class="table-responsive">
<table class="table table-bordered">
<thead>
<tr>
<th>Match</th>
<th>SingleOrDefault()</th>
<th>Any()</th>
<th>All()</th>
</tr>
</thead>
<tbody>
<tr>
<td>Average (ms)</td>
<td>6.21</td>
<td>5.49</td>
<td>14.90</td>
</tr>
<tr>
<td>Minimum (ms)</td>
<td>6</td>
<td>5</td>
<td>14</td>
</tr>
<tr>
<td>Maximum (ms)</td>
<td>16</td>
<td>19</td>
<td>27</td>
</tr>
</tbody>
</table>
</div>

The results show that the <code>IQueryable.All()</code> method is not the best option for any of the scenarios tested. Using <code>Any()</code> or <code>SingleOrDefault()</code> will provide much faster results. Clearly the time difference is accentuated when comparing the <em>worst scenario</em> results.

If you take a look at the SQL code generated from the <code>IQueryable.All()</code> and <code>IQueryable.Any()</code> methods you can immediately notice the difference between them. For the specific scenario I described at the beginning of the article, using the <code>All()</code> method was the incorrect choice from the beginning...the logic should have been written using the <code>Any()</code> method.

```sql
SET @Id = 0;

--IQueryable.All()
SELECT
   CASE
      WHEN (NOT EXISTS (SELECT 1 AS [C1] FROM Customer
         WHERE (CustomerID = @Id)
         OR
         (CASE
            WHEN (CustomerID <> @Id)
               THEN cast(1 as bit)
            WHEN (CustomerID = @Id)
               THEN cast(0 as bit)
         END IS NULL)))
      THEN cast(1 as bit)
      ELSE cast(0 as bit)
   END AS [C1]
FROM ( SELECT 1 AS X ) AS [SingleRowTable1]

--IQueryable.Any()
SELECT
   CASE
      WHEN (EXISTS (SELECT 1 AS [C1] FROM Customer
         WHERE CustomerID = @Id))
      THEN cast(1 as bit)
      ELSE cast(0 as bit)
   END AS [C1]
FROM ( SELECT 1 AS X ) AS [SingleRowTable1]
```

There will be some specific cases in which <code>IQueryable.All()</code> must be used in order to verify a condition on all the elements of a sequence. It is important to recognize these situations and plan accordingly, in order to minimize the impact of this call on the performance of an application.
