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

    let response = GET(`https://mjjxs.net/search?keyword=${key}&t=${Math.floor(new Date)}_${getNowFormatDate()}a`, {

        headers: ["Host: mjjxs.net", 

"Connection: keep-alive", 

"Upgrade-Insecure-Requests: 1", 

"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", "dnt: 1", "X-Requested-With: mark.via", "Sec-Fetch-Site: none", "Sec-Fetch-Mode: navigate", "Sec-Fetch-User: ?1", "Sec-Fetch-Dest: document", "Referer: https://mjjxs.net/", "Accept-Encoding: gzip, deflate", "Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7", "Cookie: t=t20230309; t=t20230309; user_key=303191502410355654; book_hitory_57999490=%7B%22chapter_i%22%3A227%7D"]

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
