const puppeteer = require("puppeteer");
const fs = require("fs");

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto("https://quotes.toscrape.com", {
    waitUntil: "domcontentloaded",
  });

  const results = await page.evaluate(async () => {
    const items = [];

    const elements = document.querySelectorAll(".quote");

    elements.forEach((elem) => {
      const text = elem.querySelector(".text").innerText;
      const author = elem.querySelector(".author").innerText;
      const tags = [];

      elem.querySelectorAll("a.tag").forEach((tag) => {
        tags.push(tag.innerText);
      });

      items.push({ text, author, tags });
    });

    return items;
  });

  fs.writeFile("./data.json", JSON.stringify(results), (err) => {
    if (err) {
      console.log("Error: ", err);
    }
  });

  await browser.close();
};

main();
