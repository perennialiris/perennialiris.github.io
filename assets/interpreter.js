
/*  I want a list at the bottom of each page that shows all the addresses linked
    to throughout the article. Instead of doing this manually, I have the
    code that parses links also push them to this array, which is then used to
    populate a citations list at the end automatically (see layout.js) */
let citation_array = [];
let toc_array = [];

/*  I like being able to style numbers (0-9) separately from other text. However,
    you don't want to affect numbers that are inside <elements>, because those
    are often part of URLs or styling. This function takes an HTML element
    and wraps digits in a span, but safely skips over the content of <tags>. */

/*
String.prototype.indexOf = function (string_, character_) {
    for (let num = 0; num < string_.length; num += 1) if (string_[num] === character_) return num; return -1;
}
*/
function wrapDigits(targetElement) {
    let input = targetElement.innerHTML, output = "";
    while (true) {
        const openTag = input.indexOf("<"), closeTag = input.indexOf(">");
        if (openTag == -1 || closeTag == -1) { break; }
        output += input.substring(0, openTag).replace(/(\d+)/g, "<span class='rendered_digit'>$1</span>")
            + input.substring(openTag, closeTag + 1);
        input = input.substring(closeTag + 1);
    }
    output += input.replace(/(\d+)/g, "<span class='rendered_digit'>$1</span>");
    targetElement.innerHTML = output;
}

/*  These are the replacements run over all inputs, separated into its
    own function because I needed to call it multiple times. */
