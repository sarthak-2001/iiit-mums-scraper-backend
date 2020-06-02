const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");


let attendance_scraper = async function (cookie, coid , cb ) {
  //let user = await login(uid, pwd);
  //let cookie = user.cookie;
  let data;
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
  
  rp.get(option)
    .then((_) => {
      //const $ = cheerio.load(res1.body)
      //const subject = $("div").find("h3").text()
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
            var days_present =0 ;
            var total_days = 0;
            var last_updated = '0';
            //console.log(res.body)
            const $ = cheerio.load(res.body)
            $("tbody")
              .children()
              .each((i, ele) => {
                const att = $(ele)
                  .find("td")
                  .eq(3)
                  .text()
                  .replace(/^\s+|\s+$/g, "");
                if(att === "PRESENT"){
                  days_present++;
                }
                const actdate = $(ele)
                  .find("td")
                  .eq(1)
                  .text()
                  .trim()
                const schdate = $(ele)
                  .find("td")
                  .eq(2)
                  .text()
                  .trim()
                if(schdate > last_updated){
                  last_updated = schdate;
                }
                total_days++;
              })
              data = { 
                days_present,
                total_days,
                last_updated
              };
              cb(data);
              // return data;
              // console.log(data)  ;    
        }).catch((e) => console.log(e)) ;
    
     }).catch((e) => console.log(e));
};

module.exports = { attendance_scraper };
//attendance_scraper("b418018","barbie17*",3634);