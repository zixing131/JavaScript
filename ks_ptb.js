/**
  * 请勿烂分享脚本
  * 脚本地址 https://raw.githubusercontent.com/kristallsi/JavaScript/main/ks_ptb.js
 * 快手普通版 低保版 (每天大概0.3)   自动提现时间改21行
 * cron 0 0 8-20/2 * * ?  每天跑10次就够了 签到任务务必在8-9运行一次
 * 7\5      暂时只做签到 开宝箱 任务 (等以后有能力再加)
 * 7\6      增加自动提现0.3
 
 * cookie 跟极速版通用 抓kpn=KUAISHOU;完整cookie
 
 * tg群 https://t.me/+JHc9YrZT1Iw0NDFl
 *  频道 https://t.me/+l-JQvXtZeZU3MTk1
 * ========= 青龙--配置文件 =========
 * 变量格式: export ksptb_cookie="cookie@cookie"多个账号换行 或用 @ 分割
 *
 */

const $ = new Env("快手普通版");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1 		//0为关闭通知,1为打开通知,默认为1
const debug = 0 		//0为关闭调试,1为打开调试,默认为0
let time = "12";       //提现时间   默认12点
///////////////////////////////////////////////////////////////////
let ckStr = process.env.ksptb_cookie;
let msg = "";
let ck = "";
let host = "encourage.kuaishou.com";
let hostname = "https://" + host;
let num = "SIGN_INVALID_TIMESTAMP";


async function tips(ckArr) {

    console.log(`\n=============== 共找到 ${ckArr.length} 个账号 ===============`);
    msg += `\n =============== 共找到 ${ckArr.length} 个账号 ===============`
    debugLog(`【debug】 这是你的账号数组: \n ${ckArr} `);
}