function stdReplacements(input_string) {
    if (input_string == "") {
        return ""; }
    return input_string
        .replaceAll("\\*", "&ast;")
        .replaceAll("---", "&mdash;")
        .replaceAll("...", "&hellip;")
        .replaceAll("--", "&ndash;")
        .replaceAll("\\", "&#92;")
        /*  you need these ][)( escapes for when putting links on the page, if you want
            to use ][ as part of the text or link to a URL that has )( in it */
        .replaceAll("\\(", "&lpar;")
        .replaceAll("\\)", "&rpar;")
        .replaceAll("\\[", "&lbrack;")
        .replaceAll("\\]", "&rbrack;")
        /* bold and italics */
        .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.+?)\*/g, "<i>$1</i>")
        /* curly quotes: */
        .replace(/(\s|^|\[)"/g, "$1&ldquo;")
        .replace(/(\W)"(\w)/g, "$1&ldquo;$2")
        .replace(/"/g, "&rdquo;")
        .replace(/(\s|^|\[)'/g, "$1&lsquo;")
        .replace(/(\W)'(\w)/g, "$1&lsquo;$2")
        .replace(/'/g, "&rsquo;");
}

/* This is a general parser I run all input through. It safely ignores
   anything <inside> of tags, with the same logic as wrapDigits */
function safeConvert(input_string) {
    let input = input_string, output = "";
    while (true) {
        let openTag = input.indexOf("<"), closeTag = input.indexOf(">");
        if (openTag == -1 || closeTag == -1) break;
        output += stdReplacements(input.substring(0, openTag)) + input.substring(openTag, closeTag + 1);
        input = input.substring(closeTag + 1);
    }
    output += stdReplacements(input);
    return output;
}

/*  This one is for <code> and <div class="codeblock"> elements, where you
    don't want any formatting to apply. Run this before safeConvert */
function cleanForCode(input_string) {
    return input_string
        .replaceAll("=\"\"", "")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&apos;")
        .replaceAll("-", "&hyphen;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("(", "&lpar;")
        .replaceAll(")", "&rpar;")
        .replaceAll("[", "&lbrack;")
        .replaceAll("]", "&rbrack;")
        .replaceAll("*", "&ast;")
        .replaceAll("\n", "<br>");
}
/*  .replaceAll is preferred over .replace when you don't need to regex
    functionality because it simply results in more readable code */

/*  ![description](path/to/image.png)
    ![nice](path/to/other_image.png)
 ->v
    <div class="image-box">
        <div><img alt="description" title="description" src="path/to/image.png"></div>
        <div><img alt="nice" title="nice" src="path/to/other_image.png"></div>
    </div>                                                                     */
function imageBoxParse(input_string) {
    let lines = input_string.split("\n");
    for (let i = 0; i < lines.length; i += 1) {
        const parts = lines[i].split("]("); if (parts.length != 2) { console.error("Image parser is confused (bad input)"); break; }
        const altText = parts[0].substring(2).replaceAll('"', '&quot;');
        let filePath = parts[1];
        let maxHeight = 350;
        /* defaults to 350 max height unless specified otherwise - ![](images/1-1.png)|211 would have 211 max height */
        let j = filePath.indexOf("|");
        if (j != -1) {
            maxHeight = filePath.substring(j + 1);
            filePath = filePath.substring(0, j - 1); }
        while (filePath.charAt(filePath.length - 1) == ")") {
            filePath = filePath.substring(0, filePath.length - 1); }
        lines[i] = (altText == "")
            ? `<div><img onclick="imageViewer(this)" style="max-height:${maxHeight}px" src="${filePath}"></div>`
            : `<div><img onclick="imageViewer(this)" style="max-height:${maxHeight}px" src="${filePath}" title="${altText}" alt="${altText}"></div>`;
    }
    return `<div class="image-box">${lines.join("")}</div>`;
}

/* nested list parser */
function listParser(inputString) {
    const items = inputString.split("\n");
    const end_tags = [];
    const indent_diff = [];
    for (let j = 0; j < items.length; j += 1) {
        let k = 0;
        while (items[j].charAt(k) === " ") {
            k += 1; }
        items[j] = `${" ".repeat(k)}<li>${items[j].slice(k).replace(/^[\*\-]\s+/, "- ").trimEnd()}</li>`; }
    for (let j = 0; j < items.length; j += 1) {
        let indent = items[j].indexOf("<");
        const prev_indent = (j > 0) ? items[j - 1].indexOf("<") : -1;
        const li = items[j].slice(indent + 4);
        
        if (indent > prev_indent) {
            if (li.startsWith("- ")) {
                end_tags.push("</ul>");
                items[j] = "<ul><li>" + li.slice(2); }
            else {
                if (/^\d+\./.test(li)) {
                    end_tags.push("</ol>");
                    items[j] = `<ol start="${li.substring(0, li.indexOf("."))}"><li>${li.slice(li.indexOf(".") + 1).trimStart()}`; }
                else {
                    items[j] = "<br>" + " ".repeat(indent - prev_indent) + li;
                    items[j - 1] = items[j - 1].slice(0, -5);
                    indent = prev_indent; }
            indent_diff.push(indent - prev_indent); } }
        else {
            let br = false;
            if (li.startsWith("- ")) {
                items[j] = "<li>" + li.slice(2); }
            else {
                if (/^\d+\./.test(li)) {
                    items[j] = "<li>" + li.slice(li.indexOf(".") + 1).trimStart(); }
                else {
                    br = true; } }
            if (indent < prev_indent) {
                let diff = prev_indent - indent;
                while (diff > 0) {
                    if (diff < indent_diff[indent_diff.length - 1]) {
                        indent_diff[indent_diff.length - 1] -= diff;
                        diff = 0;
                    } else {
                        diff -= indent_diff.pop();
                        items[j - 1] += end_tags.pop(); } } }
            if (br) {
                let k;
                for (k = j - 1; k > -1; k -= 1) {
                    if (items[k].indexOf("<") == indent) {
                        break; }
                    if (items[k].indexOf("<") < indent) {
                        k += 1; break; } }
                items[k] = items[k].slice(0, -5);
                items[j] = "<br>" + li; } }
        items[j] = " ".repeat(indent) + items[j]; }
    while (end_tags.length > 0) {
        items[items.length - 1] += end_tags.pop(); }
    return items.join('\n');
}

/* The main interpreter loop. Pass the main article element to start. */
function interpreter(targetElement) {
    let input = targetElement.innerHTML
        .replace(/\n\n+/g, "\n\n")
        .replace(/\r/g, "") /* safety */
        .trim()
        .split("\n\n");
    
    let table_num = 1;
    for (let i = 0; i < input.length; i += 1) {
        if (input[i].startsWith("\\")) {
            input[i] = input[i].substring(1);
            continue; }
        let smallPrint = false;
        if (input[i].startsWith("^")) {
            smallPrint = true;
            input[i] = input[i].substring(1); }
        if (input[i] == "***" || input[i] == "---") {
            input[i] = "<hr>";
            continue; }
        if (input[i] == "**" || input[i] == "--") {
            input[i] = "<br>";
            continue; }
        if (input[i].startsWith("![")) {
            input[i] = imageBoxParse(input[i]);
            continue; }
        
        /* before looking for code, fix any \` instances: */
        input[i] = input[i].replace(/\\`/g, "&#96;");
        /* div.codeblock: */
        if (input[i].startsWith("```")) {
            input[i] = input[i].replace(/\s*```\n*/g, "");
            input[i] = "<div class=\"codeblock\">" + cleanForCode(input[i]) + "</div>";
            continue; }
        /* <code></code>: */
        input[i] = input[i].replace(/`(.+?)`/g, (match, captureGroup) => {
            return "<code>" + cleanForCode(captureGroup) + "</code>"; });
        
        /* ------------------------ links ------------------------- */
        input[i] = input[i].replace(/\[([^\]]*?)\]\((.+?)\)/g, (match, displayText, address) => {
            let index = citation_array.indexOf(address);
            if (index == -1) index = citation_array.push(address);
            return (displayText === "")
                ? `<a class="citeref" target="_blank" href="${address}">[${index}]</a>`
                : `<a target="_blank" href="${address}">${displayText}</a>`; });
        
        /* ------------------------ table ------------------------- */
        if (input[i].startsWith("|table")) {
            let rows = input[i].split("\n"); rows.shift();
            for (let j = 0; j < rows.length; j += 1) {
                let cells = rows[j].split("|");
                for (let k = 0; k < cells.length; k += 1) {
                    cells[k] = "<td>" + cells[k].trim() + "</td>"; }
                rows[j] = "<tr>" + cells.join("") + "</tr>"; }
            input[i] = `<table id="${"table" + table_num++}" class="noq-table">${safeConvert(rows.join(""))}</table>`;
            continue; }
        
        input[i] = safeConvert(input[i]);
        
        /* ------------------------ headers ------------------------ */
        /* ------ h1 ------ */
        if (input[i].startsWith("# ")) {
            /* .title-box */
            /* strict format requirement: "# title text |dddd-dd-dd" */
            let title, titleId;
            if (/\|(\d{4})-(\d{2})-(\d{2})/.test(input[i].slice(-11))) {
                title = input[i].slice(2, -11).trim();
                titleId = title.replace(/<\/?(i|b)>/g, "");
                let date = input[i].slice(-10);
                input[i] = `<div class="title-box"><h1 id="${titleId}">${title}</h1><span class="date-box">${date}</span></div>`;
                title = title.replace(/<\/?(i|b)>/g, "").replace(/&amp;/g, "&");
                if (document.title == "") { document.title = title; } }
            else {
                title = input[i].slice(2);
                titleId = title.replace(/<\/?(i|b)>/g, "");
                input[i] = `<h1 id="${titleId}">${title}</h1>`; }
            toc_array.push(`<div><a class="toc-h1" href="#${titleId}">${titleId}</a></div>`);
            continue; }
        /* ------ h2 ------ */
        if (input[i].startsWith("## ")) {
            let title = input[i].slice(3);
            let titleId = title.replace(/<\/?(i|b)>/g, "");
            input[i] = `<h2 id="${titleId}">${title}</h2>`;
            toc_array.push(`<div><a class="toc-h2" href="#${titleId}">${titleId}</a></div>`);
            continue; }
        /* ------ h3 ------ */
        if (input[i].startsWith("### ")) {
            let title = input[i].slice(4);
            let titleId = title.replace(/<\/?(i|b)>/g, "");
            input[i] = `<h3 id="${titleId}">${title}</h2>`;
            toc_array.push(`<div><a class="toc-h3" href="#${titleId}">${titleId}</a></div>`);
            continue; }
        
        /* ------------ table of contents (not a table) ----------- */
        if (input[i].startsWith("|toc")) {
            let lines = input[i].split("\n"); lines.shift();
            for (let j = 0; j < lines.length; j += 1) {
                lines[j] = `<li><a href="#${lines[j]}">${lines[j]}</a></li>`; }
            input[i] = "<ul class=\"toc\">" + lines.join("") + "</ul>";
            continue; }
        
        /* ---------------------- blockquote ---------------------- */
        if (input[i].startsWith("&gt;")) {
            let lines = input[i].split("\n");
            for (let j = 0; j < lines.length; j += 1) {
                lines[j] = lines[j].replace(/^&gt;/, "").trim();
                if (lines[j].startsWith("&mdash;")) {
                    lines[j] = "<div class=\"attribution\">" + lines[j] + "</div>"; }
                else {
                    if (lines[j].startsWith("^")) {
                        lines[j] = "<div class=\"fine\">" + lines[j].substring(1) + "</div>"; }
                    else {
                        lines[j] += "\n"; } } }
            input[i] = lines.join("")
                .replace(/\n\n/g, "<br class=\"bq-br\">")
                .replace(/\n/g, "<br>");
            input[i] = "<blockquote>" + input[i] + "</blockquote>";
            continue; }
        input[i] = input[i].replaceAll("&mdash;", "<span class=\"mdash\">&mdash;</span>");
        
        /* ------------------------ lists ------------------------- */
        if (input[i].startsWith("* ") || input[i].startsWith("- ") || /^\d+\./.test(input[i])) {
            input[i] = listParser(input[i]);
            if (smallPrint) {
                if (input[i].substring(0, 3) != "<ol" && input[i].substring(0, 3) != "<ul") console.error("{INTERPRETER.JS: (B).}")
                input[i] = input[i].substring(0, 3) + " class=\"fine\"" + input[i].substring(3); }
            continue;
        }
        input[i] = input[i].replace(/\n/g, "<br>");
        if (input[i] == "") { console.error("{INTERPRETER.JS: (C).}"); }
        
        input[i] = (smallPrint)
            ? "<p class=\"fine\">" + input[i] + "</p>"
            : "<p>" + input[i] + "</p>";
    }
    targetElement.innerHTML = input.join("");
    
    function foo(y) { let x = targetElement.getElementsByTagName(y); for (let k = 0; k < x.length; k += 1) { x[k] = wrapDigits(x[k]); } }
    foo("p");
    foo("li");
    foo("blockquote");
}

