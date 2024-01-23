const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();
const URL = "https://www.globo.com/";
const PORT = 3000;

app.get("/posts", async (req, res) => {
  try {
    const posts = await scrapePosts();
    res.status(200).json({ posts });
  } catch {
    res.status(500).json({
      message: "Error fetching posts",
    });
  }
});

async function scrapePosts() {
  const response = await axios(URL);
  const html = response.data;
  const $ = cheerio.load(html);
  const posts = [];

  $(".post-row.with-6-posts .post").each(function () {
    const url = $(this).find(".post__link").attr("href");
    const title = $(this).find(".post__title").text();
    posts.push({
      url,
      title,
    });
  });

  return posts;
}

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
