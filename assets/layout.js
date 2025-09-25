"use strict"
const HTML = document.documentElement;
const githubLogoSvg = `<svg class="inline-logo github-logo" role="img" xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24"><path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path></svg>`;
const youtubeLogoSvg = `<svg class="inline-logo youtube-logo" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 30 30"><path d="M29.2 8.6c-.3-1.6-1.6-2.8-3.2-3C23 5.2 15 5.2 15 5.2s-8 0-11 .4c-1.6.2-2.9 1.4-3.2 3C.4 11.6.4 15 .4 15s0 3.4 .4 6.4c.3 1.6 1.6 2.8 3.2 3C7 24.8 15 24.8 15 24.8s8 0 11-.4c1.6-.2 2.9-1.4 3.2-3 .4-3 .4-6.4 .4-6.4s0-3.4-.4-6.4z"/><path d="M12 19.2V10.8l7.8 4.2-7.8 4.2z"/></svg>`;
const tumblrLogoSvg = `<svg class="inline-logo tumblr-logo" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 530 530"><path d="M260,0 C403.1,0 520,116.9 520,260 C520,403.1 403.1,520 260,520 C116.9,520 0,403.1 0,260 C0,116.9 116.9,0 260,0 Z"/><path d="M222.5 113.9h55.8v71.1h48.3v55.8h-48.3v91.5c0 24.1 13.6 31.6 32.2 31.6 9.5 0 20.6-1.4 28.5-3.9v51.9c-9.9 4.7-27.8 9.4-47.3 9.4-47.6 0-78.5-29.3-78.5-82.7V240.8h-38.9v-55.8h38.9v-71.1z"/></svg>`;
const twitterLogoSvg = `<svg class="inline-logo twitter-logo" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="-1 -1 25 25"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>`;
const blueskyLogoSvg = `<svg class="inline-logo bluesky-logo" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 57" width="18" height="18"><path d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745Z"></path></svg>`;
const discordLogoSvg = `<svg class="inline-logo discord-logo" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16"><path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/></svg>`;
const substackLogoSvg = `<svg class="inline-logo substack-logo" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 64 64"><path d="M8 10 H56 V16 H8 Z" /><path d="M8 22 H56 V28 H8 Z" /><path d="M8 34 H56 V62 L32 50 L8 62 Z" /></svg>`;
const socialLinksdata = `<div title="This github repo"><a class="plug" href="https://github.com/perennialiris/perennialiris.github.io">${ githubLogoSvg }</a></div>
<div title="My YouTube channel"><a class="plug" href="https://www.youtube.com/channel/UCXadODjAtT72eYW6xCGyuUA">${ youtubeLogoSvg }</a></div>
<div title="My tumblr account"><a class="plug" href="https://perennialiris.tumblr.com/">${ tumblrLogoSvg }</a></div>
<div title="Twitter"><a class="plug" href="https://x.com/perennialforces">${ twitterLogoSvg }</a></div>
<div title="Bluesky"><a class="plug" href="https://bsky.app/profile/perennialforces.bsky.social">${ blueskyLogoSvg }</a></div>
<div title="Invite to my Discord server"><a class="plug" href="https://discord.gg/fGdV7x5dk2">${ discordLogoSvg }</a></div>
<div title="My account on Substack"><a class="plug" href="https://perennialiris.substack.com">${ substackLogoSvg }</a></div>`;
const xButtonSvg = `<svg id="toc-x-button" width="15" height="15" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 16 L60 60 M60 16 L16 60" stroke-width="8" stroke-linecap="square" stroke-linejoin="miter"/></svg>`;
const citerefIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" role="img"><path fill="currentcolor" d="M6 1h5v5L8.86 3.85 4.7 8 4 7.3l4.15-4.16z M2 3h2v1H2v6h6V8h1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1"/></svg>`;
const upDownArrowsIconSvg = `↑↓`;
const hamburgerIconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6H20 M4 12H20 M4 18H20" fill="none" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const homeLink = document.getElementById("index") ? "" : "../../index.html";
const themePainting = document.getElementById("index") ? "assets/grandchamp.png" : "../../assets/grandchamp.png";