!(async () => {
    let ckArr = await getCks(ckStr, "ksptb_cookie");

    await tips(ckArr);
    for (let index = 0; index < ckArr.length; index++) {
        ks_num = index + 1;
        console.log(`\n------------- 开始【第 ${ks_num} 个账号】------------- `);
        msg += `\n------------- 开始【第 ${ks_num} 个账号】------------- `
        ck = ckArr[index].split("&");
        debugLog(`【debug】 这是你第 ${ks_num} 账号信息: ${ck} `);
        await start();
    }
    await SendMsg(msg);
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done());

async function start() {

        n = local_hours();
        if (n >= 8 && n <= 9){
        console.log("\n =========签到=========");
        await sign();
        }
        console.log("\n =========开宝箱=========");
        await info();
        
        console.log("\n =========资产列表=========");
        await basicInfo();
        
        n = local_hours();
        if (n == `${time}`){
        console.log("\n =========提现=========");
        await apply();
        }else {
        console.log("\n =========提现=========");
        console.log("\n 非设定的提现时间 跳过\n\n");
        msg += `\n 非设定的提现时间 跳过`;
        }
    }


async function basicInfo() {
    let options = {
        method: 'POST',
        url: `${hostname}/rest/wd/encourage/account/basicInfo`,
        headers: {
            'Host': host,
            'content-type': 'application/json',
            'Cookie': `${ck[0]}`
        },
        body: JSON.stringify({"taskToken":`${token}`})
    };
    let result = await httpRequest(options, `资产列表`);

    if (result.result == 6002) {
        console.log(`\n资产情况: ${result.error_msg}`);
        msg += `\n 资产情况: ${result.error_msg}`;
    } else if (result.data.rewardSuccess == false) {
        console.log(`\n 资产情况: ${result.data.toast}`);
        msg += `\n 资产情况: ${result.data.toast}`;
    } else if (result.result == 1){
        console.log(`\n 资产情况: 今日收入${result.data.coinAmount}金币\n 现金余额${result.data.cashAmountDisplay}元\n 历史累计${result.data.accumulativeAmountDisplay}元`);
        msg += `\n 资产情况: 今日收入${result.data.coinAmount}金币\n 现金余额${result.data.cashAvailableDisplay}元\n 历史累计${result.data.accumulativeAmountDisplay}元`;
    }
}


async function sign() {
    let options = {
        method: 'POST',
        url: `${hostname}/rest/wd/encourage/signIn/report`,
        headers: {
            'Host': host,
            'content-type': 'application/json',
            'Cookie': `${ck[0]}`
        },
        body: JSON.stringify({"signInBizId":0})
    };
    let result = await httpRequest(options, `签到`);

    if (result.result == 109) {
        console.log(`\n 签到: ${result.error_msg}`);
        msg += `\n 签到: ${result.error_msg}`;
    } else if (result.result == 100136) {
        console.log(`\n 签到: ${result.error_msg}`);
        msg += `\n 签到: ${result.error_msg}`;
    } else if (result.rewardSuccess == true){
        console.log(`\n 签到: 第${result.data.button.linkType}天获得${result.data.popup}`);
        msg += `\n 签到: 第${result.data.button.linkType}天获得${result.data.popup}`;
    }
}

async function info() {
    let options = {
        method: 'GET',
        url: `${hostname}/rest/wd/encourage/treasureBox/info`,
        headers: {
            'Host': host,
            'content-type': 'application/json',
            'Cookie': `${ck[0]}`
        },
     //   body: JSON.stringify()
    };
    let result = await httpRequest(options, `获取开宝箱token`);

    if (result.result == 100164) {
        console.log(`\n 获取开宝箱token: ${result.error_msg}`);
        msg += `\n 获取开宝箱token: ${result.error_msg}`;
    } else if (result.result == 109) {
        console.log(`\n 获取开宝箱token: ${result.error_msg}`);
        msg += `\n 获取开宝箱token: ${result.error_msg}`;
    } else if (result.result == 1){
        console.log(`\n 获取开宝箱token：成功`);
        msg += `\n 获取开宝箱token：成功`;
        token = result.data.token
        await report();
    }
}


async function report() {
    let options = {
        method: 'POST',
        url: `${hostname}/rest/wd/encourage/treasureBox/report`,
        headers: {
            'Host': host,
            'content-type': 'application/json',
            'Cookie': `${ck[0]}`
        },
        body: JSON.stringify({"taskToken":`${token}`})
    };
    let result = await httpRequest(options, `开宝箱`);

    if (result.result == 1){
        console.log(`\n 开宝箱：${result.data.toast}`);
        msg += `\n 开宝箱：${result.data.toast}`;
    } else if (result.result == 6002) {
        console.log(`\n 开宝箱: ${result.error_msg}`);
        msg += `\n 开宝箱: ${result.error_msg}`;
    } else if (result.data.rewardSuccess == false) {
        console.log(`\n 开宝箱: ${result.data.toast}`);
        msg += `\n 开宝箱: ${result.data.toast}`;
    } else if (result.data.rewardSuccess == true){
        console.log(`\n 开宝箱: 获得${result.data.rewardCount}金币${result.data.dialog.secondDesc}`);
        msg += `\n 开宝箱: 获得${result.data.rewardCount}金币${result.data.dialog.secondDesc}`;
    }
}

async function apply() {
    let options = {
        method: 'POST',
        url: `https://www.kuaishoupay.com/pay/account/h5/withdraw/apply`,
        headers: {
            'Host': 'www.kuaishoupay.com',
            'Content-Length': '766',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `${ck[0]}`
        },
        body: 'account_group_key=INCENTIVE_CASH&mobile_code=&fen=30&provider=WECHAT&total_fen=30&commission_fen=0&third_account=WECHAT&attach=&biz_content=%7B%22accountId%22%3A%222710211362%22%2C%22sign%22%3A%22SWg2SERxaFFVMkFIS0RXZzloYk5NWVlBUEJCMkV5Y0Q1NnRTbzk1bU5YVy9uNUZpeFVCYWFqM1UreGVCc3NuMmxxRjJaR2xZUS9iV0JhbGlwSHBJNlJCMGVTamxjbENjdEJUaWliUklWZGhQZHNTcnVOdlh1bXR0OUNJTjR2OURiNmZaYmxERFRSRG5ySUg2aiszM0M3RklBZmV0RzJtUktvWkZkZG5UalVvS1pyMnlQMkVSS1llTE5KdmNJekVPUllYZEhWRC9kcElpVHJ0clNmUnRrMnl5am12KzdHZjRnZlBvc0huMlJab1VBOUtJdHV5SzlzdU9ic1hLS2tORDlKMElnZVZoc0pkVUVZNVFGbXo2V3c3K0o3TTczVXY2N1kvWEtJY0xhRjI2WnN4K29VWUJucFB3REV1OFhTYVRBTS9FdC9ucmxmdzUxOWE1V0RqckVnPT0%3D%22%2C%22fen%22%3A%2230%22%2C%22timestamp%22%3A%221657038320195%22%7D&session_id=&bank_id=&pop_window_types='
    };
    let result = await httpRequest(options, `申请提现`);

    if (result.result == -401) {
        console.log(`\n 提现: ${result.error_msg}`);
        msg += `\n 提现: ${result.error_msg}`;
    }else if (result.code == num) {
        console.log(`\n 提现: ${result.msg}`);
        msg += `\n 提现: ${result.msg}`;
    } else if (result.result == SUCCESS){
        console.log(`\n 提现: ${result.msg}`);
        msg += `\n 提现: ${result.msg}`;
    }
}

// #region *************************************************************  固定代码  *************************************************************
/**
 * 变量检查
 */
async function getCks(ck, str) {
    return new Promise((resolve) => {
        let ckArr = []
        if (ck) {
            if (ck.indexOf("@") !== -1) {

                ck.split("@").forEach((item) => {
                    ckArr.push(item);
                });
            } else if (ck.indexOf("\n") !== -1) {

                ck.split("\n").forEach((item) => {
                    ckArr.push(item);
                });
            } else {
                ckArr.push(ck);
            }
            resolve(ckArr)
        } else {
            console.log(` :未填写变量 ${str}`)
        }
    }
    )
}



/**
 * 发送消息
 */
async function SendMsg(message) {
    if (!message) return;

    if (Notify > 0) {
        if ($.isNode()) {
            var notify = require("./sendNotify");
            await notify.sendNotify($.name, message);
        } else {
            $.msg(message);
        }
    } else {
        console.log(message);
    }
}

/**
 * 随机数生成
 */

function randomString(e) {
    e = e || 32;
    var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
        a = t.length,
        n = "";

    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
}

/**
 * 随机整数生成
 */

function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


/**
 * 时间戳 13位
 */
function ts13() {
    return Math.round(new Date().getTime()).toString();
}

/**
 * 时间戳 10位
 */
function ts10() {
    return Math.round(new Date().getTime() / 1000).toString();
}

/**
 * 获取当前小时数
 */
function local_hours() {
    let myDate = new Date();
    h = myDate.getHours();
    return h;
}

/**
 * 获取当前分钟数
 */
function local_minutes() {
    let myDate = new Date();
    m = myDate.getMinutes();
    return m;
}


/**
 * 等待 X 秒
 */
function wait(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}



/**
 * get请求
 */
async function httpGet(getUrlObject, tip, timeout = 3) {
    return new Promise((resolve) => {
        let url = getUrlObject;
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 url ===============`);
            console.log(url);
        }

        $.get(
            url,
            async (err, resp, data) => {
                try {
                    if (debug) {
                        console.log(`\n\n 【debug】===============这是 ${tip} 返回data==============`);
                        console.log(data);
                        console.log(`======`);
                        console.log(JSON.parse(data));
                    }
                    let result = JSON.parse(data);
                    if (result == undefined) {
                        return;
                    } else {
                        resolve(result);
                    }

                } catch (e) {
                    console.log(err, resp);
                    console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                    msg += `\n ${tip} 失败了!请稍后尝试!!`
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * post请求
 */
async function httpPost(postUrlObject, tip, timeout = 3) {
    return new Promise((resolve) => {
        let url = postUrlObject;
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 url ===============`);
            console.log(url);
        }

        $.post(
            url,
            async (err, resp, data) => {
                try {
                    if (debug) {
                        console.log(`\n\n 【debug】===============这是 ${tip} 返回data==============`);
                        console.log(data);
                        console.log(`======`);
                        console.log(JSON.parse(data));
                    }
                    let result = JSON.parse(data);
                    if (result == undefined) {
                        return;
                    } else {
                        resolve(result);
                    }

                } catch (e) {
                    console.log(err, resp);
                    console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                    msg += `\n ${tip} 失败了!请稍后尝试!!`
                } finally {
                    resolve();
                }
            },
            timeout
        );
    });
}

