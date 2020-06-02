const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");
const { attendance_scraper } = require("./onesub_attendance");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let attendanceScraper = async function (uid, pwd ) {
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
  let data = { Attendance: [] };

  let $ = cheerio.load(res.body);
  let course_info = [];
  $("tbody")
    .children()
    .each((i, ele) => {
      // console.log(i);
      let subject = $(ele).find("td").eq(1).text().toString().trim();
      let coid = $(ele).find("a").attr("href").slice(17);
      course_info.push({
          subject,
          coid,
        });
    });
    

  // console.log(course_info);
  

  for (let index = 0; index < course_info.length; index++) {
    attendance_scraper(cookie, course_info[index].coid, (result) => {
      console.log(result);
      data.Attendance.push({
        subject: course_info[index].subject,
        coid: course_info[index].coid,
        total_days:result.total_days,                        
        days_present: result.days_present,
        last_updated: result.last_updated,
      });
    })
    await sleep(1500);
    // console.log(data);
  }
  console.log(data);
  
};
attendanceScraper("b418018", "barbie17*");

