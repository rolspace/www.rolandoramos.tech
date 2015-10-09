---
layout: post
title: Override the IEnumerable Mapper in Glass.Mapper 4.0
date: 2015-07-12 21:54:16
categories:
- Uncategorized
tags:
- c#
- code
---
A few weeks ago I needed to write a specific implementation of the type mapper used in Glass.Mapper to handle *IEnumerable\<T\>* Types. This was necessary because the Sitecore instance I was working with had a customized implementation for handling language fallbacks. This did not play well with the default Glass.Mapper implementation.

I had to come up with a way to modify how Glass.Mapper handles fields that map to an *IEnumerable\<T\>* type, such as Multilists or Treelists. This is what I did.
<!more>

To get started, I needed to create a custom attribute class that would allow me to specify a custom type mapper. The custom attribute could be used like this on type that needed this behavior:

<pre class="lang:c# decode:true">public class Model<br />
{<br />
    [CustomIEnumerable]<br />
    public virtual IEnumerable<CollectionItem> Collection { get; set; }<br />
}<&#47;pre>

This custom attribute will map to a field similar to the one shown in this image:

<img class="img-responsive" src="/_assets/overrideienumerable-1.jpg" alt="Galata Bridge">

In order to create this custom attribute, it is necessary to inherit from the *SitecoreFieldAttribute* class from the Glass.Mapper.Sc.Configuration.Attributes namespace. In this scenario, the *Configure* method from the SitecoreFieldAttribute class must be overridden to setup the Attribute's configuration:

<pre class="lang:c# decode:true">public class CustomIEnumerableAttribute : SitecoreFieldAttribute<br />
{<br />
    public CustomIEnumerableAttribute()<br />
        : base() { }</p>
<p>    public CustomIEnumerableAttribute(string fieldName)<br />
        : base(fieldName) { }</p>
<p>    public CustomIEnumerableAttribute(string fieldId, SitecoreFieldType fieldType,<br />
        string sectionName, bool codeFirst)<br />
        : base(fieldId, fieldType, sectionName, codeFirst) { }</p>
<p>    public override AbstractPropertyConfiguration Configure(PropertyInfo propertyInfo)<br />
    {<br />
        var config = new CustomIEnumerableConfiguration();<br />
        this.Configure(propertyInfo, config);</p>
<p>        return config;<br />
    }<br />
}<&#47;pre>

The *Configure* method of our *CustomIEnumerableAttribute* requires an object of type *AbstractPropertyConfiguration*, which we do not have yet. I will create a new class called *CustomIEnumerableConfiguration* which inherits from *SitecoreFieldConfiguration*, which in turn inherits from *AbstractPropertyConfiguration*. This way I can avoid writing a full implementation, when I only need to override the *Copy* method from the *SitecoreFieldConfiguration* class:

<pre class="lang:c# decode:true">public class CustomIEnumerableConfiguration : SitecoreFieldConfiguration<br />
{<br />
    public override SitecoreFieldConfiguration Copy()<br />
    {<br />
        return new CustomIEnumerableConfiguration<br />
        {<br />
            CodeFirst = this.CodeFirst,<br />
            FieldId = this.FieldId,<br />
            FieldName = this.FieldName,<br />
            FieldSource = this.FieldSource,<br />
            FieldTitle = this.FieldTitle,<br />
            FieldType = this.FieldType,<br />
            IsShared = this.IsShared,<br />
            IsUnversioned = this.IsUnversioned,<br />
            PropertyInfo = this.PropertyInfo,<br />
            ReadOnly = this.ReadOnly,<br />
            SectionName = this.SectionName,<br />
            Setting = this.Setting<br />
        };<br />
    }<br />
}<&#47;pre>

Since the CustomIEnumerableConfiguration class is complete, then the CustomIEnumerableAttribute class is completed as well. Now the final piece of the code is the custom type mapper class I need to implement.
For this, I will inherit from the *AbstractSitecoreFieldMapper* class in the Glass.Mapper.Sc.DataMappers namespace. This is the base class from which all mappers in Glass.Mapper assembly inherit.

The implementation for the *CustomIEnumerableMapper* class is shown below. For the purpose of this post I have borrowed the implementation from the *SitecoreFieldIEnumerableMapper* class used by Glass.Mapper.
I have only added a few lines of code, in order to write to the Sitecore Log and demonstrate the use of the custom type mapper class:

