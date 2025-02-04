
let data = `
2025-news | News 2025                                 | politics |            | pinned
27        | Sex, gender, & transsexuals               | politics |            | pinned
32        | Politics fundamentals                     | politics |            | pinned
37        | Bluesky accounts listing                  | other    |            |       
16        | Milo Yiannopoulos’s cancellation          | politics | 2025-02-03 |       
34        | The Nazi salute                           | politics | 2025-01-24 |       
30        | The appearance of intelligence            | other    | 2025-01-18 |       
29        | Date formats                              | other    | 2025-01-11 |       
28        | Therapy theory                            | personal | 2025-01-09 |       
31        | Reflections on Justin Trudeau             | politics | 2025-01-08 |       
25        | A beauty holding a bird                   | other    | 2024-12-23 |       
24        | Enduring falsehoods about Warren, Clinton | politics | 2024-12-19 |       
22        | Dehumanization                            | politics | 2024-12-15 |       
21        | Relationships                             | personal | 2024-12-14 |       
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
3         | Poor things                               | culture  | 2024-10-31 |       
1         | Language                                  | personal | 2024-10-29 |       
2         | The trans prison stats argument           | politics | 2024-10-19 |       
16        | Info                                      | personal |            |       
`;

function alignTable(dataString, splitChar) {
    let table = dataString.split("\n").map(row => row.split(splitChar).map(cell => cell.trim()));
    tableWidth = Math.max(...table.map(row => row.length));
    console.log("tableWidth: " + tableWidth)
    table.sort((a, b) => {
        if (a.length < tableWidth || b.length < tableWidth) {
            return; }
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
    console.log(data);
}
/* run this to automatically align table above (to console): */
alignTable(data, "|");

function loadLayout() {
    const n_top = document.getElementById("top"); if (!n_top) { console.error("{LAYOUT.JS: Can't find #top}"); return; }
    n_top.innerHTML = `<header id="header"><a href="index.html"><img height="67" width="252" alt="North of Queen logo" src="assets/header-image.png"></a></header><div id="nav"></div>`;
    document.head.innerHTML += `<link rel="stylesheet" href="assets/main.css"><link rel="icon" type="image/x-icon" href="assets/favicon.ico">`;
    const footer = document.body.appendChild(document.createElement("footer"));
    footer.id = "footer";
    footer.innerHTML += `<div id="image-viewer-wrapper" onclick="closeImageViewer()"><img id="image-viewer"></div>`; }

let tocLinks, sectionHeadings, tocUpdateFlag = true, currentHeading = "";
function tocHighlighter() {
    if (!tocUpdateFlag) { return; }
    tocUpdateFlag = false;
    setTimeout(() => { tocUpdateFlag = true; }, 100);
    
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
    currentHeading = headingId; }

function pageLoad() {
    loadLayout();
    let mainContent = document.getElementById("main-content");
    interpreter(mainContent);
    let contentFooter = mainContent.parentNode.appendChild(document.createElement("div"));
    contentFooter.id = "content-footer";
    contentFooter.innerHTML = `
    <section>
        <img src="assets/favicon.ico">
        <div>
            <p><span style="color:var(--accent)">North of Queen</span> is my personal repo I use to host things I write. I work alone and have no association with any other person or organization.</p>
            <p>For more info about me, see <a href="info.html">here</a>.</p>
        </div>
    </section>
    `;
    if (citation_array.length > 0) {
        for (let i = 0; i < citation_array.length; i += 1) {
            citation_array[i] = `<li><a href="${citation_array[i]}">${citation_array[i]}</a></li>`; }
        let citations = mainContent.parentNode.appendChild(document.createElement("div"));
        citations.id = "citations";
        citations.innerHTML = `<div>external resources linked above:</div><ol>${citation_array.join("")}</ol>`; }
    const pageTitle = document.title;
    const full_post_list_container = document.getElementById("full-page-list");
    const page_links = { pins: [], recent: [], full: [] };
    const full_list = [];
    let data_ = data.split("\n").map(row => row.split("|").map(cell => cell.trim()));
    for (let i = 0; i < data_.length; i += 1) {
        let cell = data_[i];
        if (cell.length >= 5) {
            let file = cell[0],
            title = cell[1],
            category = cell[2],
            date = cell[3],
            flags = cell[4];
            
            if (file == 16) { continue; }
            
            let pinned = (flags == "pinned");
            let icon = (pinned) ? `<img class="icon" src="assets/pin.png" height="15" width="15">` : "";
            
            let divClass = "nav-row";
            let currentPage = (title == pageTitle.replace(/&rsquo;/g,"’"));
            if (currentPage) { divClass += " current-page"; }
            
            let entry = `<a href="${file}.html" class="${divClass}">${title}${icon}</a>`;
            if (pinned) { page_links.pins.push(entry); }
            else {
                /* max number of links in sidebar: */
                if (currentPage || page_links.recent.length < 7 ) {
                    page_links.recent.push(entry); } }
            if (full_post_list_container) {
                if (date == "") { date = "---"; }
                page_links.full.push(
                   `<td><a href="${file}.html">${title}</a></td>
                    <td>${category}</td>
                    <td>${date}</td>`); } } }
    const sidebar = document.createElement("div");
    mainContent.parentNode.parentNode.insertBefore(sidebar, mainContent.parentNode);
    sidebar.id = "sidebar";
    sidebar.innerHTML = 
        `<nav id="page-links">
            ${page_links.pins.join("")}
            ${page_links.recent.join("")}
            <div class="more-posts"><a href="15.html">Full page list</a></div>
        </nav>`;
    if (toc_array.length > 2) {
        toc_array[0] = `<a class="toc-row h1" href="#top">(Top of page)</a>`;
        sidebar.innerHTML +=
        `<nav id="toc">
            <div>
                <h3>This page table of contents</h3>
                <div id="toc-links">${toc_array.join("")}</div>
            </div>
        </nav>`;
        if (!tocLinks) { tocLinks = Array.from(document.getElementById("toc").getElementsByClassName("toc-row")); }
        if (!sectionHeadings) { sectionHeadings = Array.from(document.getElementsByClassName("noq-header")); }
        window.addEventListener("scroll", tocHighlighter); }
    else {
        document.getElementById("page-links").classList.add("is-sticky"); }
    
    if (full_post_list_container) {
        full_post_list_container.innerHTML =
            `<table>
                <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                </tr>
                <tr>${page_links.full.join("</tr><tr>")}</tr>
            </table>`; }
    
    if (document.title === "") {
        document.title = "North of Queen"; }
    else {
        document.title += " – North of Queen"; }
    
    const cover = document.getElementById("cover");
    if (cover) {
        cover.classList.add("fade-out");
        cover.addEventListener("animationend", () => { cover.remove(); }); }}

window.addEventListener("load", pageLoad);

