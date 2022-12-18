//Type checking

/**
 * Enum for types of variables.
 * @readonly
 * @enum {number}
 */
var Types={
	OTHER:-1
	,NUMBER:0
	,STRING:1
	,ARRAY:2
	,OBJECT:3
	,BOOLEAN:4
	,NULL:5
};

/**
 * Checks if the variable is of certain type
 * @param {*} variable - Variable to check type.
 * @param {Types} type - Type to check.
 * @returns {boolean} If variable is of said type.
 */
function is(variable,type){
	if(variable==null && type==Types.NULL)
		return true;
	let typesWithTypeofAndClass={
		[Types.NUMBER]:['number',Number]
		,[Types.STRING]:['string',String]
		,[Types.BOOLEAN]:['boolean',Boolean]
	}
	switch(type){
		case Types.NUMBER:
		case Types.STRING:
		case Types.BOOLEAN:
			return typesWithTypeofAndClass[type][0]==typeof variable || variable instanceof typesWithTypeofAndClass[type][1];
		case Types.ARRAY:
			return Array.isArray(variable);
		case Types.OBJECT:
			return 'object'==typeof variable && !Array.isArray(variable);
	}
	return type==Types.OTHER;
}

/**
 * Checks and returns the type of the variable.
 * @param {*} variable - Variable to check type
 * @returns {Types} Type of the variable.
 */
function whatIs(variable){
	switch(typeof variable){
	case 'number':
		return Types.NUMBER;
	case 'string':
		return Types.STRING;
	case 'object':
		switch(true){
		case Array.isArray(variable):
			return Types.ARRAY;
		case variable instanceof String:
			return Types.STRING;
		case variable instanceof Number:
			return Types.NUMBER;
		case variable==null:
			return Types.NULL;
		default:
			return Types.OBJECT;
		}
	default:
		return Types.OTHER;
	}
}

//DOM querying

const W=window,D=document
	,ALL=true,ONLY_ONE=false;
/** @const {HTMLBodyElement} */
var B;
addEventListener('DOMContentLoaded',()=>{
	B=D.body;
});

/**
 * Wrapper for getElementById.
 * @param {string} id - id to search for.
 * @returns {?HTMLElement} Matching element or null if none exists.
 */
const gEt=id=>D.getElementById(id);

/**
 * Wrapper for querySelector, querySelectorAll, and any other DOM query methods.
 * @param {string} selector - CSS selector to look for.
 * @param {object} [obj]={} - Wrapper
 * @param {(number|boolean)} [obj.n]=ONLY_ONE - Ammount of elements to return, defaults to false (ONLY_ONE).
 * @param {HTMLElement} [obj.from]=D - DOM element on which the query will be done.
 * @returns {(HTMLElement[]|HTMLElement)} The element or false if cantidad was 1 or false, a NodeList if cantidad was more than 1 or true.
 * @throws {Error} If the selector is not a string.
 */
