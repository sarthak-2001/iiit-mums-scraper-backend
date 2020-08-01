const rp = require("request-promise");
const cheerio = require("cheerio");
const { login } = require("./login");

let sgpaScraper = async function (uid, pwd) {
  let user = await login(uid, pwd);
  let cookie = user.cookie;

  let url =
    "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/vwGrades/docList1.php?tid=";


  let data = { sems: [] };

  for (let i = 1; i <= 8; i++) {
    let local_url = url + `${i}`;
    let option = {
      url: local_url,
      simple: false,
      resolveWithFullResponse: true,

      headers: {
        Cookie: cookie,
        Referer:
          "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/vwGrades/docList1.php",
        "User-Agent":
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:54.0) Gecko/20100101 Firefox/54.0",
        Connection: "keep-alive",
      },
    };

    let res = await rp.get(option);
    const $ = cheerio.load(res.body);

    let mark_line = $("h3")
      .text()
      .replace(/^\s+|\s+$/g, "");

    //   console.log(cgpa);
    let sgpa = mark_line.split(" ")[3].toString();
    let cgpa = mark_line.split(" ")[6];
    if (sgpa == "CGPA:") break;


    if (i == 1) {
      data.sems.push({
        cgpa: cgpa,
      });
    }
    data.sems.push({
      sem: i,
      sgpa: sgpa.slice(0,-1),
    });
    
  }


  return data;
};

module.exports = {sgpaScraper};