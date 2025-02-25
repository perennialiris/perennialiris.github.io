
"use strict";

var linksInArticle = [];
var tableOfContentsLinks = [];
var isKeyResponsive = false;
var canResizePageWidth = true;
var sidebar;
var page;
var rowsInTableOfContents;
var headersInArticle;
var article;
var tocUpdateFlag = true;
var currentHeading = "";
var sidebarOnTop = false;
if (window.sessionStorage.getItem("sidebarHidden") === null) { window.sessionStorage.setItem("sidebarHidden", "false"); }

let data = `
23        | Passing                                                | transgender | 2025-02-24 | document |       
20        | Israel–Palestine notes                                 | politics    | 2025-02-24 | document |       
19        | Ilhan Omar's comments about Somalia                    | politics    | 2025-02-12 | document |       
17        | Why get bottom surgery?                                | transgender | 2025-02-09 | document |       
35        | Show and tell (Lex Fridman)                            | politics    | 2025-02-05 | document |       
16        | Milo Yiannopoulos's cancellation                       | politics    | 2025-02-03 | document |       
34        | The Nazi salute                                        | politics    | 2025-01-24 | document |       
30        | The appearance of intelligence                         | other       | 2025-01-18 | document |       
29        | Date formats                                           | other       | 2025-01-11 | document |       
28        | Therapy theory                                         | personal    | 2025-01-09 | document |       
31        | Reflections on Justin Trudeau                          | politics    | 2025-01-08 | document |       
32        | Conservatism                                           | politics    | 2025-01-05 | document |       
27        | Sex, gender, & transsexuals                            | transgender | 2024-12-29 | document |       
25        | A beauty holding a bird                                | other       | 2024-12-23 | document |       
24        | Enduring falsehoods about Warren, Clinton              | politics    | 2024-12-19 | document |       
22        | Dehumanization                                         | politics    | 2024-12-15 | document |       
21        | Relationships                                          | personal    | 2024-12-14 | document |       
14        | Reasons I'm glad to be Canadian                        | politics    | 2024-12-08 | document |       
13        | The military–industrial complex                        | politics    | 2024-12-04 | document |       
12        | The order of information                               | politics    | 2024-12-03 | document |       
11        | The Trump appeal                                       | politics    | 2024-12-03 | document |       
10        | Touchscreens and smartphones                           | culture     | 2024-12-02 | document |       
9         | The default politician                                 | politics    | 2024-11-26 | document |       
8         | 10 Dollar                                              | culture     | 2024-11-25 | document |       
7         | Fetishism & politics                                   | transgender | 2024-11-14 | document |       
15        | Mark Robinson transcript                               |             | 2024-11-13 | document | hidden
6         | Mark Robinson                                          | politics    | 2024-11-13 | document |       
5         | Types of masculinity                                   | culture     | 2024-11-08 | document |       
4         | Anime reviews                                          | culture     | 2024-11-02 | document |       
3         | Poor things (2023 film)                                | culture     | 2024-10-31 | document |       
1         | Language                                               | personal    | 2024-10-29 | document |       
2         | The trans prison stats argument                        | transgender | 2024-10-19 | document |       
news-2025 | News 2025                                              | politics    |            | document | pinned
36        | People don't really have world views                   |             |            | document | hidden
37        | Bluesky accounts listing                               | other       |            | document | hidden
18        | Transcripts: context for inflammatory Trump statements | politics    |            | document |       
index     |                                                        |             |            | document | hidden
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
    console.log(data);
}
alignTable(data,"|");

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
    const footer = document.body.appendChild(document.createElement("footer"));
    footer.id = "footer";
    footer.innerHTML +=
    `<div class="f1"><div class="f2"><a target="_blank" href="https://github.com/northofqueen">North of Queen</a> is my personal repo. I have no association with any other person or organization. I give permission for my writing to be used, reposted, etc. for noncommercial purposes provided no other person claims authorship (<a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>). Any computer code I upload to this repo (northofqueen) can be interpreted as fully public domain (<a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank">CC0</a>).</div></div>
    <div id="image-viewer-wrapper" onclick="closeImageViewer()"><img id="image-viewer"></div>
    `;
    window.addEventListener("keydown", function(event) {
        if (isKeyResponsive && event.key === 'Escape') {
            closeImageViewer(); }
    })

    /* get file name */
    let fileName_get_ = location.href.split("/");
    while (fileName_get_[fileName_get_.length - 1] === "") { fileName_get_.pop(); }
    fileName_get_ = fileName_get_.pop();
    if (fileName_get_.indexOf("#") != -1) fileName_get_ = fileName_get_.substring(0, fileName_get_.indexOf("#"));
    const fileName = fileName_get_.replace(/\.html$/, "");

    document.getElementById("top").innerHTML =
       `<header id="header">
            <a href="index.html"><img height="67" width="252" alt="North of Queen logo" src="assets/header-image.png"></a>
        </header>
        <nav id="nav">
        </nav>`;

    page = document.getElementById("page");
    if (!page) { console.error("{layout.js: 137 (lost #page)}"); return; }
    if (document.getElementById("main") === null) { console.error("{layout.js: 136 (lost #main)}"); return; }

    page.innerHTML =
       `<div class="c1">
            <div class="c2">
                <div class="c3">
                    <div id="article">${document.getElementById("main").innerHTML}</div>
                </div>
                <div id="sidebar"></div>
            </div>
            <div id="right-gutter"><button id="sidebar-button" class="toggle-button-1" type="button" onclick="toggleSidebarVisibility()"><img src="assets/chevron-right.png"></button></div>
        </div>`;

    sidebar = document.getElementById("sidebar");
    article = document.getElementById("article");

    let articleFooter = article.parentNode.appendChild(document.createElement("footer"));
    articleFooter.id = "article-footer";
    articleFooter.innerHTML = 
    `
    <div>Find me on: <a target="_blank" href="https://bsky.app/profile/irispol.bsky.social">Bluesky</a> <span class="betw">&verbar;</span> <a target="_blank" href="https://northofqueen.substack.com">Substack</a> <span class="betw">&verbar;</span> <a target="_blank" href="https://forthoseinterested.tumblr.com">Tumblr</a> <span class="betw">&verbar;</span> <a target="_blank" href="https://discord.com/invite/puJEP8HKk3">Discord</a></div>
    `;
    
    interpreter(article);
    
    /*if (linksInArticle.length > 0) {
        for (let i = 0; i < linksInArticle.length; i += 1) {
            linksInArticle[i] = `<li><a href="${linksInArticle[i]}">${linksInArticle[i]}</a></li>`; }
        let articleCitations = article.parentNode.appendChild(document.createElement("div"));
        articleCitations.id = "article-citations";
        articleCitations.innerHTML = `<div>links on this page:</div><ol>${linksInArticle.join("")}</ol>`;
    }*/

    /* interpreting data for sidebar or main list */
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

            const isCurrent = rowFile == fileName;
            const isPinned = rowFlag == "pinned";

            if (isCurrent) {
                if (rowType == "document") { document.head.innerHTML += `<link rel="stylesheet" href="assets/main.css">`; }
            }
            if (rowFlag == "hidden") { continue; }

            let icon = "";
            let entryClass = "nav-row";

            if (rowFile == fileName) { entryClass += " current-page"; }
            if (isPinned) { entryClass += " pinned"; icon = `<img class="icon" src="assets/pin2.png" height="17" width="17">`; }

            let entryElement = `<a href="${rowFile}.html" class="${entryClass}">${rowTitle}${icon}</a>`;
            if (isPinned) {
                sidebarNavContent.pins.push(entryElement); }
            else {
                if (sidebarNavContent.recent.length < 10) {
                    sidebarNavContent.recent.push(entryElement);
                }
            }
            if (rowDate == "") {
                rowDate = "---"; }

            sidebarNavContent.full.push(`
                <tr>
                    <td><a href="${rowFile}.html">${rowTitle}${icon}</a></td>
                    <td>${rowCategory}</td>
                    <td>${rowDate}</td>
                </tr>`);
        }
    }
    
    const frontPageList = document.getElementById("front-page-list");
    if (frontPageList) {
        frontPageList.innerHTML = `<tr><th>Post title</th><th>Topic</th><th>Date posted</th></tr>${sidebarNavContent.full.join("")}`;
    }
    else {

        let sidebarContent = 
           `<nav class="page-links">
                ${sidebarNavContent.pins.join("")}
                <hr>
                <div class="label">Recently added:</div>
                ${sidebarNavContent.recent.join("")}
                <div class="nav-row"><a style="float:right" href="index.html">Full page list →</a></div>
            </nav>
            `;

        if (tableOfContentsLinks.length < 6) {
            sidebar.innerHTML = `<span class="is-sticky">${sidebarContent}</span>`;
        } else {
            sidebar.innerHTML = `${sidebarContent}
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
    
    setSidebar();
    
    if (document.title === "") { document.title = "North of Queen"; }
    else { document.title += " – North of Queen"; }
    
    const cover = document.getElementById("cover");
    if (!cover) { console.error("layout.js: 250 (lost #cover)"); }
    else {
        cover.classList.add("fade-out");
        cover.addEventListener("animationend", () => { cover.remove(); }); }
}

function setSidebar() {
    if (window.sessionStorage.sidebarHidden === "true") {
        page.classList.add("hide-sidebar");
    } else {
        page.classList.remove("hide-sidebar");
    }
    if (sidebarOnTop) {
        page.classList.add("vertical-sidebar");
    } else {
        page.classList.remove("vertical-sidebar");
    }
}

function toggleSidebarVisibility() {
    if (window.sessionStorage.sidebarHidden === "true") {
        page.classList.remove("hide-sidebar");
        window.sessionStorage.sidebarHidden = "false";
        document.getElementById("sidebar-button").title = "hide sidebar";
    }
    else {
        page.classList.add("hide-sidebar");
        window.sessionStorage.sidebarHidden = "true";
        document.getElementById("sidebar-button").title = "show sidebar";
    }
}

function pageWidthCheck() {
    if (canResizePageWidth) {
        let limit = sidebarOnTop ? 804 : 800;
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





