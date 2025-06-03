
"use strict"

function setMenu(action) {
    switch (action) {
        case "show":
            document.getElementById("menu").classList.remove("hidden");
            localStorage.setItem("menuState", "visible");
            break;
        case "hide":
            document.getElementById("menu").classList.add("hidden");
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
            page.classList.remove("dark");
            document.getElementById("lightswitch").checked = false;
            localStorage.setItem("brightness", "light");
            break;
        case "dark":
            page.classList.add("dark");
            document.getElementById("lightswitch").checked = true;
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

function setTextAlign(setValue) {
    switch (setValue) {
        case "left":
            document.querySelector(".main-content").classList.remove("text-justified");
            document.getElementById("text-align-switch").checked = false;
            localStorage.setItem("text-align", "left");
            break;
        case "justify":
            document.querySelector(".main-content").classList.add("text-justified");
            document.getElementById("text-align-switch").checked = true;
            localStorage.setItem("text-align", "justify");
            break;
        default:
            const mode = localStorage.getitem("text-align");
            if (mode == null || mode == "left") {
                setBrightness("justify");
            } else {
                setBrightness("left");
            }
            break;
    }
}

function setToc(action) {
    switch (action) {
        case "show":
            page.classList.remove("hide-toc");
            document.getElementById("tocToggle").checked = true;
            localStorage.setItem("tocState", "visible");
            break;
        case "hide":
            page.classList.add("hide-toc");
            document.getElementById("tocToggle").checked = false;
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

function setLightbox(action) {
    let lightbox = document.getElementById("lightbox");
    if (lightbox) {
        if (action == "close") {
            lightbox.src = lightbox.alt = "";
            lightbox.parentNode.style.display = "none";
        } else if (typeof action == "object") {
            lightbox.src = action.src;
            lightbox.alt = action.alt;
            lightbox.parentNode.style.display = "flex";
        }
    }
}

let data = `
42 | Journalism and paywalls | media, culture | 2025-06-02 | narrow
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
index | | | | unlisted narrow`;


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

const page = document.getElementById("page");
function pageLoad() {
    document.head.innerHTML += `<link rel="icon" type="image/x-icon" href="assets/favicon.ico">`;
    const fileName = getFileName();

    if (localStorage.getItem("brightness") == null) { localStorage.setItem("brightness","light"); }
    else if (localStorage.getItem("brightness") == "dark") { page.classList.add("dark"); }

    page.innerHTML =
       `<div class="pointless-black-bar" style="height: var(--nav-height); background-color: black;"></div>
        <header class="main-header align-center"><a class="title-link" href="index.html">North of Queen</a></header>
        <nav class="main-nav">
            <div class="nav-inner">
                <div class="align-center">
                    <div class="page-display"></div>
                </div>
                <div class="align-center">
                    <input class="to-top nav-button" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" value="Jump to Top" type="button">
                    <div id="menu" class="hidden">
                        <div class="menu-row">
                            <span class="no-select">Dark mode:</span>
                            <label class="menu-switch">
                                <input type="checkbox" id="lightswitch">
                                <span class="menu-slider"></span>
                            </label>
                        </div>
                        <div class="menu-row">
                            <span class="no-select">Table of contents (if available):</span>
                            <label class="menu-switch">
                                <input type="checkbox" id="tocToggle">
                                <span class="menu-slider"></span>
                            </label>
                        </div>
                        <div class="menu-row">
                            <span class="no-select">Indent and justify text:</span>
                            <label class="menu-switch">
                                <input type="checkbox" id="text-align-switch">
                                <span class="menu-slider"></span>
                            </label>
                        </div>
                        <div class="menu-row">
                            <span class="no-select">Header font:</span>
                            <select id="header-font-select">
                                <option value="Inter">Inter</option>
                                <option value="Lora">Lora</option>
                                <option value="Faculty Glyphic">Faculty Glyphic</option>
                                <option value="Trebuchet MS">Trebuchet MS</option>
                                <option value="Georgia">Georgia</option>
                            </select>
                        </div>
                        <div class="menu-row">
                            <span class="no-select">Body font:</span>
                            <select id="body-font-select">
                                <option value="Georgia">Georgia</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Faculty Glyphic">Faculty Glyphic</option>
                                <option value="Trebuchet MS">Trebuchet MS</option>
                            </select>
                        </div>
                        <div class="menu-row">
                            <span class="no-select">Secondary font:</span>
                            <select id="secondary-font-select">
                                <option value="Segoe UI">Segoe UI</option>
                                <option value="Trebuchet MS">Trebuchet MS</option>
                            </select>
                        </div>
                        <div style="opacity: 0.8; font-size: 90%;">These settings are put in localStorage, not cookies, meaning they get cleared when you end your browser session.</div>
                    </div><input class="gear nav-button" onclick="setMenu('toggle')" title="Options" type="button">
                </div>
            </div>
        </nav>
        <div class="c2">
            <div class="c3">
                <style class="theme-style"></style>
                <article class="main-content">${document.getElementById("main").innerHTML}</article>
                <footer class="article-footer">
                    <div class="see-also"></div>
                    <div style="white-space: nowrap;"><a href="index.html">Full page index</a></div>
                </footer>
                <footer class="page-bottom"><a href="https://github.com/northofqueen" target="_blank">North of Queen</a> is my personal repo. I have no association with any other person or organization. This site is coded to run entirely on client-side JavaScript, meaning if saved locally it runs identically to how it does online. The code base and site design can be taken as entirely open source (<a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank">CC0</a>), while I reserve the rights to the content of my writing. To contact me, for takedown requests or anything else, email perennialforces@gmail.com.</footer>
            </div>
        </div>
        <div class="lightbox-wrapper" onclick="setLightbox('close')"><img id="lightbox"></div>`;
    interpreter(document.querySelector(".main-content"));

    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    if (localStorage.getItem("brightness") == "dark") { document.getElementById("lightswitch").checked = true; }
    document.getElementById("lightswitch").addEventListener("change", function() {
        setBrightness(this.checked ? "dark" : "light");
    });
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    if (localStorage.getItem("tocState") == null) { localStorage.setItem("tocState", "visible"); }
    else if (localStorage.getItem("tocState") == "visible") { setToc("show"); }
    else if (localStorage.getItem("tocState") == "hidden") { setToc("hide"); }
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    document.getElementById("tocToggle").addEventListener("change", function() {
        setToc(this.checked ? "show" : "hide");
    });
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    document.getElementById("text-align-switch").addEventListener("change", function() {
        setTextAlign(this.checked ? "justify" : "left");
    });
    if (localStorage.getItem("text-align") != "left") { setTextAlign("justify"); }

    window.addEventListener("keydown", function(e) {
        if (e.key === 'Escape') {
            setLightbox("close");
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
        const isCurrentPage = (rowFile == fileName);
        const isPinned = (rowFlags.includes("pinned"));
        if (isCurrentPage) {
            pageTitle = rowTitle;
            if (rowFlags.includes("toc")) { includeToc = true; }
            if (rowFlags.includes("wide")) { page.classList.add("wide"); }
            if (rowFlags.includes("narrow")) { page.classList.add("narrow"); }
            }
        if (rowFlags.includes("unlisted")) { continue; }

        /* ---- for recent/sidenav -- not used, but will probably use again someday ---- */
        /* const navTitle = (isCurrentPage) ? rowTitle : "<b>" + rowTitle + "</b>";
        if (isPinned) {
            pageList.pins.push(`<a class="pinned" href="${rowFile}.html">${navTitle}</a>`);
        } else if (pageList.recent.length < 8) {
            pageList.pins.push(`<a href="${rowFile}.html">${navTitle}</a>`);
        } */

        /* ---- for index.html ---- */
        let fullEntry = isPinned
            ? `<a class="pinned" href="${rowFile}.html">${rowTitle}</a>`
            : `<a href="${rowFile}.html">${rowTitle}</a>`;
        
        if (rowDate || rowCategory) {
            fullEntry += " &ndash;";
            if (rowCategory != "") {
                fullEntry += ` <span>${rowCategory}</span>`;
            }
            if (rowDate != "") {
                fullEntry += ` <span>(${rowDate})</span>`;
            }
        }
        fullEntry = "<li>" + fullEntry + "</li>";
        
        if (isPinned) { pageList.full.unshift(fullEntry); }
        else { pageList.full.push(fullEntry); }
    }

    /* don't put #index on any page but index.html and we're shoifin */
    const index = document.getElementById("index");
    if (index) {
        index.innerHTML = pageList.full.join("");
        document.querySelector(".page-display").innerHTML = "Front-page index";
    }
    else {
        document.querySelector(".page-display").innerHTML = pageTitle;
        if (includeToc) {
            console.log("creating table of contents...");

            const c2 = document.querySelector(".main-content").parentNode.parentNode;
            const toc = c2.insertBefore(document.createElement("nav"), c2.firstChild);
            toc.id = "table-of-contents";
            
            const subheaders = Array.from(document.getElementsByClassName("noq-subheader"));
            toc.innerHTML = `<div class="toc-header"><h2>Content</h2><input type="button" value="hide" onclick="setToc('close'); document.querySelector('.gear').classList.add('yellow-flash')" class="toc-button"></div><a class="toc-row h1" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" style="cursor: pointer;">(Top of page)</a><div class="scroller">${subheaders.map(h => `<a class="toc-row ${h.tagName.toLowerCase()}" href="#${h.id}">${h.innerHTML.replace(/\/?i>/g, "")}</a>`).join("")}</div>`;
            
            const rowsInToc = Array.from(document.getElementById("table-of-contents").getElementsByClassName("toc-row"));
            let currentHeading = "";
            let canTocHighlighter = true;
            function tocHighlighter() {
                if (!canTocHighlighter) { return; }
                canTocHighlighter = false;
                setTimeout(() => { canTocHighlighter = true; }, 300);
                let headingId;
                for (let i = 0; i < subheaders.length; i += 1) {
                    if (pageYOffset > subheaders[i].offsetTop - window.innerHeight * 0.5) {
                        headingId = subheaders[i].id; }
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
                if (window.innerWidth < 800) { page.classList.add("toc-vertical"); }
                else { page.classList.remove("toc-vertical"); }
            }
            window.addEventListener("resize", tocWidthCheck);
            window.addEventListener("scroll", tocHighlighter);
            setTimeout(() => { tocWidthCheck(); tocHighlighter(); }, 100);

            const scroller = document.getElementById("table-of-contents").getElementsByClassName("scroller")[0];
            function scrollerHandler() {
                if (scroller.scrollHeight == scroller.offsetHeight || scroller.scrollHeight - scroller.scrollTop <= scroller.clientHeight + 20) {
                    scroller.classList.add("hide-mask"); }
                else {
                    scroller.classList.remove("hide-mask"); } }
            ["scroll", "resize"].forEach(e => { scroller.addEventListener(e, scrollerHandler); });
            scrollerHandler();
        }
    }

    let gear = document.querySelector(".gear");
    document.addEventListener("click", function(e) {
        if (!document.getElementById("menu").contains(e.target) && !gear.contains(e.target)) {
            setMenu("hide");
        }
    });

    let canNavStickyCheck = true;
    function navStickyCheck() {
        if (!canNavStickyCheck) { return; }
        canNavStickyCheck = false;
        setTimeout(() => { canNavStickyCheck = true; navStickyCheck() }, 300);
        if (pageYOffset > 180) {
            document.querySelector(".main-nav").classList.add("sticky-active"); }
        else {
            document.querySelector(".main-nav").classList.remove("sticky-active"); }
    }
    navStickyCheck();
    window.addEventListener("scroll", navStickyCheck);

    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    let headerFont = localStorage.getItem("header-font");
    if (headerFont == null) {
        headerFont = "Inter"; /* default value on first visit */
        localStorage.setItem("header-font", headerFont);
    }
    document.getElementById("header-font-select").value = headerFont;
    document.getElementById("header-font-select").addEventListener("change", function() {
        localStorage.setItem("header-font", this.value);
        updateFonts();
    })
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    let bodyFont = localStorage.getItem("body-font");
    if (bodyFont == null) {
        bodyFont = "Georgia"; /* default value on first visit */
        localStorage.setItem("body-font", bodyFont);
    }
    document.getElementById("body-font-select").value = bodyFont;
    document.getElementById("body-font-select").addEventListener("change", function() {
        localStorage.setItem("body-font", this.value);
        updateFonts();
    })
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    let secondaryFont = localStorage.getItem("secondary-font");
    if (secondaryFont == null) {
        secondaryFont = "Segoe UI"; /* default value on first visit */
        localStorage.setItem("secondary-font", secondaryFont);
    }
    document.getElementById("secondary-font-select").value = secondaryFont;
    document.getElementById("secondary-font-select").addEventListener("change", function() {
        localStorage.setItem("secondary-font", this.value);
        updateFonts();
    })
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    updateFonts();
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */

    if (document.title == "") document.title = "North of Queen";
    else if (document.title.slice(0 - "North of Queen".length) != "North of Queen") document.title += " - North of Queen";
}

window.addEventListener("load", pageLoad);

function updateFonts() {
    const css = document.querySelector(".theme-style");
    let headerFont = localStorage.getItem("header-font");
    let bodyFont = localStorage.getItem("body-font");
    let secondaryFont = localStorage.getItem("secondary-font");
    
    css.innerHTML = 
    `.main-content { font-family: "${bodyFont}",sans-serif; }
     .main-content h1,
     .main-content h2,
     .main-content h3,
     .main-content h4 { font-family: "${headerFont}",sans-serif; }
     .image-float,
     .noq-table { font-family: "${secondaryFont}"; }`;
    
    if (bodyFont == "Georgia") {
        css.innerHTML += `.main-content .digit { font-family: "Georgia Pro","Georgia",serif; } .main-content ol > li::marker { font-family: "Georgia Pro","Georgia",serif; }`
    }
    else if (bodyFont == "Faculty Glyphic") {
        css.innerHTML += `.mdash { font-family: unset !important; }`;
    }
    
    localStorage.setItem("header-font", headerFont);
    localStorage.setItem("body-font", bodyFont);
    localStorage.setItem("secondary-font", secondaryFont);
}






