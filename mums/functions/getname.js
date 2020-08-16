const rp = require("request-promise");
const cheerio = require("cheerio");
const { login } = require("./login");

let nameScraper = async function (uid, pwd) {
  let user = await login(uid, pwd);
  let cookie = user.cookie;

  let url =
    "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/vwGrades/docList1.php?tid=";


  let data;

  let option = {
    url: "https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/aisMenu.php" ,
    simple: false,
    resolveWithFullResponse: true,

    headers: {
      Cookie: cookie,
      Referer:
        "https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/blank.php?logo=",
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:54.0) Gecko/20100101 Firefox/54.0",
      Connection: "keep-alive",
    },
  };

  let res = await rp.get(option);
  const $ = cheerio.load(res.body);
  data = $('h3').text();
  data = data.split(' ')[1];
  console.log(data);


  return data;
};
module.exports = {nameScraper};