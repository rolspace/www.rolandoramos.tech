---
layout: post
title: The IEnumerable.GroupBy Overloads
date: 2016-03-08
tags:
- hello world
---

From time to time, I have needed to create a few Linq queries using the GroupBy command, and for some reason, I always found it easier to use the query syntax, instead of Lambda expressions.

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

<p class="subtitle-small">1.Enumerable.GroupBy&lt;TSource, TKey&gt; Method (IEnumerable&lt;TSource&gt;, Func&lt;TSource, TKey&gt;)</p>

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
<td colspan="2">…and so on…</td>
</tr>
</tbody>
</table>
</div>

<p class="subtitle-small">2.Enumerable.GroupBy&lt;TSource, TKey, TElement&gt; Method (IEnumerable&lt;TSource&gt;, Func&lt;TSource, TKey&gt;, Func&lt;TSource, TElement&gt;)</p>

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

<p>The code sample produces the following grouped result:</p>
<table>
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
<td colspan="2">…and so on…</td>
</tr>
</tbody>
</table>
<p>3. Enumerable.GroupBy&lt;TSource, TKey, TResult&gt; Method (IEnumerable&lt;TSource&gt;, Func&lt;TSource, TKey&gt;, Func&lt;TKey, IEnumerable&lt;TSource&gt;, TResult&gt;)</p>
<p>The next overload also takes 3 parameters, two of which we have seen in overload #1. The third parameter is different from the one shown in overload #2. The new argument is:  <code>Func&lt;TKey, IEnumerable&lt;TSource&gt;, TResult&gt;</code>. The argument defines a delegate that takes two parameters: an element of the type defined by the Key created for the grouped collection, and a collection of the type defined by the source collection.</p>
<p>Basically, the method will project the key of a specific grouping, and the elements associated to that key. This overload allows the caller to project the grouped collection into a collection of a different type:</p><!-- Crayon Syntax Highlighter v2.6.9 -->
<link rel="stylesheet" type="text/css" href="http://www.rolspace.com/wp-content/plugins/crayon-syntax-highlighter/fonts/monaco.css">

		<div id="crayon-575f10bd11731716685164" class="crayon-syntax crayon-theme-vs2012 crayon-font-monaco crayon-os-pc print-yes notranslate" data-settings=" touchscreen minimize scroll-mouseover" style="margin-top: 20px; margin-bottom: 20px; font-size: 12px !important; line-height: 20px !important; height: auto;">
		
			<div class="crayon-plain-wrap"></div>
			<div class="crayon-main" style="position: relative; z-index: 1;">
				<table class="crayon-table">
					<tbody><tr class="crayon-row">
				<td class="crayon-nums " data-settings="show">
					<div class="crayon-nums-content" style="font-size: 12px !important; line-height: 20px !important;"><div class="crayon-num" data-line="crayon-575f10bd11731716685164-1">1</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd11731716685164-2">2</div><div class="crayon-num" data-line="crayon-575f10bd11731716685164-3">3</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd11731716685164-4">4</div><div class="crayon-num" data-line="crayon-575f10bd11731716685164-5">5</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd11731716685164-6">6</div><div class="crayon-num" data-line="crayon-575f10bd11731716685164-7">7</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd11731716685164-8">8</div><div class="crayon-num" data-line="crayon-575f10bd11731716685164-9">9</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd11731716685164-10">10</div><div class="crayon-num" data-line="crayon-575f10bd11731716685164-11">11</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd11731716685164-12">12</div><div class="crayon-num" data-line="crayon-575f10bd11731716685164-13">13</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd11731716685164-14">14</div><div class="crayon-num" data-line="crayon-575f10bd11731716685164-15">15</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd11731716685164-16">16</div><div class="crayon-num" data-line="crayon-575f10bd11731716685164-17">17</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd11731716685164-18">18</div><div class="crayon-num" data-line="crayon-575f10bd11731716685164-19">19</div></div>
				</td>
						<td class="crayon-code"><div class="crayon-pre" style="font-size: 12px !important; line-height: 20px !important; -moz-tab-size:4; -o-tab-size:4; -webkit-tab-size:4; tab-size:4;"><div class="crayon-line" id="crayon-575f10bd11731716685164-1"><span class="crayon-c">//Lambda</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd11731716685164-2"><span class="crayon-v">Enumerable</span><span class="crayon-sy">.</span><span class="crayon-e">GroupBy</span><span class="crayon-sy">(</span><span class="crayon-v">context</span><span class="crayon-sy">.</span><span class="crayon-v">People</span><span class="crayon-sy">,</span><span class="crayon-h"> </span><span class="crayon-v">p</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-v">p</span><span class="crayon-sy">.</span><span class="crayon-v">Type</span><span class="crayon-sy">,</span></div><div class="crayon-line" id="crayon-575f10bd11731716685164-3"><span class="crayon-h">   </span><span class="crayon-sy">(</span><span class="crayon-v">key</span><span class="crayon-sy">,</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">)</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd11731716685164-4"><span class="crayon-h">   </span><span class="crayon-r">new</span><span class="crayon-h"> </span><span class="crayon-sy">{</span></div><div class="crayon-line" id="crayon-575f10bd11731716685164-5"><span class="crayon-h">      </span><span class="crayon-v">Key</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">key</span><span class="crayon-sy">,</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd11731716685164-6"><span class="crayon-h">      </span><span class="crayon-v">Count</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Count</span><span class="crayon-sy">(</span><span class="crayon-sy">)</span><span class="crayon-sy">,</span></div><div class="crayon-line" id="crayon-575f10bd11731716685164-7"><span class="crayon-h">      </span><span class="crayon-v">MaxAge</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Max</span><span class="crayon-sy">(</span><span class="crayon-v">a</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-v">a</span><span class="crayon-sy">.</span><span class="crayon-v">Age</span><span class="crayon-sy">)</span><span class="crayon-sy">,</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd11731716685164-8"><span class="crayon-h">      </span><span class="crayon-v">MinAge</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Min</span><span class="crayon-sy">(</span><span class="crayon-v">a</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-v">a</span><span class="crayon-sy">.</span><span class="crayon-v">Age</span><span class="crayon-sy">)</span></div><div class="crayon-line" id="crayon-575f10bd11731716685164-9"><span class="crayon-h">   </span><span class="crayon-sy">}</span><span class="crayon-sy">)</span><span class="crayon-sy">;</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd11731716685164-10"> </div><div class="crayon-line" id="crayon-575f10bd11731716685164-11"><span class="crayon-c">//Linq</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd11731716685164-12"><span class="crayon-e">from </span><span class="crayon-e">person </span><span class="crayon-st">in</span><span class="crayon-h"> </span><span class="crayon-v">context</span><span class="crayon-sy">.</span><span class="crayon-e">People</span></div><div class="crayon-line" id="crayon-575f10bd11731716685164-13"><span class="crayon-e">   </span><span class="crayon-e">group </span><span class="crayon-e">person </span><span class="crayon-e">by </span><span class="crayon-v">person</span><span class="crayon-sy">.</span><span class="crayon-e">Type </span><span class="crayon-e">into</span><span class="crayon-h"> </span><span class="crayon-e">temp</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd11731716685164-14"><span class="crayon-h">   </span><span class="crayon-e">select</span><span class="crayon-h"> </span><span class="crayon-r">new</span><span class="crayon-h"> </span><span class="crayon-sy">{</span></div><div class="crayon-line" id="crayon-575f10bd11731716685164-15"><span class="crayon-h">      </span><span class="crayon-v">Key</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-v">Key</span><span class="crayon-sy">,</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd11731716685164-16"><span class="crayon-h">      </span><span class="crayon-v">Count</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Count</span><span class="crayon-sy">(</span><span class="crayon-sy">)</span><span class="crayon-sy">,</span></div><div class="crayon-line" id="crayon-575f10bd11731716685164-17"><span class="crayon-h">      </span><span class="crayon-v">MaxAge</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Max</span><span class="crayon-sy">(</span><span class="crayon-v">a</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-v">a</span><span class="crayon-sy">.</span><span class="crayon-v">Age</span><span class="crayon-sy">)</span><span class="crayon-sy">,</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd11731716685164-18"><span class="crayon-h">      </span><span class="crayon-v">MinAge</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Min</span><span class="crayon-sy">(</span><span class="crayon-v">a</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-v">a</span><span class="crayon-sy">.</span><span class="crayon-v">Age</span><span class="crayon-sy">)</span></div><div class="crayon-line" id="crayon-575f10bd11731716685164-19"><span class="crayon-h">   </span><span class="crayon-sy">}</span><span class="crayon-sy">;</span></div></div></td>
					</tr>
				</tbody></table>
			</div>
		</div>
