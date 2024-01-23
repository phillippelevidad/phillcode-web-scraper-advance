const puppeteer = require("puppeteer");

const url = "https://gshow.globo.com/realities/bbb";

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto(url);

  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  const posts = await page.evaluate(async () => {
    await new Promise((resolve) => {
      const distance = 100;
      let scrolledAmount = 0;

      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        scrolledAmount += distance;

        if (scrolledAmount >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });

    const posts = Array.from(document.querySelectorAll(".post-item"));

    const data = posts.map((post) => ({
      url: post.querySelector(".post-materia-text")?.getAttribute("href"),
      title: post.querySelector(".post-materia-text__title")?.textContent,
      description: post.querySelector(".post-materia-text__description")
        ?.textContent,
    }));

    return data.filter((post) => post.url);
  });

  await browser.close();
  console.log(posts);
}

main();
