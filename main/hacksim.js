import * as comlib from "./computer.js";
import { INTERNET } from "./targets.js";
import { encodeHTML, loadtxt } from "./util.js";
import { CoreComputer } from "./corecomputer.js";

// TODO: binary exploitation minigame

// TODO: Fix DOMPurify and implement it server side
import * as DOMPurify from './purify.min.js';

// TODO: sdoc markdown editor? -> show multiple versions of the same doc
// TODO: fileserver browser thing


//const LOCAL_COMPUTER = new comlib.Computer('user', start_tree);
const LOCAL_COMPUTER = CoreComputer;
var ALLOW_COMMANDS = true;

function back(){
    LOCAL_COMPUTER.curr_path = comlib.popPath(LOCAL_COMPUTER.curr_path);
    displayDirectory(LOCAL_COMPUTER.curr_path);
}

function saveData(path, data, text_mode=false){
    var idealpath = LOCAL_COMPUTER.getFullPath(path);
    var splitpath = idealpath.split('/');
    if (splitpath[0] == ''){
        splitpath.shift();
    }
    var current = LOCAL_COMPUTER.tree;
    if (!text_mode){
        if (splitpath){
            for (var i=0; i<splitpath.length; i++){
                current = current[splitpath[i]];
            }
        }
        console.log(data);
        Object.keys(data).forEach((elem, i) => {
            current[elem] = new comlib.ComputerFile(data[elem].name, data[elem].data, data[elem].kind, data[elem].owner, data[elem].properties);
        })
    }else{
        if (splitpath){
            var next_thing = splitpath[splitpath.length-1];
            for (var i=0; i<splitpath.length-1; i++){
                current = current[splitpath[i]];
                next_thing = splitpath[i+1];
                console.log(next_thing);
            }
        }

        current[next_thing].data = data[next_thing];
    }
    
    console.log(current, LOCAL_COMPUTER.tree);
}

function displayDirectory(path){
    var data = LOCAL_COMPUTER.resolvePath(path);
    if (!data){
        console.log('directory display failed.');
        return;
    }
    LOCAL_COMPUTER.curr_path = LOCAL_COMPUTER.getFullPath(path);
    document.getElementById('systempath').textContent = LOCAL_COMPUTER.curr_path;
    var browser = document.getElementById('filebrowser');
    if (path !== ''){
        browser.innerHTML = '<button class="ui-button" onclick="back()">⏪ ..</button>';
    }else{
        browser.innerHTML = '';
    }
    Object.keys(data).forEach((e, i) => {
        var thing = data[e];
        if (e[0] === '.' && e !== '..' && !LOCAL_COMPUTER.sysenv['SHOW_HIDDEN_FILES']){
            return;
        }
        if (thing instanceof comlib.ComputerFile){
            if (thing.kind == 'text'){
                browser.innerHTML += `<button class="ui-button" onclick="displayText(\'${e}\', \'${LOCAL_COMPUTER.curr_path+'/'+e}\')">📝 ${e}</button>`
            }else if (thing.kind == 'web'){
                browser.innerHTML += `<button class="ui-button" onclick="displayHTML(\'${thing.data}\')">🖥️ ${e}</button>`
            }else if (thing.kind == 'pdf'){
                browser.innerHTML += `<button class="ui-button" onclick="displayIframe(\'${thing.data}\')">📄 ${e}</button>`
            }else if (thing.kind == 'image'){
                browser.innerHTML += `<button class="ui-button" onclick="displayImage(\'${thing.data}\')">🖼️ ${e}</button>`
            }else if (thing.kind == 'video'){
                browser.innerHTML += `<button class="ui-button" onclick="displayIframe(\'${thing.data}\')">🎥 ${e}</button>`
            }
        }else{
            browser.innerHTML += `<button class="ui-button" onclick="displayDirectory(\'${e}\')">📁${e}/</button>`
        }
    })
}

function displayHTML(item){
    $.ajax(item, {'async': true, 'cache': false}).done((data)=>{
        $('#box').html(data);
        $('#box').scrollTop(0);
    });
}

