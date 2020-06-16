const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");
const db = require("../firebase/firebaseInit");

let noticedataScraper = async function (cookie, id) {
  try {
    let mainUrl =
      "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/nb/docDet.php?docid=" + id;
    let option = {
      url: mainUrl,
      simple: false,
      resolveWithFullResponse: true,
      headers: {
        Cookie: cookie,
        Referer: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/nb/docList.php",
      },
    };

    let res = await rp.get(option);
    const $ = cheerio.load(res.body);

    let content = $("div.well")
      .text()
      .replace(/^\s+|\s+$/g, "");
    let preAttachment = $("a.btn-danger").attr("href");
    let isAttach = false;
    let url;
    if (preAttachment == undefined) {
      isAttach = false;
    } else {
      isAttach = true;
      url = `https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/nb/${preAttachment}`;
    }
    let attachmentLink = "";
    if (isAttach == true) {
      let option2 = {
        url: url,
        simple: false,
        resolveWithFullResponse: true,
        headers: {
          Cookie: cookie,
          Referer: mainUrl,
        },
      };
      let res2 = await rp.get(option2);
      const $ = cheerio.load(res2.body);
      attachmentLink = $("iframe").attr("src").toString();
      attachmentLink = attachmentLink.split("..")[2];

      attachmentLink = "https://hib.iiit-bh.ac.in/m-ums-2.0" + attachmentLink;
    }

    let data = {
      content,
      attachmentLink,
    };

    return data;
  } catch (e) {
    console.log(e);
  }
};
module.exports = { noticedataScraper };
