
"use strict"

/*
    This .js creates the website dynamically when this file is loaded by the .html file.
    For everything to work properly, create html files in this format:
    
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <link rel="stylesheet" href="assets/main.css">
            </head>
            <body>
                <div class="page-wrapper">
                    The unique body text of the page goes here.
                </div>
                <script src="assets/interpreter.js"></script>
                <script src="assets/layout.js"></script>
            </body>
        </html>
    
    The script looks for "page-wrapper" and takes it from there.
*/

let pageData =
/*
    .html name  |  Article title  |  topic  |  date  |  options
    
    unlisted   : doesn't appear in homepage list or sidebar
    repo-table : hides sidebar, applies different styling, like news lists
    toc        : include table of contents
    pinned     : put at top of homepage page list
    
    The page still works if you don't include it in this list, but it will be 'unlisted' and have no options or page title
*/
`
43    | Word-maker                                             | other                 |            | unlisted         
42    | Journalism and paywalls                                | media, culture        | 2025-06-02 | narrow           
41    | Normalization and status quo bias                      | politics, culture     | 2025-04-20 |                  
40    | Trump and Russia                                       | politics              | 2025-03-05 |                  
39    | Movies                                                 | other                 |            | narrow unlisted  
38    | Canadian news                                          | other, politics       |            | repo-table       
37    | Mark Robinson transcript                               |                       | 2024-11-13 | unlisted         
36    | India                                                  | history, politics     | 2025-03-05 |                  
35    | International news                                     | news, politics        |            | repo-table       
34    | The Nazi salute                                        | news, politics        | 2025-01-24 | narrow           
33    | The standard relationship model                        | other                 |            |                  
32    | Politics fundamentals                                  | politics              | 2025-01-05 | toc wide         
31    | Reflections on Justin Trudeau                          | news, politics        | 2025-01-08 |                  
30    | The appearance of intelligence                         | other                 | 2025-01-18 |                  
29    | Date formats                                           | other                 | 2025-01-11 | narrow           
28    | The problem with Pierre                                | politics              | 2025-03-15 |                  
27    | Sex, gender, & transsexuals                            | transgender, politics | 2024-12-29 | toc              
26    | American news                                          | news, politics        |            | pinned repo-table
25    | A beauty holding a bird                                | other                 | 2024-12-23 | narrow           
24    | Enduring falsehoods about Warren, Clinton              | politics              | 2024-12-19 |                  
23    | Passing                                                | transgender, culture  | 2025-02-24 |                  
22    | Dehumanization                                         | politics              | 2024-12-15 |                  
21    | Relationships                                          | personal              | 2024-12-14 | unlisted         
20    | Israel–Palestine notes                                 | politics              | 2025-02-24 | toc unlisted     
19    | Ilhan Omar’s comments about Somalia                    | politics              | 2025-02-12 |                  
18    | Transcripts: context for inflammatory Trump statements | politics              |            |                  
17    | Why get bottom surgery?                                | transgender, culture  | 2025-02-09 |                  
16    | Milo Yiannopoulos’s cancellation                       | politics              | 2025-02-03 |                  
15    | Bluesky accounts listing                               | other                 |            | repo-table       
14    | Reasons I’m glad to be Canadian                        | politics              | 2024-12-08 |                  
13    | The military–industrial complex                        | politics              | 2024-12-04 |                  
12    | The order of information                               | politics              | 2024-12-03 |                  
11    | The Trump appeal                                       | politics              | 2024-12-03 |                  
10    | Touchscreens and smartphones                           | culture               | 2024-12-02 |                  
9     | The default politician                                 | politics              | 2024-11-26 |                  
8     | 10 Dollar                                              | culture               | 2024-11-25 |                  
7     | Fetishism & politics                                   | transgender, culture  | 2024-11-14 |                  
6     | Mark Robinson                                          | news, politics        | 2024-11-13 |                  
5     | Types of masculinity                                   | culture               | 2024-11-08 |                  
4     | Anime reviews                                          | culture               | 2024-11-02 |                  
3     | Poor things (2023 film)                                | culture               | 2024-10-31 |                  
2     | The trans prison stats argument                        | transgender, politics | 2024-10-19 |                  
1     | Calendar                                               |                       |            | unlisted         
index |                                                        |                       |            | unlisted narrow  
`;