function displayIframe(item){
    document.getElementById('box').innerHTML = `<iframe id="displayframe" src="${item}" frameborder="0"></iframe>`;
}

function displayText(name, item){
    var fullPath = LOCAL_COMPUTER.getFullPath(item);
    var text = LOCAL_COMPUTER.resolvePath(item);
    var text = text.data;
    if (!LOCAL_COMPUTER.sysenv['ALLOW_FILE_EDITING']){
        $('#box').html('<span class="txt-file">'+encodeHTML(text)+'</span>');
        return;
    }
    // var fl = document.getElementById('file');
    // fl.src = 'textedit.html';
    // window.setTimeout(()=>{var text_area = fl.contentDocument;text_area.getElementById('rawtext').value = item}, 50);
    $.ajax('textedit.html', {'async': true, 'cache': false}).done((data)=>{
        $('#box').html(data);
        $('#box #rawtext').val(text);
        $('#box #filepath').html(fullPath);
        $('#box #filename').html(name);
    });

}

function displayImage(name){
    $('#box').html(`<img class="fileimage" src="${name}"></img>`)
}

function termprint(text){
    var objDiv = document.getElementById("terminal-output");
    objDiv.innerHTML += '<p class="logline">'+encodeHTML(text)+'</p>';
    objDiv.scrollTop = objDiv.scrollHeight;
}

function feedCommand(){
    var i = document.getElementById('terminal-input');
    if (ALLOW_COMMANDS && i.value){
        hold();
        var data = i.value;
        i.value = '';
        setTimeout(()=>{processCommand(data)}, 0);

    }
}

function processCommand(raw_command){
    var commands = raw_command.split(';');
    for (let i=0; i< commands.length; i++){
        try {
            runSingleCommand(commands[i]);
        }catch (error){
            termprint('Unknown error. Terminating.')
            console.log(error);
            break;
        }
    }
    unhold();
}

function runSingleCommand(cmd){
    if (cmd === ''){
        return;
    }else{
        termprint('> '+cmd);
    }
    var args = cmd.split(' ');
    var init = args[0];
    if (init === 'setenv'){
        var envname = args[1];
        var envval = args[2];
        if (!(envname&& envval)){
            termprint('Specify an env variable name and value.');
        }else if (typeof LOCAL_COMPUTER.sysenv[envname] === 'undefined'){
            termprint('Invalid env variable name '+envname+' .');
        }else if (envval !== 'true' && envval !== 'false'){
            termprint('Invalid env variable value '+envval+'.');
        }else{
            if (envval == "true"){
                var final = true;
            }else if (envval == "false"){
                var final = false;
            }
            LOCAL_COMPUTER.sysenv[envname] = final;
            if (envname === 'show_hidden_files'){
                displayDirectory(LOCAL_COMPUTER.curr_path);
            }
        }
    }else if (init === 'listenv'){
        Object.keys(LOCAL_COMPUTER.sysenv).forEach((e, i)=> {
            termprint(e+'    '+LOCAL_COMPUTER.sysenv[e])
        })
    }else if (init === 'pull'){
        var target = args[1];
        var target_path = args[2];
        var id_file = args[3];
        if (!(target && target_path)){
            termprint('You must supply a target machine and a target path.');
            return false;
        }
        var target_machine = INTERNET[target];
        if (typeof target_machine === 'undefined'){
            termprint('No such target machine '+target+'.');
            return false;
        }else if (target_machine.askid && typeof id_file === undefined){
            termprint('Warning: Target machine requests an id file.');
        }
        if (id_file){
            console.log(LOCAL_COMPUTER.resolvePath(id_file));
            id_file = LOCAL_COMPUTER.resolvePath(id_file).data
        }
        target_machine.fetchFile(target_path, id_file);
    }else if (init === 'netmap'){
        termprint('The following public servers were found:')
        Object.keys(INTERNET).forEach((e, i) => {
            console.log(INTERNET[e]);
            if (INTERNET[e].is_public){
                termprint(e);
            }
        })
    }else if (init === 'poke'){
        var target_host = args[1];
        if (!target_host){
            termprint('Target server needed.');
            return false;
        }else if (typeof INTERNET[target_host] === 'undefined'){
            termprint('No such server '+target_host+'.');
        }else{
            termprint(Object.keys(INTERNET[target_host].tree).join('<br>'));
        }
    }else if (init === 'ls'){
        var list_path = args[1];
        if (!list_path){
            list_path = LOCAL_COMPUTER.curr_path;
        }
        var list_dir = comlib.parsePath(LOCAL_COMPUTER.tree, list_path);
        if (typeof list_dir === 'undefined'){
            termprint("Invalid path "+list_path);
        }else{
            Object.keys(list_dir).forEach((e, i) =>{
                if (list_dir[e] instanceof comlib.ComputerFile){
                    termprint(list_dir[e].name.padEnd(25, ' ').substring(0, 25)+' '+list_dir[e].kind.padEnd(6).substring(0, 6)+' '+String(list_dir[e].owner).padEnd(10).substring(0, 10));
                }else{
                    termprint(e.padEnd(25, ' ').substring(0, 25)+' '+'DIRECTORY'.padEnd(17))
                }
            })
        }
    }else if (init === 'file'){
        var file = args[1];
        if (!file){
            termprint('Specify a file please.');
            return;
        }            
        var res = LOCAL_COMPUTER.resolvePath(file);
        if (!res || !(res instanceof comlib.ComputerFile)){
            termprint('No such file.');
            return;
        }
        termprint(res.desc());
    }else if (init === 'help'){
        termprint('COMMANDS:\nls\nlistenv\nsetenv\nnetmap\npull');
    }else{
        termprint(cmd+' is not a recognised command.');
    }
}

