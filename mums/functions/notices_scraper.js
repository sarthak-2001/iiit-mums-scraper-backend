const rp = require("request-promise");
const { login } = require("./login");
const { noticedataScraper } = require("./noticedata");
const cheerio = require("cheerio");
const noticeMongo = require("../models/notice");
const noticeLock = require("../models/noticeLock");
require("../db/mongoose");

let noticeDBcreator = async function (uid, pwd) {
	console.log("notice scraper triggered");
	console.log(`uid: ${uid}, pwd:${pwd}`);

	let user = await login(uid, pwd);
	let cookie = user.cookie;

	let option = {
		url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/nb/docList.php",
		simple: false,
		resolveWithFullResponse: true,
		headers: {
			Cookie: cookie,
			Referer:
				"https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/?w=766&h=749",
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
				.then(async (contents) => {
					const content = contents.content;
					const attachment = contents.attachmentLink;

					await noticeMongo.updateOne(
						{ id: parseInt(doc_id) },
						{
							$set: {
								attention: attention,
								date: date,
								id_link: id_link,
								posted_by: posted_by,
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

let noticeUpdater = async function (uid, pwd) {
	console.log("notice scraper triggered");

	try {
		await noticeLock.updateOne(
			{ name: "Noticelock" },
			{ $set: { global_lock: true } },
			{ upsert: true }
		);
		let notice = await noticeMongo.find({}).sort({ id: -1 }).limit(16);
		let idArr = [];
		
		for (let i = 0; i < 16; i++) {
			idArr.push(notice[i].id);
		}


		const lastNoticeID = Math.min(...idArr);

		// console.log('last id '+lastNoticeID);

		let user = await login(uid, pwd);
		let cookie = user.cookie;
		// console.log(user.isValid);

		let option = {
			url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.misc/nb/docList.php",
			simple: false,
			resolveWithFullResponse: true,
			headers: {
				Cookie: cookie,
				Referer:
					"https://hib.iiit-bh.ac.in/m-ums-2.0/start/here/?w=766&h=749",
			},
		};

		let res = await rp.get(option);
		const $ = cheerio.load(res.body);

		$("tbody")
			.children()
			.each((i, ele) => {
				// console.log(`${i}\n`);

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

				const title = full_heading
					.split("--")[0]
					.replace(/^\s+|\s+$/g, "");
				const attention = replaced_full_heading
					.split("---")[1]
					.replace(/^\s+|\s+$/g, "");
				const posted_by = replaced_full_heading
					.split("---")[2]
					.replace(/^\s+|\s+$/g, "");
				const id_link = $(ele).find("a").attr("href");
				const doc_id = parseInt(
					$(ele).find("a").attr("href").slice(17)
				);

				if (doc_id <= lastNoticeID) {
					console.log("done");

					return false;
				} else {
					if (idArr.includes(doc_id) == false) {
						console.log(`${doc_id} not there`);

						noticedataScraper(cookie, doc_id)
							.then(async (contents) => {
								const content = contents.content;
								const attachment = contents.attachmentLink;

								await noticeMongo.updateOne(
									{ id: parseInt(doc_id) },
									{
										$set: {
											attention: attention,
											date: date,
											id_link: id_link,
											posted_by: posted_by,
											title: title,
											content: content,
											attachment: attachment,
										},
									},
									{ upsert: true }
								);

								let notiOption = {
									url: "https://fcm.googleapis.com/fcm/send",
									simple: false,
									resolveWithFullResponse: true,
									headers: {
										"Content-Type": "application/json",
										Authorization: `key=${process.env.FCM_TOKEN}`,
									},
									body: {
										notification: {
											body: `${title}`,
											title: "New Notice",
											sound:"default"

										},
										priority: "high",
										data: {
											click_action:
												"FLUTTER_NOTIFICATION_CLICK",
											id: "1",
											status: "done",
										},
										to: "/topics/all",
									},
									json: true,
								};
								await rp.post(notiOption);
								console.log(`notification - ${doc_id}`);   

							})
							.catch((e) => {
								console.log(e);
							});
					}
				}
			});

		return "done";
	} catch (e) {
		console.log(e);
	} finally {
		await noticeLock.updateOne(
			{ name: "Noticelock" },
			{ $set: { global_lock: false } },
			{ upsert: true }
		);
	}
};

module.exports = { noticeUpdater, noticeDBcreator };
