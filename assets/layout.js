
function imageViewer(img) {
    document.getElementById("image-viewer-wrapper").style.display = "flex";
    document.getElementById("image-viewer").src = img.src;
    document.getElementById("image-viewer").alt = img.alt; }
function closeImageViewer() {
    document.getElementById("image-viewer-wrapper").style.display = "none";
    document.getElementById("image-viewer").src = "";
    document.getElementById("image-viewer").alt = ""; }

let data = `
2025-news | News 2025                                 | politics |            | pinned
32        | Politics fundamentals                     | politics | 2025-01-22 | pinned
31        | Reflections on Justin Trudeau             | politics | 2025-01-19 |       
30        | The appearance of intelligence            | other    | 2025-01-18 |       
29        | Date formats                              | other    | 2025-01-11 |       
28        | Therapy theory                            | personal | 2025-01-09 |       
27        | Sex, gender, & transsexuals               | politics | 2024-12-31 | pinned
25        | A beauty holding a bird                   | other    | 2024-12-23 |       
24        | Enduring falsehoods about Warren, Clinton | politics | 2024-12-19 |       
22        | Dehumanization                            | politics | 2024-12-15 |       
21        | Relationships                             | other    | 2024-12-14 |       
14        | Reasons I’m glad to be Canadian           | politics | 2024-12-08 |       
13        | The military industrial complex           | politics | 2024-12-04 |       
11        | The Trump appeal                          | politics | 2024-12-03 |       
12        | The order of information                  | politics | 2024-12-03 |       
10        | Touchscreens and smartphones              | culture  | 2024-12-02 |       
9         | The default politician                    | politics | 2024-11-26 |       
8         | 10 Dollar                                 | culture  | 2024-11-25 |       
7         | Fetishism & politics                      | politics | 2024-11-14 |       
6         | Mark Robinson                             | politics | 2024-11-13 |       
5         | Types of masculinity                      | culture  | 2024-11-08 |       
4         | Anime reviews                             | culture  | 2024-11-02 |       
3         | Poor things (2023 film)                   | culture  | 2024-10-31 |       
1         | Language                                  | personal | 2024-10-29 |       
2         | The trans prison stats argument           | politics | 2024-10-19 |       
`;

function alignTable(dataString, splitChar) {
    let table = dataString.split("\n").map(row => row.split(splitChar).map(cell => cell.trim()));
    tableWidth = Math.max(...table.map(row => row.length));
    table.sort((a, b) => {
        if (a.length < tableWidth || b.length < tableWidth) return;
        return parseInt(b[3].replace(/\D/g,"")) - parseInt(a[3].replace(/\D/g,""));
    });
    
    for (let column = 0; column < tableWidth; column += 1) {
        let cellWidth = 0;
        for (let i = 0; i < table.length; i += 1) {
            if (table[i].length < tableWidth) continue;
            if (table[i][column].length > cellWidth) {
                cellWidth = table[i][column].length; } }
        for (let i = 0; i < table.length; i += 1) {
            if (table[i].length < tableWidth) continue;
            table[i][column] += " ".repeat(cellWidth - table[i][column].length); } }
    for (let i = 0; i < table.length; i += 1) {
        table[i] = table[i].join(` ${splitChar} `); }
    
    data = table.join("\n");
}
// alignTable(data, "|");

function loadLayout() {
    const top_ = document.getElementById("top"); if (!top_) { console.error("{LAYOUT.JS: Can't find #top}"); return; }
    top_.innerHTML = `<header id="header"><a href="index.html"><img height="67" width="252" alt="North of Queen logo" src="assets/header-image.png"></a></header><div id="nav"></div>`;
    document.head.innerHTML += `<link rel="stylesheet" href="assets/main.css"><link rel="icon" type="image/x-icon" href="assets/favicon.ico">`;
    const footer = document.body.appendChild(document.createElement("footer"));
    footer.id = "footer";
    footer.innerHTML += `<div id="image-viewer-wrapper" onclick="closeImageViewer()"><img id="image-viewer"></div>`; }
function loadArticle() {
    const article = document.getElementById("article");
    const main = document.getElementById("main");
    if (article) {
        interpreter(article);
        let articleFooter = main.appendChild(document.createElement("div"));
        articleFooter.id = "article-footer";
        articleFooter.innerHTML = "<p>North of Queen is just my personal repo. I work alone and have no association with any other person or organization.</p><p>For more info about me, see <a href=\"index.html\">here</a>.</p>";
        if (citation_array.length > 0) {
            for (let i = 0; i < citation_array.length; i += 1) {
                citation_array[i] = `<li><a href="${citation_array[i]}">${citation_array[i]}</a></li>`; }
            let citations = main.appendChild(document.createElement("div"));
            citations.id = "citations";
            citations.innerHTML = `<div>external resources linked above:</div><ol>${citation_array.join("")}</ol>`; }
    } }
function main() {
    loadLayout();
    loadArticle();
    
    const title_ = document.title;
    const fullPostList = document.getElementById("full-post-list");
    const sidebar_links = { pins: [], recent: [] };
    const full_list = [];
    let data_ = data.split("\n").map(row => row.split("|").map(cell => cell.trim()));
    for (let i = 0; i < data_.length; i += 1) {
        let cell = data_[i];
        if (cell.length == 5) {
            let file = cell[0],
            title    = cell[1],
            category = cell[2],
            date     = cell[3],
            flags    = cell[4];
            
            const pinned = (flags == "pinned");
            const icon = (pinned) ? `<img class="icon" src="assets/pin.png" height="15" width="15">` : "";
            const attributes = (title == title_.replace(/&rsquo;/g,"’")) ? ` class="current-page"` : "";
            
            if (sidebar_links.pins.length + sidebar_links.recent.length < 16) {
                let entry = `<div${attributes}><a href="${file}.html">${title}</a>${icon}</div>`;
                if (pinned) {
                    sidebar_links.pins.push(entry); }
                else {
                    sidebar_links.recent.push(entry); } }
            if (fullPostList) {
                if (date == "") {
                    date = "---"; }
                full_list.push(`<td><a href="${file}.html">${title}</a></td><td>${category}</td><td>${date}</td>`); } } }
    
    const sidebar = document.createElement("div");
    document.getElementById("content-wrapper").insertBefore(sidebar, document.getElementById("main"));
    sidebar.id = "sidebar";
    sidebar.innerHTML = `<nav id="page-links">${sidebar_links.pins.join("")}<h3>Recent pages:</h3>${sidebar_links.recent.join("")}<div class='more-posts'><a href="full-post-list.html">Full page list</a></div></nav>`;
    if (toc_array.length > 3) {
        toc_array[0] = `<div><a class="toc-h1" href="#top">(Top of page)</a></div>`;
        sidebar.innerHTML +=
        `<nav id="toc">
            <div>
            <h3>This page table of contents</h3>
            ${toc_array.join("")}
            </div>
        </nav>`; }
    
    if (fullPostList) {
        fullPostList.innerHTML = `<table><th>Title</th><th>Category</th><th>Date</th><td>${full_list.join("</tr><tr>")}</td></table>`; }
    
    if (document.title == "") { document.title = "North of Queen"; }
    else { document.title += " - North of Queen"; }
    
    const cover = document.getElementById("cover");
    if (cover) {
        cover.classList.add("fade-out");
        cover.addEventListener("animationend", () => { cover.remove(); }); }}

window.addEventListener("load", main);
