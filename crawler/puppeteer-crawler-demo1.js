/**
 * 相关依赖版本
 * puppeteer@19.8.5
 * fs-extra@11.1.1
 */
const puppeteer = require('puppeteer');
const fse = require('fs-extra')
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    timeout: 20000
  });

  const queryData = async (url) => {
    const page = await browser.newPage();
    
    // https://galge.fun/tags/%E6%B1%89%E5%8C%96/page/2/?order=comments_count
    // https://galge.fun/tags/%E6%B1%89%E5%8C%96/
    await page.goto(url, {
      waitUntil: 'domcontentloaded'
    });

    await page.setViewport({width: 1080, height: 9024});

    await page.waitForSelector('.media')

    let arr = await page.$$('.media', el => el)
    
    let res = []

    for(let v of arr) {
      let title = await (await v.$('.media-heading')).evaluate(el=>el.textContent)
      let tags = await (await v.$('.tags')).evaluate(el=>el.textContent.replace(/(\s){2}/g, ''))
      
      let img = await v.$('img')
      let src = await img.evaluate(el=>{
        return el.src
      })

      const data = {
        src,
        title,
        tags
      }
      res.push(data)
    }

    /**处理图片下载 - 完整下载全部图片 */
    const page2 = await browser.newPage()
    for(let v of res) {
      let a = await page2.goto(v.src)
      let fileName = path.basename(v.src)
      let filePath = path.join(__dirname,'images',fileName)
      v.img = filePath
      fse.outputFile(filePath, await a.buffer(), function(err) {
        if(err) console.log(err);
      });
    }
    /**处理图片下载 - 完整下载全部图片 */

    return res
    
  }

  let urls = []

  for(let i=1; i < 48; i++) {
    urls.push(`https://galge.fun/tags/%E6%B1%89%E5%8C%96/page/${i}/?order=comments_count`)
  }

  let result = []

  for(let v of urls) { 
    let tmp = await queryData(v)
    result.push(...tmp)
  }

  fse.outputJson(path.join(__dirname,'data.json'), result,{'encoding': 'utf8'}, function(err) {
    if(err) console.log(err);
  })

  await browser.close();
})();