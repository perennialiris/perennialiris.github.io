
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

    const articleLinks = [];
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
                <tr>
                    <td>
                    <span ${pageOptions.includes("pinned") ? "style='display: inline-flex; align-items: center; gap: 5px;'" : ""}>
                        <a href="${pageDirectory}/index.html">${pageTitle}</a>
                        ${ pageOptions.includes("pinned") ? `<span class="pin-icon"></span>` : "" }
                    </span>
                    </td>
                    <td>${ pageDate }</td>
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
                <a class="to-top-button" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })">Jump to Top</a>
            </div>
        </nav>
        <div class="c1">
            <div class="c2">
                <div id="article">${ document.getElementById("page").innerHTML }</div>
                <footer id="article-footer">
                    <div style="display: flex; justify-content: space-between;">
                        <div class="see-also"></div>
                        <div style="white-space: nowrap;"><a href="${pathToRoot}index.html">Link to full page index</a></div>
                    </div>
                    <div class="citations"></div>
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
            console.log("creating table of contents...");
            
            const toc = mainContainer.insertBefore(document.createElement("nav"), mainContainer.firstElementChild);
            toc.id = "toc";
            
            const headings = Array.from(document.getElementsByClassName("heading"));
            toc.innerHTML = headings.map(heading => `<a class="toc-row ${heading.tagName.toLowerCase()}" href="#${heading.id}">${heading.innerHTML.replace(/\/?i>/g, "")}</a>`).join("");

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
                console.log(window.innerWidth)
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
    const externalLinks = articleLinks.filter(i => i[0].startsWith("http"));
    if (externalLinks.length > 0) {
        document.querySelector(".citations").innerHTML = `
        <div>External links referenced:</div>
        <div>${externalLinks
            .map((i, n) => {
                let j = 0;
                return `<div class="cite-li">${(i[1] == 1) ?
                    `<a style="font-family: monospace" href="#cite-${n + 1}">^</a>`
                    : ` <a href="#cite-${i[1] + "-" + j++}">^</a>`.repeat(i[1])
                }
                <a target="_blank" id="cite-${n + 1}" href="${i[0]}">${i[0]}</a></div>`
            }).join("")
        }</div>`;
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
        
        /* -------------------------------------------- images -------------------------------------------- */
        
        if (chunk.startsWith("||image-box")) {
            let lines = chunk.split("\n").slice(1);
            lines = lines.map( line => {
                let parts = line.split("|")
                while ( parts.length < 3 ) {
                    parts.push("");
                }
                let filePath = "media/" + parts[0].trim();
                let altText = parts[1].trim().replace(/"/g, "&quot;").replaceAll("---", "&mdash;").replaceAll("--", "&ndash;");
                let maxHeight = parts[2].trim();
                
                if (maxHeight === "") {
                    maxHeight = 300;
                }
                
                return `<div><img onclick="setLightbox(this)" style="max-height: ${ maxHeight }px" src="${ filePath }" title="${ altText }" alt="${ altText }"></div>`;
            });
            return `<div class="image-box">${ lines.join("") }</div>`;
        }
        
        if (chunk.startsWith("||image-float")) {
            const lines = chunk.split("\n").slice(1);
            for (let j = 0; j < lines.length; j += 1) {
                let imgClass = "image-float";

                const parts = lines[j].split("|");
                while (parts.length < 3) {
                    parts.push("");
                }

                let filePath = "media/" + parts[0].trim();
                let caption = parts[1].trim();
                let altText = parts[2].trim();

                let imgAttributes = `src=${filePath}`;

                if (caption != "") {
                    imgClass += " captioned";
                    caption = "<div>" + caption + "</div>";
                    imgAttributes += ` title="${altText}" alt="${altText}"`;
                }

                lines[j] = `<div class="${imgClass}"><img onclick="setLightbox(this)" ${ imgAttributes }>${ caption }</div>`;
            }
            return lines.join("");
        
        }
        /* --------------------------------------------- code --------------------------------------------- */
        if (chunk.startsWith("||codeblock")) {
            return `<div class="codeblock">${ chunk.split("\n").slice(1).join("<br>") }</div>`;
        }
        
        chunk = chunk.replace(/`(.+?)`/g, (match, captured) => {
            return `<code>${ captured.replaceAll("\"", "&quot;").replaceAll("'", "&apos;").replaceAll("-", "&hyphen;").replaceAll("(", "&lpar;").replaceAll(")", "&rpar;").replaceAll("[", "&lbrack;").replaceAll("]", "&rbrack;").replaceAll("*", "&ast;").replaceAll("\n", "<br>") }</code>`;
        });
        
        /* --------------------------------------------- links --------------------------------------------- */
        /*  \[(  [^\]]*  )[^\\]?\]\((  [^\s]+?[^\\]  )\)
            [text to be displayed](https://perennialiris.github.io/)
        */
        chunk = chunk.replace(/\[([^\]]*)[^\\]?\]\(([^\s]+?[^\\])\)/g, (match, displayText, address) => {
            address = address.replaceAll("\\)", ")");
            let index = -1, refNum = 1;
            for (let i = 0; i < articleLinks.length; i += 1) {
                if (articleLinks[i][0] == address) {
                    index = i;
                    break;
                }
            }
            if (index == -1) {
                index = articleLinks.push([address, 1]);
            }
            else {
                refNum = articleLinks[index][1] + 1;
                index += 1;
            }

            let id = index;
            if (refNum != 1) {
                id += "-" + refNum;
            }
            
            return `<a class="${displayText ? "" : "citeref"} id="cite-${id}" href=${address}>${ displayText ? displayText : `&lbrack;${index}&rbrack;` }</a>`;
        });

        /* --------------------------------------------- table --------------------------------------------- */
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

        /* ------------------------------------------ blockquote ------------------------------------------ */
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

        /* --------------------------------------------- lists --------------------------------------------- */
        /* This isn't a perfect handler but whatever it's fine for my specific purposes. */
        if ( chunk.startsWith("* ") || /^\d+\. /.test(chunk) ) {
            const lines = chunk.split("\n").map( line => {
                const marginLeftRight = (Math.floor(line.search(/[^\s]/) / 2) + 1) * 40;
                let listStyleTop = "none";
                let marginTop = "6px";
                if (line.startsWith("* ")) {
                    line = line.slice(1);
                    listStyleTop = "disc";
                    marginTop = "10px"
                }
                
                return `<li style="list-style-type: ${ listStyleTop }; display: list-item; margin: ${ marginTop } ${marginLeftRight }px 0;">${ formatting(line.trim()) }</li>`;
            })
            const listType = chunk.startsWith("* ") ? "ul" : "ol";
            
            return `<${ listType } style="padding:0" class="${ fine ? "fine" : "" }">${ lines.join("") }</${ listType }>`;
        }

        /* ------------------------------------------- headings ------------------------------------------- */
        if (chunk.startsWith("# ") || chunk.startsWith("## ") || chunk.startsWith("### ") || chunk.startsWith("#### ")) {
            const headingType = chunk.indexOf(" ");
            chunk = chunk.slice(headingType + 1);
            
            return `<h${headingType} id=${ chunk.replaceAll(" ", "_").replaceAll("---", "&mdash;").replaceAll("--", "&ndash;").replaceAll("*" ,"") } class="heading">${ formatting(chunk) }</h${headingType}>`;
        }

        /* ------------------------------------------- see also ------------------------------------------- */
        if (chunk.startsWith("||see-also")) {

            const lines = chunk.split("\n").slice(1)
                .map(c => c.replace(/substack\|(\w+)/, "https://northofqueen.substack.com/p/$1").replace(/tumblr\|(\d+)/, "https://perennialiris.tumblr.com/post/$1"))
                .map(c => `<a href="${c}" target="_blank">${c}</a>`);

            document.querySelector(".see-also").innerHTML += `<div>This content elsewhere:</div><ul><li>${lines.join("</li><li>")}</li></ul>`;

            return "";
        }

        /* -------------------------------- finalizing (normal paragraphs) -------------------------------- */
        
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
    
    wrapDigits(document.getElementById("nav"))
}