/**
 * 网络请求 (get, post等)
 */
async function httpRequest(postOptionsObject, tip, timeout = 3) {
    return new Promise((resolve) => {

        let options = postOptionsObject;
        let request = require('request');
        if (!tip) {
            let tmp = arguments.callee.toString();
            let re = /function\s*(\w*)/i;
            let matches = re.exec(tmp);
            tip = matches[1];
        }
        if (debug) {
            console.log(`\n 【debug】=============== 这是 ${tip} 请求 信息 ===============`);
            console.log(options);
        }

        request(options, async (err, resp, data) => {
            try {
                if (debug) {
                    console.log(`\n\n 【debug】===============这是 ${tip} 返回数据==============`);
                    console.log(data);
                    console.log(`\n 【debug】=============这是 ${tip} json解析后数据============`);
                    console.log(JSON.parse(data));
                }
                let result = JSON.parse(data);
                if (!result) return;
                resolve(result);
            } catch (e) {
                console.log(err, resp);
                console.log(`\n ${tip} 失败了!请稍后尝试!!`);
                msg += `\n ${tip} 失败了!请稍后尝试!!`
            } finally {
                resolve();
            }
        }), timeout

    });
}


/**
 * debug调试
 */
function debugLog(...args) {
    if (debug) {
        console.log(...args);
    }
}

// /**
//  *  单名字 Env
//  */
// function Env() {
//     return new class {
//         isNode() {
//             return "undefined" != typeof module && !!module.exports
//         }
//     }()
// }



// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

     //#endregion