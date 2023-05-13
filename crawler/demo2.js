const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://galge.fun/subjects/search?keyword=%E6%A8%B1%E4%B9%8B/');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  const textSelector = await page.waitForSelector(
    'text/サクラノ詩'
  );
  const fullTitle = await textSelector.evaluate(el => el.textContent);
  console.log('The title of this blog post is "%s".', fullTitle);

  const img = await page.waitForSelector('.media-object');
  const ab = await img.evaluate(el=>{
    return el.src
  })
  console.log(ab,'????>>>', ab)
  
  // const req = https.request(ab, (res) => {
  //   res.pipe(fs.createWriteStream(path.basename(ab)));
  // });
  // req.end();

  const s = await page.goto(ab);
  fs.writeFile(path.basename(ab), await s.buffer(), function(err) {
    if(err) console.log(err);
  });
  // const imgResp = await page.waitForResponse('https://img.achost.top/uploads/subjects/packages/normal_63176061800314b3999c4b6cc9153332.jpg', {
  //   timeout: 10000,
  // });
  // console.log(page,'???;;')
  // const buffer = await imgResp.buffer();
  // const imgBase64 = buffer.toString("base64");
  // fs.writeFileSync(
  //   path.join(__dirname, "img.jpg"),
  //   imgBase64,
  //   "base64"
  // );

  await browser.close();
})();
