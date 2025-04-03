/*const allLinks = document.querySelectorAll("a");

allLinks.forEach(link => {
    link.onclick = e => {
        e.preventDefault();
        fetch(link.href)
            .then(response => {
                return response.text()
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html")
                const title = doc.querySelector("title").textContent;
                console.log(doc);

                window.history.pushState({"html":html,"pageTitle":title},"", link.href);
                document.querySelector('html').innerHTML = html;
            })
            .catch(error => {
                console.error('Failed to fetch page: ', error)
            })
    };
});*/