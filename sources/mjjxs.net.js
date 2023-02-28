const headers = ["user-agent:Mozilla/5.0 (Linux; Android 12; Mi 10 Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/107.0.5304.141 Mobile Safari/537.36", "referer:https://m.75zw.com/"]

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    let response = GET(`https://mjjxs.net/search?keyword=${key}`, {
        headers
    })
    let array = []
    let $ = HTML.parse(response)
    $('div.s_list').forEach((child) => {
        let $ = HTML.parse(child)
        array.push({
            name: $('a').text().replace(/.+：《/, "").replace("》", ""),
            author: $('a').text().replace(/：《.+》/, ""),
            detail: `https://mjjxs.net${$('a').attr('href')}`
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
    let response = GET(url, {
        headers
    })
    let $ = HTML.parse(response)
    let book = {
        summary: $('div.intro').text(),
        update: $('.info > p:nth-child(7)').text().replace("更新时间：", ""),
        lastChapter: $('.info > p:nth-child(3)').text().replace("最新章节：", ""),
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
    let response = GET(url, {
        headers
    })
    let $ = HTML.parse(response)
    let array = []
    $('.lb_mulu:nth-of-type(8) ul > li').forEach((chapter) => {
        let $ = HTML.parse(chapter)
        array.push({
            name: $('a').text(),
            url: `https://mjjxs.net${$('a').attr('href')}`
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
    let response = GET(url, {
        headers
    }).replace(/你正在阅读章节 【.+】/,"")
    let $ = HTML.parse(response)
    return $(".content")
}

var bookSource = JSON.stringify({
    name: "mjj小说",
    url: "mjjxs.net",
    version: 100
})