<!-- [Format Time: 0.0040 seconds] -->
<p>One important difference between this overload and the previous two overloads, is that the return value of the method is no longer a collection of type  <code>IEnumerable&lt;IGrouping&lt;TKey, TSource&gt;&gt;</code>, where TKey is the type of the key and TSource is the type of the grouped items.</p>
<p>In this case, the type of the grouped collection depends on the third parameter discussed earlier. In the example, the return value of the method is a collection of type  <code>IEnumerable&lt;“AnonymousType”&gt;</code>, where the Anonymous Type has four properties: Key, Count, MaxAge, and MinAge.</p>
<p>The sample generates a new collection where the items contain the key used to create the grouping, the number of elements in the group, and the maximum/minimum age within that group:</p>
<table>
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
<p>4. Enumerable.GroupBy&lt;TSource, TKey, TElement, TResult&gt; Method (IEnumerable&lt;TSource&gt;, Func&lt;TSource, TKey&gt;, Func&lt;TSource, TElement&gt;, Func&lt;TKey, IEnumerable&lt;TElement&gt;, TResult&gt;)</p>
<p>The final overload combines all the parameters added in the previous overloads. Using this, the overload allows the caller to create the key to group the source collection, to project the source collection into a collection of a different type, and to project the grouped result into a collection of a different type:</p><!-- Crayon Syntax Highlighter v2.6.9 -->
<link rel="stylesheet" type="text/css" href="http://www.rolspace.com/wp-content/plugins/crayon-syntax-highlighter/fonts/monaco.css">

		<div id="crayon-575f10bd1173a987258701" class="crayon-syntax crayon-theme-vs2012 crayon-font-monaco crayon-os-pc print-yes notranslate" data-settings=" touchscreen minimize scroll-mouseover" style="margin-top: 20px; margin-bottom: 20px; font-size: 12px !important; line-height: 20px !important; height: auto;">
		
			<div class="crayon-plain-wrap"></div>
			<div class="crayon-main" style="position: relative; z-index: 1;">
				<table class="crayon-table">
					<tbody><tr class="crayon-row">
				<td class="crayon-nums " data-settings="show">
					<div class="crayon-nums-content" style="font-size: 12px !important; line-height: 20px !important;"><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-1">1</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-2">2</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-3">3</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-4">4</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-5">5</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-6">6</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-7">7</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-8">8</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-9">9</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-10">10</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-11">11</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-12">12</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-13">13</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-14">14</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-15">15</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-16">16</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-17">17</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-18">18</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-19">19</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-20">20</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-21">21</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-22">22</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-23">23</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-24">24</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-25">25</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-26">26</div><div class="crayon-num" data-line="crayon-575f10bd1173a987258701-27">27</div><div class="crayon-num crayon-striped-num" data-line="crayon-575f10bd1173a987258701-28">28</div></div>
				</td>
						<td class="crayon-code"><div class="crayon-pre" style="font-size: 12px !important; line-height: 20px !important; -moz-tab-size:4; -o-tab-size:4; -webkit-tab-size:4; tab-size:4;"><div class="crayon-line" id="crayon-575f10bd1173a987258701-1"><span class="crayon-c">//Lambda</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-2"><span class="crayon-v">Enumerable</span><span class="crayon-sy">.</span><span class="crayon-e">GroupBy</span><span class="crayon-sy">(</span><span class="crayon-v">context</span><span class="crayon-sy">.</span><span class="crayon-v">People</span><span class="crayon-sy">,</span><span class="crayon-h"> </span><span class="crayon-v">p</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-v">p</span><span class="crayon-sy">.</span><span class="crayon-v">Type</span><span class="crayon-sy">,</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-3"><span class="crayon-h">   </span><span class="crayon-v">p</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-r">new</span><span class="crayon-h"> </span><span class="crayon-sy">{</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-4"><span class="crayon-h">      </span><span class="crayon-v">FullName</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-t">string</span><span class="crayon-sy">.</span><span class="crayon-e">Format</span><span class="crayon-sy">(</span><span class="crayon-s">"{0} {1}"</span><span class="crayon-sy">,</span><span class="crayon-h"> </span><span class="crayon-v">p</span><span class="crayon-sy">.</span><span class="crayon-v">FirstName</span><span class="crayon-sy">,</span><span class="crayon-h"> </span><span class="crayon-v">p</span><span class="crayon-sy">.</span><span class="crayon-v">LastName</span><span class="crayon-sy">)</span><span class="crayon-sy">,</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-5"><span class="crayon-h">      </span><span class="crayon-v">Age</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">p</span><span class="crayon-sy">.</span><span class="crayon-i">Age</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-6"><span class="crayon-h">   </span><span class="crayon-sy">}</span><span class="crayon-sy">,</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-7"><span class="crayon-h">   </span><span class="crayon-sy">(</span><span class="crayon-v">key</span><span class="crayon-sy">,</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">)</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-r">new</span><span class="crayon-h"> </span><span class="crayon-sy">{</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-8"><span class="crayon-h">      </span><span class="crayon-v">Key</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">key</span><span class="crayon-sy">,</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-9"><span class="crayon-h">      </span><span class="crayon-v">Count</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Count</span><span class="crayon-sy">(</span><span class="crayon-sy">)</span><span class="crayon-sy">,</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-10"><span class="crayon-h">      </span><span class="crayon-i">Oldest</span> <span class="crayon-o">=</span> <span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">FirstOrDefault</span><span class="crayon-sy">(</span><span class="crayon-v">t</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span> <span class="crayon-v">t</span><span class="crayon-sy">.</span><span class="crayon-i">Age</span> <span class="crayon-o">==</span> <span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Min</span><span class="crayon-sy">(</span><span class="crayon-i">a</span> <span class="crayon-o">=</span><span class="crayon-o">&gt;</span> <span class="crayon-v">a</span><span class="crayon-sy">.</span><span class="crayon-v">Age</span><span class="crayon-sy">)</span><span class="crayon-sy">)</span><span class="crayon-sy">.</span><span class="crayon-v">FullName</span><span class="crayon-sy">,</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-11"><span class="crayon-h">      </span><span class="crayon-v">MaxAge</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Max</span><span class="crayon-sy">(</span><span class="crayon-v">a</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-v">a</span><span class="crayon-sy">.</span><span class="crayon-v">Age</span><span class="crayon-sy">)</span><span class="crayon-sy">,</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-12"><span class="crayon-h">      </span><span class="crayon-v">MinAge</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Min</span><span class="crayon-sy">(</span><span class="crayon-v">a</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-v">a</span><span class="crayon-sy">.</span><span class="crayon-v">Age</span><span class="crayon-sy">)</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-13"><span class="crayon-h">   </span><span class="crayon-sy">}</span><span class="crayon-sy">)</span><span class="crayon-sy">;</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-14"> </div><div class="crayon-line" id="crayon-575f10bd1173a987258701-15"><span class="crayon-c">//Linq</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-16"><span class="crayon-e">from </span><span class="crayon-e">person </span><span class="crayon-st">in</span><span class="crayon-h"> </span><span class="crayon-v">context</span><span class="crayon-sy">.</span><span class="crayon-e">People</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-17"><span class="crayon-e">   </span><span class="crayon-e">group</span><span class="crayon-h"> </span><span class="crayon-r">new</span><span class="crayon-h"> </span><span class="crayon-sy">{</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-18"><span class="crayon-h">      </span><span class="crayon-v">FullName</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-t">string</span><span class="crayon-sy">.</span><span class="crayon-e">Format</span><span class="crayon-sy">(</span><span class="crayon-s">"{0} {1}"</span><span class="crayon-sy">,</span><span class="crayon-h"> </span><span class="crayon-v">person</span><span class="crayon-sy">.</span><span class="crayon-v">FirstName</span><span class="crayon-sy">,</span><span class="crayon-h"> </span><span class="crayon-v">person</span><span class="crayon-sy">.</span><span class="crayon-v">LastName</span><span class="crayon-sy">)</span><span class="crayon-sy">,</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-19"><span class="crayon-h">      </span><span class="crayon-v">Age</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">person</span><span class="crayon-sy">.</span><span class="crayon-i">Age</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-20"><span class="crayon-h">   </span><span class="crayon-sy">}</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-21"><span class="crayon-h">   </span><span class="crayon-e">by </span><span class="crayon-v">person</span><span class="crayon-sy">.</span><span class="crayon-e">Type </span><span class="crayon-e">into</span><span class="crayon-h"> </span><span class="crayon-e">temp</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-22"><span class="crayon-h">   </span><span class="crayon-e">select</span><span class="crayon-h"> </span><span class="crayon-r">new</span><span class="crayon-h"> </span><span class="crayon-sy">{</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-23"><span class="crayon-h">      </span><span class="crayon-v">Key</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-v">Key</span><span class="crayon-sy">,</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-24"><span class="crayon-h">      </span><span class="crayon-v">Count</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Count</span><span class="crayon-sy">(</span><span class="crayon-sy">)</span><span class="crayon-sy">,</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-25"><span class="crayon-h">      </span><span class="crayon-i">Oldest</span> <span class="crayon-o">=</span> <span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">FirstOrDefault</span><span class="crayon-sy">(</span><span class="crayon-i">t</span> <span class="crayon-o">=</span><span class="crayon-o">&gt;</span> <span class="crayon-v">t</span><span class="crayon-sy">.</span><span class="crayon-i">Age</span> <span class="crayon-o">==</span> <span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Min</span><span class="crayon-sy">(</span><span class="crayon-i">a</span> <span class="crayon-o">=</span><span class="crayon-o">&gt;</span> <span class="crayon-v">a</span><span class="crayon-sy">.</span><span class="crayon-v">Age</span><span class="crayon-sy">)</span><span class="crayon-sy">)</span><span class="crayon-sy">.</span><span class="crayon-v">FullName</span><span class="crayon-sy">,</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-26"><span class="crayon-h">      </span><span class="crayon-v">MaxAge</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Max</span><span class="crayon-sy">(</span><span class="crayon-v">a</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-v">a</span><span class="crayon-sy">.</span><span class="crayon-v">Age</span><span class="crayon-sy">)</span><span class="crayon-sy">,</span></div><div class="crayon-line" id="crayon-575f10bd1173a987258701-27"><span class="crayon-h">      </span><span class="crayon-v">MinAge</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-h"> </span><span class="crayon-v">temp</span><span class="crayon-sy">.</span><span class="crayon-e">Min</span><span class="crayon-sy">(</span><span class="crayon-v">a</span><span class="crayon-h"> </span><span class="crayon-o">=</span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-v">a</span><span class="crayon-sy">.</span><span class="crayon-v">Age</span><span class="crayon-sy">)</span></div><div class="crayon-line crayon-striped-line" id="crayon-575f10bd1173a987258701-28"><span class="crayon-h">   </span><span class="crayon-sy">}</span><span class="crayon-sy">;</span></div></div></td>
					</tr>
				</tbody></table>
			</div>
		</div>
<!-- [Format Time: 0.0072 seconds] -->
<p>The result from the code sample is the following.</p>
<table>
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
<p>The GroupBy method and its overloads are quite useful when it is necessary to manipulate the data from a collection in C#. In complex scenarios it is probably better to use the standard Linq query syntax, as that will most likely help with code readability and organization. Nevertheless, it is always helpful to gain information about how to use a specific method in our code.</p>