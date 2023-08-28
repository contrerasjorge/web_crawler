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

module.exports = {
    normalizeURL,
    getURLsFromHTML,
};
