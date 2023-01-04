/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = POST("https://m.147xs.org/search.php",{data:`keyword=${key}`})
  let array = []
  let $ = HTML.parse(response)
    $('dl').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('a.bookcase_title').text().replace(/\[.+\]/,""),
      author: $('dd > p:nth-child(1)').text().replace('作者：',''),
      cover: `https://m.147xs.org/img/${$('a.bookcase_title').attr('href').replace("https://m.147xs.org/book/","").replace("/","")}.jpg`,
      detail: $('a.bookcase_title').attr('href')
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
    update: $('[property=og:novel:update_time]').attr('content'),
    lastChapter: $('[property=og:novel:latest_chapter_name]').attr('content'),
    catalog: `${url}/all.html`
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
  $('dl > dd').forEach((chapter) => {
    let $ = HTML.parse(chapter)
    array.push({
      name: $("a").text(),
      url: `https://m.147xs.org${$("a").attr("href")}`
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
  let response = GET(url)
  let $ = HTML.parse(response)
  return $("#nr")
}

var bookSource = JSON.stringify({
  name: "147小说",
  url: "147xs.org",
  version: 100
})
