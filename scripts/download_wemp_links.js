const fs = require("fs");
const fetch = require("node-fetch");
const title_map = require("../data/title_list.json");
let titleName = "ゆびさきと恋々_04";
// title_map[titleName] => roman
let [filename_partial, chapnum] = titleName.split("_");
if (!title_map.hasOwnProperty(filename_partial)) {
    throw "no english name for this title: " + filename_partial;
}
const url_list = require(`../data/temp/${titleName}.json`);
// split on _ and expand into new variables
let filename = title_map[filename_partial] + "_" + chapnum;
// fs function runs from current working directory, so here its
// "./data" instead of "../data..."
let dir = `../../../Downloads/Manga/${title_map[filename_partial]}/${chapnum}`;
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}
console.log("file name", filename);
// process.exit();
// {}: can be used to iunclude method, headers, payload, cookies
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}
async function download() {
    for (i = 0; i < url_list.length; i++) {
        await fetch(url_list[i], {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
            }
        })
            .then(res => {
                return new Promise((resolve, reject) => {
                    const destination = fs.createWriteStream(
                        `${dir}/${pad(i, 3)}.jpeg`
                    );
                    res.body.pipe(destination);
                    res.body.on("end", () => {
                        return resolve("done");
                    });
                    destination.on("error", reject);
                });
            })
            .then(console.log)
            .catch(console.log);
    }
}

download();
