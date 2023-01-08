# c3tools
Collection of personal sets of functions to speed up web development.

To install just `<script src="https://unpkg.com/@c3r38r170/c3tools" type="module"></script>`.

Specifying a version is recommended. [More info about unpkg.](https://unpkg.com/)

By default, `c3tools-min.js` will be loaded (non-module version). You must specify `/c3tools-min.m.js` after the version, for the module version:

`<script src="https://unpkg.com/@c3r38r170/c3tools@1.1.0/c3tools-min.m.js" type="module"></script>`

## Main Features:

### SuperQuerySelector ([SqS](../../wiki/DOM-querying#sqsselector--nonly_one-fromd-))

One `Element` selecting method to rule them all. Encapsulates all `getElement...` methods, `querySelector` and `querySelectorAll`, and uses the apropriate one depending on the selector.

```js
SqS('#id'); // Actually uses document.getElementById.
SqS('.class',{n:true}); // Actually uses document.getElementsByClassName. Returns all results.
SqS('button',{from:gEt('modal')}); // Actually uses from.getElementsByTagName. Returns first result.
// gEt is short for getElementById btw.
SqS('#id span, #id b',{n:true}); // Actually uses querySelectorAll. Returns all results.
```

### [DOM building](../../wiki/DOM-elements-generators) using JS objects
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

### [superFetch](../../wiki/Fetching#superfetchurl-data--methodget--format--credentialsinclude-)

A very simple and fun to use wrapper around fetch.

### [Type-checking](../../wiki/Type-checking) module

An enumeration of data types called `Types`, and a couple fine functions:
- `is(smt:any,type:Types):boolean`
- `whatIs(smt:any):Types`

This is actually for internal use, but is available anyways.

## TO DO
- Make the module version the default.
- Document functions here (with **examples**).
- Better README.
- The "Soon!" stuff.

## [Soon!](../../projects?type=classic)
`download` function.

Group functions and variables in logical modules.

Easy way to add functions to the 'DOMContentLoaded' event.

Create .js.map files.

Modal messages with premises.

Reacting to DOM changes.

---
Any suggestion or feedback is welcome.