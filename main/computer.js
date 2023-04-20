// import { Base64 } from './base64.mjs'
// Base64.extendString();

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r, c1, c2;r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);var c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

function decodeUTF16LE( binaryStr ) {
    var cp = [];
    for( var i = 0; i < binaryStr.length; i+=2) {
        cp.push( 
             binaryStr.charCodeAt(i) |
            ( binaryStr.charCodeAt(i+1) << 8 )
        );
    }

    return String.fromCharCode.apply( String, cp );
}

function parsePath(tree, path){
    path = regularisePath(path);
    path = path.split('/');
    if (path[0] == ""){
        path.shift();
    }
    var current = tree;
    for (let i=0; i<path.length; i++){
        var elem = path[i];
        if (elem == '.'){
            continue;
        }else if (elem == '..'){
            path.splice(i-1, 2);
        }else{
            current = current[elem];
            if (typeof current === "undefined"){
                return false;
            }
        }
    }
    return current;
}

function regularisePath(path){
    path = path.split('/');
    var new_path = [];
    if (path[0] == ''){
        new_path.push('');
        path.shift();
    }
    for (let i=0; i<path.length; i++){
        var elem = path[i];

        if (elem == '.' || elem == ''){
        }else if (elem == '..'){
            new_path.splice(i, 1);
        }else{
            new_path.push(elem);
        }
    }
    return new_path.join('/');
}

function popPath(path){
    path = path.split('/');
    path.pop();
    return path.join('/');
}

function getLastElemPath(path){
    path = path.split('/');
    return path.pop();
}


class ComputerFile {
    constructor(name, data, kind="html", owner="system", properties=null){
        this.name = name;
        this.data = data;
        this.kind = kind; // html, text (editable and stored in this.data)
        this.owner = owner;
        this.properties = properties;
    }

    desc(){
        if (this.properties) {
            var props = '';
            var prop_keys = Object.keys(this.properties)
            for (let i=0; i<prop_keys.length; i++){
                props += `${prop_keys[i]}=${this.properties[prop_keys[i]]};`
            }
            return `${this.name}: ${this.kind} file created by ${this.owner} with properties [${props}]`
        }else{
            return `${this.name}: ${this.kind} file created by ${this.owner}`
        }
    }
}

class FileServ {
    constructor(name, version, tree, askid, owner=null, is_public=true){
        this.name = name;
        this.tree = tree;
        this.version = version;
        this.askid = askid;
        this.owner = owner;
        this.is_public = is_public;
    }
    
    fetchFile(path){
        var result = parsePath(this.tree, path);
        if (result){
            this.post(getLastElemPath(path), result);
        }else{
            this.no_file_found(path);
        }
    }

    no_file_found(path){
        this.talk('No such file found.')
    }

    talk(message){
        postMessage({'port': 443, 'data': message});
    }

    post(name, file){
        var payload = {};
        payload[name] = file;
        postMessage({'port': 20, 'data': payload});
    }
}

class BadAlpine extends FileServ{
    constructor (name, tree, is_public=true, owner=null){
        var own = owner || {'username': 'root', 'password': 'alpine'};
        var ask = true;
        var nm = name;
        var tr = tree;
        var ver = 'Alpine Safehost v3.1';
        var pub = is_public;
        super(nm, ver, tr, ask, own, pub);
    }
    
    fetchFile(path, id_file){
        if (!id_file){
            this.talk('[ALPINE] no id file provided.');
            return false;
        }
        id_file = String(id_file).split('\n');
        var n = id_file[0];
        var p = id_file[1];
        if (! (n && p)){
            this.talk('[ALPINE] malformed id file provided.');
            return false;
        }
        if (n === this.owner['username'] && p === this.owner['password']){
            this.talk('[ALPINE] success.');
            super.fetchFile(path);
        }
    }

    no_file_found(path){
        this.talk('[ALPINE] no file found with path "'+path+'".');
    }
}

class BadEuro extends FileServ{
    constructor (name, tree, is_public=true){
        var own = null;
        var ask = true;
        var nm = name;
        var tr = tree;
        var ver = 'Havland Technica Enterprise FileServer 7.7';
        var pub = is_public;
        super(nm, ver, tr, ask, own, pub);
    }

    fetchFile(path, id_file){
        var file = parsePath(this.tree, path);
        if (!file){
            this.talk('Error - No such file found.')
        }else if (parseInt(file.properties['uid']) >= 4){ // 4 is publix
            this.talk('Success. [No ID, public fetch]')
            this.post(getLastElemPath(path), file);
        }else{
            if (!id_file){
                this.talk('Error - An ID file is required to access this system. If you are a guest, please generate a Guest ID by pulling "guest.id" from our public fileserver. If you are an employee, please contact the helpdesk.');
                return false;
            }
            console.log(id_file, Base64.decode(id_file));
            id_file = Base64.decode(id_file);
            id_file = id_file.split('=');
            var uid = parseInt(id_file[1]);
            if (isNaN(uid)){
                this.talk('Error - UID provided is invalid. Please try again.');
                return false;
            }else if (parseInt(file.properties['uid']) <= uid){
                this.talk('Error - Insufficient privilege level. Please try again.');
            }else{
                this.talk('Success.');
                this.post(getLastElemPath(path), file);
            }
        }

        
        
    }
}

class BadEuroPublic extends FileServ{
    constructor (name, tree, is_public=true){
        var own = null;
        var ask = false;
        var nm = name;
        var tr = tree;
        var ver = 'Havland Technica Public All-Access FileServer 1.3';
        var pub = is_public;
        super(nm, ver, tr, ask, own, pub);
    }

    fetchFile(path){
        var uid = 0;
        if (path === '*'){
            this.talk('Fetching all top level files.')
            Object.keys(this.tree).forEach(element => {
                var e = this.tree[element];
                if (e instanceof ComputerFile){
                    this.post(element, e);
                }
            });
        }else{
            var file = parsePath(this.tree, path);
            if (!file){
                this.talk('Error - No such file found.')
            }else{
                this.talk('Success.')
                this.post(getLastElemPath(path), file);
            }
        }

    }
}

class BadHasher extends FileServ{
    constructor(name, tree, own, is_public=true){
        var own = md5(String(own));
        var ask = true;
        var nm = name;
        var tr = tree;
        var ver = 'Panopt-Palant Secure File Server v1.0';
        var pub = is_public;
        super(nm, ver, tr, ask, own, pub);
    }

    fetchFile(path, id_file){
        if (!id_file){
            var password = md5('');
        }else{
            var password = md5(id_file);
        }
        if (!(password === this.owner)){
            this.talk(`PPSFS> Process returned with errour code 0xA3 [HASH_FAIL]. Invalid password found in id file. Exiting...`);
            this.post('PPSFS_ERRORLOG_0xA3_HASHFAIL.txt', new ComputerFile('PPSFS_ERRORLOG_0xA3_HASHFAIL.txt', `CHALHASH=${password}\nPASSHASH=${this.owner}`, 'text', 'system'));
        }else{
            this.talk('PPSFS> User verification succeeded.');
            super.fetchFile(path);
        }
    }

    no_file_found(path){
        this.talk('PPSFS> Process returned with error code NO_SUCH_FILE. Invalid path "'+path+'".');
    }
}

export {ComputerFile, parsePath, regularisePath, popPath, FileServ, BadAlpine, BadEuro, BadEuroPublic, BadHasher};