
"use strict"

/*
    This file is the javascript that creates each page dynamically from the text in the original file.
*/

let pageData = `
2  * US news list                * archive
4  * International news list     * archive
3  * Canadian news list          * archive
21 * Donald Trump                * toc
20 * Israel–Palestine            * toc
19 * Pierre Poilievre            * toc
16 * Sex, gender, & transsexuals * toc
18 * Politics fundamentals       * toc
`.split("\n").filter(n => n.trim().length > 2).map(cell => cell.split("*").map(c => c.trim()));

function pageName() {
    const p = document.baseURI.split("/").slice(-1)[0];
    const q = p.indexOf("#");
    return (q == -1) ? p : p.substring(0, q);
}

window.addEventListener("load", function() {
    // document.body.classList.add("dark");
    if (localStorage.getItem("brightness") == "dark") { document.body.classList.add("dark"); }
    else { localStorage.setItem("brightness","light"); }

    /* applying classes from list above */
    const thisPageDirectory = document.baseURI.split("/").slice(-2)[0];
    const thisPageName = document.baseURI.split("/").slice(-1)
    pageData.forEach(p => { if (p[0] == thisPageDirectory && pageName() == "index.html") { document.body.classList.add(...p[2].split(" ")); } })
    let isIndex = document.getElementById("index");

    document.body.innerHTML =
       `${ false ? `<header id="header"></header>` : "" }
        <nav id="nav">
            <div class="nav-inner">
                <span id="page-name-display">${ isIndex ? "" : `<a href="../index.html">Index</a> &#47; <a href="index.html">` + (document.title || "This page") + `</a>` }</span>
                <a class="to-top-button" href="#">Jump to Top</a>
            </div>
        </nav>
        <div class="c1">
            <nav id="toc"></nav>
            <div class="c2">
                <div id="article">${ document.body.innerHTML }</div>
                <footer id="footer">
                    <div id="see-also"></div>
                    <div id="citations"></div>
                </footer>
            </div>
        </div>
        <div class="lightbox-wrapper" onclick="setLightbox('close')"><img id="lightbox"></div>`;
    let articleLinks = [];
    interpreter(document.getElementById("article"), articleLinks);

    /* adds "digit" class to numbers in article: */
    ["p", "blockquote", "li" ].forEach(tagName => Array.from(document.getElementById("article").getElementsByTagName(tagName)).forEach(ele => wrapDigits(ele)) );

    articleLinks = articleLinks.filter(a => a.url.startsWith("http"));
    if (articleLinks.length > 0) {
        articleLinks = articleLinks.map( (link_, n) => {
            let citelist = "<li>";
            for (let i = 1; i < link_.count + 1; i += 1) {
                citelist += ` <a href="#cite-${n + 1}${ i == 1 ? "" : "-" + i }">^</a>`;
            }
            return `${citelist} <a target="_blank" id="cite-${n + 1}" href="${link_.url}">${link_.url}</a></li>`;
        }).join("");
        document.getElementById("citations").innerHTML = 
            `External pages referenced above (this list is auto-generated):<ol>${articleLinks}</ol>`;
        }
    const seeAlso = document.getElementById("see-also");

    if (document.body.classList.contains("toc")) {
        const toc = document.getElementById("toc");
        const headings = Array.from(document.getElementsByClassName("article-heading")).slice(1);
        toc.innerHTML = `<a class="toc-row h1" href="#">(Top of page)</a>`
            + headings.map ( heading => `<a class="toc-row ${heading.tagName.toLowerCase()}" href="#${ heading.id }">${heading.innerHTML.replace(/\/?i>/g, "")}</a>` )
            .join("");
        
        const rowsInToc = Array.from(toc.getElementsByClassName("toc-row"));
        let currentHeading = "";
        let canTocHighlighter = true;
        function tocHighlighter() {
            if (!canTocHighlighter) { setTimeout(() => { tocHighlighter(); }, 300 ); return; }
            canTocHighlighter = false;
            setTimeout(() => { canTocHighlighter = true; }, 300);
            let headingId;
            for (let i = 0; i < headings.length; i += 1) {
                if (pageYOffset > headings[i].offsetTop - window.innerHeight * 0.5) {
                    headingId = headings[i].id;
                } else { break; }
            }
            if (headingId != currentHeading) {
            for (let i = 0; i < rowsInToc.length; i += 1) {
                rowsInToc[i].classList.remove("active-heading");
                if (rowsInToc[i].getAttribute("href") == "#" + headingId) {
                    rowsInToc[i].classList.add("active-heading"); } } }
            currentHeading = headingId;
        }
        let canTocWidthCheck = true;
        function tocWidthCheck() {
            if (!canTocWidthCheck) { setTimeout(() => { tocWidthCheck(); }, 300 ); return; }
            canTocWidthCheck = false;
            setTimeout(() => { canTocWidthCheck = true; }, 300);
            toc.style.display = (parseInt(window.innerWidth) > 650) ? "block" : "none";
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
            mainNav.classList.add("sticky-active"); }
        else {
            mainNav.classList.remove("sticky-active"); }
    }
    navStickyCheck();
    window.addEventListener("scroll", navStickyCheck);
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */

    if (document.title == "") {
        document.title = "Perennial Iris";
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
            return `<div class="fine">${ chunk.split("\n")[1] }</div>`;
        }
        
        let fine = "";
        if (chunk.startsWith("^")) {
            chunk = chunk.slice(1);
            fine = "fine";
        }
        
        /* ------------------------------------ images ------------------------------------ */
        if (chunk.startsWith("||image-box")) {
            const lines = chunk.split("\n").slice(1).map( line => {
                const parts = line.split("|");
                while (parts.length < 3) { parts.push(""); }
                let filePath = "media/" + parts[0].trim();
                let altText = parts[1].trim().replace(/"/g, "&quot;").replaceAll("---", "&mdash;").replaceAll("--", "&ndash;");
                let maxHeight = parts[2].trim();
                return `<div><img onclick="setLightbox(this)" style="max-height: ${ maxHeight || 250 }px;" src="${ filePath }" title="${ altText }" alt="${ altText }"></div>`;
            });
            return `<figure class="image-box">${ lines.join("") }</figure>`;
        }
        
        if (chunk.startsWith("||image-float")) {
            const lines = chunk.split("\n").slice(1).map( line => {
                const parts = line.split("|");
                while (parts.length < 3) { parts.push(""); }
                let filePath = "media/" + parts[0].trim();
                let caption = formatting(parts[1].trim());
                let altText = formatting(parts[2].trim());
                if (caption != "") { caption = `<figcaption>${ caption }</figcaption>`; }
                
                return `<div><img onclick="setLightbox(this)" src="${filePath}" title="${altText}" alt="${altText}">${caption}</div>`;
            });
            return `<figure class="image-float">${lines.join("") }</figure>`;
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
            
            return displayText ?
                `<a id="${id}" href="${address}">${ displayText }</a>`
                :
                `<sup><a id="${id}" href="${address}" class="citeref">[${index + 1}]</a></sup>`;
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
        /* Not a perfect handler but whatever it's fine. */
        if ( chunk.startsWith("* ") || /^\d+\. /.test(chunk) ) {
            const listType = chunk.startsWith("* ") ? "ul" : "ol";
            let startAttr = "";
            if (listType == "ol") {
                startAttr = `start="${chunk.slice(0, chunk.indexOf(" ") - 1)}"`;
            }
            const lines = chunk.split("\n").map( line_ => {
                const pLeft = (Math.floor(line_.search(/[^\s]/) / 2) + 0) * 2.5;
                line_ = line_.trim();

                let liType = "", liValue = "";
                if (line_.startsWith("* ")) {
                    line_ = line_.slice(1).trim();
                }
                else if (/^\d+\. /.test(line_)) {
                    liValue = `value="${line_.slice(0, line_.indexOf(" ") - 1)}"`;
                    line_ = line_.slice(line_.indexOf(" ")).trim();
                }
                else {
                    liType = `class="no-marker"`;
                }
                
                let bullet = line_.startsWith("* ");
                if (bullet) { line_ = line_.slice(1).trim(); }
                return `<li style="margin-left: ${pLeft}em; margin-right: ${pLeft}em" ${liType} ${liValue}>${formatting(line_)}</li>`;
            })
            return `<${ listType } ${ startAttr } class="${ fine }">${ lines.join("") }</${ listType }>`;
        }

        /* ----------------------------------- headings ----------------------------------- */
        if (chunk.startsWith("# ") || chunk.startsWith("## ") || chunk.startsWith("### ") || chunk.startsWith("#### ")) {
            const headingType = chunk.indexOf(" ");
            chunk = chunk.slice(headingType + 1);
            
            return `<h${headingType} id=${ chunk.replaceAll(" ", "_").replaceAll("---", "&mdash;").replaceAll("--", "&ndash;").replaceAll("*" ,"") } ${ headingType != 4 ? `class="article-heading"` : "" }>${ formatting(chunk) }</h${headingType}>`;
        }

        /* ----------------------------------- see also ----------------------------------- */
        if (chunk.startsWith("||see-also")) {

            const lines = chunk.split("\n").slice(1)
                .map(c => c.replace(/substack\|(\w+)/, "https://northofqueen.substack.com/p/$1").replace(/tumblr\|(\d+)/, "https://perennialiris.tumblr.com/post/$1"))
                .map(c => `<li><a href="${c}" target="_blank">${c}</a></li>`);

            document.getElementById("see-also").appendChild(document.createElement("div")).innerHTML = `<div>This content elsewhere:</div><ul>${lines.join("")}</ul>`;

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








