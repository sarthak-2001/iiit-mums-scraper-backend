const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");

let noitces = async function (uid, pwd) {
  let user = await login(uid, pwd);
  let cookie = user.cookie;  

  let option = {
    url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/nb/docList.php",
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Cookie: cookie,
      Referer: "https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/?w=766&h=749",
    },
  };

  let data = { Notices: [] };
  let res = await rp.post(option);
  const $ = cheerio.load(res.body);

  $("tbody")
    .children()
    .each((i, ele) => {
      // if(i==2)
      //   return false;

      const date = $(ele)
        .find("td")
        .eq(1)
        .text()
        .replace(/^\s+|\s+$/g, "");
      const full_heading = $(ele)
        .find("td")
        .eq(2)
        .text()
        .replace(/^\s+|\s+$/g, "");
      const replaced_full_heading = full_heading
        .split("--")[1]
        .replace("Attention:", "---")
        .replace("Posted by:", "---")
        .toString();

      const title = full_heading.split("--")[0].replace(/^\s+|\s+$/g, "");
      const attention = replaced_full_heading
        .split("---")[1]
        .replace(/^\s+|\s+$/g, "");
      const posted_by = replaced_full_heading
        .split("---")[2]
        .replace(/^\s+|\s+$/g, "");
      const id_link = $(ele).find("a").attr("href");
      const doc_id = $(ele).find("a").attr("href").slice(17);
      data.Notices.push({
        date,
        title,
        attention,
        posted_by,
        doc_id,
        id_link,
      });
    });
  // console.log(data.Notices);
  return data;
};

module.exports = noitces;


