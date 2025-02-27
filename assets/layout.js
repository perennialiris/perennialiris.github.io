
"use strict";

var tableOfContentsLinks = [];
var canResizePageWidth = true;
var page;
var article;
var rowsInTableOfContents;
var headersInArticle;
var currentHeading = "";
var sidebarOnTop = false;
var tocUpdateFlag = true;
var lbKeyResponsive = false;
var lightboxContainer, lightboxImg;
window.sessionStorage.setItem("pageMode", "normal");
if (window.sessionStorage.getItem("sidebarHidden") === null) { window.sessionStorage.setItem("sidebarHidden", "false"); }

let data = `
23        | Passing                                                | transgender | 2025-02-24 |  |       
20        | Israel–Palestine notes                                 | politics    | 2025-02-24 |  |       
19        | Ilhan Omar's comments about Somalia                    | politics    | 2025-02-12 |  |       
17        | Why get bottom surgery?                                | transgender | 2025-02-09 |  |       
35        | Show and tell (Lex Fridman)                            | politics    | 2025-02-05 |  |       
16        | Milo Yiannopoulos's cancellation                       | politics    | 2025-02-03 |  |       
34        | The Nazi salute                                        | politics    | 2025-01-24 |  |       
30        | The appearance of intelligence                         | other       | 2025-01-18 |  |       
29        | Date formats                                           | other       | 2025-01-11 | narrow |       
28        | Therapy theory                                         | personal    | 2025-01-09 |  |       
31        | Reflections on Justin Trudeau                          | politics    | 2025-01-08 |  |       
32        | Conservatism                                           | politics    | 2025-01-05 |  |       
27        | Sex, gender, & transsexuals                            | transgender | 2024-12-29 |  |       
25        | A beauty holding a bird                                | other       | 2024-12-23 | narrow |       
24        | Enduring falsehoods about Warren, Clinton              | politics    | 2024-12-19 |  |       
22        | Dehumanization                                         | politics    | 2024-12-15 |  |       
21        | Relationships                                          | personal    | 2024-12-14 |  |       
14        | Reasons I'm glad to be Canadian                        | politics    | 2024-12-08 |  |       
13        | The military–industrial complex                        | politics    | 2024-12-04 |  |       
12        | The order of information                               | politics    | 2024-12-03 |  |       
11        | The Trump appeal                                       | politics    | 2024-12-03 |  |       
10        | Touchscreens and smartphones                           | culture     | 2024-12-02 |  |       
9         | The default politician                                 | politics    | 2024-11-26 |  |       
8         | 10 Dollar                                              | culture     | 2024-11-25 |  |       
7         | Fetishism & politics                                   | transgender | 2024-11-14 |  |       
15        | Mark Robinson transcript                               |             | 2024-11-13 |  | hidden
6         | Mark Robinson                                          | politics    | 2024-11-13 |  |       
5         | Types of masculinity                                   | culture     | 2024-11-08 |  |       
4         | Anime reviews                                          | culture     | 2024-11-02 |  |       
3         | Poor things (2023 film)                                | culture     | 2024-10-31 |  |       
1         | Language                                               | personal    | 2024-10-29 |  |       
2         | The trans prison stats argument                        | transgender | 2024-10-19 |  |       
news-2025 | News 2025                                              | politics    |            |  | pinned
36        | People don't really have world views                   |             |            |  | hidden
37        | Bluesky accounts listing                               | other       |            |  | hidden
18        | Transcripts: context for inflammatory Trump statements | politics    |            |  |       
index     |                                                        |             |            |  | hidden
39        |                                                        |             |            |  | hidden
`;
/*    23    26    33    36        38    39    40    */

/* This just helps keep the table above orderly. */
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
            if (table[i].length < tableWidth) {
                continue; }
            table[i][col] += " ".repeat(cellWidth - table[i][col].length); } }
    
    /* sort by date */
    table.sort((a, b) => {
        a = a[3].replace(/\D/g, ""); if (a == "") { a = 0; }
        b = b[3].replace(/\D/g, ""); if (b == "") { b = 0; }
        return parseInt(b) - parseInt(a);
    });
    /* but move pinned to top */
    table.sort((a, b) => {
        if (a[4].trim() == "pinned") { return -1; }
        if (b[4].trim() == "pinned") { return 1; }
        return 0;
    });
    
    data = table.map(c => c.join(` ${splitChar} `)).join("\n");
    // console.log(data);
}

