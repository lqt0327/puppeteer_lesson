const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://galge.fun/tags/%E6%B1%89%E5%8C%96/');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  const media = await page.waitForSelector('.media');
  const img = await media.waitForSelector('img');
  const title = await media.waitForSelector('.media-heading')
  const cd = await title.evaluate(el => el.textContent);
  const tags = await media.waitForSelector('.tags')
  const tag = await tags.evaluate(el => {
    let arr = []
    for(let v of el.childNodes) {
      if(v.tagName === 'SPAN') {
        arr.push(v.textContent.replace(/\s/g, ''))
      }
    }
    return arr
  });
  const ab = await img.evaluate(el=>{
    return el.src
  })
  const t = await page.evaluate(el=>{
    return el.childNodes[0].href
  }, title)
console.log(cd,'????===', await (await media.waitForSelector('img')).evaluate(el=>el.src))
  const s = await page.goto(ab);
  fs.writeFile(path.basename(ab), await s.buffer(), function(err) {
    if(err) console.log(err);
  });

  await browser.close();
})();

// 正则 清除空格 换行
const str = '  123  456  789  '
const reg = /\s/g
console.log(str.replace(reg, ''))