
"use strict"

window.addEventListener("load", function() {
    document.body.innerHTML =
    `<header class="main-header">
        <div class="header-gradient">
        </div>
    </header>
    <div class="ribbon"></div>
    <nav class="nav-wrapper">
        <div class="main-nav stretch space-between">
            <div class="align-center">
                <div id="page-name-display"><div><a href="../../index.html">Index</a> &#47; ${ document.title || "This Page" }</div></div>
            </div>
            <div class="align-center">
                <div id="to-top-button">Jump to Top</div>
                <button class="hamburger icon"></button>
            </div>
        </div>
    </nav>
    <div class="m1 center">
        <div class="m2">
            <div class="menu hidden">
                <table>
                    <tr><td>Brightness:</td>
                        <td>
                            <select class="menu-select" id="brightness-select">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="darker">Darker</option>
                            </select>
                    </td></tr>
                    <tr><td>Body font:</td>
                        <td>
                            <select class="menu-select" id="bodyfont-select">
                                <option value="Georgia">Georgia</option>
                                <option value="Palatino Linotype">Palatino Linotype</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Segoe UI">Segoe UI</option>
                            </select>
                    </td></tr>
                    <tr><td colspan="2">
                            <span class="no-select" style="font-style: italic; color: var(--grey-8);">
                                <span>These options are saved in session storage, not cookies, so they'll be discarded when your close your browser.</span>
                            </span>
                    </td></tr>
                </table>
            </div>
        </div>
    </div>
    <div class="c1 align-start">
        <div class="c2">
            <div id="article">${ document.body.innerHTML }</div>
            <footer class="article-footer">
                <div class="align-center">
                    <img style="margin-right: 10px; border: 1px solid var(--grey-a);" src="../../assets/grandchamp.png" width="100" height"100">
                    <div>
                        <div style="color: var(--grey-5); font-family: var(--ff-article);">@perennialiris</div>
                        <div class="plugs">
                            <a href="https://github.com/perennialiris/perennialiris.github.io">This Repo</a> |
                            <a href="https://bsky.app/profile/perennialiris.bsky.social">Bluesky</a> |
                            <a href="https://perennialiris.tumblr.com/">Tumblr</a> |
                            <a href="https://www.youtube.com/channel/UCXadODjAtT72eYW6xCGyuUA">YouTube</a> |
                            <a href="https://discord.gg/fGdV7x5dk2">Discord</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
    <div class="page-bottom"></div>
    <div class="lb-container stretch column space-between">
        <div id="lb-top-left"></div>
        <div class="lb-wrapper center align-center"><img id="lightbox"></div>
        <div class="lb-bottom-panel center align-center"><div id="lb-caption"></div></div>
    </div>
    <style id="style-pref"></style>`;

    setBrightness();
    setBodyFont();
    
    const article_ = document.getElementById("article");
    interpreter(article_);
    
    Array.from(article_.getElementsByTagName("p")).forEach(e => wrapDigits(e));
    Array.from(article_.getElementsByTagName("li")).forEach(e => wrapDigits(e));
    
    document.querySelector(".lb-container").addEventListener("click", () => { setLightbox("close") });
    
    /* ---------------------- setting up menu: ---------------------- */
    
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");
    
    function menuToggle(option) {
        if (option == "open")
            menu.classList.remove("hidden")
        else if (option == "close")
            menu.classList.add("hidden")
        else {
            if (menu.classList.contains("hidden")) {
                menu.classList.remove("hidden");
            } else {
                menu.classList.add("hidden");
            }
        }
    }
    hamburger.addEventListener("click", menuToggle);
    window.addEventListener("click", function(e) {
        if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
            menuToggle("close");
        }
    });
    window.addEventListener("keydown", function(e) {
        if (e.key === 'Escape') {
            setLightbox("close");
            menuToggle("close");
        }
    })
    
    /* ---------------------- setting up preferences: ---------------------- */
    let brightnessSelect = document.getElementById("brightness-select");
    brightnessSelect.addEventListener("change", function() {
        setBrightness(brightnessSelect.value);
    });
    let bodyfontSelect = document.getElementById("bodyfont-select");
    bodyfontSelect.addEventListener("change", function() {
        setBodyFont(bodyfontSelect.value);
    });
    
    /* ---- ---- ---- ---- ---- ---- ---- table of contents ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    if (document.body.classList.contains("toc")) {
        const toc = document.querySelector(".c1").insertBefore(document.createElement("nav"), document.querySelector(".c2"));
        toc.id = "toc";
        const headings = Array.from(document.getElementById("article").getElementsByClassName("toc-include"));
        toc.innerHTML = `<a class="toc-row" href="#">(Top)</a>` + headings.slice(1).map ( heading => `<a class="toc-row ${heading.tagName.toLowerCase()}" href="#${ heading.id }">${ heading.innerHTML.replace(/\/?i>/g, "") }</a>` ).join("");

        const rowsInToc = Array.from(toc.getElementsByClassName("toc-row"));
        let lastHeading = -1;
        
        let canTocUpdate = true;
        function tocUpdateAttempt() {
            if (!canTocUpdate) { return; }
            canTocUpdate = false;
            setTimeout(() => {
                canTocUpdate = true;
                tocUpdate();
            }, 500);
            tocUpdate();
        }
        function tocUpdate() {
            let currentHeading = -1;
            for (let i = 0; i < headings.length; i += 1) {
                if (pageYOffset > headings[i].offsetTop - (0.5 * window.innerHeight)) {
                    currentHeading = i;
                }
                else {
                    break;
                }
            }
            if (currentHeading != lastHeading) {
                rowsInToc.forEach( (row, n) => {
                    if (n == currentHeading) {
                        row.classList.add("active-heading");
                        let rRect = row.getBoundingClientRect();
                        let tRect = toc.getBoundingClientRect();
                        if (rRect.bottom > tRect.bottom) {
                            toc.scrollTo(
                                { top: row.offsetTop + row.offsetHeight - toc.clientHeight, behavior: "smooth" }
                            );
                        } else if (rRect.top < tRect.top) {
                            toc.scrollTo(
                                { top: row.offsetTop, behavior: "smooth" }
                            );
                        }
                    }
                    else {
                        row.classList.remove("active-heading");
                    }
                })
            }
            lastHeading = currentHeading;
        }
        let tocWidth = window.getComputedStyle(toc).getPropertyValue("max-width").replace(/\D/g,"");
        let articleWidth = window.getComputedStyle(article_).getPropertyValue("max-width").replace(/\D/g, "");
        let pageCheckWidth = parseInt(tocWidth) + parseInt(articleWidth) - 100;
        
        let canTocCheck = true;
        function tocCheckAttempt() {
            if (!canTocCheck) { return; }
            canTocCheck = false;
            setTimeout(() => {
                canTocCheck = true;
                tocCheck();
            }, 500);
            tocCheck();
        }
        function tocCheck() {
            document.body.classList.toggle("toc", parseInt(window.innerWidth) > pageCheckWidth);
        }
        window.addEventListener("resize", tocCheckAttempt);
        window.addEventListener("scroll", tocUpdateAttempt);
        setTimeout(() => { tocCheckAttempt(); tocUpdateAttempt(); }, 100);
        document.getElementById("to-top-button").addEventListener("click", () => {
            toc.scrollTo({ behavior: 'smooth', top: 0 });
            window.scrollTo({ behavior: 'smooth', top: 0 });
            history.replaceState(null, '', window.location.pathname + window.location.search);
        });
    }
    else {
        document.getElementById("to-top-button").addEventListener("click", () => {
            window.scrollTo({ behavior: 'smooth', top: 0 });
            history.replaceState(null, '', window.location.pathname + window.location.search);
        });
    }

    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    let canNavStickyCheck = true, mainNav = document.querySelector(".main-nav");
    function navStickyCheck() {
        if (!canNavStickyCheck || !mainNav) { return; }
        canNavStickyCheck = false;
        setTimeout(() => { canNavStickyCheck = true; navStickyCheck() }, 500);
        if (pageYOffset > 180) {
            mainNav.classList.add("sticky-active");
        }
        else {
            mainNav.classList.remove("sticky-active");
        }
    }
    navStickyCheck();
    window.addEventListener("scroll", navStickyCheck);
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */

    if (document.title == "") {
        document.title = "Perennial Iris";
    }
    
    document.body.classList.add("layout");
})