/* These are some variables I want to pass between things: */
let pageWrapper = null;
let formatButtonContainer = null;

window.addEventListener("load", pageLoad);

function pageLoad() {
    /* Favicon (icon for browser tab) */ document.head.innerHTML += `<link rel="icon" type="image/x-icon" href="favicon.ico">`;
    /* Get name of this .html file: */ const thisFile = document.baseURI.split("/").slice(-1)[0].replace(/\.html$/, "");
    /* Is this my front-page index.html? */ const index = document.getElementById("index-aKxOoclwfz");

    /* I wish JavaScript had 'final' variables (like in Java), but whatever. */
    pageWrapper = document.querySelector(".page-wrapper");
    
    /* Enable dark-mode if it was enabled previously in session: */
    if (localStorage.getItem("brightness") == "dark") {
        pageWrapper.classList.add("dark");
    }
        /* Otherwise, default to light: */
    else {
        localStorage.setItem("brightness", "light");
    }
    
    /* If this JavaScript fails, the page CSS has no targets and it defaults to a monospace text display of
       the .html contents. This class is what removes that styling: */
    pageWrapper.classList.add("javascript-loaded");
    
    /* Wrap the current pageWrapper contents in this structure: */
    pageWrapper.innerHTML =
       `<div class="page">
            <header class="main-header"><a href="index.html"}"></a></header>
            <nav class="main-nav">
                <div class="nav-inner space-between">
                    <div class="nav-section">
                        <div id="page-name-display"></div>
                    </div>
                    <div class="nav-section">
                        <input class="to-top nav-button" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" value="Jump to Top" title="Click to scroll to the top of the page" type="button">
                        <input class="show-toc-button nav-button" value="Show ToC" onclick="toggleToc()" type="button">
                        <div id="menu" class="hidden">
                            <div class="menu-row">
                                <div><span class="no-select">Dark mode:</span></div>
                                <div>
                                    <label class="menu-switch">
                                        <input type="checkbox" id="lightswitch">
                                        <span class="menu-slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="menu-row">
                                <div><span class="no-select">Heading font:</span></div>
                                <div>
                                    <select id="heading-font-select">
                                        <option value="Inter">Inter</option>
                                        <option value="Merriweather">Merriweather</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Roboto Slab">Roboto Slab</option>
                                        <option value="Faculty Glyphic">Faculty Glyphic</option>
                                        <option value="Segoe UI">Segoe UI</option>
                                    </select>
                                </div>
                            </div>
                            <div class="menu-row">
                                <div><span class="no-select">Body font:</span></div>
                                <div>
                                    <select id="body-font-select">
                                        <option value="Georgia">Georgia</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Trebuchet MS">Trebuchet MS</option>
                                        <option value="Lato">Lato</option>
                                        <option value="Faculty Glyphic">Faculty Glyphic</option>
                                    </select>
                                </div>
                            </div>
                            <div class="menu-row">
                                <div><span class="no-select">Secondary font:</span></div>
                                <div>
                                    <select id="secondary-font-select">
                                        <option value="Segoe UI">Segoe UI</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Trebuchet MS">Trebuchet MS</option>
                                        <option value="Lato">Lato</option>
                                    </select>
                                </div>
                            </div>
                            <div class="menu-row">
                                <div><span class="no-select">Paragraph format:</span></div>
                                <div class="format-button-container space-between">
                                    <input type="button" title="Left-align, no indenting" onclick="setTextFormat(1)" class="format-button icon" style="background-image: url('assets/icon-paragraph-style-left-no-indent.png')">
                                    <input type="button" title="Justified, no indenting" onclick="setTextFormat(2)" class="format-button icon" style="background-image: url('assets/icon-paragraph-style-justify-no-indent.png')">
                                    <input type="button" title="Left-align, indent sibling paragraphs" onclick="setTextFormat(3)" class="format-button icon" style="background-image: url('assets/icon-paragraph-style-left-indent.png')">
                                    <input type="button" title="Justified, indent sibling paragraphs" onclick="setTextFormat(4)" class="format-button icon" style="background-image: url('assets/icon-paragraph-style-justify-indent.png')">
                                </div>
                            </div>
                            <div>
                                <div style="color: #808080; font-size: 90%;">These settings are put in localStorage, not cookies, meaning they get cleared when you end your browser session.</div>
                            </div>
                        </div>
                        <input class="gear nav-button" onclick="setMenu('toggle')" title="Options" type="button">
                    </div>
                </div>
            </nav>
            <div class="main-container">
                <main id="left">
                    <style class="theme-style"></style>
                    <article class="main-content">${pageWrapper.innerHTML}</article>
                    <footer class="article-footer">
                        <div class="space-between">
                            <div class="see-also"></div>
                            <div style="white-space: nowrap;"><a href="../">Link to full page index</a></div>
                        </div>
                        <div class="citations"></div>
                    </footer>
                </main>
                <aside id="right"></aside>
            </div>
            <footer class="page-bottom">This is page is hosted on <a title="https://github.com/perennialiris" href="https://github.com/perennialiris">my personal Github repo</a>, which is controlled by me alone. I have no association with any other person or organization. To contact me for any reason, email perennialforces@gmail.com.</footer>
            <div class="lightbox-wrapper" onclick="setLightbox('close')"><img id="lightbox"></div>
        </div>`;
    
    interpreter(document.querySelector(".main-content"));
    
    /* If you want this to auto-organize and make the list above look nice, have the function console.log the output: */
    alignTable(pageData, "|");

    /* Take the data for page lists from above: */
    const pageList = { recent: [], pins: [], full: [] };
    const otherRepoTables = [];
    let includeToc = false, isPinned = false, isCurrentPage = false, repoTable = false, pageTitle = "";
    const dataRows = pageData.split("\n").filter(n => n.trim().length > 2);
    for (let i = 0; i < dataRows.length; i += 1) {
        const cells = dataRows[i].split("|").map(cell => cell.trim());
        const rowFile     = cells[0],
            rowTitle      = cells[1],
            rowCategory   = cells[2],
            rowDate       = cells[3],
            rowOptions    = cells[4].split(" ");
        
        isPinned = rowOptions.includes("pinned");
        isCurrentPage = (rowFile == thisFile);
        
        if (isCurrentPage) {
            includeToc = rowOptions.includes("toc");
            pageTitle = rowTitle;
            repoTable = rowOptions.includes("repo-table");
            if (repoTable) {
                pageWrapper.classList.add("repo-table");
            }
            if (rowOptions.includes("wide")) { pageWrapper.classList.add("wide"); }
            if (rowOptions.includes("narrow")) { pageWrapper.classList.add("narrow"); }
        }
        else if (rowOptions.includes("repo-table")) {
            otherRepoTables.push(`<a href="${rowFile}.html">${rowTitle}</a>`);
        }
        if (rowOptions.includes("unlisted")) { continue; }

        /* ---- for recent in sidenav ---- */
        if (pageList.recent.length < 9) {
            pageList.recent.push(`<div class="${isCurrentPage? "nav-row selected" : "nav-row"}"><a href="${rowFile}.html">${rowTitle}</a></div>`);
        }

        /* ---- for homepage index ---- */
        
        let entry = `<tr><td><a href="${rowFile}.html" class="${isPinned ? "pinned" : ""}">${wrapDigits(rowTitle)}</a></td><td class="date">${rowDate != "" ? "<span style='font-size: 95%; font-family: system-ui; color: #808080; white-space: nowrap;'>" + rowDate + "</span>" : ""}</td><td>${rowCategory}</td></tr>`;
        
        if (isPinned) {
            pageList.full.unshift(entry);
        }
        else {
            pageList.full.push(entry);
        }
    }
    
    if (index) {
        document.getElementById("page-name-display").innerHTML = `Iris’s documents`;
        document.getElementById("index-aKxOoclwfz").innerHTML = pageList.full.join("");
    }
    else {
        document.getElementById("page-name-display").innerHTML = `<a href="index.html">Index</a> <span style="font-family: 'Arial',sans-serif; font-weight: 700; margin-inline: 2px;">&rarr;</span> <a href="">${pageTitle != "" ? pageTitle : thisFile}</a>`;
        const right = document.getElementById("right");

        if (repoTable) {
            right.classList.add("hidden");
            const mcont = document.querySelector(".main-container");
            const n2 = mcont.parentNode.insertBefore(document.createElement("div"), mcont);
            n2.classList.add("other-lists");
            n2.innerHTML = `<div>Other lists:</div><div class="container">${otherRepoTables.join("")}</div>`;
        }
        else if (!includeToc) {
            right.style.maxHeight = "1500px";
            right.innerHTML = `
                <nav class="recently-added">
                    <div class="space-between" style="align-items: center;">
                        <div class="heading">Recent pages:</div>
                        <input type="button" class="x-button icon" onclick="document.getElementById('right').remove()"></div>
                    </div>
                    <hr>
                    ${pageList.recent.join("")}
                </nav>`;
        }
        else if (includeToc) {
            console.log("creating table of contents...");

            const toc = right.appendChild(document.createElement("nav"));
            toc.classList.add("table-of-contents");

            const headings = Array.from(document.getElementsByClassName("article-heading")).slice(1);
            toc.innerHTML = `
            <div class="toc-title-box space-between">
                <div class="heading">Table of contents</div>
                <input type="button" value="hide" class="hide-toc-button" onclick="toggleToc()">
            </div>
            <a class="toc-row h1" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" style="cursor: pointer;">(Top of page)</a>
            <div class="scroller">
                ${headings.map(h => `<a class="toc-row ${h.tagName.toLowerCase()}" href="#${h.id}">${h.innerHTML.replace(/\/?i>/g, "")}</a>`).join("")}
            </div>`;

            const rowsInToc = Array.from(toc.getElementsByClassName("toc-row"));
            let currentHeading = "";
            let canTocHighlighter = true;
            function tocHighlighter() {
                if (!canTocHighlighter) { return; }
                canTocHighlighter = false;
                setTimeout(() => { canTocHighlighter = true; }, 300);
                let headingId;
                for (let i = 0; i < headings.length; i += 1) {
                    if (pageYOffset > headings[i].offsetTop - window.innerHeight * 0.5) {
                        headingId = headings[i].id; }
                    else {
                        break; } }
                if (headingId != currentHeading) {
                for (let i = 0; i < rowsInToc.length; i += 1) {
                    rowsInToc[i].classList.remove("active-heading");
                    if (rowsInToc[i].getAttribute("href") == "#" + headingId) {
                        rowsInToc[i].classList.add("active-heading"); } } }
                currentHeading = headingId;
            }
            function tocWidthCheck() {
                if (window.innerWidth < 800) { pageWrapper.classList.add("toc-vertical"); }
                else { pageWrapper.classList.remove("toc-vertical"); }
            }
            window.addEventListener("resize", tocWidthCheck);
            window.addEventListener("scroll", tocHighlighter);
            setTimeout(() => { tocWidthCheck(); tocHighlighter(); }, 100);

            const scroller = toc.getElementsByClassName("scroller")[0];
            function scrollerHandler() {
                if (scroller.scrollHeight == scroller.offsetHeight || scroller.scrollHeight - scroller.scrollTop <= scroller.clientHeight + 20) {
                    scroller.classList.add("hide-mask"); }
                else {
                    scroller.classList.remove("hide-mask"); } }
            ["scroll", "resize"].forEach(e => { scroller.addEventListener(e, scrollerHandler); });
            scrollerHandler();
        }
    }

    let gear = document.querySelector(".gear");
    document.addEventListener("click", function(e) {
        if (!document.getElementById("menu").contains(e.target) && !gear.contains(e.target)) {
            setMenu("hide");
        }
    });

    let canNavStickyCheck = true, mainNav = document.querySelector(".main-nav");
    function navStickyCheck() {
        if (!canNavStickyCheck || !mainNav) { return; }
        canNavStickyCheck = false;
        setTimeout(() => { canNavStickyCheck = true; navStickyCheck() }, 300);
        if (pageYOffset > 180) {
            mainNav.classList.add("sticky-active"); }
        else {
            mainNav.classList.remove("sticky-active"); }
    }
    navStickyCheck();
    window.addEventListener("scroll", navStickyCheck);

    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    window.addEventListener("keydown", function(e) {
        if (e.key === 'Escape') {
            setLightbox("close");
            setMenu("hide");
        }
    });
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    if (localStorage.getItem("brightness") == "dark") { document.getElementById("lightswitch").checked = true; }
    document.getElementById("lightswitch").addEventListener("change", function() {
        setBrightness(this.checked ? "dark" : "light");
    });
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    if (localStorage.getItem("text-style") == null) {
        setTextFormat(1); }
    else {
        setTextFormat(localStorage.getItem("text-style"));
    }
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    let headingFont = localStorage.getItem("heading-font");
    if (headingFont == null) {
        headingFont = "Inter"; /* default value on first visit */
        localStorage.setItem("heading-font", headingFont);
    }
    document.getElementById("heading-font-select").value = headingFont;
    document.getElementById("heading-font-select").addEventListener("change", function() {
        localStorage.setItem("heading-font", this.value);
        updateFonts();
    })
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    let bodyFont = localStorage.getItem("body-font");
    if (bodyFont == null) {
        bodyFont = "Georgia"; /* default value on first visit */
        localStorage.setItem("body-font", bodyFont);
    }
    document.getElementById("body-font-select").value = bodyFont;
    document.getElementById("body-font-select").addEventListener("change", function() {
        localStorage.setItem("body-font", this.value);
        updateFonts();
    })
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    let secondaryFont = localStorage.getItem("secondary-font");
    if (secondaryFont == null) {
        secondaryFont = "Segoe UI"; /* default value on first visit */
        localStorage.setItem("secondary-font", secondaryFont);
    }
    document.getElementById("secondary-font-select").value = secondaryFont;
    document.getElementById("secondary-font-select").addEventListener("change", function() {
        localStorage.setItem("secondary-font", this.value);
        updateFonts();
    })
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    updateFonts();
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    
    articleLinks = articleLinks.filter(i => i[0].startsWith("http"));
    if (articleLinks.length > 0) {
        document.querySelector(".citations").innerHTML = `
        <div>External links referenced:</div>
        <div>
            <ol>${
                articleLinks
                    .map((i, n) => {
                        let j = 0;
                        return `<li>${
                            (i[1] == 1) ? `<a style="font-family: monospace" href="#cite-${n + 1}">^</a>` : ` <a href="#cite-${i[1] + "-" + j++}">^</a>`.repeat(i[1] )
                        } <a target="_blank" id="cite-${n + 1}" href="${i[0]}">${i[0]}</a></li>`})
                    .join("")
            }</ol>
        </div>`;
    }

    if (document.title == "") document.title = "Perennial Iris";
    else if (document.title.slice(0 - "Perennial Iris".length) != "Perennial Iris") document.title += " - Perennial Iris";
    
}

