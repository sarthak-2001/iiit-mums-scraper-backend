const rp = require("request-promise");
const cheerio = require("cheerio");
const { login } = require("./login");

let facultySearch = async function (uid, pwd, search) {
  let user = await login(uid, pwd);
  let cookie = user.cookie;

  let data = { faculty: [] };

  let option = {
    url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/search/facList.php",
    simple: false,
    resolveWithFullResponse: true,
    form: {
      SRCHTERM: search,
    },
    headers: {
      Cookie: cookie,
      Referer:
        "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/search/facList.php",
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:54.0) Gecko/20100101 Firefox/54.0",
      Connection: "keep-alive",
    },
  };
  let res = await rp.post(option);
  // console.log(res.body);

  const $ = cheerio.load(res.body);

  $("tbody")
    .children()
    .each((i, ele) => {
      const name = $(ele)
        .find("td")
        .eq(1)
        .text()
        .replace(/^\s+|\s+$/g, "");

      const dept = $(ele)
        .find("td")
        .eq(2)
        .text()
        .replace(/^\s+|\s+$/g, "");

      const link = $(ele).find("a").attr("href");

      data.faculty.push({
        name,
        dept,
        link,
      });
    });
  // console.log(data);
  return data;
};

module.exports = { facultySearch: facultySearch };