function setLightbox(action) {
    let lightbox = document.getElementById("lightbox");
    let lbTopLeft = document.getElementById("lb-top-left");
    let lbCaption = document.getElementById("lb-caption");
    
    if (action == "close") {
        lightbox.src = "";
        lightbox.alt = "";
        document.body.classList.remove("lightbox");
    }
    else {
        lightbox.src = action.src;
        lightbox.alt = action.alt;
        document.body.classList.add("lightbox");
        
        lbTopLeft.innerHTML = `<a href="${ action.src }">${ action.src.split("/").slice(-1) }</a>`;
        if (action.alt == "") {
            lbCaption.innerHTML = "";
        } else {
            lbCaption.innerHTML = action.alt;
        }
    }
}

/* -------------------------------- menu preference setters -------------------------------- */
function setBrightness(brightness) {
    if (brightness == "" || brightness == null) { brightness = localStorage.getItem("brightness"); }
    let select_ = document.getElementById("brightness-select");
    let options_ = Array.from(select_.getElementsByTagName("option")).map(o => o.value);
    if (!options_.includes(brightness)) {
        brightness = options_[0];
    }
    options_ = options_.filter(o => o != brightness);
    document.body.classList.remove(...options_);
    document.body.classList.add(brightness.replace(/ /g, "-"));
    select_.value = brightness;
    localStorage.setItem("brightness", brightness);
}
function setBodyFont(bodyFont) {
    if (bodyFont == "" || bodyFont == null) { bodyFont = localStorage.getItem("bodyFont"); }
    let select_ = document.getElementById("bodyfont-select");
    let fonts_ = Array.from(select_.getElementsByTagName("option")).map(o => o.value);
    if (!fonts_.includes(bodyFont)) {
        bodyFont = fonts_[0];
    }
    document.getElementById("style-pref").innerHTML = "";
    if (bodyFont != "Georgia") {
        document.getElementById("style-pref").innerHTML = ` #article { font-family: ${ bodyFont },var(--ff-article); } #article h4 { font-family: ${ bodyFont },var(--ff-h4); } #article ol > li::marker, #article .digit { font-family: ${ bodyFont },var(--ff-digit); } `;
    }
    select_.value = bodyFont;
    localStorage.setItem("bodyFont", bodyFont);
}