function updateFonts() {
    const css = document.querySelector(".theme-style");
    let headingFont = localStorage.getItem("heading-font");
    let bodyFont = localStorage.getItem("body-font");
    let secondaryFont = localStorage.getItem("secondary-font");

    css.innerHTML = `
    .page {
        --body-font: "${bodyFont}", sans-serif;
        --heading-font: "${headingFont}", sans-serif;
        --secondary-font: "${secondaryFont}", system-ui;
    }`;

    if (headingFont != "Georgia") { css.innerHTML += " .article-heading .digit { font-family: inherit; }"; }
    if (bodyFont != "Georgia") { css.innerHTML += " .main-content .digit, .main-content ol > li::marker { font-family: inherit; }"; }

    switch (bodyFont) {
        case "Faculty Glyphic":
            css.innerHTML += ` .mdash { font-family: unset !important; }`;
            break;
        case "Nunito Sans":
            css.innerHTML += ` .main-content { font-weight: 500; }`
    }

    localStorage.setItem("heading-font", headingFont);
    localStorage.setItem("body-font", bodyFont);
    localStorage.setItem("secondary-font", secondaryFont);
}


/* If you want the input data in this .js to be nice and neat, this does that and throws it in console log. */
function alignTable(dataString, splitChar) {
    const table_ = dataString.split("\n").filter(c => c.split(splitChar).length == 5).map(row => row.split(splitChar).map(cell => cell.trim()));
    const rowWidth = Math.max(...table_.map(row => row.length));
    for (let col = 0; col < rowWidth; ++col) {
        let cellWidth = 0;
        for (let i = 0; i < table_.length; i += 1) {
            while (table_[i].length < rowWidth) {
                table_[i].push("");
            }
            if (table_[i][col].length > cellWidth) {
                cellWidth = table_[i][col].length;
            }
        }
        for (let i = 0; i < table_.length; i += 1) {
            if (table_[i].length < rowWidth) {
                continue;
            }
            table_[i][col] += " ".repeat(cellWidth - table_[i][col].length);
        }
    }
    table_.sort((a, b) => {
        /* This sorts the entries by date, pushing entries without date to the bottom: */
        a = a[3].replace(/\D/g, ""); if (a == "") { a = 0; }
        b = b[3].replace(/\D/g, ""); if (b == "") { b = 0; }
        return parseInt(b) - parseInt(a);
    }).sort((a, b) => {
        /* Then this pushes any entry with pinned to the top: */
        if (a[4].indexOf("pinned") != -1) { return -1; }
        if (b[4].indexOf("pinned") != -1) { return 1; }
        return 0;
    });
    pageData = table_.map(c => c.join(` ${splitChar} `)).join("\n");
    // console.log(pageData);
}

