"use strict"
let dataVariable = `
2025-news | News 2025                                              | politics |            | pinned | wide  
27        | Sex, gender, & transsexuals                            | politics |            | pinned | wide  
32        | Politics fundamentals                                  | politics |            | pinned | wide  
17        | Showing and telling                                    | culture  | 2025-02-04 |        |       
16        | Milo Yiannopoulos's cancellation                       | politics | 2025-02-03 |        |       
34        | The Nazi salute                                        | politics | 2025-01-24 |        | narrow
30        | The appearance of intelligence                         | other    | 2025-01-18 |        | narrow
29        | Date formats                                           | other    | 2025-01-11 |        | narrow
28        | Therapy theory                                         | personal | 2025-01-09 |        | narrow
31        | Reflections on Justin Trudeau                          | politics | 2025-01-08 |        | narrow
25        | A beauty holding a bird                                | other    | 2024-12-23 |        | narrow
24        | Enduring falsehoods about Warren, Clinton              | politics | 2024-12-19 |        |       
22        | Dehumanization                                         | politics | 2024-12-15 |        |       
21        | Relationships                                          | personal | 2024-12-14 |        |       
14        | Reasons I'm glad to be Canadian                        | politics | 2024-12-08 |        |       
13        | The military industrial complex                        | politics | 2024-12-04 |        | narrow
11        | The Trump appeal                                       | politics | 2024-12-03 |        | narrow
12        | The order of information                               | politics | 2024-12-03 |        |       
10        | Touchscreens and smartphones                           | culture  | 2024-12-02 |        |       
9         | The default politician                                 | politics | 2024-11-26 |        |       
8         | 10 Dollar                                              | culture  | 2024-11-25 |        | narrow
7         | Fetishism & politics                                   | politics | 2024-11-14 |        |       
6         | Mark Robinson                                          | politics | 2024-11-13 |        | narrow
5         | Types of masculinity                                   | culture  | 2024-11-08 |        |       
4         | Anime reviews                                          | culture  | 2024-11-02 |        |       
3         | Poor things                                            | culture  | 2024-10-31 |        |       
1         | Language                                               | personal | 2024-10-29 |        |       
2         | The trans prison stats argument                        | politics | 2024-10-19 |        |       
19        | Ilham Omar's controversial comments about Somalia      | politics | 2024-01-28 |        | narrow
18        | Transcripts: context for inflammatory Trump statements | politics |            |        |       
37        | Bluesky accounts listing                               | other    |            |        | wide  
list      | Full post list                                         | personal |            |        | wide  
`;

let tableWidth;
function alignTable(dataString, splitChar) {
    let table = dataString.split("\n").map(row => row.split(splitChar).map(cell => cell.trim()));
    tableWidth = Math.max(...table.map(row => row.length));
    table.sort((a, b) => {
        if (a.length < tableWidth || b.length < tableWidth) {
            return; }
        return b[3].length - a[3].length;
        }).sort((a, b) => {
        if (a.length < tableWidth || b.length < tableWidth) {
            return; }
        return parseInt(b[3].replace(/\D/g,"")) - parseInt(a[3].replace(/\D/g,""));
        }).sort((a, b) => {
        if (a.length < tableWidth || b.length < tableWidth) {
            return; }
        return b[4].length - a[4].length;
    });
    for (let column = 0; column < tableWidth; column += 1) {
        let cellWidth = 0;
        for (let i = 0; i < table.length; i += 1) {
            if (table[i].length == 1) { continue; }
            while (table[i].length < tableWidth) { table[i].push(""); }
            if (table[i][column].length > cellWidth) {
                cellWidth = table[i][column].length; } }
        for (let i = 0; i < table.length; i += 1) {
            if (table[i].length < tableWidth) continue;
            table[i][column] += " ".repeat(cellWidth - table[i][column].length); } }
    for (let i = 0; i < table.length; i += 1) {
        table[i] = table[i].join(` ${splitChar} `); }
    dataVariable = table.join("\n");
    console.log(dataVariable); }
/* run this to automatically align table above (to console): */
alignTable(dataVariable, "|");

let tocLinks, sectionHeadings, tocUpdateFlag = true, currentHeading = "";
function tocHighlighter() {
    if (!tocUpdateFlag) { return; }
    tocUpdateFlag = false;
    setTimeout(() => { tocUpdateFlag = true; }, 100);
    
    let headingId;
    for (let i = 0; i < sectionHeadings.length; i += 1) {
        if (pageYOffset > sectionHeadings[i].offsetTop - window.innerHeight * 0.5) {
            headingId = sectionHeadings[i].id; }
        else {
            break; } }
    if (headingId != currentHeading) {
    for (let i = 0; i < tocLinks.length; i += 1) {
        tocLinks[i].classList.remove("active-heading");
        console.log(tocLinks[i].getAttribute("href"))
        if (tocLinks[i].getAttribute("href") == "#" + headingId) {
            tocLinks[i].classList.add("active-heading"); } } }
    currentHeading = headingId; }

