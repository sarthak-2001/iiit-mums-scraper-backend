const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");
//const db = require("../firebase/firebaseInit");

let course_data = async function (uid, pwd) {
  let user = await login(uid, pwd);
  let cookie = user.cookie;
  let option = {
    url:
      "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docList1.php",
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:54.0) Gecko/20100101 Firefox/54.0",
      Connection: "keep-alive",
      Referer: "https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/aisMenu.php",
      Cookie: cookie,
    },
  };
  let data = { Course_info: [] };
  let res = await rp.get(option);
  const $ = cheerio.load(res.body);

  $("tbody")
    .children()
    .each((i, ele) => {
      const sem = $(ele).find("td").eq(0).text();
      const subject = $(ele)
        .find("td")
        .eq(1)
        .text()
        .replace(/^\s+|\s+$/g, "");
      const credit = $(ele)
        .find("td")
        .eq(2)
        .text()
        .replace(/^\s+|\s+$/g, "");
      const coid = $(ele)
        .find("a")
        .attr("href")
        .split("=")[1]
        .replace(/^\s+|\s+$/g, ""); //OR slice(17)
      const course_link = $(ele)
        .find("a")
        .attr("href")
        .replace(/^\s+|\s+$/g, "");
      data.Course_info.push({
        sem,
        subject,
        credit,
        coid,
        course_link,
      });
    });
  //console.log(data.Course_info);
  return data;
};

module.exports = course_data;
