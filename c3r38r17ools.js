//Utilities

const W=window,D=document
	,ALL=true,ONLY_ONE=false
	,OTHER=-1,NUMBER=0,STRING=1,ARRAY=2,OBJECT=3,BOOLEAN=4,NULL=5;
var B;

addEventListener('DOMContentLoaded',()=>{
	B=D.body;
});

function is(variable,type){
	if(variable==null && type==NULL)
		return true;
	let types={
		[NUMBER]:['number',Number]
		,[STRING]:['string',String]
		,[BOOLEAN]:['boolean',Boolean]
	}
	switch(type){
		case 0:
		case 1:
		case 4:
			return types[type][0]==typeof variable || variable instanceof types[type][1];
		case 2:
			return Array.isArray(variable);
		case 3:
			return 'object'==typeof variable && !Array.isArray(variable);
	}
	return type==OTHER;
}

function whatIs(variable){
	switch(typeof variable){
	case 'number':
		return NUMBER;
	case 'string':
		return STRING;
	case 'object':
		switch(true){
		case Array.isArray(variable):
			return ARRAY;
		case variable instanceof String:
			return STRING;
		case variable instanceof Number:
			return NUMBER;
		case variable==null:
			return NULL;
		default:
			return OBJECT;
		}
	default:
		return OTHER;
	}
}

const gEt=id=>D.getElementById(id);

function SqS(selector,{cantidad=ONLY_ONE,ancestroComun=D}={}){
	if(selector instanceof Node)//??? Node vs Element
		return selector;
	if(is(selector,STRING)){
		let resultados, restoDeSelector=selector.slice(1);
		if(/[ :\[\.#,+~]/.test(restoDeSelector))
			if(!cantidad||cantidad===1)
				return ancestroComun.querySelector(selector)
			else if(cantidad===true)
				return ancestroComun.querySelectorAll(selector);
			else resultados=ancestroComun.querySelectorAll(selector);
		else switch(selector[0]){
		case '#':
			return D.getElementById(restoDeSelector);
		case '.':
			resultados=ancestroComun.getElementsByClassName(restoDeSelector);
			break;
		case '[':
			let nameMatch=/^\[name="([^"]*)"\]$/.exec(selector);
			if(nameMatch)
				resultados=D.getElementsByName(nameMatch[1]);
			break;
		case ':':
			break;
		default:
			resultados=ancestroComun.getElementsByTagName(selector);
		}
		if(!cantidad||cantidad===1)
			return resultados?resultados[0]:D.querySelector(selector);
		else if(cantidad===true)
			return resultados?resultados:D.querySelectorAll(selector);
		else{
			if(!resultados)
				resultados=D.querySelectorAll(selector);
			if(cantidad>=resultados.length)
				return resultados;
			let respuesta=[];
			for(let i=0;i<cantidad;i++)
				respuesta.push(resultados[i]);
			return respuesta;
		}
	}else return false;
}

//TODO deprecate in 2023, 2 years after Array.prototype.at was implemented in major browsers
function last(array){
	if(!is(array,ARRAY))
		throw new Error('Tried to get last of something not an array.');
	return array[array.length-1];
}

//Nodes

function createNode(element,options,onlyChild){
	// let {props,children,finalFun,}=options;
	if(!element)
		return;
	
	let finalFun;
	
	if(is(element,ARRAY))
		[element,options,onlyChild]=element;
	if(is(element,STRING))
		if(element=element.trim())
			element=D.createElement(element.toUpperCase());
		else return;
	
	if(options && (options.nodeType || !is(options,OBJECT))){
		onlyChild=options;
		options=null;
	}
	
	let value;
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
				addNode(element,...value);
				break;
			default:
				if(key.substring(0,2)=='on' && is(value,STRING))
					if(value.match('[^a-zA-Z0-9_]'))
						element[key]=new Function(value);
					else element[key]=W[value];
				else if(key.substring(0,2)!='on' && element[key]==undefined)//this is null too right?  probar algun dia, hacer test set 	//TODO do please
					element.setAttribute(key,value);
				else if(is(value,OBJECT)) //style, dataset
					Object.assign(element[key],value);
				else element[key]=value;
				break;
			}
			// if(key=='innerHTML')
			// 	processJSinHTML(value);
		}
	if(onlyChild)
		element.appendChild(onlyChild.nodeType?onlyChild:createNode(onlyChild));
	if(finalFun)
		(typeof finalFun=='string'?new Function(finalFun):finalFun).call(element);
	return element;
}

//TODO add some checking for parent, see if returning something else is better
function addNode(parent,...children){
	let results=[];
	for(let child of children)
		if(child)
			results.push(parent.appendChild(child.nodeType?child:createNode(child)));
	return results.length>1?results:results[0];
}

//fetching

function sendJSON(url,JSONdata,otherOptions=null){
	let defaultOptions={
		credentials:'include'
		,method:'POST'
		,headers:{'Content-Type':'application/json'}
		,body:JSON.stringify(JSONdata)
	};
	return fetch(url,otherOptions?Object.assign(defaultOptions,otherOptions):defaultOptions);
}

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

function JSONAsFormData(obj){
	if(!(is(obj,ARRAY) || is(obj,OBJECT)))
		return;
	
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

function sendPOST(url,data,{returnType=null,otherOptions=null}={}){
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

function fetchConCredentials(url,options,...rest){
	return fetch(url,Object.assign({credentials:'include'},options),...rest);
}