const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
let sitemap;

const generate_sitemap = async (req, res, next) => {
  res.header("Content-Type", "application/xml");

  if (sitemap) return res.status(200).send(sitemap);

  try {
    let links = [
      { url: "/api/admin/add-post/", changefreq: "daily", priority: 0.3 },
      { url: "/api/admin/select-post/", changefreq: "monthly", priority: 0.7 },
      { url: "/api/admin/register/", changefreq: "weekly", priority: 0.5 },
      { url: "/api/admin/login/", changefreq: "daily", priority: 0.2 },
    ];
    const stream = new SitemapStream({
      hostname: "http://localhost:3000",
      lastmodDateOnly: true,
    });
    return streamToPromise(Readable.from(links).pipe(stream)).then((data) => {
      sitemap = data;
      stream.end();
      console.log(sitemap.toString());
      return res.status(200).send(data.toString());
    });
  } catch (error) {
    next(error);
  }
};

module.exports = generate_sitemap;
