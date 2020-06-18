const rp = require("request-promise");
const { login } = require("./login");
const cheerio = require("cheerio");
const { intraDataScraper } = require("./intradata");
const intraNoticeMongo = require("../models/intranet");
const intraNoticeLock = require("../models/intranetLock");
require("../db/mongoose");

let intraDBCreator = async function (uid, pwd) {
	let user = await login(uid, pwd);
	let cookie = user.cookie;

	let option = {
		url:
			"https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/intraRes/docList.php",
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
				.then(async (contents) => {
					const content = contents.content;
					const attachment = contents.attachmentLink;
					// console.log(content);
					// console.log(attachment);
					await intraNoticeMongo.updateOne(
						{ id: parseInt(doc_id) },
						{
							$set: {
								date: date,
								id_link: id_link,
								posted_by: by,
								title: title,
								content: content,
								attachment: attachment,
							},
						},
						{ upsert: true }
					);
				})
				.catch((e) => {
					console.log(e);
				});
		});
};

let intraUpdater = async function (uid, pwd) {
	try {
		await intraNoticeLock.updateOne(
			{ name: "IntraNoticelock" },
			{ $set: { global_lock: true } },
			{ upsert: true }
		);
		let notice = await intraNoticeMongo.find({}).sort({ id: -1 }).limit(1);

		lastNoticeID = notice[0].id;
		console.log(lastNoticeID);

		let user = await login(uid, pwd);
		let cookie = user.cookie;
		
		let option = {
			url:
				"https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/intraRes/docList.php",
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
				} else {
					intraDataScraper(cookie, doc_id)
						.then(async (contents) => {
							const content = contents.content;
							const attachment = contents.attachmentLink;
							await intraNoticeMongo.updateOne(
								{ id: parseInt(doc_id) },
								{
									$set: {
										date: date,
										id_link: id_link,
										posted_by: by,
										title: title,
										content: content,
										attachment: attachment,
									},
								},
								{ upsert: true }
							);
							console.log("Send notification here");
						})
						.catch((e) => {
							console.log(e);
						});
				}
			});

		return "done";
	} catch (e) {
		console.log(e);
	} finally {
		await intraNoticeLock.updateOne(
			{ name: "IntraNoticelock" },
			{ $set: { global_lock: false } },
			{ upsert: true }
		);
	}
};
// intraUpdater("b418045", "kitu@2001");

module.exports = { intraUpdater };
