
let index_data = `
2025-news | 2025 news | pinned |

31 | Reflections on Justin Trudeau                | politics | 2025-01-19
32 | Political conservatism                       | politics | 2025-01-21
24 | Enduring falsehoods about Warren, Clinton    | politics | 2024-12-19
27 | Sex, gender, & transsexuals                  | politics | 2025-01-02
7  | Fetishism & politics                         | politics | 2024-11-14
14 | Reasons I’m glad to be Canadian              | politics | 2024-12-08
13 | The military industrial complex              | politics | 2024-12-04
11 | The Trump appeal                             | politics | 2024-12-03
12 | The order of information                     | politics | 2024-12-03
6  | Mark Robinson                                | politics | 2024-11-13
9  | The default politician                       | politics | 2024-11-26
2  | The trans prison stats argument              | politics | 2024-10-19
22 | Dehumanization                               | politics | 2024-12-15

29 | Date formats                                 | other | 2025-01-11
10 | Touchscreens and smartphones                 | other | 2024-12-02

1  | Language                                     | personal | 2024-10-29
30 | The appearance of intelligence               | personal | 2025-01-18
25 | A beauty holding a bird                      | personal | 2024-12-23
8  | 10 Dollar                                    | personal | 2024-11-25
28 | Therapy theory                               | personal | 2025-01-09
21 | Relationships                                | personal | 2024-12-14
4  | Anime reviews                                | personal | 2024-11-02
3  | Poor things (2023 film)                      | personal | 2024-10-31
5  | Types of masculinity                         | personal | 2024-11-08

`;

function main() {
    const top_ = document.getElementById("top"); if (!top_) { console.error("{LAYOUT.JS: Can't find #top}"); return; }
    top_.innerHTML = `<header id="header"><div><a href="index.html"><img height="67" width="252" alt="North of Queen logo" src="assets/header-image.png"></a></div></header><div id="nav"></div>`;
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
        
        let article_footer = main.appendChild(document.createElement("footer"));
        article_footer.id = "article-footer";
        article_footer.innerHTML = `<p>North of Queen is a personal webpage. I’m not part of any organization.</p>`;
        
        if (citation_array) {
            if (citation_array.length > 0) {
                for (let i = 0; i < citation_array.length; i += 1) {
                    citation_array[i] = `<li><a href="${citation_array[i]}">${citation_array[i]}</a></li>`; }
                let citations = main.appendChild(document.createElement("div"));
                citations.id = "citations";
                citations.innerHTML = `<div>external resources linked above:</div><ol>${citation_array.join("")}</ol>`; }
        }
    }
    
    const sidebar_data = { "pinned" : [], "politics": [], "other": [], "personal": [] };
    index_data = index_data.split("\n");
    for (let i = 0; i < index_data.length; i += 1) {
        const cell = index_data[i].trim().split("|").map(data => data.trim());
        if (cell.length == 4) {
            let file = cell[0],
            title    = cell[1],
            category = cell[2],
            date     = cell[3];
            if (!sidebar_data[category]) { continue; }
            let extras = (category == "pinned") ? `<img class="icon" src="assets/pin2.png" height="15" width="15">` : "";
            let other_attributes = (title == document.title) ? `class="current-page"` : "";
            let entry = `<div><a ${other_attributes} href="${file}.html">${title}</a>${extras}</div>`;
            sidebar_data[category].push(entry); }
    }
    
    const sidebar = document.getElementById("sidebar"); if (!sidebar) { console.error("{LAYOUT.JS: Can't find #sidebar}"); }
    if (sidebar) {
        sidebar.innerHTML = 
        `<nav id="page-links">
        ${sidebar_data.pinned.join("")}
        <h3>Politics</h3>
        ${sidebar_data.politics.join("")}
        <h3>Other</h3>
        ${sidebar_data.other.join("")}
        ${sidebar_data.personal.join("")}
        </nav>`;
        
        if (toc_array.length > 0) {
            console.log(toc_array)
            console.log(toc_array[0])
            let x = toc_array[0].indexOf(">") + 1;
            x += toc_array[0].substring(x).indexOf(">") + 1;
            let y = toc_array[0].substring(x).indexOf("<") + x;
            toc_array[0] = toc_array[0].substring(0, x) + "(Top)" + toc_array[0].substring(y);
            
            console.log(toc_array[0])
            
            sidebar.innerHTML +=
            `<nav id="toc">
                <div>
                <h2>Article table of contents</h2>
                ${toc_array.join("")}
                </div>
            </nav>`; } }
    
    document.title += " - North of Queen";
    const cover = document.getElementById("cover");
    if (cover) {
        cover.classList.add("fade-out");
        cover.addEventListener("animationend", () => {
            cover.remove(); }); }
}

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




