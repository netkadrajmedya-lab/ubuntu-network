// cPanel Phusion Passenger Startup File
const http = require("http");
const { parse } = require("url");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ubuntu Network cPanel sunucusunda port ${port} üzerinde aktif.`);
  });
}).catch((err) => {
  console.error("Next.js başlatma hatası:", err);
});
