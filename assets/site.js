
"use strict"

/*
    This file is the javascript that creates each page dynamically from the text in the original file.
*/

let pageData =
/*
    .html name  |  Article title  |  date  |  options

    unlisted   : doesn't appear in homepage list or sidebar
    repo-table : hides sidebar, applies different styling, like news lists
    toc        : include table of contents
    pinned     : put at top of homepage page list

    The page still works if you don't include it in this list, but it will be 'unlisted' and have no options or page title
*/
`
2 * US news list                          *            * table pinned
4 * International news list               *            * table pinned
3 * Canadian news list                    *            * table pinned
22 * Normalization and status quo bias     * 2025-04-20 *
21 * Donald Trump                          *            * toc
20 * Israel–Palestine notes                * 2025-02-24 * toc
19 * Pierre Poilievre                      * 2025-03-15 *
18 * Politics fundamentals                 * 2025-01-05 * toc
17 * Why get bottom surgery?               * 2025-02-09 *
16 * Sex, gender, & transsexuals           * 2024-12-29 * toc
15 * Ilhan Omar's comments about Somalia   * 2024-12-23 *
14 * Enduring falsehoods (Warren, Clinton) * 2024-12-19 *
13 * A beauty holding a bird               * 2024-12-17 *
12 * Mark Robinson                         * 2024-12-15 *
11 * The standard relationship model       * 2024-12-08 *
10 * Fetishism & politics                  * 2024-11-14 *
9  * Types of masculinity                  * 2024-11-08 *
8  * My anime reviews                      * 2024-11-02 *
7  * Poor things (2023 film)               * 2024-10-31 *
6  * The trans prison stats argument       * 2024-10-19 *
5  * Every movie I’ve ever seen            *            *
`;

pageData = pageData.split("\n")
    .filter(n => n.trim().length > 3)
    .map(cell => cell.split("*").map(c => c.trim()));

