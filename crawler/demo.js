const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: false,   //有浏览器界面启动
      slowMo: 100,       //放慢浏览器执行速度，方便测试观察
      args: [            //启动 Chrome 的参数，详见上文中的介绍
          '–no-sandbox',
          '--window-size=1280,960'
      ],
  });
  const page = await browser.newPage();

  let cookieArr = [
    {
        "domain": "bbs.zdfx.net",
        "expires": 1683963182187,
        "name": "ThW9_934f_lastvisit",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "1681367581"
    },
    {
        "domain": "zdfx.net",
        "expires": null,
        "name": "SourcePage",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": false,
        "value": ""
    },
    {
        "domain": "zdfx.net",
        "expires": null,
        "name": "FirstBrowsePage",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": false,
        "value": "https%3A%2F%2Fbbs.zdfx.net%2F"
    },
    {
        "domain": "zdfx.net",
        "expires": 1715939494429,
        "name": "_ga",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": false,
        "value": "GA1.2.339339218.1681371184"
    },
    {
        "domain": "zdfx.net",
        "expires": 1681465894000,
        "name": "_gid",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": false,
        "value": "GA1.2.1736744228.1681371184"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": null,
        "name": "ThW9_934f_seccodecST32y25",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "4520.d97c729a89ea87ae82"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": 1712907203381,
        "name": "ThW9_934f_ulastactivity",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "a714EZFYi1IcUZ%2BFwpHOvBexYIAAkNZDQJS%2BDxkSnwKfsuS1GjWq"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": 1712915494833,
        "name": "ThW9_934f_connect_is_bind",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "1"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": null,
        "name": "ThW9_934f_member_login_status",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "1"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": null,
        "name": "ThW9_934f_st_t",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "110769%7C1681371212%7C3702a9be42c04e056fd1f0906e5d4b89"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": 1681976013103,
        "name": "ThW9_934f_forum_lastvisit",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "D_2_1681371212"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": 1683963213103,
        "name": "ThW9_934f_visitedfid",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "2"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": 1681465893551,
        "name": "ThW9_934f_sid",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "t88vpD"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": null,
        "name": "ThW9_934f_lip",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "124.160.173.106%2C1681371203"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": null,
        "name": "ThW9_934f_st_p",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "110769%7C1681379493%7C977286291bd3afdbff064cdfc170406e"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": null,
        "name": "ThW9_934f_viewid",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "tid_583102"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": 1712915494138,
        "name": "ThW9_934f_lastcheckfeed",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "110769%7C1681379493"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": 1681380094000,
        "name": "ThW9_934f_noticeTitle",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": false,
        "value": "1"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": 1712915494000,
        "name": "ThW9_934f_smile",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": false,
        "value": "4D1"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": null,
        "name": "ThW9_934f_seccodecSt88vpD",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "5981.331c4eae9112b18cc4"
    },
    {
        "domain": "bbs.zdfx.net",
        "expires": 1681465894833,
        "name": "ThW9_934f_lastact",
        "partitioned": false,
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "value": "1681379494%09plugin.php%09"
    }
]
cookieArr.forEach(item=>{
  item.expires = Date.now() + 36000*1000
})
    page.setCookie(...cookieArr)

  //视口参数
  await page.setViewport({width: 1104, height: 1270});
  await page.goto('https://bbs.zdfx.net/forum-2-1.html');

  // 通过waitForSelector匹配到离我们需要数据最近的元素
//   const textSelector = await page.waitForSelector(
//     'body'
//   );

  const htmlMain = await page.evaluate((el)=>{
    document.addEventListener('click', (e)=>{
        console.log(e.target,'???===')
    })
    console.log(document.body,'????[[[[', el)
  })

})();
