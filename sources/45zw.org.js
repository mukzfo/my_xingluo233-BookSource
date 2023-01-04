/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`https://m.45zw.org/modules/article/search.php?searchtype=articlename&searchkey=${ENCODE(key,"gbk")}&t_btnsearch=`)
  let array = []
  let $ = HTML.parse(response)
  if($("[property=og:type]").attr("content") != "novel") {
    $('.list-item > tbody > tr').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('.article > a:nth-child(1)').text(),
        author: $('span.mr15').text().replace("作者:",""),
        cover: $('img').attr('src'),
        detail: $('.article > a:nth-child(1)').attr('href')
      })
    })
  } else {
    array.push({
      name: $('[property=og:novel:book_name]').attr('content'),
      author: $('[property=og:novel:author]').attr('content'),
      cover: $('[property=og:image]').attr('content'),
      detail: $('[property=og:url]').attr('content')
    })
  }
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
    catalog: url.replace("m","www")
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
  $('h2,dd').forEach((chapter) => {
    let $ = HTML.parse(chapter)
    if($('h2').text()) array.push({ name: $("h2").text() })
    else if($('a').text()) array.push({
      name: $('a').text(),
      url: `${url}${$('a').attr('href')}`
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
  let response = GET(url).replace(/四五中文网 www.45zw.org，最快更新.+最新章节！/,"")
  let $ = HTML.parse(response)
  return $('#content')
}

var bookSource = JSON.stringify({
  name: "四五中文网",
  url: "45zw.org",
  version: 100
})
