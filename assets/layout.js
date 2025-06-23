
"use strict"

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

    const btns = document.querySelector(".format-button-container").children;
    
    btns[setValue-1].classList.add("selected");
    for (let i = 0; i < btns.length; i += 1) {
        if (i != setValue-1) { btns[i].classList.remove("selected"); }
    }
    
    const mainContent = document.querySelector(".main-content");
    switch (setValue) {
        case 1:
            mainContent.classList.remove("text-justify");
            mainContent.classList.remove("text-indent");
            break;
        case 2:
            mainContent.classList.add("text-justify");
            mainContent.classList.remove("text-indent");
            break;
        case 3:
            mainContent.classList.remove("text-justify");
            mainContent.classList.add("text-indent");
            break;
        case 4:
            mainContent.classList.add("text-justify");
            mainContent.classList.add("text-indent");
            break;
    }
    
    localStorage.setItem("text-style", setValue);
}

function toggleToc() {
    if (pageWrapper.classList.contains("hide-toc")) {
        pageWrapper.classList.remove("hide-toc");
    } else {
        pageWrapper.classList.add("hide-toc");
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

let data = `
43 | Word-maker | other | | unlisted
42 | Journalism and paywalls | media, culture | 2025-06-02 | narrow
41 | Normalization and status quo bias | politics, culture | 2025-04-20 | 
40 | Trump and Russia | politics | 2025-03-05 | 
39 | Movies | other | | narrow unlisted
38 | Canadian news | other, politics | | repo-table
37 | Mark Robinson transcript | | 2024-11-13 | unlisted
36 | India | history, politics | 2025-03-05 | 
35 | International news | news, politics | | repo-table
34 | The Nazi salute | news, politics | 2025-01-24 | narrow
33 | The standard relationship model | other | | 
32 | Politics fundamentals | politics | 2025-01-05 | toc wide
31 | Reflections on Justin Trudeau | news, politics | 2025-01-08 |
30 | The appearance of intelligence | other | 2025-01-18 |
29 | Date formats | other | 2025-01-11 | narrow
28 | The problem with Pierre | politics | 2025-03-15 | 
27 | Sex, gender, & transsexuals | transgender, politics | 2024-12-29 | toc
26 | American news | news, politics | | pinned repo-table
25 | A beauty holding a bird | other | 2024-12-23 | narrow
24 | Enduring falsehoods about Warren, Clinton | politics | 2024-12-19 |
23 | Passing | transgender, culture | 2025-02-24 |
22 | Dehumanization | politics | 2024-12-15 |
21 | Relationships | personal | 2024-12-14 | unlisted
20 | Israel–Palestine notes | politics | 2025-02-24 | toc unlisted
19 | Ilhan Omar’s comments about Somalia | politics | 2025-02-12 |
18 | Transcripts: context for inflammatory Trump statements | politics | |
17 | Why get bottom surgery? | transgender, culture | 2025-02-09 |
16 | Milo Yiannopoulos’s cancellation | politics | 2025-02-03 |
15 | Bluesky accounts listing | other | | repo-table
14 | Reasons I’m glad to be Canadian | politics | 2024-12-08 |
13 | The military–industrial complex | politics | 2024-12-04 |
12 | The order of information | politics | 2024-12-03 |
11 | The Trump appeal | politics | 2024-12-03 |
10 | Touchscreens and smartphones | culture | 2024-12-02 |
9 | The default politician | politics | 2024-11-26 |
8 | 10 Dollar | culture | 2024-11-25 |
7 | Fetishism & politics | transgender, culture | 2024-11-14 |
6 | Mark Robinson | news, politics | 2024-11-13 |
5 | Types of masculinity | culture | 2024-11-08 |
4 | Anime reviews | culture | 2024-11-02 |
3 | Poor things (2023 film) | culture | 2024-10-31 |
2 | The trans prison stats argument | transgender, politics | 2024-10-19 |
index | | | | unlisted narrow`;

function alignTable(dataString, splitChar) {
    const table = dataString.split("\n").filter(c => c.split(splitChar).length == 5).map(row => row.split(splitChar).map(cell => cell.trim()));
    const rowWidth = Math.max(...table.map(row => row.length));
    for (let col = 0; col < rowWidth; ++col) {
        let cellWidth = 0;
        for (let i = 0; i < table.length; i += 1) {
            while (table[i].length < rowWidth) {
                table[i].push(""); }
            if (table[i][col].length > cellWidth) {
                cellWidth = table[i][col].length; } }
        for (let i = 0; i < table.length; i += 1) {
            if (table[i].length < rowWidth) { continue; }
            table[i][col] += " ".repeat(cellWidth - table[i][col].length);
            } }
    table.sort((a, b) => {
        a = a[3].replace(/\D/g, ""); if (a == "") { a = 0; }
        b = b[3].replace(/\D/g, ""); if (b == "") { b = 0; }
        return parseInt(b) - parseInt(a);
    }).sort((a, b) => {
        if (a[4].trim() == "pinned") { return -1; }
        if (b[4].trim() == "pinned") { return 1; }
        return 0;
    });
    data = table.map(c => c.join(` ${splitChar} `)).join("\n");
}

const pageWrapper = document.querySelector(".page-wrapper");
let mainContent, formatButtonContainer;
function pageLoad() {
    const thisDir = document.baseURI.split("/").slice(-2)[0];
    const index = document.getElementById("index-aKxOoclwfz");
    document.head.innerHTML += `<link rel="icon" type="image/x-icon" href="${index?"":"../"}/favicon.ico">`;

    if (localStorage.getItem("brightness") == null) { localStorage.setItem("brightness","light"); }
    else if (localStorage.getItem("brightness") == "dark") { pageWrapper.classList.add("dark"); }

    pageWrapper.classList.add("javascript-loaded");
    pageWrapper.innerHTML =
       `<div class="page">
            <header class="main-header align-center"><a href="${index?"":"../index.html"}"></a></header>
            <nav class="main-nav">
                <div class="nav-inner space-between">
                    <div class="align-center">
                        <div class="page-name-display"></div>
                    </div>
                    <div class="align-center">
                        <input class="to-top nav-button" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" value="Jump to Top" title="Click to scroll to the top of the page" type="button">
                        <input class="show-toc nav-button" value="Show ToC" onclick="toggleToc()" type="button">
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
                                        <option value="Roboto Slab">Roboto Slab</option>
                                        <option value="Faculty Glyphic">Faculty Glyphic</option>
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
                                    <input type="button" title="Left-align, no indenting" onclick="setTextFormat(1)" class="format-button icon" style="background-image: url('${index?"":"../"}assets/icon-paragraph-style-left-no-indent.png')">
                                    <input type="button" title="Justified, no indenting" onclick="setTextFormat(2)" class="format-button icon" style="background-image: url('${index?"":"../"}assets/icon-paragraph-style-justify-no-indent.png')">
                                    <input type="button" title="Left-align, indent sibling paragraphs" onclick="setTextFormat(3)" class="format-button icon" style="background-image: url('${index?"":"../"}assets/icon-paragraph-style-left-indent.png')">
                                    <input type="button" title="Justified, indent sibling paragraphs" onclick="setTextFormat(4)" class="format-button icon" style="background-image: url('${index?"":"../"}assets/icon-paragraph-style-justify-indent.png')">
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
                    <footer class="article-footer space-between">
                        <div class="column">
                            <div class="see-also"></div>
                            <div class="citations"></div>
                        </div>
                        <div style="white-space: nowrap;"><a href="index.html">Link to full page index</a></div>
                    </footer>
                </main>
                <aside id="right"></aside>
            </div>
            <footer class="page-bottom">This is <a title="https://github.com/perennialiris" href="https://github.com/perennialiris">my personal repo</a>. I have no association with any other person or organization. This “website” runs entirely on client-side JavaScript, meaning there is no server software and if saved locally it all runs identically to how it does online. I don’t care if you copy any aspect of how I set this up (the code base), though I reserve all rights to my writing. To contact me for takedown requests or anything else, email perennialforces@gmail.com.</footer>
            <div class="lightbox-wrapper" onclick="setLightbox('close')"><img id="lightbox"></div>
        </div>`;
    interpreter(document.querySelector(".main-content"));

    alignTable(data, "|");
    const pageList = { recent: [], pins: [], full: [] };

    let includeToc = false;
    let isPinned = false;
    let isCurrentPage = false;
    let repoTable = false;
    let pageTitle = "";
    const dataRows = data.split("\n");
    const otherLists = [];
    for (let i = 0; i < dataRows.length; i += 1) {
        const cells = dataRows[i].split("|").map(cell => cell.trim());
        const rowDir  = cells[0],
        rowTitle      = cells[1],
        rowCategory   = cells[2],
        rowDate       = cells[3],
        rowFlags      = cells[4].split(" ");
        
        isPinned = rowFlags.includes("pinned");
        isCurrentPage = (rowDir == thisDir);
        
        if (isCurrentPage) {
            includeToc = rowFlags.includes("toc");
            pageTitle = rowTitle;
            repoTable = rowFlags.includes("repo-table");
            if (repoTable) {
                pageWrapper.classList.add("repo-table");
            }
            if (rowFlags.includes("wide")) { pageWrapper.classList.add("wide"); }
            if (rowFlags.includes("narrow")) { pageWrapper.classList.add("narrow"); }
            }
        else if (rowFlags.includes("repo-table")) {
            otherLists.push(`<a href="../${rowDir}/index.html">${rowTitle}</a>`);
        }
        if (rowFlags.includes("unlisted")) { continue; }

        /* ---- for recent in sidenav ---- */
        if (pageList.recent.length < 9) {
            pageList.recent.push(`<div class="${isCurrentPage? "nav-row selected" : "nav-row"}"><a href="../${rowDir}/index.html">${rowTitle}</a></div>`);
        }

        /* ---- for index.html ---- */
        let fullEntry = isPinned
            ? `<a class="pinned" href="${rowDir}/index.html">${rowTitle}</a>`
            : `<a href="${rowDir}/index.html">${rowTitle}</a>`;
        
        if (rowDate || rowCategory) {
            fullEntry += " &ndash;";
            if (rowCategory != "") {
                fullEntry += ` <span>${rowCategory}</span>`;
            }
            if (rowDate != "") {
                fullEntry += ` <span>(${rowDate})</span>`;
            }
        }
        fullEntry = "<li>" + fullEntry + "</li>";
        
        if (isPinned) { pageList.full.unshift(fullEntry); }
        else { pageList.full.push(fullEntry); }
    }
    
    if (index) {
        document.querySelector(".page-name-display").innerHTML = `Iris’s documents`;
        document.getElementById("index-aKxOoclwfz").innerHTML = pageList.full.join("");
    }
    else {
        document.querySelector(".page-name-display").innerHTML = `<a href="../index.html">Index</a> <span style="font-family: 'Arial',sans-serif; font-weight: 700; margin-inline: 2px;">&rarr;</span> <a href="">${pageTitle}</a>`;
        const right = document.getElementById("right");

        if (repoTable) {
            right.classList.add("hidden");
            const mcont = document.querySelector(".main-container");
            const n2 = mcont.parentNode.insertBefore(document.createElement("div"), mcont);
            n2.classList.add("other-lists");
            n2.innerHTML = `<div>Other lists:</div><div class="container">${otherLists.join("")}</div>`;
            }
        else if (!includeToc) {
            right.style.maxHeight = "1500px";
            right.innerHTML = `
            <div style="position: sticky; top: calc(1em + var(--main-nav-height));">
                <nav class="recently-added">
                    <h2>Pages recently added:</h2>
                    <hr>
                    ${pageList.recent.join("")}
                </nav>
                <nav>
                    <hr>
                    <div class="plug"><a href="https://bsky.app/profile/perennialiris.bsky.social">follow me on bluesky</a></div>
                    <div class="plug"><a href="https://youtube.com/@perennialiris">check out my youtube</a></div>
                    <div class="plug"><a href="https://perennialiris.tumblr.com">still use tumblr? me too</a></div>
                    <div class="plug"><a href="https://discord.com/invite/puJEP8HKk3">discord server invite</a></div>
                </nav>
            </div>`;
        }
        else if (includeToc) {
            console.log("creating table of contents...");

            const toc = right.appendChild(document.createElement("nav"));
            toc.classList.add("table-of-contents");

            const headings = Array.from(document.getElementsByClassName("article-heading")).slice(1);
            toc.innerHTML = `<div class="toc-title-box space-between"><h2>Table of contents</h2><input type="button" value="hide" class="hide-toc-button" onclick="toggleToc()"></div><a class="toc-row h1" onclick="window.scrollTo({ top: 0, behavior: 'smooth' });" style="cursor: pointer;">(Top of page)</a><div class="scroller">${headings.map(h => `<a class="toc-row ${h.tagName.toLowerCase()}" href="#${h.id}">${h.innerHTML.replace(/\/?i>/g, "")}</a>`).join("")}</div>`;

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
    
    console.log(articleLinks)
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
                            (i[1] == 1) ? `<a style="font-family: monospace" href="#cite-${n + 1}">[^]</a>` : ` <a href="#cite-${i[1] + "-" + j++}">^</a>`.repeat(i[1] )
                        } <a target="_blank" id="cite-${n + 1}" href="${i[0]}">${i[0]}</a></li>`})
                    .join("")
            }</ol>
        </div>`;
    }

    if (document.title == "") document.title = "Perennial Iris";
    else if (document.title.slice(0 - "Perennial Iris".length) != "Perennial Iris") document.title += " - Perennial Iris";
    
}

window.addEventListener("load", pageLoad);

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
    if (bodyFont != "Georgia") { css.innerHTML += " p .digit, li .digit, blockquote .digit, h4 .digit, .main-content ol > li::marker { font-family: inherit; }"; }

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






