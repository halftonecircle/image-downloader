const fs = require("fs");
const fetch = require("node-fetch");
const url =
    "https://mmbiz.qpic.cn/mmbiz_jpg/efFQI8s0dn7UEnHA5GtOkkqkDNgoRRTuKdbStcBv7Qsq1yn1mhVs0x2giciaibMjiaQdHzLop9DQA7lCFIfJFnkdnQ/640?wx_fmt=jpeg";
const filename = "1.jpeg";
// {}: can be used to iunclude method, headers, payload, cookies
fetch(url, {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    }
})
    .then(res => {
        return new Promise((resolve, reject) => {
            const destination = fs.createWriteStream(`./images/${filename}`);
            res.body.pipe(destination);
            res.body.on("end", () => {
                return resolve("done");
            });
            destination.on("error", reject);
        });
    })
    .then(console.log)
    .catch(console.log);
