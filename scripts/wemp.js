const titles = require("../data/manga_title.json");
const puppeteer = require("puppeteer");
const fs = require("fs");
const URL = "https://wemp.app/posts/7d6aaba7-511d-416f-87f7-27acc7ea7f3b";
let pageList = {};

(async () => {
    console.log("BEFORTE LAUNCH");
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-first-run",
            "--no-sandbox",
            "--no-zygote",
            "--single-process"
        ],
        executablePath: "/usr/bin/chromium-browser"
    });
    console.log("after launch");
    const page = await browser.newPage();
    console.log("after new page");
    await page.goto(URL, { waitUntil: "load", timeout: 0 });
    console.log("after go to");
    let count = 0;
    pageList = await page
        .evaluate(
            ({ pageList }) => {
                let name = document
                    .querySelectorAll("[data-role='paragraph']")[0]
                    .querySelectorAll("span")[3].textContent;
                console.log("namne", name);
                pageList[name] = {
                    name: name
                };
                return pageList;
            },
            { pageList }
        )
        .catch(e => {
            throw e;
        });
    console.log("after evaluate");
    await page.close();
    fs.writeFileSync("./data/testList.json", JSON.stringify(pageList, null, 4));
    await browser.close();
})();
