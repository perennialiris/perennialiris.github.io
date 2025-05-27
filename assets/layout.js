
"use strict"

function get(id) {
    let ref = document.getElementById(id);
    if (ref == null) { console.error(`document.getElementById("${id}") returned null`); }
    return ref;
}

function setMenu(action) {
    switch (action) {
        case "show":
            get("menu").classList.remove("hidden");
            localStorage.setItem("menuState", "visible");
            break;
        case "hide":
            get("menu").classList.add("hidden");
            localStorage.setItem("menuState", "hidden");
            break;
        default:
            const mode = localStorage.getItem("menuState");
            if (mode == null || mode == "hidden") {
                setMenu("show");
            } else {
                setMenu("hide");
            }
            break;
    }
}
function setBrightness(setValue) {
    switch (setValue) {
        case "light":
            get("page").classList.remove("dark");
            get("lightswitch").checked = false;
            localStorage.setItem("brightness", "light");
            break;
        case "dark":
            get("page").classList.add("dark");
            get("lightswitch").checked = true;
            localStorage.setItem("brightness", "dark");
            break;
        default:
            const mode = localStorage.getitem("brightness");
            if (mode == null || mode == "light") {
                setBrightness("dark");
            } else {
                setBrightness("light");
            }
            break;
    }
}

function setToc(action) {
    switch (action) {
        case "show":
            get("table-of-contents").classList.remove("hidden");
            get("tocToggle").checked = true;
            localStorage.setItem("tocState", "visible");
            break;
        case "hide":
            get("table-of-contents").classList.add("hidden");
            get("tocToggle").checked = false;
            localStorage.setItem("tocState", "hidden");
            break;
        default:
            const mode = localStorage.getItem("tocState");
            if (mode == "visible") {
                setToc("hide");
            } else if (mode == "hidden" || mode == null) {
                setToc("show");
            }
    }
}

let data = `
41 | Normalization and status quo bias | politics, culture | 2025-04-20 | 
40 | Trump and Russia | politics | 2025-03-05 | 
39 | Movies | other | | narrow unlisted
38 | 
37 | Bluesky accounts listing | other | | toc wide
36 | India | history, politics | 2025-03-05 | 
34 | The Nazi salute | news, politics | 2025-01-24 | narrow
33 | 
32 | Politics fundamentals | politics | 2025-01-05 | toc wide
31 | Reflections on Justin Trudeau | news, politics | 2025-01-08 |
30 | The appearance of intelligence | other | 2025-01-18 |
29 | Date formats | other | 2025-01-11 | narrow
28 | The problem with Pierre | politics | 2025-03-15 | 
27 | Sex, gender, & transsexuals | transgender, politics | 2024-12-29 | toc
26 | Trump news list | news, politics | | pinned wide
35 | News list | news, politics | | wide
25 | A beauty holding a bird | other | 2024-12-23 | narrow
24 | Enduring falsehoods about Warren, Clinton | politics | 2024-12-19 |
23 | Passing | transgender, culture | 2025-02-24 |
22 | Dehumanization | politics | 2024-12-15 |
21 | Relationships | personal | 2024-12-14 | unlisted
20 | Israel–Palestine notes | politics | 2025-02-24 | toc unlisted
19 | Ilhan Omar’s comments about Somalia | politics | 2025-02-12 |
18 | Transcripts: context for inflammatory Trump statements | politics | |
17 | Why get bottom surgery? | transgender, culture | 2025-02-09 |
16 | Milo Yiannopoulos’s cancellation | politics | 2025-02-03 |
15 | Mark Robinson transcript | | 2024-11-13 | unlisted
14 | Reasons I’m glad to be Canadian | politics | 2024-12-08 |
13 | The military–industrial complex | politics | 2024-12-04 |
12 | The order of information | politics | 2024-12-03 |
11 | The Trump appeal | politics | 2024-12-03 |
10 | Touchscreens and smartphones | culture | 2024-12-02 |
9 | The default politician | politics | 2024-11-26 |
8 | 10 Dollar | culture | 2024-11-25 |
7 | Fetishism & politics | transgender, culture | 2024-11-14 |
6 | Mark Robinson | news, politics | 2024-11-13 |
5 | Types of masculinity | culture | 2024-11-08 |
4 | Anime reviews | culture | 2024-11-02 |
3 | Poor things (2023 film) | culture | 2024-10-31 |
2 | The trans prison stats argument | transgender, politics | 2024-10-19 |
1 | Language | personal | 2024-10-29 |
index | | | | unlisted narrow`;


