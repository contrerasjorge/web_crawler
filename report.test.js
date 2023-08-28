const { test, expect } = require("@jest/globals");
const { sortPages } = require("./report");

test("sortPages", () => {
    const input = {
        "https://wagslane.dev": 3,
        "https://wagslane.dev/path": 1,
    };
    const actual = sortPages(input);
    const expected = [
        ["https://wagslane.dev", 3],
        ["https://wagslane.dev/path", 1],
    ];
    expect(actual).toEqual(expected);
});

test("sortPages 6 pages", () => {
    const input = {
        "https://wagslane.dev": 3,
        "https://wagslane.dev/path": 1,
        "https://wagslane.dev/path1": 33,
        "https://wagslane.dev/path2": 7,
        "https://wagslane.dev/path4": 2,
        "https://wagslane.dev/path5": 8,
    };
    const actual = sortPages(input);
    const expected = [
        ["https://wagslane.dev/path1", 33],
        ["https://wagslane.dev/path5", 8],
        ["https://wagslane.dev/path2", 7],
        ["https://wagslane.dev", 3],
        ["https://wagslane.dev/path4", 2],
        ["https://wagslane.dev/path", 1],
    ];
    expect(actual).toEqual(expected);
});
