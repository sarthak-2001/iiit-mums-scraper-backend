const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");
const db = require("../firebase/firebaseInit");

let grade_scraper = async function (uid, pwd) {
  let user = await login(uid, pwd);
  let cookie = user.cookie;

  let option = {
    url:
      "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docDet1.php?coid=3634",
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Cookie: cookie,
      Referer:
        "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docList1.php",
    },
  };
  let data = { Grades: [] };
  rp.get(option)
    .then((res1) => {
      let option2 = {
        url:
          "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/coVwGrade/docDet1.php",
        simple: false,
        resolveWithFullResponse: true,
        headers: {
          Cookie: cookie,
          Referer:
            "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docDet1.php?coid=3634",
        },
      };
      rp.get(option2)
        .then((res) => {
          //console.log(res.body)
          const $ = cheerio.load(res.body);
          const student_id = $("p").children().eq(2).text();
          const student_name = $("p").children().eq(5).text();
          const quiz_1 = $("p").children().eq(8).text();
          const quiz_2 = $("p").children().eq(11).text();
          const midsem = $("p").children().eq(14).text();
          const ta = $("p").children().eq(17).text();
          const endsem = $("p").children().eq(20).text();
          const grade_points = $("p").children().eq(23).text();
          const grade = $("p").children().eq(26).text();
          data.Grades.push({
            student_id,
            student_name,
            quiz_1,
            quiz_2,
            midsem,
            ta,
            endsem,
            grade_points,
            grade,
          });
          //console.log(data.Grades)
          return data;
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
};

module.exports = grade_scraper;
