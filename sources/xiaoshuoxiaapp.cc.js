/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`https://w.xiaoshuoxiaapp.cc/Book/GetBookByKey?pageIndex=1&key=${key}`)
  let $ = JSON.parse(response)
  let array = []
  $.obj.forEach((child) => {
    array.push({
      name: child.BookName,
      author: child.Author,
      cover: child.BookImage,
      detail: `https://w.xiaoshuoxiaapp.cc//book/getbook?bookId=${child.BookId}`
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
  let $ = JSON.parse(response).obj
  let book = {
    summary: $.Description,
    status: $.BookStatusStr,
    category: $.CategoryName,
    update: $.UpdateTime,
    lastChapter: $.LastUpdateChapter,
    catalog: `https://w.xiaoshuoxiaapp.cc/book/GetBookAllChapters?bookId=${$.BookId}`
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
  let $ = JSON.parse(response)
  let array = []
  $.obj.forEach((chapter) => {
    array.push({
      name: chapter.chaptername,
      url: `https://w.xiaoshuoxiaapp.cc/book/NewH5Detail?bookId=${url.query('bookId')}&chapterId=${chapter.chapterid}`
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
  return $('#chapterContent').remove("h3").replaceAll("小说侠欢迎您的到来,如果您觉得还不错,可推荐给您的好友喔！小说侠APP下载:www.xiaoshuoxiaapp.com","").replace(/Ps:书友们，我是.+，推荐一款免费小说App.+书友们快关注起来吧！/g,"").replace("浏*览*器*搜*索： ","")
}

var bookSource = JSON.stringify({
  name: "小说侠",
  url: "xiaoshuoxiaapp.cc",
  version: 100
})
