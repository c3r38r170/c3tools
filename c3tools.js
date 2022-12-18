import * as c3 from './c3tools.m.js';
for(let cosa in c3){
	window[cosa]=c3[cosa];
}

// * El módulo se carga después de que carga el DOMContent
window.B=D.body;