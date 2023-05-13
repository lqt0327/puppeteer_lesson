const puppeteer = require('puppeteer');
const fse = require('fs-extra')
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    timeout: 20000
  });
  const page = await browser.newPage();

  // https://galge.fun/tags/%E6%B1%89%E5%8C%96/page/2/?order=comments_count
  await page.goto('https://galge.fun/tags/%E6%B1%89%E5%8C%96/');

  // 这里的height要设置的足够大，确保能够一次性加载页面中所有图片资源
  await page.setViewport({width: 1080, height: 9024});

  await page.waitForSelector('.media')
  // 在页面内执行 document.querySelectorAll，返回Array<ElementHandle>>，ElementHandle包含了puppeteer中的api，具体参考文档ElementHandle
  let arr = await page.$$('.media', el => el)
  
  let res = []

  // arr = arr.slice(0,2)

  for(let v of arr) {
    let title = await (await v.$('.media-heading')).evaluate(el=>el.textContent)
    let tags = await (await v.$('.tags')).evaluate(el=>el.textContent.replace(/\s/g, ''))
    
    let img = await v.$('img')
    let src = await img.evaluate(el=>{
      /**
       * 存在问题：图片的下载依赖于网页中图片的加载，对于未加载图片，下载会失败，只能下载那些已经出现的，不是懒加载的图片
       * 应该和network中的图片资源加载有关
       */
      if(el.dataset['normal']) {  // 处理图片懒加载
        return el.dataset['normal']
      }
      return el.src
    })

    /**
     * 注意：不能在这里使用page.goto，会导致 Error: Execution context was destroyed, most likely because of a navigation.
     * 参考文档：https://stackoverflow.com/questions/55877263/puppeteer-execution-context-was-destroyed-most-likely-because-of-a-navigation
     */
    // await page.waitForNavigation()
    // const s = await page.goto(src);
    // let fileName = path.basename(src)
    // let filePath = path.join(__dirname,'images',fileName)
    // fse.outputFile(filePath, await s.buffer(), function(err) {
    //   if(err) console.log(err);
    // });
    /**
     * 注意：不能在这里使用page.goto，会导致 Error: Execution context was destroyed, most likely because of a navigation.
     * 参考文档：https://stackoverflow.com/questions/55877263/puppeteer-execution-context-was-destroyed-most-likely-because-of-a-navigation
     */

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

  /**处理图片下载 - 图片存在丢失 */
  // for(let v of res) {
  //   let a = await Promise.all([
  //     page.waitForNavigation({
  //       waitUntil: 'networkidle0'
  //     }),
  //     page.goto(v.src),
  //   ])
  //   let fileName = path.basename(v.src)
  //   let filePath = path.join(__dirname,'images',fileName)
  //   v.img = filePath
  //   fse.outputFile(filePath, await a[0].buffer(), function(err) {
  //     if(err) console.log(err);
  //   });
  // }
  /**处理图片下载 - 图片存在丢失 */

  fse.outputJson(path.join(__dirname,'data.json'), res,{'encoding': 'utf8'}, function(err) {
    if(err) console.log(err);
  })

  await browser.close();
})();

// 正则 清除空格 换行
const str = '  123  456  789  '
const reg = /\s/g
console.log(str.replace(reg, ''))