
"use strict";

function get(id) { let temp = document.getElementById(id); if (temp == null) { console.error(`document.getElementById("${id}") returned null`); } return temp; }

let data = `
41 | Normalization and status quo bias | politics, culture | 2025-04-20 | 
40 | Trump and Russia | politics | 2025-03-05 | 
39 | Movies | | | narrow unlisted
38 | 
37 | Bluesky accounts listing | other | | wide toc-left
36 | India | history, politics | 2025-03-05 | 
35 | 
34 | The Nazi salute | news, politics | 2025-01-24 | narrow
33 | 
32 | Politics fundamentals | politics | 2025-01-05 | wide toc-left
31 | Reflections on Justin Trudeau | news, politics | 2025-01-08 |
30 | The appearance of intelligence | other | 2025-01-18 |
29 | Date formats | other | 2025-01-11 | narrow
28 | The problem with Pierre | politics | 2025-03-15 | unlisted
27 | Sex, gender, & transsexuals | transgender, politics | 2024-12-29 | wide toc-left
26 | News 2025 | news, politics | | wide pinned
25 | A beauty holding a bird | other | 2024-12-23 | narrow
24 | Enduring falsehoods about Warren, Clinton | politics | 2024-12-19 |
23 | Passing | transgender, culture | 2025-02-24 |
22 | Dehumanization | politics | 2024-12-15 |
21 | Relationships | personal | 2024-12-14 | unlisted
20 | Israel–Palestine notes | politics | 2025-02-24 | toc-left unlisted
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
index | | | | unlisted narrow
`;

var lbKeyResponsive = false;
var lightboxContainer, lightboxImg;
function setLightbox(img) {
    lbKeyResponsive = false;
    setTimeout(() => {
        lbKeyResponsive = true;
        }, 150);
    lightboxContainer.style.display = "flex";
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt; }
function closeLightbox() {
    lightboxContainer.style.display = "none";
    lightboxImg.src = "";
    lightboxImg.alt = ""; }

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
    // console.log(data);
}

var headersInArticle;
var tocLinks = [];
var rowsInToc;
var currentHeading = "";
var tocUpdateFlag = true;
function tocHighlighter() {
    if (!tocUpdateFlag) { return; }
    tocUpdateFlag = false;
    setTimeout(() => { tocUpdateFlag = true; }, 50);
    let headingId;
    for (let i = 0; i < headersInArticle.length; i += 1) {
        if (pageYOffset > headersInArticle[i].offsetTop - window.innerHeight * 0.5) {
            headingId = headersInArticle[i].id; }
        else {
            break; } }
    console.log(headingId)
    if (headingId != currentHeading) {
    for (let i = 0; i < rowsInToc.length; i += 1) {
        rowsInToc[i].classList.remove("active-heading");
        if (rowsInToc[i].getAttribute("href") == "#" + headingId) {
            rowsInToc[i].classList.add("active-heading"); } } }
    currentHeading = headingId;
    console.log(currentHeading)
}

function getFileName() {
    const u = document.baseURI.split("/").slice(-1)[0];
    const i = u.indexOf("#");
    const r = i == -1 ? u : u.substring(0, i);
    return r.replace(/\.html$/, "");
}

function initLightness() {
    if (localStorage.getItem("lightness") == null) { localStorage.setItem("lightness", "light"); }
    if (localStorage.getItem("lightness") == "dark") { document.body.classList.add("dark"); }
}

let canSwitch = true;
function lightswitch() {
    if (!canSwitch) return;
    setTimeout( () => { canSwitch = true; }, 222);
    canSwitch = false;
    
    if (localStorage.getItem("lightness") == "dark") { localStorage.setItem("lightness", "light"); }
    else if (localStorage.getItem("lightness") == "light") { localStorage.setItem("lightness", "dark"); }
    setLightness();
}
function setLightness() {
    const mode = localStorage.getItem("lightness");
    if (mode == "light") {
        document.body.classList.remove("dark");
        get("lightswitch").value = "dark";
    } else if (mode == "dark") {
        document.body.classList.add("dark");
        get("lightswitch").value = "light";
    }
}