window.addEventListener("load", function() {
    const thisPageDirectory = document.baseURI.split("/").slice(-2)[0]; /* gets name of folder this .html is in */
    const isIndex = document.getElementById("page-list");
    const pathToRoot = (isIndex ? "" : "../");
    document.head.innerHTML += `<link rel="icon" type="image/x-icon" href="${pathToRoot}favicon.ico">`;

    let articleLinks = [];
    const pageList = [];
    const otherTables = [];

    let includeToc = false;
    let isTable = false;
    pageData.forEach(cell => {
        const pageDirectory = cell[0], pageTitle = cell[1], pageDate = cell[2], pageOptions = cell[3];
        if (thisPageDirectory == pageDirectory) {
            document.title = pageTitle;
            includeToc = pageOptions.includes("toc");
            isTable = pageOptions.includes("table");
        }
            else if (pageOptions.includes("table")) {
                otherTables.push(`<a href="../${pageDirectory}/index.html">${pageTitle}</a>`);
            }
        if (!pageOptions.includes("unlisted")) {
            pageList.push(`
                <tr class="row-${pageList.length + 1}">
                    <td class="col-1">
                    <a href="${pageDirectory}/index.html" ${pageOptions.includes("pinned") ? "style='display: inline-flex; align-items: center; gap: 5px;'" : ""}>
                        ${wrapDigits(pageTitle)}${ pageOptions.includes("pinned") ? `<span class="pin-icon"></span>` : "" }
                    </a>
                    </td>
                    <td class="col-2">${ pageDate }</td>
                </tr>`);
        }
    })
    
    if (isTable) {
        document.body.classList.add("table");
    }
    else if (includeToc) {
        document.body.classList.add("toc");
    }
    
    let pageNameDisplay = "";
    if (!isIndex) { pageNameDisplay = `<a href="../index.html">Index</a> : <a href="">${document.title || "Unlisted document"}</a>`; }
    
    document.body.innerHTML =
       `<header id="header">
        </header>
        <nav id="nav">
            <div class="nav-inner">
                <span class="page-name-display">${ pageNameDisplay }</span>
                <a class="to-top-button" href="#">Jump to Top</a>
            </div>
        </nav>
        <div class="c1">
            <div class="c2">
                <div id="article">${ document.getElementById("page").innerHTML }</div>
                <footer id="article-footer">
                    <div class="space-between">
                        <div class="see-also"></div>
                        <div style="white-space: nowrap;"><a href="${pathToRoot}index.html">Link to homepage</a></div>
                    </div>
                </footer>
            </div>
        </div>
        <div class="lightbox-wrapper" onclick="setLightbox('close')"><img id="lightbox"></div>
        `;
    interpreter(document.getElementById("article"), articleLinks);

    if (isIndex) {
        document.getElementById("page-list").innerHTML = pageList.join("");
    }
    else {
        const mainContainer = document.querySelector(".c1");
        
        if (isTable) {
            const otherLists = mainContainer.parentNode.insertBefore(document.createElement("div"), mainContainer);
            otherLists.classList.add("other-lists");
            otherLists.innerHTML = `<div>Other lists:</div><div class="container">${otherTables.join("")}</div>`;
        }
        else if (includeToc) {
            const toc = mainContainer.insertBefore(document.createElement("nav"), mainContainer.firstElementChild);
            toc.id = "toc";
            
            const headings = Array.from(document.getElementsByClassName("side-heading")).slice(1);
            
            toc.innerHTML = `<a class="toc-row h1" href="#">(Top of page)</a>`
                + headings.map ( heading => `<a class="toc-row ${heading.tagName.toLowerCase()}" href="#${ heading.id }">${heading.innerHTML.replace(/\/?i>/g, "")}</a>` )
                .join("");
            
            const rowsInToc = Array.from(toc.getElementsByClassName("toc-row"));
            let currentHeading = "";
            let canTocHighlighter = true;
            function tocHighlighter() {
                if (!canTocHighlighter) {
                    return;
                }
                canTocHighlighter = false;
                setTimeout(() => { canTocHighlighter = true; }, 300);
                let headingId;
                for (let i = 0; i < headings.length; i += 1) {
                    if (pageYOffset > headings[i].offsetTop - window.innerHeight * 0.5) {
                        headingId = headings[i].id;
                    }
                    else {
                        break;
                    }
                }
                if (headingId != currentHeading) {
                for (let i = 0; i < rowsInToc.length; i += 1) {
                    rowsInToc[i].classList.remove("active-heading");
                    if (rowsInToc[i].getAttribute("href") == "#" + headingId) {
                        rowsInToc[i].classList.add("active-heading"); } } }
                currentHeading = headingId;
            }
            function tocWidthCheck() {
                toc.style.display = (parseInt(window.innerWidth) > 620) ? "block" : "none";
            }
            window.addEventListener("resize", tocWidthCheck);
            window.addEventListener("scroll", tocHighlighter);
            setTimeout(() => { tocWidthCheck(); tocHighlighter(); }, 100);
            function scrollerHandler() {
                if (toc.scrollHeight == toc.offsetHeight || toc.scrollHeight - toc.scrollTop <= toc.clientHeight + 20) {
                    toc.classList.add("hide-mask");
                }
                else {
                    toc.classList.remove("hide-mask"); } }
            ["scroll", "resize"].forEach(e => { toc.addEventListener(e, scrollerHandler); });
            scrollerHandler();
        }
    }

    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    window.addEventListener("keydown", function(e) {
        if (e.key === 'Escape') {
            setLightbox("close");
        }
    });
    let canNavStickyCheck = true, mainNav = document.getElementById("nav");
    function navStickyCheck() {
        if (!canNavStickyCheck || !mainNav) { return; }
        canNavStickyCheck = false;
        setTimeout(() => { canNavStickyCheck = true; navStickyCheck() }, 500);
        if (pageYOffset > 180) {
            mainNav.classList.add("sticky-active"); }
        else {
            mainNav.classList.remove("sticky-active"); }
    }
    navStickyCheck();
    window.addEventListener("scroll", navStickyCheck);
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    articleLinks = articleLinks.filter(a => a.url.startsWith("http"));
    if (articleLinks.length > 0) {
        let citations = document.createElement("div");
        citations.classList.add("citations");
        document.getElementById("article-footer").appendChild(citations);
        citations.innerHTML =
        `<div>External pages referenced (this list is auto-generated from links found in the above):</div>
        <ol>
        ${
            articleLinks.map( (link_, n) => {
                let jumpers = `<a href="#cite-${n + 1}">^</a>`;
                for (let i = 2; i < link_.count; i += 1) {
                    jumpers += ` <a href="#cite-${n + 1}-${i}">^</a>`;
                }
                return `<li class="cite-li">${jumpers} <a target="_blank" id="cite-${n + 1}" href="${link_.url}">${link_.url}</a>`
            }).join("")
        }
        </ol>`;
    }

    if (document.title == "") {
        document.title = "Perennial Iris";
    }
    else if (document.title.slice(0 - "Perennial Iris".length) != "Perennial Iris") {
        document.title += " - Perennial Iris";
    }
})

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

