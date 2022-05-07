const Tree=(o,target,m=o,v='')=>{
	list_of_strings = [];
    for(e in o){
        if(typeof o!=='object'){$('#'+target).append(v+'┗╸'+o);return}
        Array.isArray(o)?!Array.isArray(o[e])?$('#'+target).append(v+(o.length===1||o[e]===o[o.length-1]?'┗╸':'┣╸')+o[e]+'<br>'):Tree(o[e],target,m,v+(o.length===1||o[e]===o[o.length-1]?' '.repeat(o[e].toString.length+1):'┃'+' '.repeat(e.length))):($('#'+target).append(v+(e===Object.keys(m)[0]?'┏╸':Object.keys(o).length===1||Object.keys(o)[Object.keys(o).length-1]===e?'┗╸':'┣╸')+e+'<br>'),Tree(typeof o[e]!=='object'?String(o[e]):o[e],target,m,v+(Object.keys(o).length===1||Object.keys(o)[Object.keys(o).length-1]===e?' '.repeat(e.length+1):'┃'+' '.repeat(e.length))))
    }
    return list_of_strings.join('\n')
}

function displayFileTree(obj, id){
    g = Tree(obj);

    console.log(g)
	$('#'+id).html(g);
}