const { createWriteStream } = require("fs");

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const { Readable } = require("stream");
// const nodeCron = require("node-cron");
// const sitemap_generator = require("./middlewares/sitemap_generator");
const connectDB = require("./config/db");
dotenv.config({ path: "./config/config.env" });

connectDB();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// app.use(require("./routers/adminRouter"));
// app.use(sitemap_generator);

createSitemap()
  .then(() => console.log("initial sitemap created"))
  .catch((e) => console.error(e));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
async function createSitemap() {
  let sitemap;
  try {
    const writeStream = createWriteStream("./public/sitemap.xml");
    const smStream = new SitemapStream({ hostname: "http://localhost:3000" });
    const pipeline = smStream.pipe(createGzip());
    smStream.pipe(writeStream).on("error", (e) => {
      throw e;
    });

    const allCategories = ["rock", "metal", "rap", "kpop", "pop"];
    const allPosts = ["nirvana", "aerosmith", "metalica", "black sabbath"];
    const allTags = ["album", "single", "new", "lyric"];

    const URLCategories = allCategories.map((name) => `/category/${name}`);
    const URLPosts = allPosts.map((name) => `/post/${name}`);
    const URLTags = allTags.map((name) => `/tag/${name}`);

    URLCategories.forEach((item) =>
      smStream.write({ url: item, changefreq: "weekly", priority: 0.8 })
    );
    URLPosts.forEach((item) =>
      smStream.write({ url: item, changefreq: "daily", priority: 1 })
    );
    URLTags.forEach((item) =>
      smStream.write({ url: item, changefreq: "monthly", priority: 0.6 })
    );
    streamToPromise(pipeline).then((sm) => (sitemap = sm));
    smStream.end();
  } catch (err) {
    console.log(err);
  }
};