function hold(){
    ALLOW_COMMANDS = false;
    document.getElementById('terminal-button').classList.add('no');
    document.getElementById('terminal-input').classList.add('no');
    document.getElementById('terminal-input').disabled = true;
}

function unhold(){
    ALLOW_COMMANDS = true;
    document.getElementById('terminal-button').classList.remove('no');
    document.getElementById('terminal-input').classList.remove('no');
    document.getElementById('terminal-input').disabled = false;
}

window.addEventListener("message", (e) => {
    if (e.data.hasOwnProperty('port')){
        LOCAL_COMPUTER.syslog.push(e.data);
    }
    if (e.data['port'] === 20){ // html file transfer
        if (LOCAL_COMPUTER.sysenv['SAVE_TO_CURRENT_DIR']){
            var trypath = LOCAL_COMPUTER.curr_path;
        }else{
            termprint('Saving to downloads folder.')
            var trypath = '/mens rea/downloads';
            if (e['prefpath']){
                trypath = e['prefpath'];
            }    
        }
        saveData(trypath, e.data['data']);
        displayDirectory(LOCAL_COMPUTER.curr_path);
    }else if (e.data['port'] === 443){ // output coming back from remote source
        termprint(e.data['data']);
    }else if (e.data['port'] === 8080){ // local file saving text data
        console.log('received save');
        saveData(e.data['origin'], e.data['data'], true)
    }
}, false);

// document.getElementById("file").contentWindow.addEventListener("message", (e)=>{
//     console.log('forwarding message');
//     window.postMessage(e);
// })

document.addEventListener("keypress", (e) => {
    e = e || window.event;
    if ((e.key === "`" || e.code === "Backquote") && e.target === document.body){
        if (LOCAL_COMPUTER.sysenv['ALLOW_DEV_CONSOLE']) {
            if (document.getElementById('terminal').hidden === true){
                document.getElementById('terminal').hidden = false;
            }else{
                document.getElementById('terminal').hidden = true;
            }
            e.preventDefault();
        }
    }
});

document.getElementById('terminal-input').addEventListener("keypress", (e) => {
    e = e || window.event;
    if (e.code === "Enter"){
        feedCommand();
        e.preventDefault();
    }
});

window.back = back;
window.displayDirectory = displayDirectory;
window.displayHTML = displayHTML;
window.displayText = displayText;
window.displayIframe = displayIframe;
window.displayImage = displayImage;

window.feedCommand = feedCommand;

document.getElementById('terminal').hidden = true;
displayDirectory(LOCAL_COMPUTER.curr_path);


