const rp = require("request-promise");
const { login } = require("./login");
const { noticedataScraper } = require("./noticedata");
const cheerio = require("cheerio");
const db = require("../firebase/firebaseInit");

let noticeDBcreator = async function (uid, pwd) {
  let noticeRef = db.collection("notices");

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

  let res = await rp.get(option);
  const $ = cheerio.load(res.body);

  $("tbody")
    .children()
    .each((i, ele) => {
      console.log(`${i}\n`);

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

      noticedataScraper(cookie, doc_id)
        .then((contents) => {
          const content = contents.content;
          const attachment = contents.attachmentLink;

          noticeRef.doc(doc_id).set({
            date: date,
            title: title,
            attention: attention,
            posted_by: posted_by,
            doc_id: parseInt(doc_id),
            id_link: id_link,
            content: content,
            attachment: attachment,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    });
};

let noticeUpdater = async function (uid, pwd) {
  try {
    let noticeRef = db.collection("notices");
    noticesFromDB = await noticeRef.orderBy("doc_id", "desc").limit(1).get();
    let lastNoticeID;
    for (noticeDB of noticesFromDB.docs) lastNoticeID = noticeDB.id;

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

    let res = await rp.get(option);
    const $ = cheerio.load(res.body);

    $("tbody")
      .children()
      .each((i, ele) => {
        console.log(`${i}\n`);

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
        if (doc_id <= lastNoticeID) {
          console.log("done");

          return false;
        }

        noticedataScraper(cookie, doc_id)
          .then((contents) => {
            const content = contents.content;
            const attachment = contents.attachmentLink;

            noticeRef.doc(doc_id).set({
              date: date,
              title: title,
              attention: attention,
              posted_by: posted_by,
              doc_id: parseInt(doc_id),
              id_link: id_link,
              content: content,
              attachment: attachment,
            });
          })
          .catch((e) => {
            console.log(e);
          });
      });

    return "done";
  } catch (e) {
    console.log(e);
  }
};

module.exports = { noticeUpdater };
