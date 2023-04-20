function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

async function loadtxt(filename){
    var e;
    await $.ajax(filename, {'cache': false}).done ((data)=>{e = data;});
    return e;
}

export {encodeHTML, loadtxt};