/* function that enables the table of contents */
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
    for (let i = 0; i < rowsInTableOfContents.length; i += 1) {
        rowsInTableOfContents[i].classList.remove("active-heading");
        if (rowsInTableOfContents[i].getAttribute("href") == "#" + headingId) {
            rowsInTableOfContents[i].classList.add("active-heading"); } } }
    currentHeading = headingId;
}

function pageLoad() {
    document.head.innerHTML += `<link rel="icon" type="image/x-icon" href="assets/favicon.ico">`;

    const header = document.createElement("header");
    header.id = "header";
    header.innerHTML = `<a href="index.html"><img height="67" width="252" alt="North of Queen logo" src="assets/header-image.png"></a>`;
    const nav = document.createElement("nav");
    nav.id = "nav";
    nav.innerHTML = "";

    page = document.getElementById("page");
    document.body.insertBefore(header, page);
    document.body.insertBefore(nav, page);

    page.innerHTML = `
        <div class="c1">
            <div class="c2">
                <div class="c3">
                    <div class="c4">
                        <div id="article">${document.getElementById("main").innerHTML}</div>
                        <footer id="article-footer"><div>Find me on: <a target="_blank" href="https://bsky.app/profile/irispol.bsky.social">Bluesky</a> | <a target="_blank" href="https://northofqueen.substack.com">Substack</a> | <a target="_blank" href="https://forthoseinterested.tumblr.com">Tumblr</a> | <a target="_blank" href="https://discord.com/invite/puJEP8HKk3">Discord</a></div></footer>
                    </div>
                </div>
                <div id="sidebar"></div>
            </div>
            <div id="right-edge"><button id="sidebar-button" class="toggle-button-1" type="button" onclick="toggleSidebarVisibility()"><img src="assets/chevron-right.png"></button></div>
        </div>`;
    
    article = document.getElementById("article");
    interpreter(article);
    
    const footer = document.body.appendChild(document.createElement("footer"));
    footer.id = "footer";
    footer.innerHTML = `<div class="f1"><div class="f2"><a target="_blank" href="https://github.com/northofqueen">North of Queen</a> is my personal repo. I have no association with any other person or organization. Code uploaded to this repo (northofqueen) can be interpreted as fully public domain (<a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank">CC0</a>). I also give broad permission for my writing to be used, reposted, etc. for non-commercial purposes provided no other person claims authorship (<a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>).</div></div>
    <div id="lightbox-container" onclick="closeLightbox()"><img id="lightbox"></div>`;

    lightboxContainer = document.getElementById("lightbox-container");
    lightboxImg = document.getElementById("lightbox");

    window.addEventListener("keydown", function(event) {
        if (lbKeyResponsive && event.key === 'Escape') {
            closeLightbox(); }
    })

    /* get file name */
    let getFileName = location.href.split("/");
    while (getFileName[getFileName.length - 1] === "") { getFileName.pop(); }
    getFileName = getFileName.pop();
    if (getFileName.indexOf("#") != -1) getFileName = getFileName.substring(0, getFileName.indexOf("#"));
    getFileName = getFileName.replace(/\.html$/, "");
    const fileName = (getFileName != "northofqueen.github.io") ? getFileName : "index";
    // console.log(fileName);

    alignTable(data,"|");

    /* processing data from variable at the top of this file */
    const sidebarNavContent = { pins: [], recent: [], full: [] };
    const dataRows = data.split("\n");
    for (let i = 0; i < dataRows.length; i += 1) {
        let cells = dataRows[i].split("|").map(cell => cell.trim());
        if (cells.length >= 6) {
            let rowFile     = cells[0],
                rowTitle    = cells[1],
                rowCategory = cells[2],
                rowDate     = cells[3],
                rowType     = cells[4],
                rowFlag     = cells[5];

            const isCurrent = (rowFile == fileName);
            const isPinned = (rowFlag == "pinned");

            if (isCurrent) {
                if (rowType == "narrow") {
                    page.classList.add("narrow");
                    window.sessionStorage.pageMode = "narrow";
                }
                document.head.innerHTML += `<link rel="stylesheet" href="assets/main.css">`; }
            if (rowFlag == "hidden") {
                continue; }

            let icon = "";
            let entryClass = "nav-row";

            if (isCurrent) {
                entryClass += " current-page"; }
            if (isPinned) {
                entryClass += " pinned"; icon = `<img class="icon" src="assets/pin2.png" height="17" width="17">`; }

            let entryElement = `<a href="${rowFile}.html" class="${entryClass}">${rowTitle}${icon}</a>`;
            if (isPinned) {
                sidebarNavContent.pins.push(entryElement); }
            else {
                if (sidebarNavContent.recent.length < 10) {
                    sidebarNavContent.recent.push(entryElement); } }
            if (rowDate == "") {
                rowDate = "---"; }

            let fullEntry = `<tr><td><a href="${rowFile}.html">${rowTitle}${icon}</a></td> <td>${rowCategory}</td><td>${rowDate}</td></tr>`;
            if (isPinned) {
                sidebarNavContent.full.unshift(fullEntry); }
            else {
                sidebarNavContent.full.push(fullEntry); }
        }
    }

    const frontPageList = document.getElementById("front-page-list");
    if (frontPageList) {
        frontPageList.innerHTML = `<tr><th>Post title</th><th>Topic</th><th>Date posted</th></tr>${sidebarNavContent.full.join("")}`; }
    else {

        let sidebarContent = 
           `<nav class="page-links">
                ${sidebarNavContent.pins.join("")}
                <hr>
                <div class="label">Recently added:</div>
                ${sidebarNavContent.recent.join("")}
                <div class="nav-row"><a style="float:right" href="index.html">Full page list →</a></div>
            </nav>`;

        if (tableOfContentsLinks.length < 6) {
            document.getElementById("sidebar").innerHTML = `<span class="is-sticky">${sidebarContent}</span>`;
        } else {
            document.getElementById("sidebar").innerHTML = `${sidebarContent}
            <span class="is-sticky">
            <nav id="toc">
                <div class="toc-title">Contents</div>
                <span class="scroller">
                    <a class="toc-row h1" href="#top">(Top of page)</a>
                    ${tableOfContentsLinks.slice(1).join("")}
                </span>
            </nav>
            </span>`;
            if (rowsInTableOfContents === undefined) { rowsInTableOfContents = Array.from(document.getElementById("toc").getElementsByClassName("toc-row")); }
            if (headersInArticle === undefined) { headersInArticle = Array.from(document.getElementsByClassName("noq-header")); }
            window.addEventListener("scroll", tocHighlighter);
            setTimeout(() => { tocHighlighter(); }, 100);
        }

        window.addEventListener("resize", pageWidthCheck);
        window.addEventListener("load", pageWidthCheck);
        setTimeout(() => { pageWidthCheck(); }, 50);
    }

    updateSidebar();

    const cover = document.getElementById("cover");
    if (!cover) { console.error("layout.js: 250 (lost #cover)"); }
    else {
        cover.classList.add("fade-out");
        cover.addEventListener("animationend", () => { cover.remove(); }); }

    if (document.title === "") { document.title = "North of Queen"; }
    else { document.title += " – North of Queen"; }

    // const cover = document.getElementById("cover"); if (!cover) { console.error("layout.js: 250 (lost #cover)"); } else { cover.classList.add("fade-out"); cover.addEventListener("animationend", () => { cover.remove(); }); }
}

