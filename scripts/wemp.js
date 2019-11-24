const puppeteer = require("puppeteer");
const fs = require("fs");
const URL = "https://wemp.app/posts/7d6aaba7-511d-416f-87f7-27acc7ea7f3b";
let title_list = require("../data/manga_title.json");
let manga_list = require("../data/manga_list.json");

(async () => {
    // console.log("BEFORTE LAUNCH");
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
    // console.log("after launch");
    const page = await browser.newPage();
    // console.log("after new page");
    // timeout: 0 to wait infinitely
    await page.goto(URL, { waitUntil: "load", timeout: 0 });
    // console.log("after go to");
    manga_list = await page
        .evaluate(
            ({ manga_list }) => {
                let title_alt = document
                    .querySelectorAll("[data-role='paragraph']")[0]
                    .querySelectorAll("span")[3].textContent;
                let post_title = document.querySelector(".post__title")
                    .innerText;
                let titlePattern = /[「【](.*)[】」]\s?.{1}(\d+).{1}/;
                // let numPattern = /(\d+)/;
                // let chinPattern =  /[\u3000-\u303f]([\u4E00-\u9FA5]+[,]?\W?[\u4E00-\u9FA5]+)\W?[\u4E00-\u9FA5](\d+)[\u4E00-\u9FA5]/;

                if (titlePattern.exec(post_title) === null) {
                    return;
                }
                let title = titlePattern.exec(post_title)[1];
                let chapNum = titlePattern.exec(post_title)[2];

                return manga_list;
            },
            { manga_list }
        )
        .catch(e => {
            throw e;
        });
    console.log("after evaluate");
    await page.close();
    fs.writeFileSync("./data/testList.json", JSON.stringify(pageList, null, 4));
    await browser.close();
})();
