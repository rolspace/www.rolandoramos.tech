---
layout: v1/post
title: The IEnumerable.GroupBy Overloads
date: 2016-03-08
tags:
- c#
- code
---
From time to time, I have had the need to create a few Linq queries using the GroupBy command. For some reason, I have always found it easier to use the query syntax, instead of Lambda expressions.

Today I decided to go through each of the GroupBy overloads in order to clarify things and make life easier on my end (and maybe for you as well!). One note though, I have decided not include the overloads using the <code>IEqualityComparer</code>, as they are the same version of another overload with just an additional parameter.

<!--more-->

In these examples I will use data from this table:

<div class="table-responsive">
<table class="table table-bordered">
<thead>
<tr>
<th>ID</th>
<th>Type</th>
<th>FirstName</th>
<th>LastName</th>
<th>Age</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>EM</td>
<td>Ken</td>
<td>Sánchez</td>
<td>25</td>
</tr>
<tr>
<td>2</td>
<td>EM</td>
<td>Terri</td>
<td>Duffy</td>
<td>47</td>
</tr>
<tr>
<td>3</td>
<td>EM</td>
<td>Roberto</td>
<td>Tamburello</td>
<td>34</td>
</tr>
<tr>
<td>6</td>
<td>SP</td>
<td>Stephen</td>
<td>Jiang</td>
<td>29</td>
</tr>
<tr>
<td>7</td>
<td>SP</td>
<td>Michael</td>
<td>Blythe</td>
<td>30</td>
</tr>
<tr>
<td>8</td>
<td>SP</td>
<td>Linda</td>
<td>Mitchell</td>
<td>23</td>
</tr>
<tr>
<td>9</td>
<td>SP</td>
<td>Jillian</td>
<td>Carson</td>
<td>43</td>
</tr>
<tr>
<td>10</td>
<td>SP</td>
<td>Garrett</td>
<td>Vargas</td>
<td>56</td>
</tr>
<tr>
<td>11</td>
<td>SC</td>
<td>Gustavo</td>
<td>Achong</td>
<td>37</td>
</tr>
<tr>
<td>12</td>
<td>SC</td>
<td>Catherine</td>
<td>Abel</td>
<td>40</td>
</tr>
<tr>
<td>13</td>
<td>SC</td>
<td>Kim</td>
<td>Abercrombi</td>
<td>38</td>
</tr>
<tr>
<td>14</td>
<td>SC</td>
<td>Humberto</td>
<td>Acevedo</td>
<td>27</td>
</tr>
<tr>
<td>15</td>
<td>VC</td>
<td>Paula</td>
<td>Moberly</td>
<td>30</td>
</tr>
<tr>
<td>16</td>
<td>VC</td>
<td>Suchitra</td>
<td>Mohan</td>
<td>35</td>
</tr>
<tr>
<td>17</td>
<td>IN</td>
<td>David</td>
<td>Robinett</td>
<td>33</td>
</tr>
<tr>
<td>18</td>
<td>IN</td>
<td>Rebecca</td>
<td>Robinson</td>
<td>29</td>
</tr>
<tr>
<td>19</td>
<td>IN</td>
<td>Dorothy</td>
<td>Robinson</td>
<td>41</td>
</tr>
<tr>
<td>20</td>
<td>IN</td>
<td>Carol Ann</td>
<td>Rockne</td>
<td>36</td>
</tr>
</tbody>
</table>
</div>

This table is a scaled down version of the Person.Person table found in the AdventureWorks database freely provided by Microsoft. I am using a table with only 20 records to better illustrate how the overloads work. The table has been mapped to the following C# class using EF Code First:

