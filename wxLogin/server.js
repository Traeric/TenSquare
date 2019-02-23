let http = require("http");
let https = require("https");
let url = require("url");

http.createServer(function(request, response) {
    // 获取参数
    let params = url.parse(request.url, true).query;

    let appid = 'wx3bdb1192c22883f3';
    let secret = 'db9d6b88821df403e5ff11742e799105';
    let code = params.code;
    if (params.operation === "token") {
        https.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`, function(res) {
            res.on('data', function(chunk) {
                response.writeHead(200, {
                    'Content-Type': "application/json;charset=utf-8",
                    'Access-Control-Allow-Origin': '*',         // 允许跨域
                });
                response.end(chunk);
            });
        });
    }
    if (params.operation === "userInfo") {
        https.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${params.access_token}&openid=${params.openid}`, function(res) {
            res.on('data', function(chunk) {
                response.writeHead(200, {
                    'Content-Type': "application/json;charset=utf-8",
                    'Access-Control-Allow-Origin': '*',         // 允许跨域
                });
                response.end(chunk);
            });
        });
    }
}).listen(8888);

console.log("server running.... http://localhost:8888");