function setMenu(action) {
    switch (action) {
        case "show":
            document.getElementById("menu").classList.remove("hidden");
            localStorage.setItem("menuState", "visible");
            break;
        case "hide":
            document.getElementById("menu").classList.add("hidden");
            localStorage.setItem("menuState", "hidden");
            break;
        default:
            const mode = localStorage.getItem("menuState");
            if (mode == null || mode == "hidden") {
                setMenu("show");
            } else {
                setMenu("hide");
            }
            break;
    }
}

function setBrightness(setValue) {
    switch (setValue) {
        case "light":
            pageWrapper.classList.remove("dark");
            document.getElementById("lightswitch").checked = false;
            localStorage.setItem("brightness", "light");
            break;
        case "dark":
            pageWrapper.classList.add("dark");
            document.getElementById("lightswitch").checked = true;
            localStorage.setItem("brightness", "dark");
            break;
        default:
            const mode = localStorage.getitem("brightness");
            if (mode == null || mode == "light") {
                setBrightness("dark");
            } else {
                setBrightness("light");
            }
            break;
    }
}

function setTextFormat(setValue) {
    setValue = Number(setValue);
    
    /* Put 'selected' class on the button of the option that's selected: */
    const btns = document.getElementById("menu").getElementsByClassName("format-button");
    btns[setValue - 1].classList.add("selected");
    
    for (let i = 0; i < btns.length; i += 1) {
        if (i != setValue-1) { btns[i].classList.remove("selected"); }
    }
    /* This just add or remove the classes as required: */
    if (setValue == 1) {
        pageWrapper.classList.remove("text-justify", "text-indent")
    }
    else if (setValue == 2) {
        pageWrapper.classList.add("text-justify");
        pageWrapper.classList.remove("text-indent");
    }
    else if (setValue == 3) {
        pageWrapper.classList.add("text-justify", "text-indent");
    }
    else if (setValue == 4) {
        pageWrapper.classList.remove("text-justify");
        pageWrapper.classList.add("text-indent");
    }
    
    localStorage.setItem("text-style", setValue);
}

function toggleToc() {
    if (pageWrapper.classList.contains("toc-hidden")) {
        pageWrapper.classList.remove("toc-hidden");
    } else {
        pageWrapper.classList.add("toc-hidden");
    }
}

function setLightbox(action) {
    let lightbox = document.getElementById("lightbox");
    if (lightbox) {
        if (action == "close") {
            lightbox.src = lightbox.alt = "";
            lightbox.parentNode.style.display = "none";
        } else if (typeof action == "object") {
            lightbox.src = action.src;
            lightbox.alt = action.alt;
            lightbox.parentNode.style.display = "flex";
        }
    }
}