function pageLoad() {
    document.head.innerHTML += `<link rel="stylesheet" href="assets/main.css"><link rel="icon" type="image/x-icon" href="assets/favicon.ico">`;
    const footer = document.body.appendChild(document.createElement("footer"));
    footer.id = "footer";
    footer.innerHTML += `<div id="image-viewer-wrapper" onclick="closeImageViewer()"><img id="image-viewer"></div>`;
    
    const pageTop = document.getElementById("top");
    if (pageTop) {
        pageTop.innerHTML = `<div id="header-wrapper"><header id="header"><a href="index.html"><img height="67" width="252" alt="North of Queen logo" src="assets/header-image.png"></a></header></div><div id="nav"><div id="hamburger"></div></div>`; }
    else console.error("layout.js: can't find #top");
    
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
        interpreter(mainContent); }
    else console.error("layout.js: can't find #main-content");
    
    const contentWrapper = document.getElementById("content-wrapper");
    if (contentWrapper) {
        let contentFooter = contentWrapper.appendChild(document.createElement("div"));
        contentFooter.id = "content-footer";
        contentFooter.innerHTML = `
        <section>
            <img src="assets/favicon.ico">
            <div>
                <p><span style="color:var(--accent)">North of Queen</span> is my personal repo I use to host things I write. I work alone and have no association with any other person or organization.</p>
                <p>For more info about me, see <a href="index.html">here</a>.</p>
            </div>
        </section>`;
        
        if (citationArray.length > 0) {
            for (let i = 0; i < citationArray.length; i += 1) {
                citationArray[i] = `<li><a href="${citationArray[i]}">${citationArray[i]}</a></li>`; }
            let citations = contentWrapper.appendChild(document.createElement("div"));
            citations.id = "citations";
            citations.innerHTML = `<div>external resources linked above:</div><ol>${citationArray.join("")}</ol>`; } }
    else console.error("layout.js: can't find #content-wrapper");
    
    const pageTitle = document.title;
    const navPageLinks = { pins: [], recent: [], full: [] };
    const data = dataVariable.split("\n").map(row => row.split("|").map(cell => cell.trim()));
    const full_post_list_container = document.getElementById("full-page-list");
    
    const pageWrapper = document.getElementById("page-wrapper");
    if (pageWrapper) {
        for (let i = 0; i < data.length; i += 1) {
            let cell = data[i];
            if (cell.length >= 5) {
                let file = cell[0],
                title    = cell[1],
                category = cell[2],
                date     = cell[3],
                flags    = cell[4],
                options  = cell[5];
                if (file == "list") { continue; }
                const pinned = (flags == "pinned");
                let icon = (pinned) ? `<img class="icon" src="assets/pin.png" height="17" width="17">` : "";
                
                let aClass = "nav-row";
                let currentPage = (title == pageTitle.replace(/&rsquo;/g,"'"));
                if (currentPage) {
                    aClass += " current-page";
                    if (options != "") {
                        document.body.classList.add(...options.split(" ")); } }
                let entry = `<a href="${file}.html" class="${aClass}">${title}${icon}</a>`;
                if (pinned) { navPageLinks.pins.push(entry); }
                else {
                    if (currentPage || navPageLinks.recent.length < 11 ) {
                        navPageLinks.recent.push(entry); } }
                if (full_post_list_container) {
                    if (date == "") {
                        date = "---"; }
                    navPageLinks.full.push(`
                    <tr>
                        <td><a href="${file}.html">${title}${icon}</a></td>
                        <td>${category}</td>
                        <td>${date}</td>
                    </tr>`);
                }
            }
        }
        const sidebar = document.createElement("div");
        pageWrapper.insertBefore(sidebar, pageWrapper.firstChild);
        sidebar.id = "sidebar";
        sidebar.innerHTML = 
            `<nav id="page-links">
                ${navPageLinks.pins.join("")}
                ${navPageLinks.recent.join("")}
                <div class="more-posts"><a href="list.html">Full page list</a></div>
            </nav>`;
        if (toc_array.length > 1) {
            toc_array[0] = `<a class="toc-row h1" href="#top">(Top of page)</a>`;
            sidebar.innerHTML +=
            `<nav id="toc">
                <div>
                    <h3>Table of contents (this page)</h3>
                    <div id="toc-links">${toc_array.join("")}</div>
                </div>
            </nav>`;
            if (!tocLinks) { tocLinks = Array.from(document.getElementById("toc").getElementsByClassName("toc-row")); }
            if (!sectionHeadings) { sectionHeadings = Array.from(document.getElementsByClassName("noq-header")); }
            window.addEventListener("scroll", tocHighlighter); }
        else {
            document.getElementById("page-links").classList.add("is-sticky"); } }
    else console.error("layout.js: can't find #page-wrapper");
    
    if (full_post_list_container) {
        full_post_list_container.innerHTML =
        `<table>
            <tr><th>Title</th><th>Category</th><th>Date</th></tr>
            ${navPageLinks.full.join("")}
        </table>`; }
    if (document.title === "") {
        document.title = "North of Queen"; }
    else {
        document.title += " – North of Queen"; }
    
    const cover = document.getElementById("cover");
    if (cover) {
        cover.classList.add("fade-out");
        cover.addEventListener("animationend", () => { cover.remove(); }); }
    else console.error("layout.js: can't find #cover");
}

window.addEventListener("load", pageLoad);