/* ------------------------------- main interpreter for article content ------------------------------- */
function interpreter(argValue) {
    if (argValue instanceof Node) {
        argValue.innerHTML = interpreter(argValue.innerHTML);
        return;
    }
    let input = argValue.replace(/\n\n+/g, "\n\n")
        .replace(/\r/g, "") /* for safety, probably no effect */
        .trim()
        .split("\n\n");

    let tableNum = 1;
    let galleryNum = 1;
    let linkNum = 1;
    let firstParagraph = true;
    
    input = input.map( chunk => {
    
        if (chunk.startsWith("\\")) {
            return chunk.slice(1);
        }
        if (chunk == "---") {
            return "<hr>";
        }

        /* ------------------------------------ images ------------------------------------ */
        if (chunk.startsWith("||image-span")) {
            /* ||image-span maxHeight */
            /* imgUrl | alt-text/title */
            const rows = chunk.split("\n");
            let homeRow = rows.shift().substring("||image-span".length).trim();
            const galleryFigures = chunk.split("\n").slice(1).map( line => {
                const parts = line.split("|");
                while (parts.length < 2) {
                    parts.push("");
                }
                let imgUrl = "media/" + parts[0].trim();
                let altText = formatting(parts[1].trim().replace(/"/g,"&quot;"));
                return `<div><img style="max-height: ${homeRow || 300}px;" onclick="setLightbox(this)" src="${ imgUrl }" title="${ altText }" alt="${ altText }"></div>`;
            });
            return `<div class="image-span align-center space-evenly">${ galleryFigures.join("") }</div>`;
        }
        
        if (chunk.startsWith("||image-float")) {
            /* imgUrl | caption | alt-text/title */
            const lines = chunk.split("\n").slice(1).map( line => {
                const parts = line.split("|");
                while (parts.length < 3) {
                    parts.push("");
                }
                const imgUrl = "media/" + parts[0].trim();
                let figCaption = formatting(parts[1].trim());
                let altText = formatting(parts[2].trim().replace(/"/g,"&quot;"));
                if (figCaption) { figCaption = `<figcaption>${ figCaption }</figcaption>`; }
                
                return `<figure><img onclick="setLightbox(this)" src="${ imgUrl }" title="${ altText }" alt="${ altText }">${ figCaption }</figure>`;
            });
            return `<div class="image-float column">${ lines.join("") }</div>`;
        }
        
        if (chunk.startsWith("||image-grid")) {
            /* ||image-grid gridWidth */
            /* imgUrl | alt-text/title */
            const rows = chunk.split("\n");
            let homeRow = rows.shift().substring("||image-span".length).trim();
            const lines = chunk.split("\n").slice(1).map( line => {
                const parts = line.split("|");
                while (parts.length < 3) {
                    parts.push("");
                }
                const imgUrl = "media/" + parts[0].trim();
                let figCaption = formatting(parts[1].trim());
                let altText = formatting(parts[2].trim().replace(/"/g,"&quot;"));
                if (figCaption) { figCaption = `<figcaption>${ figCaption }</figcaption>`; }
                
                return `<figure><div class="center align-center"><img onclick="setLightbox(this)" src="${ imgUrl }" title="${ altText }" alt="${ altText }"></div>${ figCaption }</figure>`;
            });
            return `<div class="image-grid space-evenly">${ lines.join("") }</div>`;
        }
        
        /* ------------------------------------ video ------------------------------------ */
        if (chunk.startsWith("||video")) {
            let data = chunk.split("\n").slice(1)[0].split("|").map(c => c.trim());
            let fileUrl = data[0];
            let dot = fileUrl.indexOf(".");
            if (dot == -1) {
                return;
            }
            let fileType = fileUrl.substring(dot + 1);
            let maxHeight = (data.length == 2) ? data[1] : 300;
            return `<div class="auto-video"><video controls height="${maxHeight}"><source src="media/${fileUrl}" type="video/${fileType}"></video></div>`;
        }

        /* ------------------------------------- code ------------------------------------- */
        if (chunk.startsWith("||codeblock")) {
            return `<div class="codeblock">${ chunk.split("\n").slice(1).join("<br>") }</div>`;
        }
        
        chunk = chunk.replace(/`(.+?)`/g, (match, captured) => {
            return `<code>${
                captured.replaceAll("\"", "&quot;")
                    .replaceAll("'", "&apos;")
                    .replaceAll("-", "&hyphen;")
                    .replaceAll("(", "&lpar;")
                    .replaceAll(")", "&rpar;")
                    .replaceAll("[", "&lbrack;")
                    .replaceAll("]", "&rbrack;")
                    .replaceAll("*", "&ast;")
                    .replaceAll("\n", "<br>") }</code>`;
        });
        
        
        let pStyle = [];
        
        if (chunk.startsWith("^")) {
            chunk = chunk.slice(1);
            pStyle.push("small");
        } else if (firstParagraph) {
            pStyle.push("first-paragraph")
        }
        
        if (chunk.startsWith("$")) {
            chunk = chunk.slice(1);
            pStyle.push("drop-cap");
        }
        
        /* ------------------------------------- links ------------------------------------- */
        /*  \[(  [^\]]*  )[^\\]?\]\((  [^\s]+?[^\\]  )\)
            [text to be displayed](https://perennialiris.github.io/)
        */
        chunk = chunk.replace(/\[([^\]]*)[^\\]?\]\(([^\s]+?[^\\])\)/g, (match, displayText, address) => {
            address = address.replaceAll("\\)", ")");
            
            let a;
            if (!address.startsWith("http")) {
                if (displayText == "") {
                    a = `<a class="internal" href="${ address }>[internal]</a>`;
                }
                else {
                    a = `<a class="internal" href=${ address }>${ displayText }</a>`
                }
            }
            else {
                if (displayText == "") {
                    a = `<sup><a href="${ address }" class="citeref">[${ linkNum }]</a></sup>`;
                }
                else {
                    a = `<a href="${ address }">${ displayText }</a>`;
                }
            }
            
            linkNum += 1;
            return a;
        });
        
        /* link to section on this page: */
        chunk = chunk.replace(/\[\[(.+?)\]\]/g, (match, displayText) => {
            return `<a class="internal section-link" title="Jump to section" href="#${ displayText.replaceAll(" ", "_") }">${ displayText }</a>`
        });

        /* ------------------------------------- table ------------------------------------- */
        if (chunk.startsWith("||table")) {
            let rows = chunk.split("\n");
            let homeRow = rows.shift().substring("||table".length).trim();
            let tableWidth = 1;
            for (let row = 0; row < rows.length; row += 1) {
                let cells = rows[row].split("|");
                for (let cell = 0; cell < cells.length; cell += 1) {
                    cells[cell] = `<td class="col-${cell + 1}">${ formatting(cells[cell].trim()) }</td>`;
                    if (cell + 1 > tableWidth) { tableWidth = cell + 1; }
                }
                rows[row] = `<tr class="row-${row + 1}">${ cells.join("") }</tr>`;
            }
            return `<table class="auto-table auto-table-${tableNum++}">${ (homeRow.length > 0) ? `<thead><th colspan=${ tableWidth }>${ homeRow }</th></thead>` : "" }<tbody>${rows.join("")}</tbody></table>`;
        }

        /* ---------------------------------- blockquote ---------------------------------- */
        if (chunk.startsWith("||indent")) {
            const lines = chunk.split("\n").slice(1).map( line => {
                if (line.startsWith("---")) {
                    return `<p class="attribution">${line}</p>`;
                }
                if (line.startsWith("^")) {
                    return `<div class="small">${ line.substring(1) }</div>`;
                }
                return `<p>${line}</p>`;
            })

            return `<blockquote>${ formatting(lines.join("")) }</blockquote>`;
        }

        /* ------------------------------------- lists ------------------------------------- */
        /* Not a perfect handler but whatever it'll do. */
        if ( chunk.startsWith("* ") || /^\d+\. /.test(chunk) ) {
            
            const listTag = chunk.startsWith("* ") ? "ul" : "ol";
            let startNumber = "";
            if (listTag == "ol") {
                startNumber = chunk.slice(0, chunk.indexOf(" ") - 1);
            }
            const lines = chunk.split("\n").map( line => {
                let li_ = "<li";

                if (line.startsWith("* ")) {
                    line = line.substring(1).trim();
                }
                else if (/^\d+\. /.test(line)) {
                    li_ += ` value="${line.slice(0, line.indexOf(" ") - 1)}"`;
                    line = line.slice(line.indexOf(" ")).trim();
                }
                else {
                    li_ += ` class="no-marker"`;
                }
                return li_ + `>${formatting(line)}</li>`;
            })
            let list = `<${listTag} class="auto-list"`;
            if (startNumber) {
                list += ` start="${startNumber}"`;
            }
            list += `>${lines.join("")}</${listTag}>`;
            if (pStyle.includes("small")) {
                list = `<div class="small">${ list }</div>`;
            }
            return list;
        }
        
        if ( chunk.startsWith("-- ")) {
            return `<ul class="auto-list short">${ chunk.split("\n").map(li => `<li>${ li.substring(2).trim() }</li>`).join("") }</ul>`;
        }
        
        /* ----------------------------------- headings ----------------------------------- */
        if (/^\#{1,4} /.test(chunk)) {
            const headingTag = "h" + chunk.indexOf(" ");
            chunk = chunk.slice(chunk.indexOf(" ") + 1);
            const headingId = chunk.replaceAll(" ", "_").replaceAll("---", "&mdash;").replaceAll("--", "&ndash;").replaceAll("*" ,"");
            const headingClass = (headingTag == "h4") ? "heading" : "heading toc-include";
            return `<${headingTag} id="${headingId}" class="${headingClass}">${ formatting(chunk) }</${headingTag}>`;
        }

        /* ----------------------------------- see also ----------------------------------- */
        if (chunk.startsWith("||see-also")) {
            document.querySelector(".article-footer").appendChild(document.createElement("div")).innerHTML
                = "<div class='see-also'><div>This content was also posted here:</div>" + chunk.split("\n").slice(1)
                    .map( line => {
                        const url = line
                            .replace(/substack\|(\w+)/, "https://perennialiris.substack.com/p/$1")
                            .replace(/tumblr\|(\d+)/, "https://perennialiris.tumblr.com/post/$1");
                        return `<div><a href="${ url }" target="_blank">${ url }</a></div>`;
                    }).join("") + "</div>";
            return;
        }

        /* ------------------------ finalizing (normal paragraphs) ------------------------ */
        
        chunk = formatting(chunk);
        
        if (pStyle.includes("small")) {
            chunk = chunk.replaceAll("\n", "<br>");
        }
        
        if (pStyle.length > 0) {
            return `<p class="${ pStyle.join(' ') }">${ chunk }</p>`;
        }
        return `<p>${ chunk }</p>`;
    })
    
    return input.join("");
}

function formatting(input_string) {
    input_string = input_string.trim();
    if (input_string == "") { return input_string; }
    
    let output = "";
    
    /* first: replacements that shouldn't affect inside of tags */
    let left = 0;
    let k = 0;
    while (true) {
        /* the logic here is funky because it makes curly quotes easier (see wrapDigits for alternative logic) */
        let openTag = input_string.indexOf("<"),
            closeTag = openTag + input_string.substring(openTag).indexOf(">");
        if (openTag == -1 || closeTag == -1) { break; }
        output += rplc(input_string.substring(0, openTag + 1)) + input_string.substring(openTag + 1, closeTag);
        input_string = input_string.substring(closeTag);
        
        if (k++ > 50) { break; }
            // prevent recursion while testing
    }
    
    return (output + rplc(input_string)).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>");
}

function rplc(input_string) {
    if (input_string == "") { return input_string; }
    /* escaped symbols */
    input_string = input_string.replaceAll("\\*", "&ast;")
        .replaceAll("\\(", "&lpar;")
        .replaceAll("\\)", "&rpar;")
        .replaceAll("\\[", "&lbrack;")
        .replaceAll("\\]", "&rbrack;")
        .replaceAll("\\", "&#92;")
        .replaceAll("\\^", "&Hat;");

    /* curly quotes: */
    if (input_string.indexOf("'") != -1 || input_string.indexOf("\"") != -1) {
        input_string = input_string
            .replaceAll(/ '(\d{2}\D)/g, " &rsquo;$1")
            .replaceAll(/(^| |\()'/g, "$1&lsquo;")
            .replaceAll(/(\*|>|-)'(\w)/g, "$1&lsquo;$2")
            .replaceAll(/'/g, "&rsquo;")

            .replaceAll(/(^| |\()"/g, "$1&ldquo;")
            .replaceAll(/(\*|>|-)"(\w)/g, "$1&ldquo;$2")
            .replaceAll(/"/g, "&rdquo;");
    }
    /* dashes */
    input_string = input_string.replaceAll("---", "<span class='mdash'>&mdash;</span>")
        .replaceAll("--", "&ndash;");
    
    return input_string;
}

function wrapDigits(arg) {
    if (typeof arg != "string") {
        arg.innerHTML = wrapDigits(arg.innerHTML);
    }
    else {
        let k = 0;
        let output = "";
        while (true) {
            const openTag = arg.indexOf("<");
            const closeTag = arg.indexOf(">");
            if (openTag == -1 || closeTag == -1) { break; }
            
            let not_between_tags = arg.substring(0, openTag);
            let between_tags = arg.substring(openTag, closeTag + 1);
            
            output += not_between_tags.replace(/(\d+)/g, "<span class='digit'>$1</span>");
            output += between_tags;
            
            arg = arg.substring(closeTag + 1);
        }
        output += arg.replace(/(\d+)/g, "<span class='digit'>$1</span>");
        return output;
    }
}








