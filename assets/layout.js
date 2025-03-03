
"use strict";

function get(x) { let temp = document.getElementById(x); if (temp == null) { console.error(`document.getElementById("${x}") returned null`); } return temp; }

let data = `
33 | The Lorax sux | culture | 2025-02-27 | narrow
23 | Passing | transgender culture | 2025-02-24 |
20 | Israel–Palestine notes | politics | 2025-02-24 | toc
19 | Ilhan Omar’s comments about Somalia | politics | 2025-02-12 |
17 | Why get bottom surgery? | transgender, culture | 2025-02-09 |
35 | Show and tell (Lex Fridman) | politics | 2025-02-05 |
16 | Milo Yiannopoulos’s cancellation | politics | 2025-02-03 |
34 | The Nazi salute | politics | 2025-01-24 |
30 | The appearance of intelligence | other | 2025-01-18 |
29 | Date formats | other | 2025-01-11 | narrow
28 | Therapy theory | personal | 2025-01-09 |
31 | Reflections on Justin Trudeau | politics | 2025-01-08 |
32 | Conservatism | politics | 2025-01-05 | wide toc
27 | Sex, gender, & transsexuals | transgender, politics | 2024-12-29 | toc
25 | A beauty holding a bird | other | 2024-12-23 | narrow
24 | Enduring falsehoods about Warren, Clinton | politics | 2024-12-19 |
22 | Dehumanization | politics | 2024-12-15 |
21 | Relationships | personal | 2024-12-14 |
14 | Reasons I’m glad to be Canadian | politics | 2024-12-08 |
13 | The military–industrial complex | politics | 2024-12-04 |
12 | The order of information | politics | 2024-12-03 |
11 | The Trump appeal | politics | 2024-12-03 |
10 | Touchscreens and smartphones | culture | 2024-12-02 |
9 | The default politician | politics | 2024-11-26 |
8 | 10 Dollar | culture | 2024-11-25 |
7 | Fetishism & politics | transgender culture | 2024-11-14 |
15 | Mark Robinson transcript | | 2024-11-13 | unlisted
6 | Mark Robinson | politics | 2024-11-13 |
5 | Types of masculinity | culture | 2024-11-08 |
4 | Anime reviews | culture | 2024-11-02 |
3 | Poor things (2023 film) | culture | 2024-10-31 |
1 | Language | personal | 2024-10-29 |
2 | The trans prison stats argument | transgender, politics | 2024-10-19 |
39 | Movies | | | narrow unlisted
37 | Bluesky accounts listing | other | | wide toc
36 | People don’t really have world views | | | unlisted
26 | News 2025 | politics | | wide pinned
18 | Transcripts: context for inflammatory Trump statements | politics | |
index | | | | unlisted narrow
`;
let imgGallery = [[`assets/gallery/j-c-dahl-frogner-manor-1842.jpg`, `Frogner Manor (1842) by J. C. Dahl` ],[ `assets/gallery/j-c-dahl-copenhagen-harbor-by-moonlight-1839.jpg`, `Copenhagen Harbor by Moonlight (1846) by J. C. Dahl` ],[ `assets/gallery/frederic-edwin-church-niagara-1857.jpg`, `Niagara (1857) by Frederic Edwin Church.jpg` ],[ `assets/gallery/frederic-edwin-church-mt-ktaadn-1853.jpg`, `Mt. Ktaadn (1853) by Frederic Edwin Church` ],[ `assets/gallery/cole-thomas-the-consummation-1836.jpg`, `The Consummation (1836) by Cole Thomas` ],[ `assets/gallery/yosemite-national-park.jpg`, `Yosemite National Park (unknown).jpg` ],[ `assets/gallery/karl-friedrich-schinkel-landschaft-mit-pilger-1813.jpg`, `Landschaft mit Pilger (1813) by Karl Friedrich Schinkel` ]];
/*     38    40    */

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
    let table = dataString.split("\n").filter(c => c != "").map(row => row.split(splitChar).map(cell => cell.trim()));
    let tableWidth = Math.max(...table.map(row => row.length));
    for (let col = 0; col < tableWidth; col += 1) {
        let cellWidth = 0;
        for (let i = 0; i < table.length; i += 1) {
            while (table[i].length < tableWidth) {
                table[i].push(""); }
            if (table[i][col].length > cellWidth) {
                cellWidth = table[i][col].length; } }
        for (let i = 0; i < table.length; i += 1) {
            if (table[i].length < tableWidth) { continue; }
            table[i][col] += " ".repeat(cellWidth - table[i][col].length); } }
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
    if (headingId != currentHeading) {
    for (let i = 0; i < rowsInToc.length; i += 1) {
        rowsInToc[i].classList.remove("active-heading");
        if (rowsInToc[i].getAttribute("href") == "#" + headingId) {
            rowsInToc[i].classList.add("active-heading"); } } }
    currentHeading = headingId;
}

function getFileName() {
    const u = document.baseURI.split("/").slice(-1)[0];
    const v = u.indexOf("#");
    const w = v == -1 ? u : u.substring(0, v);
    return w.replace(/\.html$/, "");
}

