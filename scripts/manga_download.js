const puppeteer = require("puppeteer");
const fs = require("fs");
const URL = "https://wemp.app/posts/7d6aaba7-511d-416f-87f7-27acc7ea7f3b";

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
    // timeout: 0 to wait infinitely
    await page.goto(URL, { waitUntil: "load", timeout: 0 });
    console.log("after go to");
    page.on("console", msg => console.log(msg.text()));
    let [url_list, title] = await page
        .evaluate(() => {
            let url_list = [];
            let title_alt = document
                .querySelectorAll("[data-role='paragraph']")[0]
                .querySelectorAll("span")[3].textContent;
            let post_title = document.querySelector(".post__title").innerText;
            let titlePattern = /[「【](.*)[】」]\s?.{1}(\d+).{1}/;
            // let numPattern = /(\d+)/;
            // let chinPattern =  /[\u3000-\u303f]([\u4E00-\u9FA5]+[,]?\W?[\u4E00-\u9FA5]+)\W?[\u4E00-\u9FA5](\d+)[\u4E00-\u9FA5]/;
            // console.log("post_title", post_title);
            if (titlePattern.exec(post_title) === null) {
                return;
            }
            let title = title_alt + "_" + titlePattern.exec(post_title)[2];
            document.querySelectorAll("#content>p>img").forEach(img => {
                url_list.push(img.src);
            });
            return [url_list, title];
        }, {})
        .catch(e => {
            throw e;
        });
    console.log("after evaluate, title", title);
    console.log("list of url", url_list);
    fs.writeFileSync(
        `./data/temp/${title}.json`,
        JSON.stringify(url_list, null, 4)
    );
    await page.close();
    await browser.close();
})();