function interpreter(targetElement, articleLinks) {
    let input = targetElement.innerHTML
        .replace(/\n\n+/g, "\n\n")
        .replace(/\r/g, "") /* for safety, probably no effect */
        .trim()
        .split("\n\n");

    let tableNum = 1;
    let firstParagraph = true;
    
    input = input.map( chunk => {
    
        if (chunk.startsWith("\\")) {
            return chunk.slice(1);
        }
        if (chunk == "---") {
            return "<hr>";
        }
        if (chunk.startsWith("||date")) {
            return `<p class='date'>${ chunk.split("\n")[1] }</p>`;
        }
        
        let fine = chunk.startsWith("^");
        if (fine) {
            chunk = chunk.slice(1);
        }
        
        /* ------------------------------------ images ------------------------------------ */
        
        if (chunk.startsWith("||image-box")) {
            const lines = chunk.split("\n").slice(1).map( line => {
                const parts = line.split("|");
                while (parts.length < 3) { parts.push(""); }
                let filePath = "media/" + parts[0].trim();
                let altText = parts[1].trim().replace(/"/g, "&quot;").replaceAll("---", "&mdash;").replaceAll("--", "&ndash;");
                let maxHeight = parts[2].trim();
                return `<div><img onclick="setLightbox(this)" style="max-height: ${ maxHeight || 300 }px" src="${ filePath }" title="${ altText }" alt="${ altText }"></div>`;
            });
            return `<figure class="image-box">${ lines.join("") }</figure>`;
        }
        
        if (chunk.startsWith("||image-float")) {
            return chunk.split("\n").slice(1).map( line => {
                const parts = line.split("|");
                while (parts.length < 3) { parts.push(""); }
                
                let filePath = "media/" + parts[0].trim();
                let caption = parts[1].trim();
                let altText = parts[2].trim();
                if (caption != "") { caption = `<figcaption>${caption}</figcaption>`; }
                
                return `<figure class="image-float"><img onclick="setLightbox(this)" src="${filePath}" title="${altText}" alt="${altText}">${caption}</figure>`;
            }).join("");
            
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
                    .replaceAll("\n", "<br>") }</code>
                `;
        });
        
        /* ------------------------------------- links ------------------------------------- */
        /*  \[(  [^\]]*  )[^\\]?\]\((  [^\s]+?[^\\]  )\)
            [text to be displayed](https://perennialiris.github.io/)
        */
        chunk = chunk.replace(/\[([^\]]*)[^\\]?\]\(([^\s]+?[^\\])\)/g, (match, displayText, address) => {
            address = address.replaceAll("\\)", ")");
            
            let index = -1;
            for (let i = 0; i < articleLinks.length; i += 1) {
                if (articleLinks[i].url == address) {
                    index = i; break;
                }
            }
            
            if (index == -1) {
                index = articleLinks.push({ "url": address, "count": 1 }) - 1;
            }
            else {
                articleLinks[index].count += 1;
            }
            
            let id = `cite-${index + 1}`;
            if (articleLinks[index].count > 1) { id += `-${articleLinks[index].count}`; }
            
            return `<a id="${id}" href="${address}" ${displayText ? "" : `class="citeref"`}>${displayText || `[${index + 1}]`}</a>`;
        });
        
        chunk = chunk.replace(/\[\[(.+?)\]\]/g, (match, displayText) => {
            return `<a style="border-bottom: 1px dotted currentcolor;" title="Jump to section" href="#${ displayText.replaceAll(" ", "_") }">${ displayText }</a>`
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
            return `<table class="auto-table table-${tableNum++}"><tbody>${rows.join("")}</tbody></table>`;
        }

        /* ---------------------------------- blockquote ---------------------------------- */
        if (chunk.startsWith("||indent")) {
            const lines = chunk.split("\n").slice(1).map( line => {
                if (line.startsWith("---")) {
                    return `<p class="attribution">${line}</p>`;
                }
                if (line.startsWith("^")) {
                    return `<p class="fine">${line}</p>`;
                }
                return `<p>${line}</p>`;
            })
            
            return `<blockquote>${ formatting(lines.join("")) }</blockquote>`;
        }

        /* ------------------------------------- lists ------------------------------------- */
        /* This isn't a perfect handler but whatever it's fine for my specific purposes. */
        if ( chunk.startsWith("* ") || /^\d+\. /.test(chunk) ) {
            const listType = chunk.startsWith("* ") ? "ul" : "ol";
            const lines = chunk.split("\n").map( line_ => {
                const marginLeft = (Math.floor(line_.search(/[^\s]/) / 2) + 1) * 40;
                line_ = line_.trim();
                let bullet = line_.startsWith("* ");
                if (bullet) { line_ = line_.slice(1).trim(); }
                return `<li style="margin-left: ${marginLeft}px; margin-right: 20px" ${!bullet && "class='no-marker'"}>${formatting(line_)}</li>`;
            })
            return `<${ listType } style="padding:0" class="${ fine ? "fine" : "" }">${ lines.join("") }</${ listType }>`;
        }

        /* ----------------------------------- headings ----------------------------------- */
        if (chunk.startsWith("# ") || chunk.startsWith("## ") || chunk.startsWith("### ") || chunk.startsWith("#### ")) {
            const headingType = chunk.indexOf(" ");
            chunk = chunk.slice(headingType + 1);
            
            return `<h${headingType} id=${ chunk.replaceAll(" ", "_").replaceAll("---", "&mdash;").replaceAll("--", "&ndash;").replaceAll("*" ,"") } ${ headingType != 4 ? `class="side-heading"` : "" }>${ formatting(chunk) }</h${headingType}>`;
        }

        /* ----------------------------------- see also ----------------------------------- */
        if (chunk.startsWith("||see-also")) {

            const lines = chunk.split("\n").slice(1)
                .map(c => c.replace(/substack\|(\w+)/, "https://northofqueen.substack.com/p/$1").replace(/tumblr\|(\d+)/, "https://perennialiris.tumblr.com/post/$1"))
                .map(c => `<a href="${c}" target="_blank">${c}</a>`);

            document.querySelector(".see-also").innerHTML += `<div>This content elsewhere:</div><ul><li>${lines.join("</li><li>")}</li></ul>`;

            return "";
        }

        /* ------------------------ finalizing (normal paragraphs) ------------------------ */
        
        chunk = formatting(chunk);

        if (fine) {
            return `<p class='fine'>${ chunk.replaceAll("\n", "<br>") }</p>`;
        }
        if (firstParagraph) {
            firstParagraph = false;
            return `<p class='first-paragraph'>${ chunk }</p>`;
        }
        
        return `<p>${ chunk }</p>`;
    })

    targetElement.innerHTML = input.join("");
    
    ["p", "blockquote", "li"].forEach(tagName => Array.from(targetElement.getElementsByTagName(tagName)).forEach(ele => wrapDigits(ele)) )
}

/*  These are the replacements run over all inputs, separated into its
    own function because I needed to call it multiple times. */
function replacements(inputString) {
    if (inputString == "") {
        return "";
    }
    let output = inputString
        .replaceAll("\\*", "&ast;")
        .replaceAll("\\^", "&Hat;")
        .replaceAll("\\_", "&lowbar;")
        .replaceAll("\\(", "&lpar;")
        .replaceAll("\\)", "&rpar;")
        .replaceAll("\\[", "&lbrack;")
        .replaceAll("\\]", "&rbrack;")
        .replaceAll("\\", "&#92;")
        /* It took many versions, but I think I finally got to a point where this always
           works the way I want it to. */
        /* Is there a much better way to do this? Not sure, whatever. */
        /* ---- curly " replacement ---- */
        .replace(/(\S\*{1,3})" /g, "$1&rdquo; ")
        .replace(/^"(\w)/g, "&ldquo;$1")
        .replace(/^" /g, "&rdquo; ")
        .replace(/", /g, "&rdquo;, ")
        .replace(/\*"\-/g, "*&rdquo;-")
        .replace(/^"(\.|,)/g, "&rdquo;$1")
        .replace(/ "$/g, " &ldquo;")
        .replace(/"$/g, "&rdquo;")
        .replace(/(\s|^|;|\*|\[|\()"/g, "$1&ldquo;")
        .replace(/\-"([a-zA-Z])/g, "-&ldquo;$1")
        .replace(/"/g, "&rdquo;")
        /* ---- curly ' replacement ---- */
        .replace(/'(\d{2})(\D{1})/g, "&rsquo;$1$2") // for saying '95 or '27 etc.
        .replace(/(\S\*{1,3})'(\s)/g, "$1&rsquo;$2")
        .replace(/^'(\w)/g, "&lsquo;$1")
        .replace(/^',/g, "&rsquo; ")
        .replace(/^' /g, "&rsquo; ")
        .replace(/', /g, "&rsquo;, ")
        .replace(/\-'([a-zA-Z])/g, "-&lsquo;$1")
        .replace(/\*'\-/g, "*&rsquo;-")
        .replace(/^'(\.|)/g, "&rsquo;$1")
        .replace(/ '$/g, " &lsquo;")
        .replace(/'$/g, "&rsquo;")
        .replace(/(\s|^|;|\*|\[|\()'/g, "$1&lsquo;")
        .replace(/'/g, "&rsquo;")
        .replace(/__(.+?)__/g, "<u>$1</u>")
        .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.+?)\*/g, "<i>$1</i>")
        .replaceAll("---", "<span class='mdash'>&mdash;</span>")
        .replaceAll("--", "&ndash;")
        .replaceAll("...", "&hellip;")
    return output;
}

function formatting(input) {
    let output = "";
    while (true) {
        let openTag = input.indexOf("<"), closeTag = input.indexOf(">");
        if (openTag == -1 || closeTag == -1) break;
        output += replacements(input.substring(0, openTag)) + input.substring(openTag, closeTag + 1);
        input = input.substring(closeTag + 1);
    }
    output += replacements(input);
    return output;
}

function wrapDigits(arg) {
    if (typeof arg != "string") { arg.innerHTML = wrapDigits(arg.innerHTML); }
    else {
        let k = 0;
        let output = "", left = 0;
        while (true) {
            const openTag = arg.indexOf("<");
            const closeTag = arg.indexOf(">");
            if (openTag == -1 || closeTag == -1) { break; }
            
            let not_in_tags = arg.substring(0, openTag);
            let between_tags = arg.substring(openTag, closeTag + 1);
            
            output += (not_in_tags.startsWith("[") && not_in_tags.endsWith("]"))
                ? not_in_tags
                : not_in_tags.replace(/(\d+)/g, "<span class='digit'>$1</span>");
            
            output += between_tags;
            arg = arg.substring(closeTag + 1);
        }
        output += arg.replace(/(\d+)/g, "<span class='digit'>$1</span>");
        return output;
    }
}