function pageLoad() {
    document.head.innerHTML += `<link rel="icon" type="image/x-icon" href="assets/favicon.ico"><link rel="stylesheet" href="assets/main.css">`;

    const fileName = getFileName();
    const randomImg = imgGallery[Math.floor(Math.random() * imgGallery.length)];

    get("page").innerHTML =
       `<header id="header"><a href="index.html"><img height="67" width="252" alt="North of Queen logo" src="assets/header-image.png"></a></header>
        <nav id="nav"></nav>
        <div class="c1">
            <div class="c2">
                <div id="article">${get("main").innerHTML}</div>
                <section id="body-after">
                    <div>Find me on: <a target="_blank" href="https://bsky.app/profile/irispol.bsky.social">Bluesky</a> | <a target="_blank" href="https://northofqueen.substack.com">Substack</a> | <a target="_blank" href="https://forthoseinterested.tumblr.com">Tumblr</a> | <a target="_blank" href="https://discord.com/invite/puJEP8HKk3">Discord</a></div>
                </section>
                <footer id="footer">
                    <div><img style="max-width:100%" src="${randomImg[0]}" alt="${randomImg[1]}"></div>
                    <div><a target="_blank" href="https://github.com/northofqueen">North of Queen</a> is my personal repo. I have no association with any other person or organization. Code uploaded to this repo (northofqueen) can be interpreted as fully public domain (<a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank">CC0</a>). I also give broad permission for my writing to be used, reposted, etc. for non-commercial purposes provided no other person claims authorship (<a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>).</div>
                </footer>
            </div>
            <!-- TABLE OF CONTENTS -->
        </div>
        <div id="lightbox-container" onclick="closeLightbox()"><img id="lightbox"></div>`;

    interpreter(get("article"));
    document.title = (document.title === "") ? "North of Queen" : document.title + " – North of Queen";

    get("cover").classList.add("fade-out");
    get("cover").addEventListener("animationend", () => { get("cover").remove(); });

    lightboxContainer = get("lightbox-container");
    lightboxImg = get("lightbox");
    window.addEventListener("keydown", function(event) {if (lbKeyResponsive && event.key === 'Escape') { closeLightbox(); } })

    alignTable(data,"|");
    const pageList = { recent: [], pins: [], full: [] };
    let includeToc = false;
    const dataRows = data.split("\n");
    for (let i = 0; i < dataRows.length; i += 1) {
        let cells = dataRows[i].split("|").map(cell => cell.trim());
        if (cells.length >= 5) {
            let rowFile = cells[0],
            rowTitle =    cells[1],
            rowCategory = cells[2],
            rowDate =     cells[3],
            rowFlags =    cells[4].split(" ");
            if (rowFile == fileName) {
                if (rowFlags.includes("toc")) { includeToc = true; }
                if (rowFlags.includes("wide")) { get("page").classList.add("wide"); }
                else if (rowFlags.includes("narrow")) { get("page").classList.add("narrow"); }
                }
            if (rowFlags.includes("unlisted")) { continue; }
            const isPinned = (rowFlags.includes("pinned"));
            let entryClass = "nav-row";
            if (isPinned) { entryClass += " pinned"; }
            if (pageList.recent.length < 8) { pageList.recent.push(`<a href="${rowFile}.html">${rowTitle}</a>`); }
            let indexEntry = `<li><a href="${rowFile}.html">${rowTitle}${isPinned?`<img class="icon" src="assets/pin2.png" height="17" width="17">` : ''}</a> <b>·</b> <span>${rowCategory}</span>${rowDate != '' ? ' <b>·</b> <span>'+rowDate+'</span>' : ''}</li>`;
            if (isPinned) { pageList.full.unshift(indexEntry); }
            else { pageList.full.push(indexEntry); }
        }
    }

    const indexTable = document.getElementById("page-list");
    if (indexTable) {
        indexTable.innerHTML = `<ul>${pageList.full.join("")}</ul>`;
    }
    else {
        get("body-after").innerHTML +=
           `<div class="link-box-container">
                <div class="link-box">
                    <div style="font-weight:700;padding-inline:8px;">Other pages recently added:</div>
                    ${pageList.recent.join("")}
                    <a style="font-size:14px;margin-left:auto;border-left:0;color:var(--grey-90);font-family:system-ui;" href="index.html">Full page list (front) &rarr;</a>
                </div>
            </div>`;
        
        if (includeToc) {
            const container = get("article").parentNode.parentNode;
            const toc = container.appendChild(document.createElement("div"));
            toc.id = "toc";
            container.classList.add("toc-page");
            toc.innerHTML = `<div class="toc-title">Content</div><a class="toc-row h1" href="#top">(Top of page)</a><div class="scroller">${tocLinks.slice(1).join("")}</div>`;
            rowsInToc = Array.from(get("toc").getElementsByClassName("toc-row"));
            headersInArticle = Array.from(document.getElementsByClassName("noq-header"));
            window.addEventListener("scroll", tocHighlighter);
            setTimeout(() => { tocHighlighter(); }, 100);
        }
    }
    
    if (document.title == "") document.title = "North of Queen";
    else if (document.title.slice(-14) != "North of Queen") document.title += " - North of Queen";
}



window.addEventListener("load", pageLoad);



