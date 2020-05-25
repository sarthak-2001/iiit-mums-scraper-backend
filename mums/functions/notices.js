const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");
const db = require("../firebase/firebaseInit");

let noticesScraper = async function (uid, pwd) {
  let user = await login(uid, pwd);
  let cookie = user.cookie;

  let option = {
    url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/nb/docList.php",
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Cookie: cookie,
      Referer: "https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/?w=766&h=749",
    },
  };

  let data = { Notices: [] };
  let res = await rp.get(option);
  const $ = cheerio.load(res.body);

  $("tbody")
    .children()
    .each((i, ele) => {
      // if(i==2)
      //   return false;

      const date = $(ele)
        .find("td")
        .eq(1)
        .text()
        .replace(/^\s+|\s+$/g, "");
      const full_heading = $(ele)
        .find("td")
        .eq(2)
        .text()
        .replace(/^\s+|\s+$/g, "");
      const replaced_full_heading = full_heading
        .split("--")[1]
        .replace("Attention:", "---")
        .replace("Posted by:", "---")
        .toString();

      const title = full_heading.split("--")[0].replace(/^\s+|\s+$/g, "");
      const attention = replaced_full_heading
        .split("---")[1]
        .replace(/^\s+|\s+$/g, "");
      const posted_by = replaced_full_heading
        .split("---")[2]
        .replace(/^\s+|\s+$/g, "");
      const id_link = $(ele).find("a").attr("href");
      const doc_id = $(ele).find("a").attr("href").slice(17);
      data.Notices.push({
        date,
        title,
        attention,
        posted_by,
        doc_id,
        id_link,
      });
    });
  // console.log(data.Notices);
  return data;
};

let noticeUpdater = async function (uid, pwd) {
  try {
    let noticeList = await noticesScraper(uid, pwd);
    noticeList = noticeList.Notices;

    let noticeRef = db.collection("notices");

    noticesFromDB = await noticeRef.orderBy("doc_id", "desc").limit(1).get();
    let lastNoticeID;
    for (noticeDB of noticesFromDB.docs) lastNoticeID = noticeDB.id;

    noticeList.every((notice, index) => {
      // console.log(index);

      if (notice.doc_id > lastNoticeID || noticesFromDB.docs.length == 0) {
        noticeRef
          .doc(notice.doc_id)
          .set({
            date: notice.date,
            doc_id: notice.doc_id,
            title: notice.title,
            attention: notice.attention,
            posted_by: notice.posted_by,
            id_link: notice.id_link,
          })
          .then(() => console.log("done"))
          .catch((e) => console.log(e));
      } else {
        console.log("up to date");
        return false;
      }
    });
    return "done";
  } catch (err) {
    console.log(`Internet or firebase issue\n${err}`);
    return "error";
  }
};

let noticeWriter = async function (uid, pwd) {
  let noticeList = await noticesScraper(uid, pwd);
  noticeList = noticeList.Notices;

  let noticeRef = db.collection("notices");
  noticeList.forEach((notice) => {
    noticeRef
      .doc(notice.doc_id)
      .set({
        date: notice.date,
        doc_id: notice.doc_id,
        title: notice.title,
        attention: notice.attention,
        posted_by: notice.posted_by,
        id_link: notice.id_link,
      })
      .then(() => console.log("done"))
      .catch((e) => console.log(e));
  });
};

module.exports = { noticesScraper, noticeUpdater };
