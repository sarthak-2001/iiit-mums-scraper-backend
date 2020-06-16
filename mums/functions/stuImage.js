const rp = require("request-promise");
const cheerio = require("cheerio");
const { login } = require("./login");

let studentImage = async function (uid, pwd, link) {
  let user = await login(uid, pwd);
  let cookie = user.cookie;

  let option = {
    url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/search/" + link,
    simple: false,
    resolveWithFullResponse: true,

    headers: {
      Cookie: cookie,
      Referer:
        "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/search/stuList.php",
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:54.0) Gecko/20100101 Firefox/54.0",
      Connection: "keep-alive",
    },
  };

  let res = await rp.get(option);
  const $ = cheerio.load(res.body);

  let img_link = $("img").attr("src").toString();
  // console.log(img_link);
  img_link = "https://hib.iiit-bh.ac.in/m-ums-2.0/" + img_link.split("../")[2];

  return img_link;
};
module.exports = { studentImage };
