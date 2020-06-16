const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");
const db = require("../firebase/firebaseInit");
const { intraDataScraper } = require("./intradata");

let intraDBCreator = async function (uid, pwd) {
  let intraRef = db.collection("intranet");

  let user = await login(uid, pwd);
  let cookie = user.cookie;

  let option = {
    url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/intraRes/docList.php",
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      Cookie: cookie,
      Referer:
        "https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/aisMenu.php?role=Common",
    },
  };

  let res = await rp.get(option);
  const $ = cheerio.load(res.body);

  $("tbody")
    .children()
    .each((i, ele) => {
      // if(i==2)
      //   {
      //     return false;
      //   }
      // console.log(`${i}\n`);

      const date = $(ele)
        .find("td")
        .eq(0)
        .text()
        .replace(/^\s+|\s+$/g, "");

      const title = $(ele)
        .find("td")
        .eq(1)
        .text()
        .replace(/^\s+|\s+$/g, "");

      const by = $(ele)
        .find("td")
        .eq(2)
        .text()
        .replace(/^\s+|\s+$/g, "");

      const id_link = $(ele).find("a").attr("href");

      const doc_id = $(ele).find("a").attr("href").slice(17);
      console.log(doc_id);
      

      intraDataScraper(cookie, doc_id)
        .then((contents) => {
          const content = contents.content;
          const attachment = contents.attachmentLink;
          // console.log(content);
          // console.log(attachment);

          intraRef.doc(doc_id).set({
            date: date,
            title: title,
            by: by,

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

let intraUpdater = async function (uid, pwd) {
  try {
    let intraRef = db.collection("intranet");
    intraFromDB = await intraRef.orderBy("doc_id", "desc").limit(1).get();
    let lastNoticeID;
    for (intraNoticeFromDB of intraFromDB.docs) lastNoticeID = intraNoticeFromDB.id;

    console.log(lastNoticeID);
    
    let user = await login(uid, pwd);
    let cookie = user.cookie;

    let option = {
      url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/intraRes/docList.php",
      simple: false,
      resolveWithFullResponse: true,
      headers: {
        Cookie: cookie,
        Referer:
          "https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/aisMenu.php?role=Common",
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
          .eq(0)
          .text()
          .replace(/^\s+|\s+$/g, "");

        const title = $(ele)
          .find("td")
          .eq(1)
          .text()
          .replace(/^\s+|\s+$/g, "");

        const by = $(ele)
          .find("td")
          .eq(2)
          .text()
          .replace(/^\s+|\s+$/g, "");

        const id_link = $(ele).find("a").attr("href");

        const doc_id = $(ele).find("a").attr("href").slice(17);
        if (doc_id <= lastNoticeID) {
          console.log("done");

          return false;
        }

        intraDataScraper(cookie, doc_id)
          .then((contents) => {
            const content = contents.content;
            const attachment = contents.attachmentLink;

            intraRef.doc(doc_id).set({
              date: date,
              title: title,
              by: by,

              doc_id: doc_id,
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

module.exports={intraUpdater}
