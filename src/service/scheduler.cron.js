const cron = require("node-cron");
const scrapeNoticeWebsite = require("./noticeScraper.service.js");

// Schedule the task to run every minute
new cron.CronJob("* * * * *", async () => {
  console.log("Running scraping script every minute");
  await scrapeNoticeWebsite();
});
// cron.schedule("* * * * *", async () => {
//   console.log("Running scraping script every minute");
//   await scrapeNoticeWebsite();
// });
