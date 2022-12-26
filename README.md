# c3tools
Collection of personal sets of functions to speed up web development.

To install just `<script src="https://unpkg.com/@c3r38r170/c3tools" type="module"></script>`.

Specifying a version is recommended. [More info about unpkg.](https://unpkg.com/)

By default, `c3tools-min.js` will be loaded (non-module version). You must specify `/c3tools-min.m.js` after the version, for the module version:

`<script src="https://unpkg.com/@c3r38r170/c3tools@1.0.0/c3tools-min.m.js" type="module"></script>`

## Features:

### SuperQuerySelector (SqS)

One `Element` selecting method to rule them all. Encapsulates all `getElement...` methods, `querySelector` and `querySelectorAll`, and uses the apropriate one depending on the selector.

```js
SqS('#id'); // Actually uses document.getElementById.
SqS('.class',{n:true}); // Actually uses document.getElementsByClassName. Returns all results.
SqS('button',{from:gEt('modal')}); // Actually uses from.getElementsByTagName. Returns first result.
// gEt is short for getElementById btw.
SqS('#id span, #id b',{n:true}); // Actually uses querySelectorAll. Returns all results.
```

### DOM building using JS objects
<table>
<tr>
<td> c3tools </td> <td> Resulting HTML </td>
</tr>
<tr>
<td>

```js
createElement('DIV',{
  children:[
    ['H2',{
      innerText:'Fito Paez'
    }]
    ,['P',{
      innerText:'Él fue un gran cantautor'
    }]
  ]
  ,class:'cantante'
  ,dataset:{
    value:2
  }
});
```

</td>
<td>

```html
<div
  class="cantante"
  data-value="2"
>
  <h2>Fito Paez</h2>
  <p>Él fue un gran cantautor</p>
</div>
```

</td>
</tr>
</table>

This is the main point of the library, so it has some interesting stuff you may want to check out in the wiki.

### Fetching utilities.

You got `sendPOST` and `sendJSON`, they work as wrappers around `fetch` (same response type ... for now). There's also some internal utilities and finally a soon-to-be-deprecated function called `fetchConCredentials`.

This is being reworked soon. Ideally there'll be a very cool `sendJSON` function and that'll be it.

### Type-checking module

An enumeration of data types called `Types`, and a couple fine functions:
- `is(smt:any,type:Types):boolean`
- `whatIs(smt:any):Types`; 

This is actually for internal use, but is available anyways.

## TO DO
- Make the module version the default.
- Document functions here (with **examples**).
- Better README.
- The "Soon!" stuff.

## Soon!
`download` function.

Group functions and variables in logical modules.

Easy way to add functions to the 'DOMContentLoaded' event.

Create .js.map files.

Modal messages with premises.

Reacting to DOM changes.

---
Any suggestion or feedback is welcome.