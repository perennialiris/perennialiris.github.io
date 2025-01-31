
let pages_data = `

2025-news | 2025 news                                 |   |            | pinned

32        | Politics, fundamentals                    | Politics |            | pinned
27        | Sex, gender, & transsexuals               | Politics |            | pinned
31        | Reflections on Justin Trudeau             | Politics | 2025-01-19 |       
24        | Enduring falsehoods about Warren, Clinton | Politics | 2024-12-19 |       
7         | Fetishism & politics                      | Politics | 2024-11-14 |       
14        | Reasons I’m glad to be Canadian           | Politics | 2024-12-08 |       
13        | The military industrial complex           | Politics | 2024-12-04 |       
11        | The Trump appeal                          | Politics | 2024-12-03 |       
12        | The order of information                  | Politics | 2024-12-03 |       
6         | Mark Robinson                             | Politics | 2024-11-13 |       
9         | The default politician                    | Politics | 2024-11-26 |       
2         | The trans prison stats argument           | Politics | 2024-10-19 |       
22        | Dehumanization                            | Politics | 2024-12-15 |       

29        | Date formats                              | Other    | 2025-01-11 |       
10        | Touchscreens and smartphones              | Other    | 2024-12-02 |       

1         | Language                                  | Other    | 2024-10-29 |       
30        | The appearance of intelligence            | Other    | 2025-01-18 |       
25        | A beauty holding a bird                   | Other    | 2024-12-23 |       
8         | 10 Dollar                                 | Other    | 2024-11-25 |       
28        | Therapy theory                            | Other    | 2025-01-09 |       
21        | Relationships                             | Other    | 2024-12-14 |       
4         | Anime reviews                             | Other    | 2024-11-02 |       
3         | Poor things (2023 film)                   | Other    | 2024-10-31 |       
5         | Types of masculinity                      | Other    | 2024-11-08 |   
`;

function alignTable(dataString, splitChar) {
    const table = dataString.split("\n").map(row => row.split(splitChar).map(cell => cell.trim()));
    const tableWidth = Math.max(...table.map(row => row.length));
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
    console.log(table.join("\n")); }
alignTable(pages_data, "|");

function main() {
    const top_ = document.getElementById("top"); if (!top_) { console.error("{LAYOUT.JS: Can't find #top}"); return; }
    top_.innerHTML = `<header id="header"><a href="index.html"><img height="67" width="252" alt="North of Queen logo" src="assets/header-image.png"></a></header><div id="nav"></div>`;
    document.head.innerHTML += `<link rel="stylesheet" href="assets/main.css"><link rel="icon" type="image/x-icon" href="assets/favicon.ico">`;
    const footer = document.body.appendChild(document.createElement("footer"));
    footer.id = "footer";
    footer.innerHTML += `<div id="image-viewer-wrapper" onclick="closeImageViewer()"><img id="image-viewer"></div>`;
    
    /* If you want a right panel: */
    // const contentWrapper = document.getElementById("content-wrapper"); if (!contentWrapper) { console.error("{LAYOUT.JS: Can't find #content-wrapper}"); }
    // contentWrapper.appendChild(document.createElement("div"));
    
    const main = document.getElementById("main"); if (!main) { console.error("{LAYOUT.JS: Can't find #main}"); }
    const article = document.getElementById("article");
    if (article) {
        interpreter(article);
        
        if (citation_array) {
            if (citation_array.length > 0) {
                for (let i = 0; i < citation_array.length; i += 1) {
                    citation_array[i] = `<li><a href="${citation_array[i]}">${citation_array[i]}</a></li>`; }
                let citations = main.appendChild(document.createElement("div"));
                citations.id = "citations";
                citations.innerHTML = `<div>external resources linked above:</div><ol>${citation_array.join("")}</ol>`; }
        }
    }
    
    const sidebar_links = { };
    pages_data = pages_data.split("\n");
    for (let i = 0; i < pages_data.length; i += 1) {
        const cell = pages_data[i].trim().split("|").map(data => data.trim());
        if (cell.length == 5) {
            let file = cell[0],
            title    = cell[1],
            category = cell[2],
            date     = cell[3],
            options  = cell[4];
            
            if (category == "") category = "topLinks";
            if (!sidebar_links.hasOwnProperty(category)) {
                sidebar_links[category] = []; }
            
            let extras = (options == "pinned")
                ? `<img class="icon" src="assets/pin.png" height="15" width="15">` : "";
            let attributes = (title == document.title)
                ? ` class="current-page"` : "";
            
            sidebar_links[category].push(
                `<div${attributes}><a href="${file}.html">${title}</a>${extras}</div>`
            ); }
    }
    
    const sidebar = document.getElementById("sidebar"); if (!sidebar) { console.error("{LAYOUT.JS: Can't find #sidebar}"); }
    if (sidebar) {
        
        let page_nav = "";
        Object.keys(sidebar_links).forEach(key => {
            page_nav += (key == "topLinks")
                ? sidebar_links[key].join("")
                : `<h3>${key}</h3>${sidebar_links[key].join("")}` });
        
        sidebar.innerHTML = 
        `<nav id="page-links">${page_nav}</nav>`;
        
        if (toc_array.length > 0) {
            toc_array[0] = `<div><a class="toc-h1" href="#top">(Top)</a></div>`;
            sidebar.innerHTML +=
            `<nav id="toc">
                <div>
                <h2>Article table of contents</h2>
                ${toc_array.join("")}
                </div>
            </nav>`; } }
    
    if (document.title == "") {
        document.title = "North of Queen"; }
    else {
        document.title += " - North of Queen"; }
    
    const cover = document.getElementById("cover");
    if (cover) {
        cover.classList.add("fade-out");
        cover.addEventListener("animationend", () => {
            cover.remove(); }); } }

let viewerWrapper;
let viewerImg;
function imageViewer(img) {
    viewerWrapper = document.getElementById("image-viewer-wrapper");
    viewerImg = document.getElementById("image-viewer");
    viewerWrapper.style.display = "flex";
    viewerImg.src = img.src;
    viewerImg.alt = img.alt;
}
function closeImageViewer() {
    viewerWrapper = document.getElementById("image-viewer-wrapper");
    viewerImg = document.getElementById("image-viewer");
    viewerWrapper.style.display = "none";
    viewerImg.src = "";
    viewerImg.alt = "";
}

window.onload = main;




