"use strict"

let data = `
news-2025 | News 2025                                              | politics |            | pinned | wide
27        | Sex, gender, & transsexuals                            | politics |            | pinned | wide
32        | Politics fundamentals                                  | politics |            | pinned | wide
19        | Ilhan Omar's comments about Somalia                    | politics | 2025-02-12 |        |     
17        | Why get bottom surgery?                                | culture  | 2025-02-09 |        |     
35        | Show and tell (Lex Fridman)                            | politics | 2025-02-05 |        |     
16        | Milo Yiannopoulos's cancellation                       | politics | 2025-02-03 |        |     
34        | The Nazi salute                                        | politics | 2025-01-24 |        |     
30        | The appearance of intelligence                         | other    | 2025-01-18 |        |     
29        | Date formats                                           | other    | 2025-01-11 |        |     
28        | Therapy theory                                         | personal | 2025-01-09 |        |     
31        | Reflections on Justin Trudeau                          | politics | 2025-01-08 |        |     
25        | A beauty holding a bird                                | other    | 2024-12-23 |        |     
24        | Enduring falsehoods about Warren, Clinton              | politics | 2024-12-19 |        |     
22        | Dehumanization                                         | politics | 2024-12-15 |        |     
21        | Relationships                                          | personal | 2024-12-14 |        |     
14        | Reasons I'm glad to be Canadian                        | politics | 2024-12-08 |        |     
13        | The military–industrial complex                        | politics | 2024-12-04 |        |     
12        | The order of information                               | politics | 2024-12-03 |        |     
11        | The Trump appeal                                       | politics | 2024-12-03 |        |     
10        | Touchscreens and smartphones                           | culture  | 2024-12-02 |        |     
9         | The default politician                                 | politics | 2024-11-26 |        |     
8         | 10 Dollar                                              | culture  | 2024-11-25 |        |     
7         | Fetishism & politics                                   | politics | 2024-11-14 |        |     
15        | Mark Robinson transcript                               |          | 2024-11-13 | hidden |     
6         | Mark Robinson                                          | politics | 2024-11-13 |        |     
5         | Types of masculinity                                   | culture  | 2024-11-08 |        |     
4         | Anime reviews                                          | culture  | 2024-11-02 |        |     
3         | Poor things (2023 film)                                | culture  | 2024-10-31 |        |     
1         | Language                                               | personal | 2024-10-29 |        |     
2         | The trans prison stats argument                        | politics | 2024-10-19 |        |     
36        | People don't really have world views                   |          |            | hidden |     
37        | Bluesky accounts listing                               | other    |            | hidden | wide
18        | Transcripts: context for inflammatory Trump statements | politics |            |        |     
index     |                                                        |          |            |        |     
20        | Israel notes                                           | politics |            | hidden | wide
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
let tocLinks, sectionHeadings, tocUpdateFlag = true, currentHeading = "";
function tocHighlighter() {
    if (!tocUpdateFlag) { return; }
    tocUpdateFlag = false;
    setTimeout(() => { tocUpdateFlag = true; }, 50);
    
    let headingId;
    for (let i = 0; i < sectionHeadings.length; i += 1) {
        if (pageYOffset > sectionHeadings[i].offsetTop - window.innerHeight * 0.5) {
            headingId = sectionHeadings[i].id; }
        else {
            break; } }
    if (headingId != currentHeading) {
    for (let i = 0; i < tocLinks.length; i += 1) {
        tocLinks[i].classList.remove("active-heading");
        if (tocLinks[i].getAttribute("href") == "#" + headingId) {
            tocLinks[i].classList.add("active-heading"); } } }
    currentHeading = headingId;
}

function pageLoad() {
    document.head.innerHTML += `<link rel="stylesheet" href="assets/main.css"><link rel="icon" type="image/x-icon" href="assets/favicon.ico">`;
    const footer = document.body.appendChild(document.createElement("footer"));
    footer.id = "footer";
    footer.innerHTML += `<div id="image-viewer-wrapper" onclick="closeImageViewer()"><img id="image-viewer"></div>`;
    window.addEventListener("keydown", function(event) {
        if (isKeyResponsive && event.key === 'Escape') { closeImageViewer(); }
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
    
    const page = document.getElementById("page");
    const main = document.getElementById("main");
    if (!main) { console.error("{layout.js: can't find #main}"); return; }
    if (!page) { console.error("{layout.js: can't find #page}"); return; }

    page.innerHTML =
       `<div class="c1">
            <div class="c2">
                <div id="article">${main.innerHTML}</div>
            </div>
            <div id="sidebar"></div>
        </div>`;



    let article = document.getElementById("article");
    // article.parentNode.appendChild(document.createElement("hr"))
    let articleFooter = article.parentNode.appendChild(document.createElement("footer"));
    articleFooter.id = "article-footer";
    articleFooter.innerHTML = `<hr><p>North of Queen is my personal repo. I work alone and have no association with any other person or organization.<br>I&rsquo;m a 30-year-old Canadian. Find me on Bluesky <a target="_blank" href="https://bsky.app/profile/irispol.bsky.social">here</a>.</p>`;

    interpreter(article);

    if (citationArray.length > 0) {
        for (let i = 0; i < citationArray.length; i += 1) {
            citationArray[i] = `<li><a href="${citationArray[i]}">${citationArray[i]}</a></li>`; }
        let citations = article.parentNode.appendChild(document.createElement("div"));
        citations.id = "article-citations";
        citations.innerHTML = `<div>links on this page:</div><ol>${citationArray.join("")}</ol>`;
    }

    // alignTable(data, "|");
    /* interpreting data for sidebar or main list */
    const navLinks = { pins: [], recent: [], full: [] };
    const dataRows = data.split("\n");
    for (let i = 0; i < dataRows.length; i += 1) {
        let cells = dataRows[i].split("|").map(cell => cell.trim());
        if (cells.length >= 5) {
            let row_fileName = cells[0],
                row_name     = cells[1],
                row_category = cells[2],
                row_date     = cells[3],
                row_flags    = cells[4],
                row_options  = cells[5];
            
            const isPinned = (row_flags == "pinned");
            let icon = (isPinned)
                ? `<img class="icon" src="assets/pin2.png" height="17" width="17">`
                : "";
            
            let row_class = "nav-row";
            if (row_fileName == fileName) {
                row_class += " current-page";
                if (row_options != "") {
                    document.body.classList.add(...row_options.split(" "));
                }
            }
            
            if (row_flags == "hidden"
             || row_fileName == "index") { continue; }
            
            let linkElement = `<a href="${row_fileName}.html" class="${row_class}">${row_name}${icon}</a>`;
            if (isPinned) {
                navLinks.pins.push(linkElement); }
            else {
                if (navLinks.recent.length < 8) {
                    navLinks.recent.push(linkElement);
                }
            }
            
            if (row_date == "") { row_date = "---"; }
            navLinks.full.push(`
            <tr>
                <td><a href="${row_fileName}.html">${row_name}${icon}</a></td>
                <td>${row_category}</td>
                <td>${row_date}</td>
            </tr>`);
        }
    }
    
    const sidebar = document.getElementById("sidebar");
    const frontPageList = document.getElementById("front-page-list");
    if (frontPageList) {
        frontPageList.innerHTML = `<tr><th>Post title</th><th>Topic</th><th>Date posted</th></tr>${navLinks.full.join("")}`;
        sidebar.remove();
    } else {
        const sidebar = document.getElementById("sidebar");
        sidebar.innerHTML = 
           `<nav class="page-links">
                ${navLinks.pins.join("")}
            <hr>
                <div class="label">Recently added:</div>
                ${navLinks.recent.join("")}
                <div class="nav-row more-posts"><a href="index.html">Full page list →</a></div>
            </nav>`;
        if (tocArray.length > 2) {
            tocArray[0] = `<a class="toc-row h1" href="#top">(Top of page)</a>`;
            sidebar.innerHTML +=
           `<nav id="toc">
                <div class="toc-links"><h3>This page, table of contents</h3>${tocArray.join("")}</div>
            </nav>`;
            if (!tocLinks) { tocLinks = Array.from(document.getElementById("toc").getElementsByClassName("toc-row")); }
            if (!sectionHeadings) { sectionHeadings = Array.from(document.getElementsByClassName("noq-header")); }
            window.addEventListener("scroll", tocHighlighter);
        }
        window.addEventListener("load", pageWidthCheck);
        window.addEventListener("resize", pageWidthCheck);
    }
    if (document.title === "") { document.title = "North of Queen"; }
    else { document.title += " – North of Queen"; }
    
    const cover = document.getElementById("cover");
    if (!cover) { console.error("layout.js: can't find #cover"); }
    else {
        cover.classList.add("fade-out");
        cover.addEventListener("animationend", () => { cover.remove(); });
    }
    
    // articleFooter.innerHTML += `<p style="text-align:center">North of Queen</p>`;
}


let canResize = true, sidebarCollapsed = false;
function pageWidthCheck() {
    if (canResize) {
        let limit = (sidebarCollapsed) ? 804 : 800;
        if (window.innerWidth < limit) {
            document.body.classList.add("vertical-sidebar");
            canResize = false;
            sidebarCollapsed = true;
            setTimeout(() => {
                canResize = true;
                pageWidthCheck();
            }, 500);
        } else {
            document.body.classList.remove("vertical-sidebar");
            sidebarCollapsed = false;
        }
    }
}

window.addEventListener("load", pageLoad);




