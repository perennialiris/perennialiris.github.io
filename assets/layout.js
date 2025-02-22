
"use strict";

var linksInArticle = [];
var tableOfContentsLinks = [];
var isKeyResponsive = false;
var canResizePageWidth = true;
var sidebarOnTop = false;
var sidebarHidden = false;
var sidebar;
var page;
var rowsInTableOfContents;
var headersInArticle;
var article;
var tocUpdateFlag = true;
var currentHeading = "";

let data = `
news-2025 | News 2025                                              | politics |            | pinned 
19        | Ilhan Omar's comments about Somalia                    | politics | 2025-02-12 |        
17        | Why get bottom surgery?                                | culture  | 2025-02-09 |        
35        | Show and tell (Lex Fridman)                            | politics | 2025-02-05 |        
16        | Milo Yiannopoulos's cancellation                       | politics | 2025-02-03 |        
34        | The Nazi salute                                        | politics | 2025-01-24 |        
30        | The appearance of intelligence                         | other    | 2025-01-18 |        
29        | Date formats                                           | other    | 2025-01-11 |        
28        | Therapy theory                                         | personal | 2025-01-09 |        
31        | Reflections on Justin Trudeau                          | politics | 2025-01-08 |        
32        | Conservatism                                           | politics | 2025-01-05 |        
27        | Sex, gender, & transsexuals                            | politics | 2024-12-29 |        
25        | A beauty holding a bird                                | other    | 2024-12-23 |        
24        | Enduring falsehoods about Warren, Clinton              | politics | 2024-12-19 |        
22        | Dehumanization                                         | politics | 2024-12-15 |        
21        | Relationships                                          | personal | 2024-12-14 |        
14        | Reasons I'm glad to be Canadian                        | politics | 2024-12-08 |        
13        | The military–industrial complex                        | politics | 2024-12-04 |        
12        | The order of information                               | politics | 2024-12-03 |        
11        | The Trump appeal                                       | politics | 2024-12-03 |        
10        | Touchscreens and smartphones                           | culture  | 2024-12-02 |        
9         | The default politician                                 | politics | 2024-11-26 |        
8         | 10 Dollar                                              | culture  | 2024-11-25 |        
7         | Fetishism & politics                                   | politics | 2024-11-14 |        
15        | Mark Robinson transcript                               |          | 2024-11-13 | hidden 
6         | Mark Robinson                                          | politics | 2024-11-13 |        
5         | Types of masculinity                                   | culture  | 2024-11-08 |        
4         | Anime reviews                                          | culture  | 2024-11-02 |        
3         | Poor things (2023 film)                                | culture  | 2024-10-31 |        
1         | Language                                               | personal | 2024-10-29 |        
2         | The trans prison stats argument                        | politics | 2024-10-19 |        
36        | People don't really have world views                   |          |            | hidden 
37        | Bluesky accounts listing                               | other    |            | hidden 
18        | Transcripts: context for inflammatory Trump statements | politics |            |        
index     |                                                        |          |            | hidden 
20        | Israel notes                                           | politics |            | hidden 
`;
/*    23    26    33    38    39    40    */

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
    document.head.innerHTML += `<link rel="stylesheet" href="assets/main.css"><link rel="icon" type="image/x-icon" href="assets/favicon.ico">`;
    const footer = document.body.appendChild(document.createElement("footer"));
    footer.id = "footer";
    footer.innerHTML += `<div id="image-viewer-wrapper" onclick="closeImageViewer()"><img id="image-viewer"></div>`;
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
                <div id="article">${document.getElementById("main").innerHTML}</div>
            </div>
            <div id="sidebar"></div>
        </div>
        <div id="toggle-container"><input class="toggle-subtle" type="button" onclick="toggleSidebarVisibility()" value="show navbar"></div>`;
    sidebar = document.getElementById("sidebar");

    article = document.getElementById("article");
    let articleFooter = article.parentNode.appendChild(document.createElement("footer"));
    articleFooter.id = "article-footer";
    articleFooter.innerHTML = 
    `<div><span>North of Queen</span> is my personal repo. I work alone and have no association with any other person or organization.</div>
    <div>Find me on: <a target="_blank" href="https://bsky.app/profile/irispol.bsky.social">Bluesky</a> <span class="betw">&verbar;</span> <a target="_blank" href="https://northofqueen.substack.com">Substack</a> <span class="betw">&verbar;</span> <a target="_blank" href="https://forthoseinterested.tumblr.com">Tumblr</a> <span class="betw">&verbar;</span> <a target="_blank" href="https://discord.com/invite/puJEP8HKk3">Discord</a></div>`;

    interpreter(article);

    if (linksInArticle.length > 0) {
        for (let i = 0; i < linksInArticle.length; i += 1) {
            linksInArticle[i] = `<li><a href="${linksInArticle[i]}">${linksInArticle[i]}</a></li>`; }
        let articleCitations = article.parentNode.appendChild(document.createElement("div"));
        articleCitations.id = "article-citations";
        articleCitations.innerHTML = `<div>links on this page:</div><ol>${linksInArticle.join("")}</ol>`;
    }

    // alignTable(data, "|");
    /* interpreting data for sidebar or main list */
    const sidebarNavContent = { pins: [], recent: [], full: [] };
    const dataRows = data.split("\n");
    for (let i = 0; i < dataRows.length; i += 1) {
        let cells = dataRows[i].split("|").map(cell => cell.trim());
        if (cells.length >= 5) {
            let articleName     = cells[0],
                articleTitle    = cells[1],
                articleCategory = cells[2],
                articleDate     = cells[3],
                articleFlags    = cells[4];

            const isPinned = (articleFlags == "pinned");
            let iconElement = (isPinned)
                ? `<img class="icon" src="assets/pin2.png" height="17" width="17">`
                : "";

            let contentClass = "nav-row";
            if (articleName == fileName) { contentClass += " current-page"; }
            if (isPinned) { contentClass += " pinned"; }

            if (articleFlags == "hidden") { continue; }

            let entryElement = `<a href="${articleName}.html" class="${contentClass}">${articleTitle}${iconElement}</a>`;
            if (isPinned) {
                sidebarNavContent.pins.push(entryElement); }
            else {
                if (sidebarNavContent.recent.length < 12) {
                    sidebarNavContent.recent.push(entryElement);
                }
            }
            if (articleDate == "") {
                articleDate = "---"; }

            sidebarNavContent.full.push(`
                <tr>
                    <td><a href="${articleName}.html">${articleTitle}${iconElement}</a></td>
                    <td>${articleCategory}</td>
                    <td>${articleDate}</td>
                </tr>`);
        }
    }
    
    const frontPageList = document.getElementById("front-page-list");
    if (frontPageList) {
        frontPageList.innerHTML = `<tr><th>Post title</th><th>Topic</th><th>Date posted</th></tr>${sidebarNavContent.full.join("")}`;
        sidebar.remove();
    } else {
        
        sidebar.innerHTML = 
           `<nav class="page-links">
                ${sidebarNavContent.pins.join("")}
            <hr>
                <div class="label">Recently added:</div>
                ${sidebarNavContent.recent.join("")}
                ${tableOfContentsLinks.length > 4 ? "" : `<div class="nav-row close-container"><input class="toggle-subtle" type="button" onclick="toggleSidebarVisibility()" value="hide sidebar"></div>`}
            </nav>`;

        if (tableOfContentsLinks.length > 3) {
            tableOfContentsLinks[0] = `<a class="toc-row h1" href="#top">(Top of page)</a>`;
            sidebar.innerHTML += `<nav id="toc"><span class="toc-title"><div>Contents</div><input class="toggle-subtle" type="button" onclick="toggleSidebarVisibility()" value="hide"></span>${tableOfContentsLinks.join("")}</span>`;
            if (rowsInTableOfContents === undefined) { rowsInTableOfContents = Array.from(document.getElementById("toc").getElementsByClassName("toc-row")); }
            if (headersInArticle === undefined) { headersInArticle = Array.from(document.getElementsByClassName("noq-header")); }
            window.addEventListener("scroll", tocHighlighter);
            setTimeout(() => { tocHighlighter(); }, 100);
            document.getElementById("toc").classList.add("is-sticky");
        } else {
            sidebar.firstChild.classList.add("is-sticky");
        }
        
        window.addEventListener("resize", pageWidthCheck);
        window.addEventListener("load", pageWidthCheck);
        setTimeout(() => { pageWidthCheck(); }, 50);
    }
    if (document.title === "") { document.title = "North of Queen"; }
    else { document.title += " – North of Queen"; }
    
    const cover = document.getElementById("cover");
    if (!cover) { console.error("layout.js: 250 (lost #cover)"); }
    else {
        cover.classList.add("fade-out");
        cover.addEventListener("animationend", () => { cover.remove(); }); }
}

function toggleSidebarVisibility() {
    if (sidebarHidden == true) {
        page.classList.remove("hide-sidebar");
        document.getElementById("toggle-container").value = "hide";
    }
    else
    if (sidebarHidden == false) {
        page.classList.add("hide-sidebar");
        document.getElementById("toggle-container").value = "unhide sidebar";
    }
    sidebarHidden = !sidebarHidden;
}

function pageWidthCheck() {
    if (canResizePageWidth) {
        let limit = (sidebarOnTop) ? 804 : 800;
        if (window.innerWidth < limit) {
            page.classList.add("vertical-sidebar");
            if (sidebarHidden) {
                // page.classList.remove("hide-sidebar");
            }
            canResizePageWidth = false;
            sidebarOnTop = true;
            setTimeout(() => {
                canResizePageWidth = true;
                pageWidthCheck();
            }, 500);
        } else {
            page.classList.remove("vertical-sidebar");
            sidebarOnTop = false;
            if (sidebarHidden) {
                // page.classList.add("hide-sidebar");
            }
        }
    }
}

window.addEventListener("load", pageLoad);





