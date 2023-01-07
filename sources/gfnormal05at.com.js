require('crypto-js')

const decrypt = function (data) {
  data = data.slice(3,-4)
  let key = CryptoJS.enc.Utf8.parse("6CB1E21E")
  let iv = CryptoJS.enc.Utf8.parse("1F0FB845")
  let decrypted = CryptoJS.DES.decrypt(data, key, {
    mode: CryptoJS.mode.CBC,
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

//转换时间戳
function timestampToTime(timestamp) {
  if(timestamp.length == 13) var date = new Date(timestamp);
  else var date = new Date(timestamp * 1000);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
  var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
  var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
  var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
  var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
  return Y+M+D+h+m+s;
}

const headers = ["versionCode:263","SYS:android","qd:baoshu_sogo1","User-Agent:okhttp-okgo/jeasonlzy"]

//搜索
const search = (key) => {
  let response = GET(`https://gfnormal05at.com/api/category-search?name=${key}`,{headers})
  let $ = JSON.parse(decrypt(response))
  let array = []
  $.result.list.forEach((child) => {
    array.push({
      name: child.name,
      author: child.author,
      cover: child.icon,
      detail: child.id,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(`https://gfnormal05at.com/cdn/book/info/${url}.html`,{headers})
  let $ = JSON.parse(decrypt(response)).result.book
  let book = {
    summary: $.description,
    status: $.is_finish == 2 ? '连载' : '完结',
    category: $.category,
    update: timestampToTime($.mtime),
    lastChapter: $.new_title,
    catalog: $.id
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(`https://gfnormal05at.com/cdn/book/chapterList/${url}.html`,{headers})
  let $ = JSON.parse(decrypt(response)).result
  let array = []
  $.list.forEach((booklet) => {
    array.push({ name: booklet.name })
    booklet.list.forEach((chapter) => {
      array.push({
        name: chapter.name,
        url: `${url}/${chapter.id}`
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = GET(`https://gfnormal05at.com/cdn/book/content/${url}.html`,{headers})
  let $ = JSON.parse(decrypt(response)).result
  return $.info.content.trim().replaceAll("内容正在手打中，请在10-30分钟后重新进入阅读，如果还没个正常内容，请点击右上角得问题反馈，我们会在第一时间处理，请帮忙分享app，分享越多更新越快！","")
}

var bookSource = JSON.stringify({
  name: "宝书免费小说",
  url: "gfnormal05at.com",
  version: 101
})