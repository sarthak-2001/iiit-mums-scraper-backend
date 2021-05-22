
const rp = require("request-promise");
const { noticedataOnlineScraper } = require("./notice_outside_data");
const cheerio = require("cheerio");
const noticeMongo = require("../models/notice");
const noticeLock = require("../models/noticeLock");

require("../db/mongoose");

let outsideNoticeDBCreator = async function () {
	console.log("notice outside scraper triggered");
	let cookie = "PHPSESSID=vuv23ie1cbkcsjtjjn6m84lrv5";
	let option = {
		url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.pub/nb/nbList1.php",
		simple: false,
		resolveWithFullResponse: true,
		headers: {
			Cookie: cookie,
			Referer: "https://hib.iiit-bh.ac.in/m-ums-2.0/start/login/",
		},
	};

	let res = await rp.get(option);

	// console.log(res.body);
	const $ = cheerio.load(res.body);
	try {
		$(".bg-light")
			.next()
			// .children()
			.each((i, ele) => {
				console.log(`${i}\n`);
				// if (i > 10) return false;
				// console.log($(ele).html());

				const title = $(ele)
					.find("h5")
					.text()
					.replace(/^\s+|\s+$/g, "");

				if (title.startsWith("Private Message for") == false) {
					console.log(title);
					const attention = $(ele).find("b").eq(0).text();
					const posted_by = $(ele).find("b").eq(1).text();
					const date = $(ele).find("b").eq(2).text();
					const doc_id = $(ele).find("a").attr("href").slice(17);
					const id_link = $(ele).find("a").attr("href");

					noticedataOnlineScraper(cookie, doc_id)
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
				}
			});
	} catch (error) {
		console.log(error);
	}
};

let outsideNoticeUpdater = async function () {
	try {
		await noticeLock.updateOne(
			{ name: "Noticelock" },
			{ $set: { global_lock: true } },
			{ upsert: true }
		);
		let notice = await noticeMongo.find({}).sort({ id: -1 }).limit(1);
		console.log(notice[0].id);
		lastNoticeID = notice[0].id;

		console.log("notice outside scraper triggered");
		let cookie = "PHPSESSID=vuv23ie1cbkcsjtjjn6m84lrv5";
		let option = {
			url: "https://hib.iiit-bh.ac.in/m-ums-2.0/app.pub/nb/nbList1.php",
			simple: false,
			resolveWithFullResponse: true,
			headers: {
				Cookie: cookie,
				Referer: "https://hib.iiit-bh.ac.in/m-ums-2.0/start/login/",
			},
		};

		let res = await rp.get(option);

		// console.log(res.body);
		const $ = cheerio.load(res.body);

		$(".bg-light")
			.next()
			// .children()
			.each((i, ele) => {
				// console.log(`${i}\n`);
				if (i > 16) return false;
				// console.log($(ele).html());

				const title = $(ele)
					.find("h5")
					.text()
					.replace(/^\s+|\s+$/g, "");

				if (title.startsWith("Private Message for") == false) {
					console.log(title);
					const attention = $(ele).find("b").eq(0).text();
					const posted_by = $(ele).find("b").eq(1).text();
					const date = $(ele).find("b").eq(2).text();
					const doc_id = $(ele).find("a").attr("href").slice(17);
					const id_link = $(ele).find("a").attr("href");

					if (doc_id <= lastNoticeID) {
						console.log("done");

						return false;
					} else {
						noticedataOnlineScraper(cookie, doc_id)
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
	} catch (error) {
		console.log(error);
	}
	finally {
		await noticeLock.updateOne(
			{ name: "Noticelock" },
			{ $set: { global_lock: false } },
			{ upsert: true }
		);
	}
};

module.exports = { outsideNoticeDBCreator, outsideNoticeUpdater};
