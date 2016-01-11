---
layout: post
published: true
title: Modify Validation Messages in ASP.NET MVC with jQuery Validation
date: 2014-05-25
categories:
- Uncategorized
tags:
- c#
- ".net mvc"
- code
---
Some time ago I needed to change the way in which the unobtrusive validation messages were displayed in a form part of an ASP.NET MVC application.

The reason was that the amount of space available in the window was limited and it was a requirement to display the proper validation messages, even though fitting them in the screen was impossible.

I decided that the best option to solve this issue was to modify the way the validation messages were shown in the form...instead of displaying them as text next to the form input, the application would display the messages associated to each form input as tooltips.

Here is an example to demonstrate how to achieve this functionality.

<a id="more"></a><a id="more-60"></a>

Let's create an Employee class with the following class definition. A few data annotations have been added to the properties of the class in order to trigger specific validation messages.
<pre class="lang:c# decode:true">public class Employee
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public int Age { get; set; }
    [Phone]
    public string PhoneNumber { get; set; }
}</pre>
In order to edit items from this class, we will use a view with a form that contains <em>Html.ValidationMessageFor</em> helper methods to display the validation errors for the Employee class properties.
<pre class="lang:xhtml decode:true">
<div class="form-group">
  @Html.LabelFor(model => model.Name, htmlAttributes: new { @class = "control-label col-md-2" })
<div class="col-md-10">
    @Html.EditorFor(model => model.Name, new { htmlAttributes = new { @class = "form-control" } })
    @Html.ValidationMessageFor(model => model.Name, "", new { @class = "text-danger" })
  </div>
</div>
<div class="form-group">
  @Html.LabelFor(model => model.Age, htmlAttributes: new { @class = "control-label col-md-2" })
<div class="col-md-10">
    @Html.EditorFor(model => model.Age, new { htmlAttributes = new { @class = "form-control" } })
    @Html.ValidationMessageFor(model => model.Age, "", new { @class = "text-danger" })
  </div>
</div>
<div class="form-group">
  @Html.LabelFor(model => model.PhoneNumber, htmlAttributes: new { @class = "control-label col-md-2" })
<div class="col-md-10">
    @Html.EditorFor(model => model.PhoneNumber, new { htmlAttributes = new { @class = "form-control" } })
    @Html.ValidationMessageFor(model => model.PhoneNumber, "", new { @class = "text-danger" })
  </div>
</div>
<div class="form-group">
<div class="col-md-offset-2 col-md-10">
    <input type="submit" value="Save" class="btn btn-default" />
  </div>
</div></pre>
Such a view would provide the following result:
<a href="http://www.rolspace.com/wp-content/uploads/2014/05/standardunobstrusive.png"><img class="aligncenter wp-image-86 size-full" src="http://www.rolspace.com/wp-content/uploads/2014/05/standardunobstrusive.png" alt="standardunobstrusive" width="607" height="248" /></a>
In order to modify the way in which the unobstrusive validation messages are displayed, we need to access one of the methods provided by the jQuery Validator that is packaged with ASP.NET MVC. The <em>setDefaults</em> method allows us to modify the jQuery Validator's default settings.
For this specific scenario we need to modify the Validator's <em>showErrors</em> property. In an MVC application the default <em>showErrors</em> property is a function which displays the validation errors associated with a form input. An easy way to test this is to add the following script to the View.
<pre class="lang:js decode:true"><script>
   $.validator.setDefaults({
      showErrors: function (errorMap, errorList) {
      }
   })
</script></pre>
In this case, unobtrusive validation would still work: the form would not submit if there are errors, however, there would be no error messages displayed.
The <em>showErrors</em> function is called everytime a validation event occurs (keyup, onblur, submit). The two parameters in the function signature provide information about the elements currently validated when the event is triggered.
The <em>errorMap</em> variable is an object with key/value pairs, where the keys refer to the name of an input field, and the values for these keys refer to the validation message for that input.
The <em>errorList</em> variable is an array of objects, where the objects in the array contain two properties: an element property (whose value is a DOM element) and a message property (whose value is the message specific to that DOM element).
Using this information, it is possible to create a new <em>showErrors</em> method that will allow us to display unobtrusive validation messages in a different manner:
<pre class="tab-size:2 lang:js decode:true"><script>
   $.validator.setDefaults({
      showErrors: function (errorMap, errorList) {
         $(".valid").each(function (i, v) {
            $(v).tooltip('destroy');
         });
         $.each(errorList, function (i, v) {
            $(v.element).tooltip({ title: v.message, placement: 'right' });
         });
         this.defaultShowErrors();
      }
   })
</script></pre>
In this case we are using the <em>errorList</em> parameter to determine the validation errors in a form. When an element is invalid, a tooltip (from Bootstrap) is added in order to display the validation message.
In order to remove the tooltip if the element becomes valid, we are taking advantage of the <em>defaultShowErrors</em> method, which adds the valid CSS class to form elements and helps identify those elements which are no longer invalid.
Since the <em>defaultShowErrors</em> method is being used, it is important to remove all the <em>Html.ValidationFor</em> helpers from the Razor View, so only one set of validation messages is displayed for the input elements:
<a href="http://www.rolspace.com/wp-content/uploads/2014/05/tooltipunobtrusive.png"><img class="aligncenter size-full wp-image-100" src="http://www.rolspace.com/wp-content/uploads/2014/05/tooltipunobtrusive.png" alt="tooltipunobtrusive" width="618" height="209" /></a>