{% highlight c# %}
public class AWContext : DbContext
{
    public AWContext() { }
 
    public DbSet<Person> People { get; set; }
}
 
public class Person
{
    public int Id { get; set; }
 
    public string Type { get; set; }
 
    public string FirstName { get; set; }
 
    public string LastName { get; set; }
}
{% endhighlight %}


Now it is time to start calling the GroupBy methods. This post will discuss the Lamdba implementation of each overload, however, the Linq syntax implementation is included as well. Here we go:

<p class="subtitle">1. Enumerable.GroupBy&lt;TSource, TKey&gt; Method (IEnumerable&lt;TSource&gt;, Func&lt;TSource, TKey&gt;)</p>

The first GroupBy overload is the simplest to use. The method takes two parameters, the first parameter is the <code>IEnumerable</code> collection to be grouped, while the second parameter defines the key that will be used to group the collection.

{% highlight c# %}
//Lambda
Enumerable.GroupBy(context.People, p => p.Type);
 
//Linq
from person in context.People
   group person by person.Type;
{% endhighlight %}

The parameter that creates the key is: <code>Func&lt;TSource, TKey&gt;</code>. It takes an element of the type defined by the source collection and returns an element of the type defined in the selector delegate. In the example, the parameter is declared with the type: <code>Func&lt;Person, string&gt;</code>.

The items in the collection are being grouped by the Type property into a collection that keeps the original type intact, that is to say, the grouping contains elements of type <code>Person.</code> If we iterate over the grouped collection, these are the results:

<div class="table-responsive">
<table class="table table-bordered">
<thead>
<tr>
<th>Key</th>
<th>Value</th>
</tr>
</thead>
<tbody>
<tr>
<td>EM</td>
<td>Person { Id = 1, FirstName = Ken, LastName = Sánchez, Age = 25 }</td>
</tr>
<tr>
<td>EM</td>
<td>Person { Id = 2, FirstName = Terry, LastName = Duffy, Age = 47 }</td>
</tr>
<tr>
<td>EM</td>
<td>Person { Id = 3, FirstName = Roberto, LastName = Tamburello, Age = 34 }</td>
</tr>
<tr>
<td>IN</td>
<td>Person { Id = 17, FirstName = David, LastName = Robinett, Age = 33 }</td>
</tr>
<tr>
<td colspan="2">…etc, etc…</td>
</tr>
</tbody>
</table>
</div>

<p class="subtitle">2. Enumerable.GroupBy&lt;TSource, TKey, TElement&gt; Method (IEnumerable&lt;TSource&gt;, Func&lt;TSource, TKey&gt;, Func&lt;TSource, TElement&gt;)</p>

The second overload takes three parameters, two of which we have already seen in overload #1. The third parameter is:  <code>Func&lt;TSource, TElement&gt;</code>. This parameter defines a delegate that will project the elements in the source collection into a new collection.

In the code sample, the elements in the source collection, of type  <code>Person</code>, are being grouped by the Type property into a new anonymous object. This object has two properties, the person’s full name and the age. The new parameter is declared with the type:  <code>Func&lt;Person, “Anonymous Type”&gt;</code>:

{% highlight c# %}
//Lambda
Enumerable.GroupBy(context.People, p => p.Type,
   p => new {
      FullName = string.Format("{0} {1}", p.FirstName, p.LastName),
      Age = p.Age
   });
 
//Linq
from person in context.People
group new {
   FullName = string.Format("{0} {1}", person.FirstName, person.LastName),
   Age = person.Age
} by person.Type;
{% endhighlight %}

The code sample produces the following grouped result:

<div class="table-responsive">
<table class="table table-bordered">
<thead>
<tr>
<th>Key</th>
<th>Value</th>
</tr>
</thead>
<tbody>
<tr>
<td>EM</td>
<td>{ FullName = Ken Sánchez, Age = 25 }</td>
</tr>
<tr>
<td>EM</td>
<td>{ FullName = Terry Duffy, Age = 47 }</td>
</tr>
<tr>
<td>EM</td>
<td>{ FullName = Roberto Tamburello, Age = 34 }</td>
</tr>
<tr>
<td>IN</td>
<td>{ FullName = David Robinett, Age = 33 }</td>
</tr>
<tr>
<td colspan="2">…etc, etc…</td>
</tr>
</tbody>
</table>
</div>

<p class="subtitle">3. Enumerable.GroupBy&lt;TSource, TKey, TResult&gt; Method (IEnumerable&lt;TSource&gt;, Func&lt;TSource, TKey&gt;, Func&lt;TKey, IEnumerable&lt;TSource&gt;, TResult&gt;)</p>

The next overload also takes 3 parameters, two of which we have seen in overload #1. The third parameter is different from the one shown in overload #2. The new argument is:  <code>Func&lt;TKey, IEnumerable&lt;TSource&gt;, TResult&gt;</code>. The argument defines a delegate that takes two parameters: an element of the type defined by the Key created for the grouped collection, and a collection of the type defined by the source collection.

Basically, the method will project the key of a specific grouping, and the elements associated to that key. This overload allows the caller to project the grouped collection into a collection of a different type:

{% highlight c# %}
//Lambda
Enumerable.GroupBy(context.People, p => p.Type,
   (key, temp) =>
   new {
      Key = key,
      Count = temp.Count(),
      MaxAge = temp.Max(a => a.Age),
      MinAge = temp.Min(a => a.Age)
   });
 
//Linq
from person in context.People
   group person by person.Type into temp
   select new {
      Key = temp.Key,
      Count = temp.Count(),
      MaxAge = temp.Max(a => a.Age),
      MinAge = temp.Min(a => a.Age)
   };
{% endhighlight %}

One important difference between this overload and the previous two overloads, is that the return value of the method is no longer a collection of type  <code>IEnumerable&lt;IGrouping&lt;TKey, TSource&gt;&gt;</code>, where TKey is the type of the key and TSource is the type of the grouped items.

In this case, the type of the grouped collection depends on the third parameter discussed earlier. In the example, the return value of the method is a collection of type  <code>IEnumerable&lt;“AnonymousType”&gt;</code>, where the Anonymous Type has four properties: Key, Count, MaxAge, and MinAge.

The sample generates a new collection where the items contain the key used to create the grouping, the number of elements in the group, and the maximum/minimum age within that group:

<div class="table-responsive">
<table class="table table-bordered">
<thead>
<tr>
<th>Value</th>
</tr>
</thead>
<tbody>
<tr>
<td>{ Key = EM, Count = 3, MaxAge = 47, MinAge = 25 }</td>
</tr>
<tr>
<td>{ Key = IN, Count = 4, MaxAge = 41, MinAge = 29 }</td>
</tr>
<tr>
<td>{ Key = SC, Count = 4, MaxAge = 40, MinAge = 27 }</td>
</tr>
<tr>
<td>{ Key = SP, Count = 5, MaxAge = 56, MinAge = 23 }</td>
</tr>
<tr>
<td>{ Key = VC, Count = 2, MaxAge = 35, MinAge = 30 }</td>
</tr>
</tbody>
</table>
</div>

<p class="subtitle">4. Enumerable.GroupBy&lt;TSource, TKey, TElement, TResult&gt; Method (IEnumerable&lt;TSource&gt;, Func&lt;TSource, TKey&gt;, Func&lt;TSource, TElement&gt;, Func&lt;TKey, IEnumerable&lt;TElement&gt;, TResult&gt;)</p>

The final overload combines all the parameters added in the previous overloads. Using this, the overload allows the caller to create the key to group the source collection, to project the source collection into a collection of a different type, and to project the grouped result into a collection of a different type:

{% highlight c# %}
//Lambda
Enumerable.GroupBy(context.People, p => p.Type,
   p => new {
      FullName = string.Format("{0} {1}", p.FirstName, p.LastName),
      Age = p.Age
   },
   (key, temp) => new {
      Key = key,
      Count = temp.Count(),
      Oldest = temp.FirstOrDefault(t => t.Age == temp.Min(a => a.Age)).FullName,
      MaxAge = temp.Max(a => a.Age),
      MinAge = temp.Min(a => a.Age)
   });
 
//Linq
from person in context.People
   group new {
      FullName = string.Format("{0} {1}", person.FirstName, person.LastName),
      Age = person.Age
   }
   by person.Type into temp
   select new {
      Key = temp.Key,
      Count = temp.Count(),
      Oldest = temp.FirstOrDefault(t => t.Age == temp.Min(a => a.Age)).FullName,
      MaxAge = temp.Max(a => a.Age),
      MinAge = temp.Min(a => a.Age)
   };
{% endhighlight %}

The result from the code sample is the following:

<div class="table-responsive">
<table class="table table-bordered">
<thead>
<tr>
<th>Value</th>
</tr>
</thead>
<tbody>
<tr>
<td>{ Key = EM, Count = 3, Oldest = Ken Sánchez, MaxAge = 47, MinAge = 25 }</td>
</tr>
<tr>
<td>{ Key = IN, Count = 4, Oldest = Rebecca Robinson, MaxAge = 41, MinAge = 29 }</td>
</tr>
<tr>
<td>{ Key = SC, Count = 4, Oldest = Humberto Acevedo, MaxAge = 40, MinAge = 27 }</td>
</tr>
<tr>
<td>{ Key = SP, Count = 5, Oldest = Linda Mitchell, MaxAge = 56, MinAge = 23 }</td>
</tr>
<tr>
<td>{ Key = VC, Count = 2, Oldest = Paula Moberly, MaxAge = 35, MinAge = 30 }</td>
</tr>
</tbody>
</table>
</div>

The GroupBy method and its overloads are quite useful when it is necessary to manipulate the data from a collection in C#. In complex scenarios it is probably better to use the standard Linq query syntax, as that will most likely help with code readability and organization. Nevertheless, it is always helpful to gain information about how to use a specific method in our code.