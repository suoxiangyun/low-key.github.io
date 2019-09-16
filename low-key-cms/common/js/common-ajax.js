function trimAndEncode(params){
    for(var key in params){
        if(params[key] != null && typeof params[key]=='string'){
            params[key] = params[key].trim();
        }
    }
    return params;
}
/**
 * 获取当前页面URL参数
 * @param name
 */
function  getQueryUrlVal(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var url = decodeURI(decodeURI(window.location.search));
    var r = url.substr(1).match(reg);
    if(r != null){
        return unescape(r[2]);
    }else{
        return null;
    }
}
/**
 * 提交表单
 * @returns {{get: Function, getUnAsync: Function, post: Function, postUnAsync: Function}}
 */
function request_get(url, dataType,data = {}, method = "GET", header="application/text"){
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: url,
            data: data,
            method: method,
            dataType:dataType,
            header: {
                'Content-Type': header
            },
            success: function (res) {
                if (res !={} && res!= null) {
                    resolve(res);
                } else {
                    reject(res.errMsg);
                }
            },
            fail: function (err) {
                reject(err)
            }
        })
    });
}

function request_get_jsonp (url, dataType,jsonpCallbackName, data = {}, method = "GET", header="application/text"){
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: url,
            data: data,
            method: method,
            dataType:dataType,
            //把传递函数名的那个形参callBack变为cb
            jsonp: "cb",
            //自定义传递给服务器的函数名，而不是使用jquery自动生成的
            jsonpCallback: jsonpCallbackName,
            header: {
                'Content-Type': header
            },
            success: function (res) {
                if (res !={} && res!= null) {
                    resolve(res);
                } else {
                    reject(res.errMsg);
                }
            },
            fail: function (err) {
                reject(err)
            }
        })
    });
}


function getQqListDataToConventListData(jsonData){
    var videoDatas=[];
    if(jsonData != null){
        var results = jsonData.jsonvalue.results;
        results.forEach(function (value, key, map) {
            var parserArray={};
            parserArray.moviesId=value.id;
            var moviesUrl = value.fields.url;
            if(util.isNotEmpty(moviesUrl)){
                parserArray.moviesUrl=moviesUrl;
            }else{
                parserArray.moviesUrl="https://v.qq.com/x/cover/"+value.id+".html";
            }
            parserArray.moviesName=value.fields.title;
            // {parserArray.moviesName=value.fields.second_title}
            parserArray.moviesImg=value.fields.new_pic_vt;
            var scoreAarray=value.fields.score;
            if(scoreAarray!=null && scoreAarray !=undefined){
                parserArray.moviesScores=scoreAarray.score;
            }else{
                parserArray.moviesScores=0;
            }
            videoDatas.push(parserArray);
        });
    }
    return videoDatas;
}
