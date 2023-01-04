const headers = ["Cookie:waf_sc=5889647726;sex=boy","user-agent:Mozilla/5.0 (Linux; Android 12; Mi 10 Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/107.0.5304.141 Mobile Safari/537.36","referer:https://m.75zw.com/"]

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = POST("https://m.75zw.com/search.html",{data:`searchkey=${key}`,headers})
  let array = []
  let $ = HTML.parse(response)
  $('ul > li').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('p.bookname').text(),
      author: $('a.layui-btn').text(),
      cover: $('img').attr('src'),
      detail: `https://m.75zw.com${$('p.bookname > a').attr('href')}`
    })
  })
  return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let response = GET(url,{headers})
  let $ = HTML.parse(response)
  let book = {
    summary: $('div.intro > p:nth-child(1)').text(),
    status: $('[property=og:novel:status]').attr('content'),
    category: $('[property=og:novel:category]').attr('content'),
    words: $('span.layui-bg-red').text().replace("字",""),
    update: $('[property=og:novel:update_time]').attr('content').replace("T"," "),
    lastChapter: $('[property=og:novel:latest_chapter_name]').attr('content'),
    catalog: $('[property=og:novel:read_url]').attr('content').replace("m","www")
  }
  return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
  let response = GET(url,{headers})
  let $ = HTML.parse(response)
  let array = []
  $('dt:nth-of-type(2) ~ dd').forEach((chapter) => {
    let $ = HTML.parse(chapter)
    array.push({
      name: $('a').text(),
      url: `https://www.75zw.com${$('a').attr('href')}`
    })
  })
  return JSON.stringify(array)
}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
  let content = ""
  let i = 2
  let first_url = url
  while (true) {
    let response = GET(url,{headers})
    let $ = HTML.parse(response)
    content += $('#content')
    let next_btn = $('#pager_next').text()
    if (next_btn != "下一页") {
      break
    }
    url = first_url.replace('.html', `_${i}.html`);
    i += 1
  }
  content = content.replace(/本章未完.+！/,"").replace(/本章尚未结束.+！/,"").replace(/喜欢.+起舞中文更新速度全网最快。/,"").replace(/.+无错章节将持续在起舞中文小说网更新,还请大家收藏和推荐起舞中文！/,"")
  return content
}

var bookSource = JSON.stringify({
  name: "起舞中文",
  url: "75zw.com",
  version: 103
})