/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = POST("https://m.77z5.com/s.php",{data:`keyword=${key}&t=1`})
  let array = []
  let $ = HTML.parse(response)
  $('div.hot_sale').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('p.title').text(),
      author: $('p.author:nth-child(2)').text().replace(/.+作者：/,""),
      detail: $('a').attr('href')
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
    summary: $('p.review').text(),
    status: $('div.synopsisArea_detail > p:nth-child(4)').text().replace("状态：",""),
    category: $('p.sort').text().replace("类别：",""),
    update: $('div.synopsisArea_detail > p:nth-child(6)').text().replace("更新：",""),
    lastChapter: $('div.directoryArea > p:nth-child(1)').text(),
    catalog: url.replace("m.","www.")
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
  $('dt:nth-of-type(2) ~ dd').forEach((chapter) => {
    let $ = HTML.parse(chapter)
    array.push({
      name: $('a').text(),
      url: $('a').attr('href')
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
  return $('#content')
}

var bookSource = JSON.stringify({
  name: "博仕书屋",
  url: "77z5.com",
  version: 100
})