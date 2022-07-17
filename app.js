const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
const { Readable } = require("stream");

const sitemap_generator = require('./middlewares/sitemap_generator');
const connectDB = require("./config/db");
dotenv.config({ path: "./config/config.env" });

connectDB();
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(require("./routers/adminRouter"));

app.use(sitemap_generator);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);



//*1.
// const links = [
//   { url: "/api/admin/add-post/", changefreq: "daily", priority: 0.3 },
// ];
// const stream = new SitemapStream({ hostname: "http://localhost:3000" });
// streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
//   console.log(data.toString())
// );
//*2.
// let sitemap;

// app.get("/sitemap.xml", function (req, res) {
//   res.header("Content-Type", "application/xml");
//   res.header("Content-Encoding", "gzip");
//   // if we have a cached entry send it
//   if (sitemap) {
//     res.send(sitemap);
//     return;
//   }

//   try {
//     const smStream = new SitemapStream({ hostname: "http://localhost:3000" });
//     const pipeline = smStream.pipe(createGzip());

//     // pipe your entries or directly write them.
//     smStream.write({ url: "/api/admin/add-post/", changefreq: "daily", priority: 0.3 });
//     smStream.write({ url: "/api/admin/select-post/", changefreq: "monthly", priority: 0.7 });
//     smStream.write({ url: "/api/admin/register/" ,changefreq: 'weekly',  priority: 0.5});
//     smStream.write({ url: "/api/admin/login/",changefreq: 'daily',  priority: 0.2});

//     // cache the response
//     streamToPromise(pipeline).then((sm) => (sitemap = sm));
//     // make sure to attach a write stream such as streamToPromise before ending
//     smStream.end();
//     // stream write the response
//     pipeline.pipe(res).on("error", (e) => {
//       throw e;
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).end();
//   }
// });