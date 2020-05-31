const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");
const db = require("../firebase/firebaseInit");

let attendance_scraper = async function (uid, pwd,coid) {
  let user = await login(uid, pwd);
  let cookie = user.cookie;

  let option = {
    url:
      "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docDet1.php?coid="+coid,
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Cookie: cookie,
      Referer:
        "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docList1.php",
    },
  };
  let data = { Attendance: [] };
    rp.get(option)
    .then((res1) => {
      let option2 = {
        url:
          "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/coClassSch/docList1.php",
        simple: false,
        resolveWithFullResponse: true,
        headers: {
          Cookie: cookie,
          Referer:
            "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docDet1.php?coid="+coid,
        },
      };
      rp.get(option2)
        .then((res) => {
            console.log(res.body)
        })
    })
}

attendance_scraper("b418018","barbie17*",3634);