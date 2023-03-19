function getNowFormatDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let aDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (aDate >= 1 && aDate <= 9) {
        aDate = "0" + aDate;
    }
    return `${year}${month}${aDate}`;
}

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    let response = GET(`https://mjjxs.net/search/s312t20230309?keyword=${key}&t=${Math.floor(new Date)}_${getNowFormatDate()}a`, {
        headers: ["User-Agent:Mozilla/5.0 (Linux; Android 12; Mi 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36 EdgA/110.0.1587.61", "Referer:https://mjjxs.net/?t=302_from_search"]
    })
    let res = response.match(/\[\{.+\}\]/)[0]
    let $ = JSON.parse(res)
    let array = []
    $.forEach((child) => {
        array.push({
            name: child.book_name,
            author: child.author,
            detail: `https://mjjxs.net/${child.book_id}.html?t=${getNowFormatDate()}`
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
        headers: ["User-Agent:Mozilla/5.0 (Linux; Android 12; Mi 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36 EdgA/110.0.1587.61", "Referer:https://mjjxs.net/"]
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
        headers: ["User-Agent:Mozilla/5.0 (Linux; Android 12; Mi 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36 EdgA/110.0.1587.61", "Referer:https://mjjxs.net/"]
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
        headers: ["User-Agent:Mozilla/5.0 (Linux; Android 12; Mi 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36 EdgA/110.0.1587.61", `Referer:${url}`]
    }).replace(/你正在阅读 《.+》 章节： .+/, "").replace("[已开启防爬虫,如果浏览不正常,请正常浏览 mjjxs.net ]","")
    let $ = HTML.parse(response)
    return $(".content")
}

var bookSource = JSON.stringify({
    name: "mjj小说",
    url: "mjjxs.net",
    version: 102
})