window.addEventListener("load", function() {
    document.body.innerHTML =
    `<header class="main-header center align-center">
        <div class="title-container"><a href="${ homeLink }" class="header-title">Perennial<span style="color: var(--header-color-2); margin-left: 1px;">Iris</span></a></div>
    </header>
    <nav class="nav-wrapper no-select">
        <div class="main-nav stretch space-between">
            <div class="align-center">
                <div class="page-name-display text-select"><div><a href="${ homeLink }">Index</a> &#47; ${ document.title || "This Page" }</div></div>
            </div>
            <div class="align-center">
                <a id="to-top-button">Jump to Top</a>
                <a class="hamburger icon">${ hamburgerIconSvg }</a>
            </div>
        </div>
    </nav>
    <div class="menu-line center">
        <div class="menu-aligner">
            <div class="menu hidden">
                <div class="align-center gap-8">
                    <span><b>Theme:</b></span>
                    <select class="menu-select" id="brightness-select">
                        <option value="light">White</option>
                        <option value="red">Red accent</option>
                        <option value="blue">High contrast blue</option>
                        <option value="dark">Dark grey</option>
                        <option value="darker">Very dark</option>
                    </select>
                </div>
                <div>
                    <div><b>Fonts:</b></div>
                    <div>
                        <table class="font-options">
                            <tbody>
                                <tr>
                                    <td>Headings:</td>
                                    <td>
                                        <select class="menu-select" id="heading-font-select">
                                            <option value="Arial">Arial</option>
                                            <option value="Faculty Glyphic">Faculty Glyphic</option>
                                            <option value="Georgia">Georgia</option>
                                            <option value="Inter">Inter</option>
                                            <option value="Lora">Lora</option>
                                            <option value="Merriweather">Merriweather</option>
                                            <option value="Open Sans">Open Sans</option>
                                            <option value="Palatino Linotype">Palatino Linotype</option>
                                            <option value="Roboto">Roboto</option>
                                            <option value="Roboto Slab">Roboto Slab</option>
                                            <option value="Segoe UI">Segoe UI</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Trebuchet MS">Trebuchet MS</option>
                                            <option value="Ubuntu">Ubuntu</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Body:</td>
                                    <td>
                                        <select class="menu-select" id="body-font-select">
                                            <option value="Arial">Arial</option>
                                            <option value="Faculty Glyphic">Faculty Glyphic</option>
                                            <option value="Georgia">Georgia</option>
                                            <option value="Inter">Inter</option>
                                            <option value="Palatino Linotype">Palatino Linotype</option>
                                            <option value="Roboto">Roboto</option>
                                            <option value="Segoe UI">Segoe UI</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Trebuchet MS">Trebuchet MS</option>
                                            <option value="Ubuntu">Ubuntu</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tables:</td>
                                    <td>
                                        <select class="menu-select" id="table-font-select">
                                            <option value="Arial">Arial</option>
                                            <option value="Faculty Glyphic">Faculty Glyphic</option>
                                            <option value="Georgia">Georgia</option>
                                            <option value="Inter">Inter</option>
                                            <option value="Palatino Linotype">Palatino Linotype</option>
                                            <option value="Roboto">Roboto</option>
                                            <option value="Segoe UI">Segoe UI</option>
                                            <option value="Trebuchet MS">Trebuchet MS</option>
                                            <option value="Ubuntu">Ubuntu</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="text-align:right; color:var(--grey-8); padding:3px 0;"><span class="pseudo-link" onclick="menuRestoreDefaults()">restore defaults</span></div>
                </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px; color:var(--grey-5);"><div class="align-center"><label class="no-select" for="page-full-width">Full page width:</label><input type="checkbox" class="menu-checkbox" id="page-full-width"></div>
                    ${ HTML.classList.contains("toc") ?
                        `<div class="align-center"><label for="show-toc">Show table of contents:</label><input type="checkbox" class="menu-checkbox" checked id="show-toc"></div>`
                        : ""
                    }
                </div>
            </div>
        </div>
    </div>
    <div class="c1">
        ${ HTML.classList.contains("toc") ? `<div class="toc-wrapper"><nav id="table-of-contents"></nav></div>` : "" }
        <div class="c2">
            <div class="c3">
                <article id="article">${ document.body.innerHTML }</article>
                <footer class="article-footer">
                    <img alt="Theme painting ('A Beauty Holding a Bird' by Louis Emile Pinel de Grandchamp)" src="${ themePainting }" width="100" height"100">
                    <div class="social-links">
                        ${ socialLinksdata }
                    </div>
                </footer>
            </div>
        </div>
    </div>
    <div class="page-bottom"></div>
    <div class="lb-container">
        <div id="lightbox-top-left"></div>
        <div class="lightbox-wrapper"><img id="lightbox"></div>
        <div class="lightbox-bottom-panel"><div id="lightbox-caption"></div></div>
    </div>
    <style id="--custom-style"></style>`;

    HTML.classList.add("layout");
    Array.from(document.querySelector(".font-options").getElementsByTagName("option")).forEach(o => o.style.fontFamily = `"${ o.value }",system-ui` );
    
    const article_ = document.getElementById("article");
    interpreter(article_);
    
    document.querySelector(".lightbox-wrapper").addEventListener("click", () => { setLightbox("close") });
    
    Array.from(document.getElementsByClassName("ie-expand")).forEach(e => {
        e.classList.add("collapsed")
        e.title = "Click to expand this section";
        
        e.addEventListener("click", function() {
            this.classList.remove("collapsed");
            e.title = "";
        })
        let b = e.appendChild(document.createElement("div"));
        b.innerHTML = `<div class="collapse-button-container"><input type="button" class="flat-button" value="minimize this"></div>`;
        b.querySelector(".flat-button").addEventListener("click", function(f) {
            e.classList.add("collapsed");
            e.title = "Click to expand this section";
            f.stopPropagation();
            if (e.getBoundingClientRect().top + window.scrollY < pageYOffset) {
                e.scrollIntoView({ behavior: "smooth" });
            }
        })
    })
    
    /* ---------------------- setting up menu: ---------------------- */
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".menu");
    
    function menuToggle(option) {
        if (option == "close" || option == "open") {
            menu.classList.toggle("hidden", option == "close");
        }
        else {
            menu.classList.toggle("hidden", !menu.classList.contains("hidden"));
        }
    }
    hamburger.addEventListener("click", menuToggle);
    window.addEventListener("click", function(e) {
        if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
            menuToggle("close");
        }
    });
    window.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            menuToggle("close");
            setLightbox("close");
        }
    });

    /* ---- ---- ---- ---- ---- ---- ---- set-up for menu items: ---- ---- ---- ---- ---- ---- ---- */
    setBrightness();
    document.getElementById("brightness-select").addEventListener("change", function() {
        setBrightness(this.value);
    });
    updateFonts();
    document.getElementById("heading-font-select").addEventListener("change", function() {
        localStorage.setItem("headingFont", this.value);
        updateFonts();
    });
    document.getElementById("body-font-select").addEventListener("change", function() {
        localStorage.setItem("bodyFont", this.value);
        updateFonts();
    });
    document.getElementById("table-font-select").addEventListener("change", function() {
        localStorage.setItem("tableFont", this.value);
        updateFonts();
    });
    if (localStorage.getItem(window.location.href + "-full-width") == "true") {
        HTML.classList.add("full-width");
        document.getElementById("page-full-width").checked = true;
    }
    document.getElementById("page-full-width").addEventListener("change", function() {
        HTML.classList.toggle("full-width", this.checked);
        localStorage.setItem(window.location.href + "-full-width", this.checked ? "true" : "false");
    });
    /* ---- ---- ---- ---- ---- ---- ---- table of contents ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    if (HTML.classList.contains("toc")) {
        document.getElementById("show-toc").addEventListener("change", function() {
            if (this.checked) {
                HTML.classList.add("toc");
                window.addEventListener("resize", tocWidthCheck);
                window.addEventListener("scroll", tocHighlightUpdateAttempt);
            } else {
                HTML.classList.remove("toc");
                window.removeEventListener("resize", tocWidthCheck);
                window.removeEventListener("scroll", tocHighlightUpdateAttempt);
            }
        });
        const toc = document.getElementById("table-of-contents");
        const headings = Array.from(document.getElementById("article").getElementsByClassName("toc-include"));
        toc.innerHTML = `<div class="toc-row"><div class="align-center space-between"><a class="toc-row" onclick="scrollToTop()" style="cursor: pointer;">(Top)</a>${ xButtonSvg }</div></div>` + headings.slice(1).map ( heading => `<a class="toc-row ${ heading.tagName.toLowerCase() }" href="#${ heading.id }">${ heading.innerHTML.replace(/\/?i>/g, "") }</a>` ).join("");

        console.log("headings.length: " + headings.length)
        console.log(headings)
        const rowsInToc = Array.from(toc.getElementsByClassName("toc-row")).slice(1);
        let lastHeading = -1;
        
        let canTocHighlightUpdate = true;
        function tocHighlightUpdateAttempt() {
            if (!canTocHighlightUpdate) { return; }
            canTocHighlightUpdate = false;
            setTimeout(() => {
                canTocHighlightUpdate = true;
                tocHighlightUpdate();
            }, 500);
            tocHighlightUpdate();
        }
        function tocHighlightUpdate() {
            let currentHeading = -1;
            for (let i = 0; i < headings.length; i += 1) {
                let elementDistanceFromPageTop = window.scrollY + headings[i].getBoundingClientRect().top;
                if (pageYOffset < elementDistanceFromPageTop - (0.4 * window.innerHeight)) {
                    break;
                }
                // if (pageYOffset < headings[i].offsetTop - (0.4 * window.innerHeight)) {
                    // break;
                // }
                currentHeading = i;
            }
            console.log("currentHeading: "+currentHeading )
            if (currentHeading != lastHeading) {
                rowsInToc.forEach( (row, n) => {
                    if (n == currentHeading) {
                        row.classList.add("active-heading");
                        let rRect = row.getBoundingClientRect();
                        let tRect = toc.getBoundingClientRect();
                        if (rRect.bottom + 20 > tRect.bottom) {
                            toc.scrollTo(
                                { top: row.offsetTop + row.offsetHeight - toc.clientHeight + 20, behavior: "smooth" }
                            );
                        }
                        /* To make it also scroll up: */
                        /*
                        else if (rRect.top < tRect.top) {
                            toc.scrollTo(
                                { top: row.offsetTop, behavior: "smooth" }
                            );
                        }
                        */
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
            if (!canTocWidthCheck) {
                return;
            }
            canTocWidthCheck = false;
            setTimeout(() => {
                canTocWidthCheck = true;
                HTML.classList.toggle("toc", window.innerWidth > 850);
            }, 333);
            HTML.classList.toggle("toc", window.innerWidth > 850);
        }
        window.addEventListener("resize", tocWidthCheck);
        window.addEventListener("scroll", tocHighlightUpdateAttempt);
        
        setTimeout(() => {
            tocWidthCheck();
            tocHighlightUpdateAttempt();
        }, 100);
        
        /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
        let canTocFadeCheck = true;
        function tocFadeCheck() {
            if (canTocFadeCheck) {
                canTocFadeCheck = false;
                setTimeout(() => {
                    canTocFadeCheck = true;
                    toc.classList.toggle("hide-mask", (toc.scrollTop + 30 > toc.scrollHeight - toc.offsetHeight));
                }, 250);
                toc.classList.toggle("hide-mask", (toc.scrollTop + 30 > toc.scrollHeight - toc.offsetHeight));
            }
        }
        toc.addEventListener("scroll", tocFadeCheck);
        toc.addEventListener("resize", tocFadeCheck);
        
        document.getElementById("toc-x-button").addEventListener("click", () => {
            document.getElementById("show-toc").checked = false;
            HTML.classList.remove("toc");
            window.removeEventListener("resize", tocWidthCheck);
            window.removeEventListener("scroll", tocHighlightUpdateAttempt);
        });
    }
    /* ---- ---- ---- ---- ---- / table of contents ---- ---- ---- ---- ---- ---- ---- */

    Array.from(article_.getElementsByTagName("p")).forEach(e => wrapDigits(e, "digit"));
    // Array.from(article_.getElementsByTagName("li")).forEach(e => wrapDigits(e, "digit"));
    // Array.from(article_.getElementsByTagName("td")).forEach(e => wrapDigits(e, "table-digit"));
    // Array.from(article_.getElementsByClassName("heading")).forEach(e => wrapDigits(e, "heading-digit"));
    
    document.getElementById("to-top-button").addEventListener("click", scrollToTop);
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */
    const mainNav = document.querySelector(".main-nav");
    let canNavStickyCheck = true;
    function navStickyCheck() {
        if (canNavStickyCheck) {
            canNavStickyCheck = false;
            setTimeout(() => {
                canNavStickyCheck = true;
                mainNav.classList.toggle("sticky-active", pageYOffset > 180);
            }, 333);
            mainNav.classList.toggle("sticky-active", pageYOffset > 180);
        }
    }
    navStickyCheck();
    window.addEventListener("scroll", navStickyCheck);
    /* ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- */

    if (document.title == "") {
        document.title = "Perennial Iris";
    }
})

