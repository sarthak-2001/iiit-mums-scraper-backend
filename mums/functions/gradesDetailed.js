const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");
const { grade_scraper } = require("./individualGrade");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let gradeScraper = async function (uid, pwd, semesterCur) {
  let user = await login(uid, pwd);
  let cookie = user.cookie;

  let option = {
    url:
      "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/myCourses/docList1.php",
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Cookie: cookie,
      Referer: "https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/aisMenu.php",
    },
  };

  let res = await rp.get(option);
  let data = { grades: [] };

  let $ = cheerio.load(res.body);
  let subjects = [];
  $("tbody")
    .children()
    .each((i, ele) => {
      // console.log(i);

      // if (i == 8) return false;
      let sem = $(ele).find("td").eq(0).text().toString().trim();
      let subject = $(ele).find("td").eq(1).text().toString().trim();
      let credit = $(ele).find("td").eq(2).text().toString().trim();
      let coid = $(ele).find("a").attr("href").slice(17);
      // grade_scraper(cookie, coid).then((data) => {
      //   console.log(data.Grades);
      // });
      if (sem == semesterCur) {
        subjects.push({
          sem,
          subject,
          credit,
          coid,
        });
      }
    });

  // console.log(subjects);

  for (let index = 0; index < subjects.length; index++) {
    grade_scraper(cookie, subjects[index].coid, (result) => {
      // console.log(result);
      data.grades.push({
        semester: subjects[index].sem,
        subject: subjects[index].subject,
        credit: subjects[index].credit,
        coid: subjects[index].coid,
        quiz_1: result.quiz_1,
        quiz_2: result.quiz_2,
        midsem: result.midsem,
        ta: result.ta,
        endsem: result.endsem,
        grade_points: result.grade_points,
        grade: result.grade,
      });
    });
    await sleep(1500);
    // console.log(data);
  }
  console.log(data);
  
};
 gradeScraper("b418045", "kitu@2001", "1");