function setLightbox(img) {
    get("lightbox").src = img.src;
    get("lightbox").alt = img.alt;
    get("lightbox").parentNode.style.display = "flex";
}
function closeLightbox() {
    get("lightbox").parentNode.style.display = "none";
    get("lightbox").src = "";
    get("lightbox").alt = "";
}

function alignTable(dataString, splitChar) {
    const table = dataString.split("\n").filter(c => c.split(splitChar).length == 5).map(row => row.split(splitChar).map(cell => cell.trim()));
    const rowWidth = Math.max(...table.map(row => row.length));
    for (let col = 0; col < rowWidth; col += 1) {
        let cellWidth = 0;
        for (let i = 0; i < table.length; i += 1) {
            while (table[i].length < rowWidth) {
                table[i].push(""); }
            if (table[i][col].length > cellWidth) {
                cellWidth = table[i][col].length; } }
        for (let i = 0; i < table.length; i += 1) {
            if (table[i].length < rowWidth) { continue; }
            table[i][col] += " ".repeat(cellWidth - table[i][col].length);
            } }
    table.sort((a, b) => {
        a = a[3].replace(/\D/g, ""); if (a == "") { a = 0; }
        b = b[3].replace(/\D/g, ""); if (b == "") { b = 0; }
        return parseInt(b) - parseInt(a);
    }).sort((a, b) => {
        if (a[4].trim() == "pinned") { return -1; }
        if (b[4].trim() == "pinned") { return 1; }
        return 0;
    });
    data = table.map(c => c.join(` ${splitChar} `)).join("\n");
}

function getFileName() {
    const u = document.baseURI.split("/").slice(-1)[0];
    const i = u.indexOf("#");
    const r = i == -1 ? u : u.substring(0, i);
    return r.replace(/\.html$/, "");
}
function flashGear() {
    const gear = document.querySelector(".gear");
    gear.classList.add("yellow-flash");
}

