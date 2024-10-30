# css-events
The simplest way to add interactivity to a web page.

## Motivation

Consider for a moment how, when you abstract away HTML elements and their locations on a page, 
the underlying interaction models for many components are similar. For example,
a checkbox has the same interaction model as a toggle buttun -- click to change its
state. Likewise, radio buttons have the same interaction model as select lists.

Now consider how the display of such a component can be easily configured to mirror its
state by adding or removing CSS classes on an HTML element. Add/remove a class
on one element to update the display of a toggle, or add/remove a class on a set of elements
to update the display of a select.

What if such interactions could be configured declaratively in CSS? This is the question that
gave birth to css-events. Using just 4 verbs - select, toggle, add, and remove (STAR) -
you can model an amazingly diverse set of interactions using only CSS.

- checkboxes: toggle
- toggle buttons: toggle
- multi-select: toggle
- radio buttons: select
- select lists: select
- tab groups: select
- dialogs: on open, add; on close, remove
- navigation menus: on open, select; on close, remove

The list goes on.

css-events is a simple, declarative, and css-like way to add interactivity to a web page 
by assigning STAR verbs and CSS selectors to DOM events.

## Usage

CSS events are declared in a style tag of type text/css-events. After all your events are declared,
include the css-events.js script in your page.

```html
    <style type="text/css-events">
		/* CSS events go here */
    </style>
    <script src="css-events.js"></script>
```

## Event declaration

### Example 1: Toggle Button

```html
    <style>
		.button { /* base button styles go here */ }
		.button.selected { /* select button styles go here */ }
    </style>
    <style type="text/css-events">
		@event click (.button) toggle 'selected';
    </style>
```

### Example 2: Dialog

```html
	<style>
		#open-button { /* ... */ }
		#close-button { /* ... */ }
		#dialog { /* ... */ }
		#dialog.open { /* ... */ }
	</style>
	<style type="text/css-events">
		@event click (#open-button) add 'open' at (#dialog);
		@event click (#close-button) remove 'open' at (#dialog);
	</style>
```

### Example 3: Select list

```html
    <style>
        .option { /* ... */ }
        .option.selected { /* ... */ }
    </style>
    <style type="text/css-events">
        @event click (.option) select 'selected';
    </style>
```

### Example 4: Tabbed content

```html
    <style>
        .tab-button { /* ... */ }
        .tab-button.selected { /* ... */ }
        .tab-content { /* ... */ }
        .tab-content.visible { /* ... */ }
    </style>
    <style type="text/css-events">
        @event click (.tab-button) select 'selected';
        @event click (.tab-button) select 'visible' at (.tab-content);
    </style>
```

## Notes

- Any event type is supported. For example:  
  `@event dragover (.dropzone) add 'active';`
  
- Class names can contain multiple classes (useful for the utility-first CSS fans):  
  `@event click (.button) toggle 'bg-blue text-white';`
  
- Compound selectors are supported. For example:  
  `@event click (.toggle, .checkbox) toggle 'selected';`


## Formal syntax

```
  @event <event-name> (<event-target>) add|remove|toggle|select <class-name> [ at (<update-target>) ];
```

## Status

**ALPHA**

This library currently supports static HTML pages quite nicely.

Dynamic applications are not yet supported - the API to get/set component state via 
JavaScript is not yet complete.

