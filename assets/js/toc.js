// The sidebar from _includes/toc.html: lists the current page's sections,
// highlights the one being read, and opens as a drawer on small screens.
(function () {
    var toc = document.getElementById("toc");
    if (!toc) return;

    // 1. the sections (## and ###) of the current page, under its entry
    var current = toc.querySelector("li.current");
    var headings = Array.prototype.filter.call(
        document.querySelectorAll("article h2[id], article h3[id]"),
        function (h) { return !h.closest("details"); });
    var links = [];
    if (current && headings.length) {
        var list = document.createElement("ol"), sub = null;
        headings.forEach(function (h) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "#" + h.id;
            a.textContent = h.textContent;
            li.appendChild(a);
            if (h.tagName === "H3" && list.lastChild) {
                if (!sub || sub.parentNode !== list.lastChild) {
                    sub = document.createElement("ol");
                    list.lastChild.appendChild(sub);
                }
                sub.appendChild(li);
            } else {
                list.appendChild(li);
            }
            links.push({ heading: h, link: a });
        });
        // right under the page's link, above the chapter's other pages
        current.insertBefore(list, current.firstElementChild.nextSibling);
    }

    // 2. highlight the section at the top of the window
    var ticking = false;
    function spy() {
        ticking = false;
        var active = null;
        links.forEach(function (l) {
            if (l.heading.getBoundingClientRect().top < window.innerHeight * 0.25) active = l;
        });
        links.forEach(function (l) { l.link.classList.toggle("active", l === active); });
        if (active && toc.scrollHeight > toc.clientHeight) {
            var r = active.link.getBoundingClientRect(), t = toc.getBoundingClientRect();
            if (r.top < t.top || r.bottom > t.bottom) active.link.scrollIntoView({ block: "nearest" });
        }
    }
    if (links.length) {
        window.addEventListener("scroll", function () {
            if (!ticking) { ticking = true; requestAnimationFrame(spy); }
        }, { passive: true });
        spy();
    }

    // 3. the drawer on small screens
    var button = document.querySelector(".toc-toggle");
    var backdrop = document.querySelector(".toc-backdrop");
    function setOpen(open) {
        toc.classList.toggle("open", open);
        button.setAttribute("aria-expanded", open);
        backdrop.hidden = !open;
    }
    button.addEventListener("click", function () { setOpen(!toc.classList.contains("open")); });
    backdrop.addEventListener("click", function () { setOpen(false); });
    toc.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && toc.classList.contains("open")) { setOpen(false); button.focus(); }
    });
})();
