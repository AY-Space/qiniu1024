import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const port = 3080; // Port on which your proxy server will run

app.use("/bilibili-image", (req, res) => {
  const imageUrl = req.query.url;
  if (typeof imageUrl !== "string" || !imageUrl) {
    res.status(400).send("Invalid image URL");
    return;
  }
  req.headers.referer = "https://www.bilibili.com/";
  delete req.headers.origin;
  delete req.headers.cookie;
  // Proxy the image request
  const proxy = createProxyMiddleware({
    target: imageUrl,
    changeOrigin: true,
    pathRewrite: {
      ".*": "",
    },
  });
  proxy(req, res, () => {
    //
  });
});

// Start the proxy server
app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
