//搜索
const search = (key) => {
  let response = GET(`https://souxs.pigqq.com/search.aspx?key=${key}&page=1&siteid=app2`)
  let array = []
  let $ = JSON.parse(response)
  $.data.forEach((child) => {
    array.push({
      name: child.Name,
      author: child.Author,
      cover: child.Img,
      detail: `https://infosxs.pysmei.com/BookFiles/Html/${parseInt(child.Id/1000) + 1}/${child.Id}/info.html`
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response).data
  let book = {
    summary: $.Desc,
    status: $.BookStatus,
    category: $.CName,
    update: $.LastTime,
    lastChapter: $.LastChapter,
    catalog: `${parseInt($.Id/1000) + 1}/${$.Id}`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(`https://infosxs.pysmei.com/BookFiles/Html/${url}/index.html`).replaceAll("},]","}]")
  let $ = JSON.parse(response)
  let array = []
  $.data.list.forEach((booklet) => {
    array.push({ name: booklet.name })
    booklet.list.forEach((chapter) => {
      array.push({
        name: chapter.name,
        url: `https://contentxs.apptuxing.com/BookFiles/Html/${url}/${chapter.id}.html`
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let $ = JSON.parse(GET(url))
  return $.data.content.replaceAll("@@﻿@@","").replaceAll("@@","").replaceAll("@@@@","").replaceAll("正在更新中，请稍等片刻，内容更新后，重新进来即可获取最新章节！亲，如果觉得APP不错，别忘了点右上角的分享给您好友哦！","").replaceAll("内容正在手打中，请在10-30分后重新进入阅读，如果还是没有正常内容，请点击右上角的问题反馈，我们会第一时间处理！","").trim()
}

var bookSource = JSON.stringify({
  name: "笔趣阁",
  url: "pigqq.com",
  version: 101
})