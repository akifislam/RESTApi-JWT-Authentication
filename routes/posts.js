const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.json({
    posts: {
      title: "my First post",
      description: "Hello Hi ! PRIVATE DATA",
    },
  });
});

module.exports = router;
