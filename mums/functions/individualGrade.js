const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");

let grade_scraper = async function (cookie, coid, cb) {
  // let user = await login(uid, pwd);
  // let cookie = user.cookie;
  console.log(coid);

  let data;
  let option = {
    url:
      "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docDet1.php?coid=" +
      coid,
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Cookie: cookie,
      Referer:
        "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docList1.php",
    },
  };

  rp.get(option)
    .then((_) => {
      let option2 = {
        url:
          "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/coVwGrade/docDet1.php",
        simple: false,
        resolveWithFullResponse: true,
        headers: {
          Cookie: cookie,
          Referer:
            "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docDet1.php?coid=" +
            coid,
        },
      };
      rp.get(option2)
        .then((res) => {
          // console.log(res.body);
          let student_id,
            student_name,
            quiz_1,
            quiz_2,
            midsem,
            ta,
            endsem,
            grade_points,
            grade;

          const $ = cheerio.load(res.body);
          let c = $("div.col-xs-4").text();
          console.log(`----- ${c}`);
          if (c.length <= 45) {
            grade_points = $("p").children().eq(11).text();
            grade = $("p").children().eq(14).text();
            student_id = " ";
            student_name = " ";
            quiz_1 = " ";
            quiz_2 = " ";
            midsem = " ";
            ta = " ";
            endsem = " ";
          } else {
            student_id = $("p").children().eq(2).text();
            student_name = $("p").children().eq(5).text();
            quiz_1 = $("p").children().eq(8).text();
            quiz_2 = $("p").children().eq(11).text();
            midsem = $("p").children().eq(14).text();
            ta = $("p").children().eq(17).text();
            endsem = $("p").children().eq(20).text();
            grade_points = $("p").children().eq(23).text();
            grade = $("p").children().eq(26).text();
          }
          data = {
            student_id,
            student_name,
            quiz_1,
            quiz_2,
            midsem,
            ta,
            endsem,
            grade_points,
            grade,
          };
          // console.log(data);
          cb(data);
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
};

module.exports = { grade_scraper };