function SqS(selector,{n=ONLY_ONE,from=D}={}){
	if(selector instanceof Node)//??? Node vs HTMLElement
		return selector;
	if(!n)
		n=1;

	if(is(selector,Types.STRING)){
		let results, restOfSelector=selector.slice(1);
		if(/[ :\[\.#,+~]/.test(restOfSelector))
			if(n===1)
				return from.querySelector(selector);
			else if(n===true)
				return [...from.querySelectorAll(selector)];
			else results=from.querySelectorAll(selector);
		else switch(selector[0]){
		case '#':
			return D.getElementById(restOfSelector);
		case '.':
			results=from.getElementsByClassName(restOfSelector);
			break;
		case '[':
			let nameMatch=/^\[name="([^"]*)"\]$/.exec(selector);
			if(nameMatch)
				results=D.getElementsByName(nameMatch[1]);
			break;
		case ':':
			break;
		default:
			results=from.getElementsByTagName(selector);
		}
		if(n===1)
			return results?results[0]:from.querySelector(selector);
		else {
			let response=[...results||from.querySelectorAll(selector)];
			return n===true?
				response
				:response.slice(0,n);
		}
	}else throw new Error('The selector must be a string.');
}

//DOM elements generators

/**
 * @typedef {(string|HTMLElement|DocumentFragment)} SimpleElementRepresentation The element representation values that aren't an array.
 */

/**
 * @typedef {(SimpleElementRepresentation|[SimpleElementRepresentation,(ElementRepresentationProperties|ElementRepresentation),ElementRepresentation])} ElementRepresentation Either a string (the name of the element) or an array with the name of the element and an object containing the properties the element will have.
 */

/**
 * An object with the properties that will be applied to the element. It has some special properties that will be handled differently, the rest will just be set through direct property access or the setAttribute method.
 * @typedef ElementRepresentationProperties
 * @type {object}
 * @property {string} [class] - A CSS class.
 * @property {string[]} [classList] - A list of CSS classes.
 * @property {(Function|string)} [finalFun] - A function that will be called when the element is created with it as the context.
 * @property {ElementRepresentation[]} [children] - A list of elements representations that will be created and appended. MUST be an array or other iterable.
 * @property {(Function|string)} [onevent] - A function or a string representing the name of a global function or a function body that will be added as a property (element.onevent=function).
 * @property {object} [dataset] - An object representing the data- attributes of the element as accessed through JavaScript.
 * @property {object} [style] - An object representing the inline CSS style of the element as accessed through JavaScript.
 */

/**
 * Creates Elements from a representation.
 * This function is not supposed to be used alone, but with nested elements inside addElement parameters. However, it comes handy every so often.
 * @param {ElementRepresentation} element - A representation of the starting element, can be the name or an existing element. Can also be an array of the 3 parameters, for nesting.
 * @param {(ElementRepresentationProperties|ElementRepresentation)} [options] - Represents the properties to be added to the element. Can also be used to pass an only child, for nesting. Some special values: children; an array of children representations (Existing Elements, arrays of parameters for createElement, even a string of the node name.). class; a single class name as a string. Not incompatible with classList. classList; an array of classes names. finalFun; a function that will be called at the end and has the resulting element as the context. on{event}; can be passed a function (not an arrow one) or a string of the body of the function or the name of the function (looked for in Window).
 * @param {ElementRepresentation} [onlyChild] - If only 1 child will be added, then this parameter is for you. This comes handy in nesting.
 * @returns {HTMLElement} The resulting element.
 * @throws {Error} If the element is falsey. It must be there, whatever its value.
 */
function createElement(element,options,onlyChild){
	if(!element)
		throw new Error("Element is required.");
	
	let finalFun;
	
	if(is(element,Types.ARRAY))
		[element,options,onlyChild]=element;
	if(is(element,Types.STRING))
		if(element=element.trim())
			element=D.createElement(element.toUpperCase());
		else throw new Error("Element is required.");
	
	if(options && (options.nodeType || !is(options,Types.OBJECT))){
		onlyChild=options;
		options=null;
	}
	
	let value,childrenHolder;
	if(options)
		for(let key in options){
			value=options[key];
			
			switch(key){
			case 'class':
				element.classList.add(value);
				break;
			case 'classList':
				for(let item of value)
					element.classList.add(item);
				break;
			case 'finalFun':
				finalFun=value;
				break;
			case 'children':
				childrenHolder=D.createDocumentFragment();
				addElement(childrenHolder,...value);
				break;
			default:
				if(key.substring(0,2)=='on' && is(value,Types.STRING))
					if(value.match('[^a-zA-Z0-9_]'))
						element[key]=new Function(value);
					else element[key]=W[value];
				// I can't think of enough cases to prove == and === behave differently here. So watch out.
				else if(key.substring(0,2)!='on' && element[key]===undefined)
					element.setAttribute(key,value);
				else if(is(value,Types.OBJECT)) //style, dataset
					Object.assign(element[key],value);
				else element[key]=value;
				break;
			}
			// if(key=='innerHTML')
			// 	processJSinHTML(value);
		}
	
	if(onlyChild){
		if(!childrenHolder)
			childrenHolder=D.createDocumentFragment();
		childrenHolder.appendChild(onlyChild.nodeType?onlyChild:createElement(onlyChild));
	}

	if(childrenHolder)
		element.appendChild(childrenHolder);

	if(finalFun)
		(typeof finalFun=='string'?new Function(finalFun):finalFun).call(element);
	return element;
}

/**
 * Adds the elements resulting from the children to the specified parent element.
 * @param {HTMLElement} parent - The element where all children will be appended.
 * @param  {...ElementRepresentation} children - The structures of the children that will be created and appended.
 * @returns {(HTMLElement|HTMLElement[])} The only child added if there's one or an array of all the children added.
 * @throws When parent is not a HTMLElement.
 */
function addElement(parent,...children){
	if(!parent instanceof HTMLElement)
		throw new Error('Parent must be an HTMLElement.');

	let results=[];
	for(let child of children)
		if(child)
			results.push(parent.appendChild(child.nodeType?child:createElement(child)));
	return results.length>1?results:results[0];
}

//Fetching

/**
 * Sends JSON as POST request.
 * @param {string} url - The target URL.
 * @param {object} JSONdata - The request payload.
 * @param {object} otherOptions - Options for the fetch operation.
 * @returns {Promise} The resulting Promise from the fetch operation.
 */
function sendJSON(url,JSONdata,otherOptions=null){
	let defaultOptions={
		credentials:'include'
		,method:'POST'
		,headers:{'Content-Type':'application/json'}
		,body:JSON.stringify(JSONdata)
	};
	return fetch(url,otherOptions?Object.assign(defaultOptions,otherOptions):defaultOptions);
}

/**
 * A recursive iterator that turns a JSON object into URL string key-value pairs.
 * @param {object} obj - The object to parse.
 * @param {string} prefix - The path to this object.
 * @yields {[string, (string|boolean|number)]} Key-value pair.
 */
function* JSONAsURLEncodedStringIterator(obj,prefix=null){
	let pairs=Array.isArray(obj)?
		obj.map(el=>['',el])
		:Object.entries(obj);
	for (let [k,v] of pairs){
		k = prefix ? prefix + "[" + k + "]" : k;
		if(v != null && typeof v == "object")
			yield* JSONAsURLEncodedStringIterator(v, k);
		else yield [k,v];
	}
}

/**
 * Turns a regular object into a FormData object.
 * @param {(Array|object)} obj - Original object.
 * @returns {FormData} The data as a FormData.
 * @throws {Error} If obj is not valid.
 */
function JSONAsFormData(obj){
	if(!(is(obj,Types.ARRAY) || is(obj,Types.OBJECT)))
		throw new Error("\"obj\" must be an array or object.");
	
	let fd=new FormData;
	for(let key in obj){
		let value=obj[key];
		if(value != null && !(value instanceof File) && typeof value == "object"){ // objects and arrays
			for(let pair of JSONAsURLEncodedStringIterator(value,key))
				fd.append(...pair);
		}else fd.append(key,value);
	}
	return fd;
}

/**
 * Sends JSON as FormData. This differs from sendJSON in that this can send files.
 * @param {string} url - The URL where to send the data
 * @param {(object|FormData)} data - The data to be sent.
 * @param {string} [returnType=undefined] - If provided, the Promise returned will not be the one returned by the fetch call, but the function of this name on the response. Example values: "json", "text"
 * @param {object} [otherOptions=undefined] - Other fetch options that should be applied.
 * @return {Promise} The Promise of the fetch request or its response.
 */
function sendPOST(url,data,{returnType,otherOptions}={}){
	if(!(data instanceof FormData))
		data=JSONAsFormData(data);
	
	let options={
		credentials:'include'
		,method:'POST'
		,body:data
	};
	if(otherOptions)
		Object.assign(options,otherOptions);
	
	let f=fetch(url,options);
	return returnType?
		f.then(r=>r[returnType]())
		:f;
}

/**
 * Just like a regular fetch but with credentials:'include'.
 * @param {string} url - URL to fetch.
 * @param {object} options - Options to pass to the fetch function.
 * @param  {...*} rest - More parameters to pass to the fetch function.
 * @returns {Promise} The promise returned from the fetch call.
 */
function fetchConCredentials(url,options={},...rest){
	options.credentials='include';
	return fetch(url,options,...rest);
}

export {
	SqS
	,gEt
	,ALL
	,ONLY_ONE
	
	,Types
	,is
	,whatIs
	
	,createElement
	,addElement
	
	,sendJSON
	,sendPOST
	,JSONAsURLEncodedStringIterator
	,JSONAsFormData
	,fetchConCredentials

	,W
	,D
	,B
}