function pageLoad() {
    initLightness();
    document.head.innerHTML += `<link rel="icon" type="image/x-icon" href="assets/favicon.ico"><link rel="stylesheet" href="assets/main.css">`;
    const fileName = getFileName();
    console.log(fileName);

    get("page").innerHTML =
       `<header id="header"><div><a href="index.html"><img src="assets/header-image.png" height="75" width="272"></a></div></header>
        <nav id="nav">
            <div class="nav-inner">
                <div>
                    <div id="page-display"></div>
                </div>
                <div class="buttons">
                    <input id="lightswitch" onclick="lightswitch()" value="${(localStorage.getItem("lightness") == "dark") ? "light" : "dark"}" type="button">
                    <input id="to-top" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" value="top" type="button">
                </div>
            </div>
        </nav>
        <div class="c1">
            <div class="c2">
                <div class="c3">
                    <div id="article">${get("main").innerHTML}</div>
                    <footer class="inner-footer">
                        <div class="see-also"><p>I&rsquo;m Iris, a Canadian woman. I often write about politics, culture, and related topics. I have no particular credentials or experience. I’m literally just some person.</p></div>
                        <div style="white-space: nowrap; margin-left: 10px"><a href="index.html">Full page index</a></div>
                    </footer>
                    <footer id="page-bottom">I have no association with any other person or organization. I give broad permission for the stuff I write to be used, copied, or shared for non-commercial purposes provided no other person claims authorship (<a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>).</footer>
                </div>
            </div>
        </div>
        <div id="lightbox-container" onclick="closeLightbox()"><img id="lightbox"></div>
        `;

    if (localStorage.getItem("darkmode") == "on") { get("lightswitch").value = "light"; }
    interpreter(get("article"));

    document.title = (document.title === "") ? "North of Queen" : document.title + " – North of Queen";

    get("cover").classList.add("fade-out");
    get("cover").addEventListener("animationend", () => { get("cover").remove(); });

    lightboxContainer = get("lightbox-container");
    lightboxImg = get("lightbox");
    window.addEventListener("keydown", function(event) { if (lbKeyResponsive && event.key === 'Escape') { closeLightbox(); } })

    alignTable(data, "|");
    const pageList = { recent: [], pins: [], full: [] };
    let includeToc = false, tocLeft = false, currentPageTitle = "";
    const dataRows = data.split("\n");
    for (let i = 0; i < dataRows.length; i += 1) {
        const cells = dataRows[i].split("|").map(cell => cell.trim());
        const rowFile = cells[0],
        rowTitle      = cells[1],
        rowCategory   = cells[2],
        rowDate       = cells[3],
        rowFlags      = cells[4].split(" ");
        const isCurrent = rowFile == fileName;
        const isPinned = (rowFlags.includes("pinned"));
        let entryClass = "nav-row";
        if (isCurrent) {
            currentPageTitle = rowTitle;
            if (rowFlags.includes("toc")) { includeToc = true; }
            if (rowFlags.includes("toc-left")) { includeToc = true; tocLeft = true; }
            if (rowFlags.includes("wide")) { get("page").classList.add("wide"); }
            else if (rowFlags.includes("narrow")) { get("page").classList.add("narrow"); }
            }
        if (rowFlags.includes("unlisted")) { continue; }
        if (isPinned) { entryClass += " pinned"; }
        if (!isCurrent && pageList.recent.length < 8) { pageList.recent.push(wrapDigits(`<a href="${rowFile}.html">${rowTitle}</a>`)); }
        let indexEntry = wrapDigits(`<li><a href="${rowFile}.html">${rowTitle}${isPinned?`<img src="assets/pin-icon.png" height="17" width="17">` : ''}</a> <b>·</b> <span>${rowCategory}</span>${rowDate != '' ? ' <b>·</b> <span>'+rowDate+'</span>' : ''}</li>`);
        if (isPinned) { pageList.full.unshift(indexEntry); }
        else { pageList.full.push(indexEntry); }
    }
    
    const index = document.getElementById("index");
    if (index) {
        index.innerHTML = `<ul>${pageList.full.join("")}</ul>`;
    }
    else {
        get("page-display").innerHTML += currentPageTitle;
        if (includeToc) {
            console.log("creating table of contents...");
            get("page").classList.add("toc-page");
            const c1 = get("article").parentNode.parentNode;
            c1.style.display = "flex";
            const toc = tocLeft ? c1.insertBefore(document.createElement("div"), c1.firstChild) : c1.appendChild(document.createElement("div"));
            if (!tocLeft) { c1.style.paddingRight = "0"; }
            toc.id = "toc";
            toc.innerHTML = `<div class="toc-title">Content</div><a class="toc-row h1" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" style="cursor: pointer;">(Top of page)</a><div class="scroller">${tocLinks.slice(1).join("")}</div>`;
            rowsInToc = Array.from(get("toc").getElementsByClassName("toc-row"));
            headersInArticle = Array.from(document.getElementsByClassName("noq-header"));
            window.addEventListener("resize", tocWidthCheck);
            window.addEventListener("scroll", tocHighlighter);
            setTimeout(() => { tocWidthCheck(); tocHighlighter(); }, 100);
            const scroller = document.getElementsByClassName("scroller")[0];
            scroller.addEventListener("scroll", () => {
                if (scroller.scrollHeight - scroller.scrollTop <= scroller.clientHeight + 20) {
                    scroller.classList.add("hide-mask"); }
                else {
                    scroller.classList.remove("hide-mask"); }
            });
        }
    }
    
    if (document.title == "") document.title = "North of Queen";
    else if (document.title.slice(0 - "North of Queen".length) != "North of Queen") document.title += " - North of Queen";
    
}

window.addEventListener("load", pageLoad);

function tocWidthCheck() {
    const i = window.innerWidth;
    if (i < 940) {
        get("toc").classList.add("condensed");
        get("toc").parentNode.style.flexDirection = "column";
    } else {
        get("toc").classList.remove("condensed");
        get("toc").parentNode.style.flexDirection = "row";
    }
}






