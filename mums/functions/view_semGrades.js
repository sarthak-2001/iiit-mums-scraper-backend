const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");
//const db = require("../firebase/firebaseInit");

let sem_grades = async function (uid, pwd,tid) {
    let user = await login(uid, pwd);
    let cookie = user.cookie;  
    //console.log(cookie)
    let option = {
        url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/vwGrades/docList1.php?tid="+tid,
        simple: false,
        resolveWithFullResponse: true,
        headers: {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:54.0) Gecko/20100101 Firefox/54.0",
            Connection: "keep-alive",
            Referer: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.acadstu/vwGrades/docList1.php",
            Cookie: cookie 
    
        }
    }
    let data = { Sem_grades: [] };
    let res = await rp.get(option) ;
    const $ = cheerio.load(res.body) ;
    //console.log(res.body)
    for(i = 0,c=0;i<=10;i++){ 
        const subject = $('td').children()
            .eq(c++)
            .text()
        const gpb4pen = $('td').children()
            .eq(c++)
            .text()
        const penalty = $('td').children()
            .eq(c++)
            .text()
        const netgp = $('td').children()
            .eq(c++)
            .text()
        const grade = $('td').children()
            .eq(c++)
            .text()
        data.Sem_grades.push({
            subject,
            gpb4pen,
            penalty,
            netgp,
            grade
        })
            
    }
    const cgpa = $('h3').text().split(":")[2].trim()
    const sgpa = $('h3').text().split("\n")[1].split(":")[1].trim()
    data.Sem_grades.push({
        sgpa,
        cgpa
    })
    //return data ;
    console.log(data)
        
}

module.exports = sem_grades ;
