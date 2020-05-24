const rp = require("request-promise");

let login = async function (uid, pwd) {
  let option = {
    url: "https://hib.iiit-bh.ac.in/m-ums-2.0/start/login/auth.php?client=iiit",
    simple: false,
    resolveWithFullResponse: true,
    form: {
      uid,
      pwd,
      txtinput: 3,
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:54.0) Gecko/20100101 Firefox/54.0",
      Connection: "keep-alive",
    },
  };

  let res = await rp.post(option);

  let cookie = res.headers["set-cookie"][0].toString();
  cookie = cookie.split(";")[0];

  let isValid = true;
  let location = res.headers["location"].toString();
  if (location.search("Incorrect") != -1) isValid = false;
  else isValid = true;

  return { cookie, isValid };
};

module.exports = { login };

