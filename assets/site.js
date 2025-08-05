
"use strict"

window.addEventListener("load", function() {
    setBrightness(localStorage.getItem("brightness"));
    
    document.body.innerHTML =
    `<header id="header"></header>
    <nav class="nav-wrapper">
        <div id="nav">
            <div>
                <div id="page-name-display"><div><a href="../index.html">Index</a> &#47; ${ document.title || "This Page" }</div></div>
            </div>
            <div>
                <div id="to-top-button">Jump to Top</div>
                <button id="menu-button" class="icon""></button>
                <div id="menu" class="hidden">
                    <div class="menu-row">
                        <span>Brightness:</span>
                        <div>
                            <select class="menu-select" id="brightness-menu">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="darker">Darker</option>
                            </select>
                        <div>
                    </div>
                </div><!-- #menu -->
            </div>
        </div>
    </nav>
    <div id="c1">
        <div id="c2">
            <div id="article">${ document.body.innerHTML }</div>
            <footer id="article-footer"></footer>
        </div>
    </div>
    <div class="page-bottom"></div>
    <div id="lightbox-wrapper"><img id="lightbox"></div>`;
    
    interpreter(document.getElementById("article"));

    document.getElementById("lightbox-wrapper").addEventListener("click", setLightbox("close"));
    const menu = document.getElementById("menu");
    const menuButton = document.getElementById("menu-button");
    function menuToggle(option) {
        if (option == "close") {
            menu.classList.add("hidden");
        }
        else if (option == "open") {
            menu.classList.remove("hidden");
        }
        else if (menu.classList.contains("hidden")) {
            menuToggle("open");
        } else {
            menuToggle("close");
        }
    }
    menuButton.addEventListener("click", menuToggle);
    document.addEventListener("click", function(e) {
        if (!menu.contains(e.target) && !menuButton.contains(e.target)) {
            menuToggle("close");
        }
    });

    let brightnessMenu = document.getElementById("brightness-menu");
    brightnessMenu.addEventListener("change", () => {
        setBrightness(brightnessMenu.value);
    });
    let brightness = localStorage.getItem("brightness");
    document.getElementById("brightness-menu").value = (brightness == "dark") ? "dark" : (brightness == "darker") ? "darker" : "light";

    /* add "digit" class to numbers in article: */
    ["p", "li"].forEach(tagName => Array.from(document.getElementById("article").getElementsByTagName(tagName)).forEach(ele => wrapDigits(ele)) );
    
    if (document.body.classList.contains("toc")) {
        const toc = document.getElementById("c1").insertBefore(document.createElement("nav"), document.getElementById("c2"));
        toc.id = "toc";
        const headings = Array.from(document.getElementById("article").getElementsByClassName("toc-include"));
        toc.innerHTML = `<a class="toc-row" href="#">(Top)</a>` + headings.slice(1).map ( heading => `<a class="toc-row ${heading.tagName.toLowerCase()}" href="#${ heading.id }">${ heading.innerHTML.replace(/\/?i>/g, "") }</a>` ).join("");

        const rowsInToc = Array.from(toc.getElementsByClassName("toc-row"));
        let lastHeading = -1;
        let canTocHighlighter = true;
        function tocHighlighter() {
            if (!canTocHighlighter) { return; }
            canTocHighlighter = false;
            setTimeout(() => { canTocHighlighter = true; tocHighlighter(); }, 200);
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
        let canTocWidthCheck = true;
        function tocWidthCheck() {
            if (!canTocWidthCheck) { return; }
            canTocWidthCheck = false;
            setTimeout(() => { canTocWidthCheck = true; tocWidthCheck(); }, 300);
            toc.style.display = (parseInt(window.innerWidth) > 840) ? "block" : "none";
        }
        window.addEventListener("resize", tocWidthCheck);
        window.addEventListener("scroll", tocHighlighter);
        setTimeout(() => { tocWidthCheck(); tocHighlighter(); }, 100);
        function scrollerHandler() {
            if (toc.scrollHeight == toc.offsetHeight || toc.scrollHeight - toc.scrollTop <= toc.clientHeight + 20) {
                toc.classList.add("hide-mask");
            }
            else {
                toc.classList.remove("hide-mask");
            }
        }
        toc.addEventListener("scroll", scrollerHandler);
        toc.addEventListener("resize", scrollerHandler);
        scrollerHandler();
        document.getElementById("to-top-button").addEventListener("click", () => {
            toc.scrollTo({ behavior: 'smooth', top: 0 });
            window.scrollTo({ behavior: 'smooth', top: 0 });
            history.replaceState(null, '', window.location.pathname + window.location.search);
        });
    }
    else {
        document.getElementById("to-top-button").addEventListener("click", () => {
            toc.scrollTo({ behavior: 'smooth', top: 0 });
            window.scrollTo({ behavior: 'smooth', top: 0 });
            history.replaceState(null, '', window.location.pathname + window.location.search);
        });
    }

    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    window.addEventListener("keydown", function(e) {
        if (e.key === 'Escape') {
            setLightbox("close");
        }
    })
    let canNavStickyCheck = true, mainNav = document.getElementById("nav");
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
})

function setBrightness(setValue) {
    document.body.classList.remove("dark");
    document.body.classList.remove("darker");
    document.body.classList.add(setValue);
    localStorage.setItem("brightness", setValue);
}

function setLightbox(action) {
    let lightbox = document.getElementById("lightbox");
    if (lightbox) {
        if (action == "close") {
            lightbox.src = lightbox.alt = "";
            lightbox.parentNode.style.display = "none";
        }
        else if (typeof action == "object") {
            lightbox.src = action.src;
            lightbox.alt = action.alt;
            lightbox.parentNode.style.display = "flex";
        }
    }
}

function interpreter(targetElement, externalLinks) {
    let input = targetElement.innerHTML
        .replace(/\n\n+/g, "\n\n")
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
            return `<div class="image-span">${ galleryFigures.join("") }</div>`;
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
            return `<div class="image-float">${lines.join("") }</div>`;
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
                
                return `<figure><div><img onclick="setLightbox(this)" src="${ imgUrl }" title="${ altText }" alt="${ altText }"></div>${ figCaption }</figure>`;
            });
            return `<div class="image-grid">${lines.join("") }</div>`;
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
        
        let fine = "";
        if (chunk.startsWith("^")) {
            chunk = chunk.slice(1).trim();
            fine = "fine";
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
            return `<a class="section-link" title="Jump to section" href="#${ displayText.replaceAll(" ", "_") }">${ displayText }</a>`
        });

        /* ------------------------------------- table ------------------------------------- */
        if (chunk.startsWith("||table")) {
            let rows = chunk.split("\n").slice(1);
            for (let row = 0; row < rows.length; row += 1) {
                let cells = rows[row].split("|");
                for (let cell = 0; cell < cells.length; cell += 1) {
                    cells[cell] = `<td class="col-${cell + 1}">${ formatting(cells[cell].trim()) }</td>`;
                }
                rows[row] = `<tr class="row-${row + 1}">${ cells.join("") }</tr>`;
            }
            return `<table class="auto-table auto-table-${tableNum++}"><tbody>${rows.join("")}</tbody></table>`;
        }

        /* ---------------------------------- blockquote ---------------------------------- */
        if (chunk.startsWith("||indent")) {
            const lines = chunk.split("\n").slice(1).map( line => {
                if (line.startsWith("---")) {
                    return `<p class="attribution">${line}</p>`;
                }
                if (line.startsWith("^")) {
                    return `<div class="fine">${line.substring(1)}</div>`;
                }
                return `<p>${line}</p>`;
            })

            return `<blockquote>${ formatting(lines.join("")) }</blockquote>`;
        }

        /* ------------------------------------- lists ------------------------------------- */
        /* Not a perfect handler but whatever it's fine. */
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
            if (fine) {
                list = `<div class="fine">${list}</div>`;
            }
            return list;
        }
        /* ------------------------------------- lists ------------------------------------- */
        /* Not a perfect handler but whatever it's fine. */
        if ( chunk.startsWith("-- ")) {
            const lines = chunk.split("\n").map( line => {
                if (line.startsWith("-- ")) {
                    line = line.substring(3).trim();
                }
                return `<li>${ formatting(line) }</li>`;
            })
            return `<ul class="condensed">${ lines.join("") }</ul>`;
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
            document.getElementById("article-footer").appendChild(document.createElement("div")).innerHTML
                = "<div class='see-also'><div>This content was also posted here:</div>" + chunk.split("\n").slice(1)
                    .map( line => {
                        const url = line
                            .replace(/substack\|(\w+)/, "https://northofqueen.substack.com/p/$1")
                            .replace(/tumblr\|(\d+)/, "https://perennialiris.tumblr.com/post/$1");
                        return `<div><a href="${ url }" target="_blank">${ url }</a></div>`;
                    }).join("") + "</div>";
            return;
        }

        /* ------------------------ finalizing (normal paragraphs) ------------------------ */
        
        chunk = formatting(chunk);
        
        if (fine) {
            return `<div class='fine'>${ chunk.replaceAll("\n", "<br>") }</div>`;
        }
        if (firstParagraph) {
            firstParagraph = false;
            return `<p class='first-paragraph'>${ chunk }</p>`;
        }
        
        return `<p>${ chunk }</p>`;
    })
    
    targetElement.innerHTML = input.join("");
}

