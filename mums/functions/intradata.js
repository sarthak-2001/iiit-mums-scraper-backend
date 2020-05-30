const rp = require("request-promise");
const { login } = require("./login");

const cheerio = require("cheerio");

let intraDataScraper = async function (cookie, id) {
  // let user = await login(uid, pwd);
  // let cookie = user.cookie;
  try {
    let mainUrl =
      "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/intraRes/docDet.php?docid=" +
      id;
    let option = {
      url: mainUrl,
      simple: false,
      resolveWithFullResponse: true,
      headers: {
        Cookie: cookie,
        Referer:
          "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/intraRes/docList.php",
      },
    };

    let res = await rp.get(option);
    const $ = cheerio.load(res.body);

    // console.log(res.body);

    let content = $("div.well").html();
    // console.log(content);

    let preAttachment = $("a").next().next().next().next().next().attr("href");
    // console.log(preAttachment);

    let isAttach = false;
    let url;
    if (preAttachment == undefined) {
      isAttach = false;
    } else {
      isAttach = true;

      url = `https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/intraRes/${preAttachment}`;
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
    // console.log(data);

    return data;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { intraDataScraper };
