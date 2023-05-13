/**
 * 相关依赖版本
 * puppeteer@19.8.5
 * fs-extra@11.1.1
 */
const puppeteer = require('puppeteer');
const fse = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ora = require('ora');

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

    /**获取 简介 / 中文名称 */
    const queryDetailData = async (url) => {
      const page = await browser.newPage();
      await page.goto(url, {  waitUntil: 'domcontentloaded' });
      let t = await page.waitForSelector('.control-group .tags .muted', {timeout: 5000}).catch(err=>null)
      let title_cn = ''
      if(t) {
        title_cn = await t.evaluate(el=>el.textContent)
      }

      let d = await page.waitForSelector('blockquote', {timeout: 5000}).catch(err=>null)
      let desc = ''
      if(d) desc = await d.evaluate(el=>el.innerHTML)
      page.close()
      return {
        title_cn,
        about: desc
      }
    }
    /**获取 简介 / 中文名称 */

    for(let v of arr) {
      let title = await (await v.$('.media-heading')).evaluate(el=>el.textContent)
      let tags = await (await v.$('.tags')).evaluate(el=>{
        let arr = []
        for(let e of el.children) {
          arr.push(e.textContent.replace(/(\s){2}/g, ''))
        }
        return arr
      })

      let factory = tags[0].split('：')[1]
      let createTime = tags[1].split('：')[1]
      
      let img = await v.$('img')
      let src = await img.evaluate(el=>{
        return el.src
      })

      let ele = await v.$('.media-heading>a')
      let href = await ele.evaluate(el=>{
        return el.href
      })

      const { title_cn, about } = await queryDetailData(href)

      const data = {
        id: `llscw_${uuidv4()}`,
        src,
        title,
        factory,
        createTime,
        tags,
        img: "",
        banner: "",
        startLink: "",
        title_cn: title_cn || title,
        about
      }
      res.push(data)
      spinner.text = `读取中：${data.title_cn}`
    }

    spinner.text = '开始下载图片……'
    /**处理图片下载 - 完整下载全部图片 */
    const page2 = await browser.newPage()
    for(let v of res) {
      let a = await page2.goto(v.src)
      let fileName = path.basename(v.src)
      let filePath = path.join(__dirname,'images',fileName)
      v.img = filePath
      v.banner = filePath
      fse.outputFile(filePath, await a.buffer(), function(err) {
        if(err) console.log(err);
      });
      spinner.text = `图片下载中：${v.src}`
    }
    /**处理图片下载 - 完整下载全部图片 */

    return res
    
  }

  let urls = []

  for(let i=1; i < 49; i++) {
    urls.push(`https://galge.fun/tags/%E6%B1%89%E5%8C%96/page/${i}/?order=comments_count`)
  }

  let result = []
  const spinner = ora('🗃 开始拉取数据...').start();
  for(let v of urls) { 
    let tmp = await queryData(v)
    result.push(...tmp)
  }
  spinner.succeed('🎉 数据下载完成');
  fse.outputJson(path.join(__dirname,'data.json'), result,{'encoding': 'utf8'}, function(err) {
    if(err) console.log(err);
  })

  await browser.close();
})();