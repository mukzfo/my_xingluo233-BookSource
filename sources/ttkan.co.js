/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`https://cn.ttkan.co/novel/search?q=${encodeURI(key)}`)
  let array = []
  let $ = HTML.parse(response)
  $('div.novel_cell').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('h3').text(),
      author: $('li:nth-child(2)').text().replace("作者：",""),
      cover: $('amp-img').attr('src'),
      detail: `https://cn.ttkan.co${$('a').attr('href')}`,
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
    summary: $('div.description').text(),
    status: $('[name=og:novel:status]').attr("content"),
    category: $('[name=og:novel:category]').attr("content"),
    update: $('[name=og:novel:update_time]').attr("content"),
    lastChapter: $('[name=og:novel:latest_chapter_name]').attr("content"),
    catalog: url
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
  $('div.full_chapters > div:nth-child(1) > a').forEach((chapter) => {
    let $ = HTML.parse(chapter)
    array.push({
      name: $('a').text(),
      url: `https://cn.bg3.co${$('a').attr('href')}`
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
    return $('div.content').remove("amp-addthis,div")
}

var bookSource = JSON.stringify({
  name: "天天看小说",
  url: "ttkan.co",
  version: 100
})