var tocLinks = [];
function pageLoad() {
    document.head.innerHTML += `<link rel="icon" type="image/x-icon" href="assets/favicon.ico">`;
    const fileName = getFileName();

    if (localStorage.getItem("brightness") == null) { localStorage.setItem("brightness","light"); }
    else if (localStorage.getItem("brightness") == "dark") { get("page").classList.add("dark"); }

    if (localStorage.getItem("theme-color") == null) { localStorage.setItem("theme-color", "theme-red"); }

    get("page").classList.add(localStorage.getItem("theme-color"));
    get("page").innerHTML =
       `<div class="pointless-black-bar" style="height: var(--nav-height); background-color: black;"></div>
        <header class="main-header align-center"><a class="title-link" href="index.html">North of Queen</a></header>
        <nav class="main-nav">
            <div class="nav-inner">
                <div class="align-center">
                    <div class="page-display"></div>
                </div>
                <div class="align-center">
                    <input class="to-top nav-button" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" value="Top" type="button">
                    <div id="menu" class="hidden">
                        <div>
                            <span class="no-select">Dark mode:</span>
                            <label class="menu-switch">
                                <input type="checkbox" id="lightswitch">
                                <span class="menu-slider"></span>
                            </label>
                        </div>
                        <div>
                            <span class="no-select">Theme color:</span>
                            <select id="theme-color-select">
                                <option value="theme-red">Red</option>
                                <option value="theme-green">Green</option>
                                <option value="theme-blue">Blue</option>
                            </select>
                        </div>
                        <div>
                            <span class="no-select">Header font:</span>
                            <select id="header-font-select">
                                <option value="Inter">Inter</option>
                                <option value="Lora">Lora</option>
                                <option value="Trebuchet MS">Trebuchet MS</option>
                            </select>
                        </div>
                        <div>
                            <span class="no-select">Body font:</span>
                            <select id="body-font-select">
                                <option value="Georgia">Georgia</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Trebuchet MS">Trebuchet MS</option>
                            </select>
                        </div>
                    </div><input class="gear" onclick="setMenu('toggle')" title="Options" type="button">
                </div>
            </div>
        </nav>
        <div class="c2">
            <div class="c3">
                <style id="theme-style"></style>
                <article id="main-content">${get("main").innerHTML}</article>
                <footer class="article-footer">
                    <div class="see-also"></div>
                    <div style="white-space: nowrap;"><a href="index.html">Full page index</a></div>
                </footer>
                <footer class="page-bottom">I have no association with any other person or organization. I give broad permission for the stuff I write to be used, copied, or shared for non-commercial purposes provided no other person claims authorship (<a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>).</footer>
            </div>
        </div>
        <div class="lightbox-wrapper" onclick="closeLightbox()"><img id="lightbox"></div>`;
    interpreter(get("main-content"));

    if (localStorage.getItem("brightness") == "dark") { get("lightswitch").checked = true; }
    get("lightswitch").addEventListener("change", function() {
        setBrightness(this.checked ? "dark" : "light");
    });

    window.addEventListener("keydown", function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            setMenu("hide");
        }
    });

    alignTable(data, "|");
    const pageList = { recent: [], pins: [], full: [] };
    let includeToc = false, pageTitle = "";
    const dataRows = data.split("\n");
    for (let i = 0; i < dataRows.length; i += 1) {
        const cells = dataRows[i].split("|").map(cell => cell.trim());
        const rowFile = cells[0],
        rowTitle      = cells[1],
        rowCategory   = cells[2],
        rowDate       = cells[3],
        rowFlags      = cells[4].split(" ");
        const isCurrentPage = rowFile == fileName;
        const isPinned = (rowFlags.includes("pinned"));
        let entryClass = "nav-row";
        if (isCurrentPage) {
            pageTitle = rowTitle;
            if (rowFlags.includes("toc")) { includeToc = true; }
            if (rowFlags.includes("wide")) { get("page").classList.add("wide"); } }
        if (rowFlags.includes("unlisted")) { continue; }
        if (isPinned) { entryClass += " pinned"; }
        if (!isCurrentPage && pageList.recent.length < 8) { pageList.recent.push(`<a href="${rowFile}.html">${rowTitle}</a>`); }
        let indexEntry = `<li><a href="${rowFile}.html">${rowTitle}${isPinned?`<img src="assets/pin-icon.png" height="17" width="17">` : ''}</a> – <span>${rowCategory}</span>${rowDate != '' ? ' <span>('+rowDate+')</span>' : ''}</li>`;
        if (isPinned) { pageList.full.unshift(indexEntry); }
        else { pageList.full.push(indexEntry); }
    }
    
    const index = document.getElementById("index");
    if (index) {
        index.innerHTML = pageList.full.join("");
    }
    else {
        document.querySelector(".page-display").innerHTML = pageTitle;
        if (includeToc) {
            console.log("creating table of contents...");
            const tocToggleContainer = get("menu").insertBefore(document.createElement("div"), get("menu").firstElementChild);
            tocToggleContainer.innerHTML = `<span class="no-select">Table of contents:</span><label class="menu-switch"><input type="checkbox" id="tocToggle"><span class="menu-slider"></span></label>`;
            
            get("tocToggle").addEventListener("change", function() {
                setToc(this.checked ? "show" : "hide");
            });

            const c2 = get("main-content").parentNode.parentNode;
            const toc = c2.insertBefore(document.createElement("nav"), c2.firstChild);
            toc.id = "table-of-contents";
            if (localStorage.getItem("tocState") == "hidden") { setToc("hide"); }
            else { get("tocToggle").checked = true; }
            toc.innerHTML = `<div class="toc-header"><h2>Content</h2><input type="button" value="hide" onclick="setToc('close'); flashGear()" class="toc-button"></div><a class="toc-row h1" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" style="cursor: pointer;">(Top of page)</a><div class="scroller">${tocLinks.slice(1).join("")}</div>`;
            let rowsInToc = Array.from(get("table-of-contents").getElementsByClassName("toc-row"));
            let headersInArticle = Array.from(document.getElementsByClassName("noq-header"));

            let currentHeading = "", canUpdateToc = true;
            function tocHighlighter() {
                if (!canUpdateToc) { return; }
                canUpdateToc = false;
                setTimeout(() => { canUpdateToc = true; }, 100);
                let headingId;
                for (let i = 0; i < headersInArticle.length; i += 1) {
                    if (pageYOffset > headersInArticle[i].offsetTop - window.innerHeight * 0.5) {
                        headingId = headersInArticle[i].id; }
                    else {
                        break; } }
                if (headingId != currentHeading) {
                for (let i = 0; i < rowsInToc.length; i += 1) {
                    rowsInToc[i].classList.remove("active-heading");
                    if (rowsInToc[i].getAttribute("href") == "#" + headingId) {
                        rowsInToc[i].classList.add("active-heading"); } } }
                currentHeading = headingId;
            }
            function tocWidthCheck() {
                if (window.innerWidth < 800) { get("page").classList.add("toc-vertical"); }
                else { get("page").classList.remove("toc-vertical"); }
            }
            window.addEventListener("resize", tocWidthCheck);
            window.addEventListener("scroll", tocHighlighter);
            setTimeout(() => { tocWidthCheck(); tocHighlighter(); }, 100);

            const scroller = get("table-of-contents").getElementsByClassName("scroller")[0];
            function scrollerHandler() {
                if (scroller.scrollHeight == scroller.offsetHeight || scroller.scrollHeight - scroller.scrollTop <= scroller.clientHeight + 20) {
                    scroller.classList.add("hide-mask"); }
                else {
                    scroller.classList.remove("hide-mask"); } }
            ["scroll", "resize"].forEach(e => { scroller.addEventListener(e, scrollerHandler); });
            scrollerHandler();
        }
    }

    document.addEventListener("click", function(e) {
        if (!get("menu").contains(e.target) && !get("menu").nextElementSibling.contains(e.target)) {
            setMenu("hide");
        }
    });

    function navStickyCheck() {
        if (pageYOffset > 150) {
            document.getElementsByClassName("main-nav")[0].classList.add("sticky-active"); }
        else {
            document.getElementsByClassName("main-nav")[0].classList.remove("sticky-active"); }
    }
    navStickyCheck();
    window.addEventListener("scroll", navStickyCheck);

    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    let bodyFont = localStorage.getItem("body-font");
    if (bodyFont == null) {
        bodyFont = "Georgia"; // default value
        localStorage.setItem("body-font", bodyFont);
    }
    get("body-font-select").value = bodyFont;
    get("body-font-select").addEventListener("change", function() {
        localStorage.setItem("body-font", this.value);
        updateFonts();
    })
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    let headerFont = localStorage.getItem("header-font");
    if (headerFont == null) {
        headerFont = "Inter"; // default value
        localStorage.setItem("header-font", headerFont);
    }
    get("header-font-select").value = headerFont;
    get("header-font-select").addEventListener("change", function() {
        localStorage.setItem("header-font", this.value);
        updateFonts();
    })
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    updateFonts();
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    let themeColor = localStorage.getItem("theme-color");
    if (themeColor == null) {
        themeColor = "red"; // default value
        localStorage.setItem("theme-color", themeColor);
    }
    get("theme-color-select").value = themeColor;
    get("theme-color-select").addEventListener("change", function() {
        localStorage.setItem("theme-color", this.value);
        if (this.value == "theme-blue") { get("page").classList.add("theme-blue"); } else { get("page").classList.remove("theme-blue"); }
        if (this.value == "theme-green") { get("page").classList.add("theme-green"); } else { get("page").classList.remove("theme-green"); }
        if (this.value == "theme-red") { get("page").classList.add("theme-red"); } else { get("page").classList.remove("theme-red"); }
    })

    if (document.title == "") document.title = "North of Queen";
    else if (document.title.slice(0 - "North of Queen".length) != "North of Queen") document.title += " - North of Queen";
}

window.addEventListener("load", pageLoad);

function updateFonts() {
    let bodyFont = localStorage.getItem("body-font");
    if (bodyFont == null) { bodyFont = "Georgia"; }

    let headerFont = localStorage.getItem("header-font");
    if (headerFont == null) { headerFont = "Inter"; }

    function fallback(f) {
        switch (f) {
            case "Georgia":
            case "Constantia":
            case "Lora":
                return f + ",serif";
                break;
            case "Segoe UI":
                return f + ",system-ui";
                break;
            default:
                return f + ",sans-serif";
        }
    }
    get("theme-style").innerHTML = `#main-content { font-family: ${fallback(bodyFont)}; } #main-content h1, #main-content h2, #main-content h3, #main-content h4 { font-family: ${fallback(headerFont)}; }`;
    localStorage.setItem("body-font", bodyFont);
    localStorage.setItem("header-font", headerFont);
}