function updateSidebar() {
    if (window.sessionStorage.sidebarHidden === "true") {
        page.classList.add("hide-sidebar");
        document.getElementById("sidebar-button").title = "show sidebar"; }
    else {
        page.classList.remove("hide-sidebar");
        document.getElementById("sidebar-button").title = "hide sidebar"; }

    if (sidebarOnTop) {
        page.classList.add("vertical-sidebar"); }
    else {
        page.classList.remove("vertical-sidebar"); }
    
    pageWidthCheck();
}

function toggleSidebarVisibility() {
    window.sessionStorage.sidebarHidden = (window.sessionStorage.sidebarHidden === "true") ? "false" : "true";
    updateSidebar();
}

function pageWidthCheck() {
    if (canResizePageWidth) {
        let limit = sidebarOnTop ? 884 : 881;
        if (window.sessionStorage.pageMode === "narrow") { limit -= 160; }
        if (window.innerWidth < limit) {
            page.classList.add("vertical-sidebar");
            canResizePageWidth = false;
            sidebarOnTop = "true";
            setTimeout(() => {
                canResizePageWidth = true;
                pageWidthCheck();
            }, 200);
        } else {
            page.classList.remove("vertical-sidebar");
            sidebarOnTop = "false";
        }
    }
}



window.addEventListener("load", pageLoad);





