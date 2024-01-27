const axios = require("axios");
const cheerio = require("cheerio");

const scrapeNoticeWebsite = async () => {
	// const url = "https://iost.tu.edu.np/notices";
	const url = "https://google.com";

	try {
		const response = await axios.get(url, { rejectUnauthorized: false });

		const $ = cheerio.load(response.data);

		const pageTitle = $("title").text();
		console.log("Page Title:", pageTitle);

		const links = [];
		$("a").each((index, element) => {
			const href = $(element).attr("href");
			links.push(href);
		});

		console.log("Links on the page:", links);
	} catch (error) {
		console.error("Error fetching the page:", error.message);
	}
};
scrapeNoticeWebsite();
// module.exports = scrapeNoticeWebsite;
