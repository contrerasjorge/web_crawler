const { test, expect } = require("@jest/globals");
const { getURLsFromHTML, normalizeURL } = require("./crawl.js");

urls = [
    "https://blog.boot.dev/path/",
    "https://blog.boot.dev/path",
    "http://blog.boot.dev/path/",
];

const normalizedOutput = "blog.boot.dev/path";

test("normalizeURL", () => {
    for (let i = 0; i < urls.length; i++) {
        expect(normalizeURL(urls[i])).toEqual(normalizedOutput);
    }
});

test("getURLsFromHTML absolute", () => {
    const inputHtml = `
        <html>
        <body>
        <a href='https://blog.boot.dev/path/'>
        Boot.dev Blog</a>
        </body>
        </html>
    `;

    const inputUrl = "https://blog.boot.dev/path/";

    const actual = getURLsFromHTML(inputHtml, inputUrl);
    const expected = ["https://blog.boot.dev/path/"];
    expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
    const inputHtml = `
        <html>
        <body>
        <a href='/path/'>
        Boot.dev Blog</a>
        </body>
        </html>
    `;

    const inputUrl = "https://blog.boot.dev";

    const actual = getURLsFromHTML(inputHtml, inputUrl);
    const expected = ["https://blog.boot.dev/path/"];
    expect(actual).toEqual(expected);
});

test("getURLsFromHTML multiple urls", () => {
    const inputHtml = `
        <html>
        <body>

        <a href='https://blog.boot.dev/path1/'>
            Boot.dev Blog
        </a>

        <a href='/path2/'>
            Boot.dev Blog
        </a>

        </body>
        </html>
    `;

    const inputUrl = "https://blog.boot.dev";

    const actual = getURLsFromHTML(inputHtml, inputUrl);
    const expected = [
        "https://blog.boot.dev/path1/",
        "https://blog.boot.dev/path2/",
    ];
    expect(actual).toEqual(expected);
});

test("getURLsFromHTML invalid url", () => {
    const inputHtml = `
        <html>
        <body>

        <a href='invalid'>
            Invalid url
        </a>

        </body>
        </html>
    `;

    const inputUrl = "https://blog.boot.dev";

    const actual = getURLsFromHTML(inputHtml, inputUrl);
    const expected = [];
    expect(actual).toEqual(expected);
});