function scrollToTop() {
    window.scrollTo({ behavior: "instant", top: 0 });
    history.replaceState(null, "", window.location.pathname + window.location.search);
    let toc = document.getElementById("table-of-contents");
    if (toc) {
        toc.scrollTo({ behavior: "instant", top: 0 });
    }
    
}

function setLightbox(action) {
    let lightbox = document.getElementById("lightbox");
    if (action == "close") {
        lightbox.src = "";
        lightbox.alt = "";
        HTML.classList.remove("lightbox");
    }
    else {
        let lbTopLeft = document.getElementById("lightbox-top-left");
        let lbCaption = document.getElementById("lightbox-caption");
        lightbox.src = action.src;
        lightbox.alt = action.alt;
        HTML.classList.add("lightbox");
        lbTopLeft.innerHTML = `<a href="${ action.src }">${ action.src.split("/").slice(-1) }</a>`;
        if (action.alt == "") {
            lbCaption.innerHTML = "";
        } else {
            lbCaption.innerHTML = action.alt;
        }
    }
}

/* -------------------------------- menu preference setters -------------------------------- */
function setBrightness(setValue) {
    let brightness = setValue || localStorage.getItem("brightness") || "light";
    HTML.classList.remove(...Array.from(document.getElementById("brightness-select").children).map(o => o.value).filter(o => o != brightness));
    HTML.classList.add(brightness);
    localStorage.setItem("brightness", brightness);
    document.getElementById("brightness-select").value = brightness;
}
function updateFonts() {
    let headingFont = localStorage.getItem("headingFont") || "Georgia";
    let bodyFont = localStorage.getItem("bodyFont") || "Georgia";
    let tableFont = localStorage.getItem("tableFont") || "Roboto";
    document.getElementById("heading-font-select").value = headingFont;
    document.getElementById("body-font-select").value = bodyFont;
    document.getElementById("table-font-select").value = tableFont;
    document.getElementById("--custom-style").innerHTML = ` body {
        --ff-heading: ${ headingFont=="Georgia"? "Georgia Pro":headingFont },sans-serif;
        --ff-heading-digit: ${ headingFont=="Georgia" ? "Georgia Pro":headingFont };
        --ff-article: ${ bodyFont },sans-serif;
        --ff-article-digit: ${ bodyFont=="Georgia" ? "Georgia Pro":bodyFont };
        --ff-table: ${ tableFont },sans-serif;
        --ff-table-digit: ${ tableFont=="Georgia" ? "Georgia Pro":tableFont };
        ${ bodyFont == "Times" || bodyFont == "Times New Roman" ? "--fs-article: 17px;" : "" }
        ${ headingFont == "Georgia" ? " --fw-h1: 600; --fw-h2: 600; " : "" }
    }`;
}
function menuRestoreDefaults() {
    localStorage.setItem("headingFont", "Georgia");
    localStorage.setItem("bodyFont", "Georgia");
    localStorage.setItem("tableFont", "Roboto");
    updateFonts();
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
    let infoNum = 1;
    let firstParagraph = true;
    let firstHeading = true;
    
    input = input.map( chunk => {
    
        if (chunk.startsWith("\\")) {
            return chunk.slice(1);
        }
        if (chunk == "---") {
            return "<hr>";
        }
        if (chunk.startsWith("!")) {
            return `<p class="info info-${infoNum++}">${ format_(chunk.slice(1)) }</p>`;
        }

        /* ------------------------------------ images ------------------------------------ */
        if (chunk.startsWith("||image-float")) {
            /* imgUrl | caption | alt-text/title */
            const lines = chunk.split("\n").slice(1).map( line => {
                const parts = line.split("|");
                while (parts.length < 3) {
                    parts.push("");
                }
                const imgUrl = "media/" + parts[0].trim();
                let figCaption = format_(parts[1].trim());
                let altText = format_(parts[2].trim().replace(/"/g,"&quot;"));
                if (figCaption && !altText) { altText = figCaption }
                if (figCaption) { figCaption = `<figcaption>${ figCaption }</figcaption>`; }
                
                return `<figure><img onclick="setLightbox(this)" src="${ imgUrl }" title="${ altText }" alt="${ altText }">${ figCaption }</figure>`;
            });
            return `<div class="image-float">${ lines.join("") }</div>`;
        }

        if (chunk.startsWith("||image-span")) {
            /* ||image-span maxHeight */
            /* imgUrl | alt-text/title */
            const rows = chunk.split("\n");
            let homeRow = rows.shift().substring("||image-span".length).trim();
            const galleryFigures = rows.map( line => {
                const parts = line.split("|");
                while (parts.length < 2) {
                    parts.push("");
                }
                let imgUrl = "media/" + parts[0].trim();
                let altText = format_(parts[1].trim().replace(/"/g,"&quot;"));
                return `<div><img style="max-height: ${homeRow || 300}px;" onclick="setLightbox(this)" src="${ imgUrl }" title="${ altText }" alt="${ altText }"></div>`;
            });
            return `<div class="image-span align-center space-evenly">${ galleryFigures.join("") }</div>`;
        }

        if (chunk.startsWith("||captioned-gallery")) {
            /* ||image-span maxHeight */
            /* imgUrl | caption | alt-text/title */
            const rows = chunk.split("\n");
            let homeRow = rows.shift().substring("||gallery".length).trim();
            let galleryFigures = rows.map( line => {
                const parts = line.split("|");
                while (parts.length < 3) {
                    parts.push("");
                }
                let imgUrl = "media/" + parts[0].trim();
                let caption = format_(parts[1].trim());
                let altText = format_(parts[2].trim().replace(/"/g,"&quot;"));
                return `<figure><img style="max-height: ${ homeRow || 300 }px;" onclick="setLightbox(this)" src="${ imgUrl }" title="${ altText }" alt="${ altText }"><figcaption>${ caption }</figcaption></figure>`;
            });
            return `<div class="captioned-gallery">${ galleryFigures.join("") }</div>`;
        }
        
        if (chunk.startsWith("||square-gallery")) {
            /* ||square-gallery gridHeight */
            /* imgUrl | alt-text/title */
            const rows = chunk.split("\n");
            let homeRow = rows.shift().substring("||image-span".length).trim();
            const lines = chunk.split("\n").slice(1).map( line => {
                const parts = line.split("|");
                while (parts.length < 3) {
                    parts.push("");
                }
                const imgUrl = "media/" + parts[0].trim();
                let figCaption = format_(parts[1].trim());
                let altText = format_(parts[2].trim().replace(/"/g,"&quot;"));
                if (figCaption) {
                    figCaption = `<figcaption>${ figCaption }</figcaption>`;
                }
                
                return `<figure><div class="center align-center"><img onclick="setLightbox(this)" src="${ imgUrl }" title="${ altText }" alt="${ altText }"></div>${ figCaption }</figure>`;
            });
            return `<div class="square-gallery">${ lines.join("") }</div>`;
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

        if (chunk.startsWith("||yt-gallery")) {
            let rows = chunk.split("\n");
            let galleryInfo = rows.shift().substring("||yt-gallery".length);
            let sortInput = galleryInfo.includes("sort");
            rows = rows.map(row => {
                row = row.replace(/\\\|/g, "&verbar;").split("|").map(d => d.trim());
                while (row.length < 3) {
                    row.push("");
                }
                return row;
            });
            if (sortInput) {
                rows.sort((a, b) => {
                    a = parseInt(a[2].replace(/\D/g, "")) || 0;
                    b =parseInt(b[2].replace(/\D/g, "")) || 0;
                    return b - a;
                });
            }
            let numToInclude = parseInt(galleryInfo.replace(/\D/g, "")) || rows.length;
            rows = rows.slice(0, numToInclude).map( row => {
                let title = row[0];
                let videoCode = row[1];
                let date = row[2];

                while (videoCode.charAt(videoCode.length - 1) == "/") {
                    videoCode = videoCode.substring(0, videoCode.length - 1);
                }
                videoCode = videoCode.split("/").slice(-1);

                let videoUrl = `https://www.youtube.com/watch?v=${ videoCode }`;
                let thumbUrl = `https://i.ytimg.com/vi/${ videoCode }/hqdefault.jpg`;

                let videoLink = `<a href="${ videoUrl }"><img src="${ thumbUrl }"></a>`;

                return `<figure>
                    <div>${ videoLink }</div>
                    <figcaption><span class="yt-title"><a href="${ videoUrl }">${ title }</a></span> <span class="yt-date">${ wrapDigits(date, "table-digit") }</span></figcaption>
                </figure>`;
            });
            return `<div class="table-wrapper"><div class="yt-gallery">${ rows.join("") }</div></div>`;
        }

        chunk = chunk.replaceAll("\\`", "&#96;");

        /* ------------------------------------- code ------------------------------------- */
        if (chunk.startsWith("||codeblock")) {
            let lines = chunk.split("\n");
            let syntaxClass = lines.shift().substring("||codeblock".length).trim();
            let divClass = "codeblock";
            if (syntaxClass) {
                divClass += " " + syntaxClass;
                lines = lines.map(line => syntaxHighlight(line, syntaxClass));
            }
            
            return `<div class="${divClass}">${ lines.map(line => `<div>${ line }</div>`).join("") }</div>`;
        }

        chunk = chunk.replace(/`(.+?)`/g, (match, captured) => {
            return `<code>${ captured.replaceAll("\"", "&quot;")
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

        if (chunk.startsWith(".")) {
            chunk = chunk.slice(1);
            pStyle.push("small");
        } /*  first-paragraph = first that's not small */
        else if (firstParagraph) {
            pStyle.push("first-paragraph");
            firstParagraph = false;
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
                    a = `<a href="${ address }>[internal]</a>`;
                }
                else {
                    a = `<a href=${ address }>${ displayText }</a>`
                }
            }
            else {
                if (displayText == "") {
                    a = `<a href="${ address }" title="${ address }" class="citeref">[${ linkNum }]</a>`;
                }
                else {
                    a = `<a href="${ address }" title="${ address }">${ displayText }</a>`;
                }
            }
            
            linkNum += 1;
            return a;
        });
        
        /* link to section on this page: */
        chunk = chunk.replace(/\[\[(.+?)\]\]/g, (match, displayText) => {
            return `<a title="Jump to section" href="#${ displayText.replaceAll(" ", "_") }">${ displayText }</a>`
        });

        /* ------------------------------------- table ------------------------------------- */
        if (chunk.startsWith("||table")) {
            let rows = chunk.split("\n");
            let firstRow = rows.shift().substring("||table".length).trim();
            let tableHead = "";
            if (rows[0].startsWith("||th")) {
                tableHead = rows.shift().substring("||th".length).trim();
            }
            /* make tbody cells */
            let tableWidth = 1;
            for (let r = 0; r < rows.length; r += 1) {
                let rowNum = r + 1;
                let cells = rows[r].replace(/\\\|/g, "&verbar;").split("|");
                for (let c = 0; c < cells.length; c += 1) {
                    let cellNum = c + 1;
                    cells[c] = `<td class="cell col-${ cellNum + " col-" + ((cellNum % 2 == 1) ? "odd" : "even") }">${ format_(cells[c].trim()) }</td>`;
                    if (c + 1 > tableWidth) {
                        tableWidth = c + 1;
                    }
                }
                rows[r] = `<tr class="row-${ rowNum + " row-" + ((rowNum % 2 == 1) ? "odd" : "even") }">${ cells.join("") }</tr>`;
            }
            /* if thead was included, construct it here: */
            if (tableHead) {
                tableHead = tableHead.replace(/\\\|/g, "&verbar;").split("|");
                if (tableHead.length == 1) {
                    /* for giving the table a title ("||th List of releases") */
                    tableHead = tableHead[0];
                    tableHead = `<thead><th class="toc-include" id="${ tableHead.replaceAll(" ", "_").replaceAll("*", "") }" colspan="${ tableWidth }">${ format_(tableHead) }</th></thead>`;
                }
                else {
                    /* for labelling columns ("||th Date | Name | Category") */
                    tableHead = `<thead>${ tableHead.map(c => `<th class="cell">${ c }</th>`).join("") }</thead>`;
                }
            }
            /* if ||table declaration had styling included: */
            let customTableStyle = "";
            if (firstRow.replace(/\s/g, "").length > 1) {
                customTableStyle = `<style>${ firstRow.replace(/this/g, ".auto-table-"+tableNum).replace(/;/g, " !important;") }</style>`;
            }

            let table = `${ customTableStyle }<div class="table-wrapper"><table class="auto-table auto-table-${ tableNum }">${ tableHead }<tbody>${ rows.join("") }</tbody></table></div>`;
            tableNum += 1;

            return table;
        }

        /* -------- technically not a table -------- */
        if (chunk.startsWith("||rows")) {
            let rows = chunk.split("\n").slice(1);
            for (let i = 0; i < rows.length; i += 1) {
                rows[i] = rows[i].replace(/\\\|/g, "&verbar;");
                let cells = rows[i].split("|");
                if (cells.length == 1) { cells.push(""); }
                for (let j = 0; j < cells.length; j += 1) {
                    cells[j] = `<div class="cell col-${ j + 1 } col-${ (j + 1) % 2 == 1 ? "odd" : "even" }">${ format_(cells[j]) }</div>`;
                }
                rows[i] = `<div class="row row-${ i + 1 } row-${ (i + 1) % 2 == 1 ? "odd" : "even" }">${ cells.join("") }</div>`;
            }
            return `<div class="table-wrapper"><div class="rows auto-table-${ tableNum++ }">${ rows.join("") }</div></div>`;
        }

        /* ---------------------------------- blockquote ---------------------------------- */
        if (chunk.startsWith("||indent")) {
            const lines = chunk.split("\n").slice(1).map( line => {
                if (line.startsWith("---")) {
                    return `<p class="attribution">${line}</p>`;
                }
                if (line.startsWith(".")) {
                    return `<div class="small">${ line.substring(1) }</div>`;
                }
                return `<p>${line}</p>`;
            })

            return `<blockquote>${ format_(lines.join("")) }</blockquote>`;
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
                return li_ + `>${ format_(line) }</li>`;
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
            return `<ul class="auto-list short">${ chunk.split("\n").map(li => `<li>${ format_(li.substring(2).trim()) }</li>`).join("") }</ul>`;
        }
        
        /* ----------------------------------- headings ----------------------------------- */
        if (/^\#{1,4} /.test(chunk)) {
            const headingTag = "h" + chunk.indexOf(" ");
            chunk = chunk.slice(chunk.indexOf(" ") + 1);
            const headingId = chunk.replaceAll(" ", "_").replaceAll("---", "&mdash;").replaceAll("--", "&ndash;").replaceAll("*" ,"");
            
            if (headingTag == "h4") {
                return `<h4 id="${ headingId }" class="heading">${ format_(chunk) }</h4>`;
            }
            if (headingTag == "h1" && firstHeading) {
                return `<h1 id="${ headingId }" class="heading toc-include first-heading">${ format_(chunk) }</h1>`;
            }
            firstHeading = false;
            return `<${ headingTag } id="${ headingId }" class="heading toc-include">${ format_(chunk) }</${ headingTag }>`;
        }

        /* ----------------------------------- see also ----------------------------------- */
        if (chunk.startsWith("||see-also")) {
            document.getElementById("article").parentNode.appendChild(document.createElement("div")).innerHTML = "<div class=\"see-also\"><div>This content was also posted here:</div>" + chunk.split("\n").slice(1)
                .map( line => {
                    const url = line .replace(/substack\|(\w+)/, "https://perennialiris.substack.com/p/$1")
                        .replace(/tumblr\|(\d+)/, "https://perennialiris.tumblr.com/post/$1");
                    return `<div><a href="${ url }" target="_blank">${ url }</a></div>`;
                }).join("") + "</div>";
            return;
        }

        /* ------------------------ finalizing (normal paragraphs) ------------------------ */
        
        chunk = format_(chunk);
        
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

function format_(input_string) {
    input_string = input_string.trim();
    if (input_string == "") { return input_string; }
    
    let output = "";
    
    /* first: replacements that shouldn't affect inside of tags */
    let left = 0;
    let overflow_check = 0;
    while (true) {
        /* the logic here is funky because it makes curly quotes easier (see wrapDigits for alternative logic) */
        let openTag = input_string.indexOf("<"),
            closeTag = openTag + input_string.substring(openTag).indexOf(">");
        if (openTag == -1 || closeTag == -1) { break; }
        output += replacements_(input_string.substring(0, openTag + 1)) + input_string.substring(openTag + 1, closeTag);
        input_string = input_string.substring(closeTag);
        
        if (overflow_check++ > 99) { break; }
            // prevent recursion while testing
    }
    return (output + replacements_(input_string))
        .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.+?)\*/g, "<i>$1</i>");
}

function replacements_(input_string) {
    if (input_string == "") { return input_string; }
    /* escaped symbols */
    input_string = input_string.replaceAll("\\*", "&ast;")
        .replaceAll('\\"', "&quot;")
        .replaceAll("\\'", "&apos;")
        .replaceAll("\|", "&verbar;")
        .replaceAll("\\(", "&lpar;")
        .replaceAll("\\)", "&rpar;")
        .replaceAll("\\[", "&lbrack;")
        .replaceAll("\\]", "&rbrack;")
        .replaceAll("\\", "&#92;")
        .replaceAll("\\^", "&Hat;");

    /* curly quotes: */
    if (input_string.indexOf("'") != -1 || input_string.indexOf("\"") != -1) {
        // console.log(input_string)
        input_string = input_string
            .replaceAll(/ '(\d{2}\D)/g, " &rsquo;$1") /* like for saying '95 to indicate a year */
            .replaceAll(/(>|^| |\()'/g, "$1&lsquo;")
            .replaceAll(/(\*|>|-)'(\w)/g, "$1&lsquo;$2")
            .replaceAll(/'/g, "&rsquo;")
            
            .replaceAll(/(>|^| |\()"/g, "$1&ldquo;")
            .replaceAll(/(\*|>|-)"(\w)/g, "$1&ldquo;$2")
            .replaceAll(/"(,|\.)/g, "<span style='margin-right:-2px'>&rdquo;</span>$1")
            .replaceAll(/"/g, "&rdquo;");
    }
    /* dashes */
    input_string = input_string.replaceAll("---", "<span class='mdash'>&mdash;</span>")
        .replaceAll("--", "&ndash;");
    
    return input_string;
}

function wrapDigits(arg, targetClass) {
    if (typeof arg != "string") {
        arg.innerHTML = wrapDigits(arg.innerHTML, targetClass);
    }
    else {
        let output = "";
        if (!targetClass) {
            targetClass = "digit";
        }
        
        while (true) {
            const openTag = arg.indexOf("<");
            const closeTag = arg.indexOf(">");
            if (openTag == -1 || closeTag == -1) { break; }
            
            let display_text = arg.substring(0, openTag);
            let tag_and_attributes = arg.substring(openTag, closeTag + 1);
            
            output += display_text.replace(/(\d+)/g, `<span class="${targetClass}">$1</span>`);
            output += tag_and_attributes;
            
            arg = arg.substring(closeTag + 1);
        }
        output += arg.replace(/(\d+)/g, `<span class="${targetClass}">$1</span>`);
        return output;
    }
}

function wrapElementType(rootElement, tagName, className) {
    if (typeof rootElement == "string") { rootElement = document.getElementById("article") }
    Array.from(rootElement.getElementsByTagName(tagName)).forEach(ele => wrapDigits(ele, className));
}

function tokenizeByWordChar(stringData) {
    let overflow_check = 0;
    
    const result = [];
    while (stringData.length > 0) {
        let point = stringData.search( /[a-zA-Z0-9_$]/.test(stringData[0]) ? /[^a-zA-Z0-9_$]/ : /[a-zA-Z0-9_$]/ );
        if (point == -1) {
            result.push(stringData);
            break;
        }
        result.push(stringData.substring(0, point));
        stringData = stringData.substring(point);
        
        if (overflow_check++ > 99) break;
            // prevent recursion while testing
    }
    return result;
}

function colorizeKeywords(stringInput, syntaxClass, customKeywords) {
    return tokenizeByWordChar(stringInput).map(word => {
        if (KEYWORDS[syntaxClass] && KEYWORDS[syntaxClass].includes(word)) {
            return `<span class="code-blue">${ word }</span>`;
        }
        else if (customKeywords && customKeywords.includes(word)) {
            return `<span class="code-purple">${ word }</span>`;
        }
        else if (/^\d+$/.test(word)) {
            return `<span class="code-orange">${ word }</span>`;
        }
        return word;
    }).join("");
}

const KEYWORDS = {
    cpp: "alignas alignof and and_eq asm auto bitand bitor bool break case catch char char16_t char32_t char8_t class co_await co_return co_yield compl concept const const_cast consteval constexpr constinit continue decltype default delete do double dynamic_cast else enum explicit export extern false final float for friend goto if inline int long mutable namespace new noexcept not not_eq nullptr operator or or_eq private protected public register reinterpret_cast requires return short signed sizeof static static_assert static_cast struct switch template this thread_local throw true try typedef typeid typename union unsigned using virtual void volatile wchar_t while xor xor_eq".split(" "),
    cs: "abstract add alias allows and args as ascending async await base bool break by byte case catch char checked class const continue decimal default delegate descending do double dynamic else enum equals event explicit extension extern false field file finally fixed float for foreach from get global goto group if implicit in init int interface internal into is join let lock long managed nameof namespace new nint not notnull nuint null object on operator or orderby out override params partial partial private protected public readonly record ref remove required return sbyte scoped sealed select set short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unmanaged unmanaged unsafe ushort using value var virtual void volatile when where where while with yield".split(" "),
    java: "abstract continue for new switch assert default goto package synchronized boolean do if private this break double implements protected throw byte else import public throws case enum instanceof return transient catch extends int short try char final interface static void class finally long strictfp volatile const float native super while".split(" ")
};

function syntaxHighlight(stringInput, syntaxClass) {
    let output = "";
    let overflow_check = 0;
    while (true) {
        const openTag = stringInput.indexOf("<");
        const closeTag = stringInput.indexOf(">");
        if (openTag == -1 || closeTag == -1) {
            break;
        }

        let display_text = stringInput.substring(0, openTag);
        let tag_and_attributes = stringInput.substring(openTag, closeTag + 1);

        output += colorizeKeywords(display_text, syntaxClass);
        output += tag_and_attributes;

        stringInput = stringInput.substring(closeTag + 1);
        if (overflow_check++ > 99) break;
            // prevent recursion while testing
    }
    output += colorizeKeywords(stringInput, syntaxClass);

    output = output.replace(/(\/\/.*)/, "<span class=\"code-commented\">$1</span>")
        .replace(/(#.*)/, "<span class=\"code-macro\">$1</span>");

    return output;
}







