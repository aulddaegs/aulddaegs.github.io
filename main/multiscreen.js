import * as computer from "computer.js";

/*
Use GUI to navigate file tree, review traffic to hack website? Simulate browser?

Needs:
Browser, localstorage cookie (as a literal file? could be edited), terminal

Or should we have a more binexp local exploit focus... but that's more fiddly

Possible commands:
pull <WEBSTIE> - download public web data
login <WEBSITE> - login to server (use login form, error messages to diagnose OS/security features)
req <WEBSITE> - send request in the format VAR=VALUE;VAR=VALUE; etc.to website
rm <FILE> - delete file
ted <FILE> - edit file
*/

const ROOT_TREE = {
    "home": {"start_hacking.txt": "FILE$start_hacking.txt", ".next_instructions.txt": "FILE$next_instructions.txt"}
}

const SYSTEM_VARIABLES = {
    "curr_path": "",
    "allow_commands": true,    
}

const RESOURCES = {
    "hafgam": {"rpg": {"rpg.exe": "FILE$rpg.html"}}
}

function show_file(flnm){
    document.getElementById('file').src = flnm;
}

function show_directory(directory, path_to_dir){
    SYSTEM_VARIABLES['curr_path'] = path_to_dir;
    var browser = document.getElementById("filebrowser");
    if (path_to_dir.split('/').length >= 2){
        browser.innerHTML = `<button onclick="get_elem_from_path('${path_to_dir}/..')">..</button>`;
    }else{
        browser.innerHTML = '';
    }
    Object.keys(directory).forEach((elem, i) => {
        if (elem[0] !== '.'){
            browser.innerHTML += `<button onclick="get_elem_from_path('${path_to_dir+'/'+elem}')">${elem}</button>`;
        }
    })
}

function get_elem_from_path(raw_path){
    if (raw_path === ''){
        show_directory(ROOT_TREE, '');
        return true;
    }
    var path = raw_path.split('/');
    if (path[0] == ""){
        path.shift();
    }
    var current = ROOT_TREE;
    for (var i=0; i<path.length; i++){
        if (path[i] === '..'){
            path.splice(i-1, 2);
            return get_elem_from_path(path.join('/'));
        }
        var c = current[path[i]];
        if (typeof(c) === "string"){
            var _ = c.split('$');
            var filetype = _[0];
            var filename = _[1];
            if (filetype === "FILE"){
                show_file(filename);
            }
            return true;
        }else if (typeof(c) === "object"){
            current = c;
        }
    }
    show_directory(current, raw_path);
    return true;
}

function feedCommand(){
    var i = document.getElementById('terminal-input');
    if (SYSTEM_VARIABLES['allow_commands'] && i.value){
        hold();
        var data = i.value;
        i.value = '';
        setTimeout(()=>{processCommand(data)}, 0);

    }
}

function processCommand(raw_command){
    var commands = raw_command.split(';');
    commands.forEach((cmd, i) => {
        var args = cmd.split(' ');
        var init = args[0];
        if (init === 'pull'){
            if (args.length === 3){
                if (pull(args[1], args[2])){
                    termprint("Pull succeeded.")
                }else{
                    termprint("Pull aborted by server.")
                }
            }else{
                termprint("Pull failed. Insufficient arguments.")
            }
        }
    })
    unhold();
}

function termprint(text){
    var objDiv = document.getElementById("terminal-output");
    objDiv.innerHTML += '<p>'+text+'</p>';
    objDiv.scrollTop = objDiv.scrollHeight;
}

function hold(){
    SYSTEM_VARIABLES['allow_commands'] = false;
    document.getElementById('terminal-button').classList.add('no');
    document.getElementById('terminal-input').classList.add('no');
    document.getElementById('terminal-input').disabled = true;
}

function unhold(){
    SYSTEM_VARIABLES['allow_commands'] = true;
    document.getElementById('terminal-button').classList.remove('no');
    document.getElementById('terminal-input').classList.remove('no');
    document.getElementById('terminal-input').disabled = false;
}

function add_to_tree(raw_path, data){
    console.log(raw_path);
    var current = ROOT_TREE;
    if (raw_path !== ''){
        var path = raw_path.split('/');
        if (path[0] == ""){
            path.shift();
        }
        console.log(path);
        for (var i=0; i<path.length; i++){
            current = ROOT_TREE[path[i]];
            if (typeof current == "undefined"){
                return false;
            }
        }
    }

    Object.keys(data).forEach((elem, i) => {
        current[elem] = data[elem];
    })

    return true;
}

function pull(src, file){
    var target = RESOURCES[src];
    if (target){
        var tfile = target[file];
        if (tfile){
            if (!tfile["$PASSWORD"]){
                var tdata = {'port': 20, 'data': tfile, 'prefpath': ''}
                if (tfile['$PREFPATH']){
                    tdata['prefpath'] = tfile['$PREFPATH'];
                }
                window.postMessage(tdata);
                return true;
            }else{
                termprint('File is password protected.');
                return false;
            }
        }else{
            termprint('No such file with name '+file+' on server '+src);
            return false;
        }
    }else{
        termprint('No such server with the name '+src);
        return false;
    }
}

window.addEventListener("message", (e) => {
    if (e.data['port'] === 20){
        var trypath = SYSTEM_VARIABLES['curr_path'];
        if (e['prefpath']){
            trypath = e['prefpath'];
        }
        if (!add_to_tree(trypath, e.data['data'])){
            add_to_tree(SYSTEM_VARIABLES['curr_path'], e.data['data']);
        };
        get_elem_from_path(SYSTEM_VARIABLES['curr_path']);
    }else if (e.data['port'] === 443){
        termprint(e.data['data']);
    }
}, false);

document.addEventListener("keypress", (e) => {
    e = e || window.event;
    if (e.key === "~" || e.code === "Backquote"){
        document.getElementById('terminal').hidden = false;
        e.preventDefault();
    }
});

document.getElementById("terminal-input").addEventListener("keypress", (e) => {
    e = e || window.event;
    if (e.code === "Enter"){
        feedCommand();
        e.preventDefault();
    }
})

window.get_elem_from_path = get_elem_from_path;
window.feedCommand = feedCommand;
document.getElementById('terminal').hidden = true;
show_file('');
show_directory(ROOT_TREE, '');
// postMessage({'port': 80, 'data': {'secret.txt': 'FILE$secret.txt'}});