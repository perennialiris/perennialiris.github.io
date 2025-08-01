
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
    const t = p.indexOf("#");
    return (t == -1) ? p : p.substring(0, t);
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
       `<header id="header"></header>
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
                </footer>
            </div>
        </div>
        <div class="lightbox-wrapper" onclick="setLightbox('close')"><img id="lightbox"></div>`;
    let articleLinks = [];
    interpreter(document.getElementById("article"), articleLinks);

    /* adds "digit" class to numbers in article: */
    ["p", "li"].forEach(tagName => Array.from(document.getElementById("article").getElementsByTagName(tagName)).forEach(ele => wrapDigits(ele)) );

    articleLinks = articleLinks.filter(a => a.url.startsWith("http"));
    if (articleLinks.length > 0) {
        articleLinks = articleLinks.map( (link_, n) => {
            let li = `<li>`;
            for (let i = 1; i < link_.count + 1; i += 1) {
                li += `<a href="#cite-${n + 1}${ i == 1 ? "" : "-" + i }">^</a>`;
            }
            return `${li} <a target="_blank" href="${link_.url}">${link_.url}</a></li>`;
        });
        document.getElementById("footer").innerHTML += 
            `<div id="citations">External pages referenced above (this list is auto-generated):<ol>${articleLinks.join("")}</ol></div>`;
        }

    if (document.body.classList.contains("toc")) {
        const toc = document.getElementById("toc");
        const headings = Array.from(document.getElementById("article").getElementsByClassName("toc-include"));
        toc.innerHTML = headings.map ( (heading, n) => `<a class="toc-row ${heading.tagName.toLowerCase()}" href="#${ (n > 0) ? heading.id : "" }">${ heading.innerHTML.replace(/\/?i>/g, "") }</a>` ).join("");

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
    let galleryNum = 1;
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
        
        /* ------------------------------------ images ------------------------------------ */
        if (chunk.startsWith("||gallery")) {
            /* imgUrl | alt-text/title | figcaption */
            const galleryFigures = chunk.split("\n").slice(1).map( line => {
                const parts = line.split("|");
                while (parts.length < 3) { parts.push(""); }
                let imgUrl = "media/" + parts[0].trim();
                let altText = formatting(parts[1].trim().replace(/"/g,"&quot;"));
                return `<figure><img onclick="setLightbox(this)" src="${ imgUrl }" title="${ altText }" alt="${ altText }"></figure>`;
            });
            return `<div class="gallery">${ galleryFigures.join("") }</div>`;
        }

        if (chunk.startsWith("||image-float")) {
            const lines = chunk.split("\n").slice(1).map( line => {
                const parts = line.split("|"); while (parts.length < 3) { parts.push(""); }
                let imgUrl = "media/" + parts[0].trim();
                let figCaption = formatting(parts[1].trim());
                let altText = formatting(parts[2].trim().replace(/"/g,"&quot;"));
                if (figCaption) { figCaption = `<figcaption>${ figCaption }</figcaption>`; }
                
                return `<figure><img onclick="setLightbox(this)" src="${ imgUrl }" title="${ altText }" alt="${ altText }">${ figCaption }</figure>`;
            });
            return `<div class="image-float">${lines.join("") }</div>`;
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

            return displayText
                ? `<a id="${id}" href="${address}">${ displayText }</a>`
                : `<sup><a id="${id}" href="${address}" class="citeref">[${index + 1}]</a></sup>`;
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
            let list = `<${listTag} class="list"`;
            if (startNumber) {
                list += ` start="${startNumber}"`;
            }
            list += `>${lines.join("")}</${listTag}>`;
            if (fine) {
                list = `<div class="fine">${list}</div>`;
            }
            return list;
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

            const seeAlsoLines = chunk.split("\n").slice(1)
                .map(c => c.replace(/substack\|(\w+)/, "https://northofqueen.substack.com/p/$1").replace(/tumblr\|(\d+)/, "https://perennialiris.tumblr.com/post/$1"))
                .map(c => `<div><a href="${c}" target="_blank">${c}</a></div>`);

            document.getElementById("footer").appendChild(document.createElement("div")).innerHTML = `<div>This content elsewhere:</div>${seeAlsoLines.join("")}`;
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








