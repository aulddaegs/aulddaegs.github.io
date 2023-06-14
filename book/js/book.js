
THEME = localStorage.getItem("theme") || "light";

console.log(THEME);
if (THEME == 'light'){
    document.documentElement.style.setProperty('--custom-dark', 'rgb(41, 18, 4)');
    document.documentElement.style.setProperty('--custom-cream', 'rgb(227, 215, 189)');
}else if (THEME == 'dark'){
    document.documentElement.style.setProperty('--custom-cream', 'rgb(41, 18, 4)');
    document.documentElement.style.setProperty('--custom-dark', 'rgb(227, 215, 189)');
}

if (!localStorage.getItem('theme')){
    localStorage.setItem("theme", 'light');
}
console.log(THEME);

document.getElementById('dosbutton').onclick = ()=>{
    if (THEME == 'light'){
        document.documentElement.style.setProperty('--custom-cream', 'rgb(41, 18, 4)');
        document.documentElement.style.setProperty('--custom-dark', 'rgb(227, 215, 189)');
        THEME = 'dark';
        localStorage.removeItem("theme");
        localStorage.setItem("theme", 'dark');
    }else{
        document.documentElement.style.setProperty('--custom-dark', 'rgb(41, 18, 4)');
        document.documentElement.style.setProperty('--custom-cream', 'rgb(227, 215, 189)');
        THEME = 'light';
        localStorage.removeItem("theme");
        localStorage.setItem("theme", 'light');
    }
}