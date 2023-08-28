const { JSDOM } = require("jsdom");

function normalizeURL(urlString) {
    const url = new URL(urlString);
    const myUrl = `${url.hostname}${url.pathname}`;

    return myUrl.replace(/\/$/, "");
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkTags = dom.window.document.querySelectorAll("a");
    for (const linkTag of linkTags) {
        if (linkTag.href.slice(0, 1) === "/") {
            // relative url
            try {
                const urlObj = new URL(`${baseURL}${linkTag.href}`);
                urls.push(urlObj.href);
            } catch (err) {
                console.log(`error with relative url: ${err.message}`);
            }
        } else {
            try {
                const urlObj = new URL(linkTag.href);
                urls.push(urlObj.href);
            } catch (err) {
                console.log(`error with url: ${err.message}`);
            }
        }
    }
    return urls;
}

async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);

    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++;
        return pages;
    }

    pages[normalizedCurrentURL] = 1;

    console.log(`actively crawling ${currentURL}`);

    try {
        const resp = await fetch(currentURL);

        if (resp.status > 399) {
            console.log(
                `error in fetch with status code: ${resp.status} on page: ${currentURL}`,
            );
            return pages;
        }

        const contentType = resp.headers.get("content-type");
        if (!contentType.includes("text/html")) {
            console.log(
                `non html response, content type: ${contentType}, on page: ${currentURL}`,
            );
            return pages;
        }

        const htmlBody = await resp.text();

        const nextURLs = getURLsFromHTML(htmlBody, baseURL);

        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages);
        }
    } catch (err) {
        console.log(`error in fetch: ${err.message}, on page ${currentURL}`);
    }

    return pages;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
};
