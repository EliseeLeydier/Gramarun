var html_themeOther = "<link id='theme' href='/staticFiles/css/other.css' rel='stylesheet' />";
window.addEventListener("load", switchTheme_advanced_init);

function switchTheme_advanced_onClick(e) {
    e.preventDefault();
    var localStorage_theme = localStorage.getItem("theme");

    if (localStorage_theme === undefined || localStorage_theme === "default") {
        localStorage_theme = "other";
    } else {
        localStorage_theme = "default";
    }

    localStorage.setItem("theme", localStorage_theme);
    window.location.reload();
}

function switchTheme_advanced_init() {
    var localStorage_theme = localStorage.getItem("theme");
    var html_head = document.getElementsByTagName("head")[0];

    if (localStorage_theme === "other") {
        html_head.innerHTML = html_head.innerHTML + html_themeOther;
    }
    setTimeout(function() {
        document.getElementById("style_temporaire").remove();
    }, 100);
}