function wrapDigits(arg) {
    if (typeof arg != "string") { arg.innerHTML = wrapDigits(arg.innerHTML); }
    else {
        let output = "";
        while (true) {
            const openTag = arg.indexOf("<"), closeTag = arg.indexOf(">");
            if (openTag == -1 || closeTag == -1) { break; }
            output += arg.substring(0, openTag).replace(/(\d+)/g, "<span class='digit'>$1</span>");
            output += arg.substring(openTag, closeTag + 1);
            arg = arg.substring(closeTag + 1);
        }
        output += arg.replace(/(\d+)/g, "<span class='digit'>$1</span>");
        return output;
    }
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
        .replace(/"/g, "&rdquo;")
        // .replace(/&rdquo;(,|\.|[a-zA-Z])/g, `<span class="rquo">&rdquo;</span>$1`)
        /* ---- curly ' replacement ---- */
        .replace(/'(\d{2})(\D{1})/g, "&rsquo;$1$2") // for saying '95 or '27 etc.
        .replace(/(\S\*{1,3})'(\s)/g, "$1&rsquo;$2")
        .replace(/^'(\w)/g, "&lsquo;$1")
        .replace(/^',/g, "&rsquo; ")
        .replace(/^' /g, "&rsquo; ")
        .replace(/', /g, "&rsquo;, ")
        .replace(/\*'\-/g, "*&rsquo;-")
        .replace(/^'(\.|)/g, "&rsquo;$1")
        .replace(/ '$/g, " &lsquo;")
        .replace(/'$/g, "&rsquo;")
        .replace(/(\s|^|;|\*|\[|\()'/g, "$1&lsquo;")
        .replace(/'/g, "&rsquo;")
        // .replace(/&rsquo;(,|\.|[a-zA-Z])/g, `<span class="rquo">&rsquo;</span>$1`)
        .replace(/__(.+?)__/g, "<u>$1</u>")
        .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.+?)\*/g, "<i>$1</i>")
        .replaceAll("---", "<span class='mdash'>&mdash;</span>")
        .replaceAll("--", "&ndash;")
        .replaceAll("...", "&hellip;")
    return output;
}

function formatting(inputString) {
    let input = inputString, output = "";
    while (true) {
        let openTag = input.indexOf("<"), closeTag = input.indexOf(">");
        if (openTag == -1 || closeTag == -1) break;
        output += replacements(input.substring(0, openTag)) + input.substring(openTag, closeTag + 1);
        input = input.substring(closeTag + 1);
    }
    output += replacements(input);
    return output;
}