function rplcb(x) {
    if (x == "") { return x; }
    
    /* escaped symbols */
    return x.replaceAll("\\(", "&lpar;")
        .replaceAll("\\)", "&rpar;")
        .replaceAll("\\[", "&lbrack;")
        .replaceAll("\\]", "&rbrack;")
        .replaceAll("\\", "&#92;")
        .replaceAll("\\*", "&ast;")
        .replaceAll("\\^", "&Hat;")
        .replace(/(^| )"(\w)/g, "$1&ldquo;$2")
        .replaceAll('"', "&rdquo;")
        .replace(/(^| )'(\w)/g, "$1&lsquo;$2")
        .replaceAll("'", "&rsquo;")
        .replaceAll("---", "<span class='mdash'>&mdash;</span>")
        .replaceAll("--", "&ndash;")
}

function formatting(input) {
    input = input.trim();
    if (input == "") { return input; }
    
    input = input.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.+?)\*/g, "<i>$1</i>");
    
    let output = "";
    /* first: replacements that shouldn't affect inside of tags */
    while (true) {
        let openTag = input.indexOf("<"), closeTag = input.indexOf(">");
        if (openTag == -1 || closeTag == -1) break;
        output += rplcb(input.substring(0, openTag)) + input.substring(openTag, closeTag + 1);
        input = input.substring(closeTag + 1);
    }
    output += rplcb(input);
    
    return output;
}

function wrapDigits(arg) {
    if (typeof arg != "string") {
        arg.innerHTML = wrapDigits(arg.innerHTML);
    }
    else {
        let k = 0;
        let output = "", left = 0;
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








