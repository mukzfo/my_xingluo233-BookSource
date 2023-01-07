/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`http://00txs.com/novel/search?searchkey=${key}`)
  let array = []
  let $ = HTML.parse(response)
  $('ul.library > li').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('a.bookname').text(),
      author: $('a.author').text(),
      cover: $('a.bookimg > img').attr('src'),
      detail: `http://00txs.com${$('a.bookname').attr('href')}`,
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
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('[property=og:description]').attr('content'),
    status: $('[property=og:novel:status]').attr('content'),
    category: $('[property=og:novel:category]').attr('content'),
    words: $('.detail > p:nth-child(3)').text().replace(/作者：.+分类：.+字数：/,"").replace("字",""),
    update: $('[property=og:novel:update_time]').attr('content'),
    lastChapter: $('[property=og:novel:latest_chapter_name]').attr('content'),
    catalog: url.replace(".html","/")
  }
  return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
    $('dl:nth-child(2) > dd').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text(),
        url: `http://00txs.com${$('a').attr('href')}`
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
  let response = GET(url).replace("老域名(9txs)被墙，请您牢记本站最新域名(00txs.com)","").replace(/您可以在百度里搜索“.+\(00txs.com\)”查找最新章节！/,"")
  let $ = HTML.parse(response)
  return $('#content').remove("div")
}

var bookSource = JSON.stringify({
  name: "九桃小说",
  url: "00txs.com",
  version: 101
})