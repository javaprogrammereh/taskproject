const app = require("@forkjs/group-router");

const { createPost } = require("../controllers/adminController");

app.group("/api/admin", function () {
  //  @desc   Blog post
  //  @route  POST /api/admin/add-post
  app.post("/add-post", createPost);
});

module.exports = app.router;