<pre class="tab-size:3 lang:c# decode:true ">public class CustomIEnumerableMapper : AbstractSitecoreFieldMapper<br />
{<br />
   public override object GetFieldValue(string fieldValue,<br />
      SitecoreFieldConfiguration config, SitecoreDataMappingContext context)<br />
   {<br />
      Type genericArgument =<br />
         Glass.Mapper.Utilities.GetGenericArgument(config.PropertyInfo.PropertyType);</p>
<p>      &#47;&#47;Write to the Sitecore Log<br />
      Sitecore.Diagnostics.Log.Info(<br />
         string.Format("Mapping Type: {0}", genericArgument), this);</p>
<p>      IEnumerable<object> enumerable = (IEnumerable<object>)Enumerable.ToArray<object>(<br />
         Enumerable.Select<string, object>(<br />
            (IEnumerable<string>)Enumerable.ToArray<string>(<br />
               Enumerable.Select<string, string>(<br />
                  (IEnumerable<string>)fieldValue.Split(<br />
                     new char[1] { '|' }, StringSplitOptions.RemoveEmptyEntries),<br />
                  (Func<string, string>)(x => x.Replace(Global.PipeEncoding, "|")))),<br />
                  (Func<string, object>)(x => Context.Database.GetItem(new ID(x)))));</p>
<p>      IList list = Glass.Mapper.Sc.Utilities.CreateGenericType(typeof(List<>),<br />
         new Type[1] { genericArgument }) as IList;</p>
<p>      foreach (object obj in enumerable)<br />
      {<br />
         if (obj != null)<br />
            list.Add(context.Service.CreateType(<br />
              genericArgument, (Item)obj, false, false, null));<br />
      }</p>
<p>      return (object)list;<br />
    }</p>
<p>   public override string SetFieldValue(object value,<br />
      SitecoreFieldConfiguration config, SitecoreDataMappingContext context)<br />
   {<br />
      IEnumerable enumerable = value as IEnumerable;<br />
      if (enumerable == null)<br />
         return (string) null;</p>
<p>      List<string> list = new List<string>();<br />
      foreach (object obj in enumerable)<br />
      {<br />
         string str = this.Mapper.SetFieldValue(obj, config, context);<br />
         if (!ExtensionMethods.IsNullOrEmpty(str))<br />
            list.Add(str);<br />
      }</p>
<p>      Type genericArgument =<br />
         Glass.Mapper.Utilities.GetGenericArgument(config.PropertyInfo.PropertyType);</p>
<p>      &#47;&#47;Write to the Sitecore Log<br />
      Sitecore.Diagnostics.Log.Info(<br />
         string.Format("Storing Type: {0}", genericArgument), this);</p>
<p>      if (Enumerable.Any<string>((IEnumerable<string>) list))<br />
         return Enumerable.Aggregate<string>((IEnumerable<string>) list,<br />
            (Func<string, string, string>) ((x, y) => x + "|" + y));</p>
<p>      return (string) null;<br />
   }</p>
<p>   public override bool CanHandle(AbstractPropertyConfiguration configuration,<br />
      Glass.Mapper.Context context)<br />
   {<br />
      return configuration is CustomIEnumerableConfiguration;<br />
   }<br />
}<&#47;pre>

There are three methods that need to be overridden in order to properly implement our custom *IEnumerable\<T\>* type mapper:

* GetFieldValue: this method will obtain the field's value in raw format and convert each of the referenced items to the generic type used in the *IEnumerable\<T\>*.
* SetFieldValue: as the name implies, this method will take the value of the *IEnumerable\<T\>* instance and store it in the field.
* CanHandle: this method defines a condition to determine if the custom mapper can be used. In our scenario there is one rule only, apply the custom mapper if the configuration parameter is of type *CustomIEnumerableConfiguration*.

Once this is all completed, it is possible to include this type mapper in the *CreateResolverMethod* of the *GlassMapperScCustom* class:

<pre class="lang:c# decode:true">public static IDependencyResolver CreateResolver()<br />
{<br />
    var config = new Glass.Mapper.Sc.Config();<br />
    var container = new Castle.Windsor.WindsorContainer();</p>
<p>    container.Register(<br />
        Component.For<AbstractDataMapper>()<br />
            .ImplementedBy<CustomFieldMapper>().LifestyleTransient(),<br />
        Component.For<AbstractDataMapper>()<br />
            .ImplementedBy<CustomIEnumerableMapper>().LifestyleTransient()<br />
    );</p>
<p>    container.Install(new Glass.Mapper.Sc.CastleWindsor.WindsorSitecoreInstaller(config));</p>
<p>    var resolver = new Glass.Mapper.Sc.CastleWindsor.DependencyResolver(container);</p>
<p>    return resolver;<br />
}<&#47;pre>

After this code is deployed to the Sitecore instance, it is easy to determine that the code used in the *CustomIEnumerableMapper* class is being executed:

<img class="img-responsive" src="/_assets/overrideienumerable-2.jpg" alt="Galata Bridge">

As a final note, it is important to point out that this approach will work if you are using Glass.Mapper v4 together with the *Glass.Mapper.Sc.CastleWindsor* v4 assembly in your solution.

Unfortunately, I have not been able to test this functionality in Glass.Mapper.Sc v4 using a different IoC container. However, the code provided here serves as a good starting point for anyone trying to achieve something similar.
