const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  await rp.get(option)
    .then(async (_) => {
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
      await rp.get(option2)
        .then((res) => {
          console.log(`----- ${coid}`);
          
          // console.log(res.body);
          var student_id,
            student_name,
            quiz_1,
            quiz_2,
            midsem,
            ta,
            endsem,
            grade_points,
            grade;

          const $ = cheerio.load(res.body);

          $("div.text-left").each((i, ele) => {
            // console.log(`--- ${coid} ---`);

            $(ele)
              .children()
              .each((j, e) => {
                // console.log(j);
                
                let field = $(e).find("b").text().toLowerCase();
                let value = $(e)
                  .find("font[style='font-size: 100%; color: black']")
                  .text()
                  .trim();

                // console.log(`${field} --> ${value}`);

                if (field == "qz-1" || field == "quiz-1") quiz_1 = value;
                if (field == "qz-2" || field == "quiz-2") quiz_2 = value;
                if (field == "midsem" || field == "mid sem") midsem = value;
                if (field == "ta") ta = value;
                if (field == "endsem" || field == "end sem") endsem = value;
                if (field == "grade points" || field == "gradepoints")
                  grade_points = value;
                if (field == "grade") grade = value;

                // console.log(z);

                // console.log(`${j} --> ${$(e).text()}`);
              });
          });

        
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
