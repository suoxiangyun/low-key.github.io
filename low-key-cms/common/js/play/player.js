// 获取今日日期
var today = javaex.getTime("today");

var pageNum = "1";

$(function() {
    // // 判断当前视频是否已被用户收藏过了
    // isCollectioned();
    //
    // // 获取评论列表
    // getCommentList(pageNum);
    //
    // // 获取该视频的播放列表
    // getVideoPlaylist(mediaId);
    //
    // // 获取周排行榜
    // getWeekRank();
    //
    // // 猜你喜欢
    // guess();
});

/**
 * 猜你喜欢
 */
function guess() {
    $.ajax({
        url : path+"/api/guess",
        type : "GET",
        dataType : "json",
        data : {
            "mediaId" : mediaId
        },
        success : function(rtn) {
            if (rtn.code=="999999") {
                return;
            }

            var html = '';
            var list = rtn.data.list;
            for (var i=0; i<list.length; i++) {
                html += '<div class="plist-item plist-item-img">';
                html += '<div class="plist-img-wrap">';
                html += '<div class="plist-con">';
                html += '<a href="'+path+'/play/'+list[i].videoInfo.videoId+'" target="_blank" class="slider-atag javaex-list-link">';
                html += '<img data-original="'+list[i].haibao+'" width="100%" height="100%" />';
                if (list[i].videoInfo.sort==list[i].zongjishu) {
                    html += '<p class="pic-inner-title">全'+list[i].zongjishu+'集</p>';
                } else {
                    html += '<p class="pic-inner-title">更新至第'+list[i].videoInfo.sort+'集</p>';
                }
                html += '</a>';
                html += '</div>';
                html += '<a href="'+path+'/play/'+list[i].videoInfo.videoId+'" target="_blank" class="pic-title">'+list[i].biaoti+'</a>';
                html += '</div>';
                html += '</div>';
            }

            $("#guess").append(html);

            javaex.lazyload({
                selector : "#guess img"
            });
            $(window).trigger("scroll");
        }
    });
}

/**
 * 获取周排行榜
 */
function getWeekRank() {
    $.ajax({
        url : path+"/api/rank?apiId=36",
        type : "GET",
        dataType : "json",
        success : function(rtn) {
            if (rtn.code=="999999") {
                getMonthRank();
                return;
            }

            var html = '';
            var list = rtn.data.list;
            for (var i=0; i<list.length; i++) {
                var index = i+1;
                html += '<li class="rank-item" index="'+i+'">';
                html += '<div class="rank-nub rank-nub-'+index+'">'+index+'</div>';
                html += '<div class="rank-con">';
                html += '<a href="'+path+'/play/'+list[i].videoInfo.videoId+'" target="_blank" class="rank-link">';
                html += '<img data-original="'+list[i].fengmian+'"/>';
                html += '</a>';
                html += '<div class="rank-tit">';
                html += '<h3 class="rank-title">';
                html += '<a target="_blank" href="'+path+'/play/'+list[i].videoInfo.videoId+'" class="rank-title-link">'+list[i].biaoti+'</a>';
                if (list[i].zongjishu==list[i].videoInfo.sort) {
                    html += '<p class="rank-txt">全'+list[i].videoInfo.sort+'集</p>';
                } else {
                    html += '<p class="rank-txt">更新至'+list[i].videoInfo.num+'集</p>';
                }
                html += '</div>';
                html += '</div>';
                html += '</li>';
            }

            $("#week_rank").append(html);

            javaex.lazyload({
                selector : "#week_rank img"
            });
        }
    });
}

/**
 * 获取评论列表
 */
function getCommentList(pageNum) {
    // 获取评论条数
    $.ajax({
        url : path+"/comment_info/getCommentCount",
        type : "GET",
        dataType : "json",
        data : {
            "videoId" : videoId
        },
        success : function(rtn) {
            if (rtn.code=="999999") {
                return;
            }
            var commentCount = rtn.data.count;

            // 获取评论列表
            $.ajax({
                url : path+"/comment_info/getCommentList",
                type : "POST",
                dataType : "json",
                data : {
                    videoId : videoId,
                    pageNum : pageNum
                },
                success : function(rtn) {
                    if (rtn.code=="999999") {
                        return;
                    }

                    var pageInfo = rtn.data.pageInfo;
                    var currentPage = pageInfo.pageNum;
                    var pageCount = pageInfo.pages;

                    var list = pageInfo.list;
                    javaex.comment({
                        id : "comment",
                        avatar : path+"/static/common/images/avatar.jpg",
                        url : "http://www.173dm.net/?uid=",
                        isChangeTimeText : true,	// 修改时间显示文本
                        commentCount : commentCount,
                        list : list,
                        commentMapping : {
                            commentId : "id",
                            userId : "userId",
                            userName : "nickname",
                            avatar : "avatar",
                            content : "content",
                            time : "createTime",
                            replyInfoList : "replyInfoList"
                        },
                        replyMapping : {
                            userId : "userId",
                            userName : "nickname",
                            avatar : "avatar",
                            toUserId : "toUserId",
                            toUserName : "toNickname",
                            content : "content",
                            time : "createTime"
                        },
                        callback: function (rtn) {
                            if (rtn.type=="comment") {
                                // 对视频的评论
                                comment(rtn.content);
                            } else {
                                // 对评论的回复
                                reply(rtn.commentId, rtn.toUserId, rtn.toUserName, rtn.content);
                            }
                        }
                    });

                    $("#page").empty();
                    javaex.page({
                        id : "page",
                        pageCount : pageCount,	// 总页数
                        currentPage : currentPage,// 默认选中第几页
                        callback:function(rtn) {
                            getCommentList(rtn.pageNum);
                        }
                    });
                }
            });
        }
    });
}

/**
 * 对视频的评论
 */
function comment(content) {
    if (!userPower) {
        login();
        return;
    }

    $.ajax({
        url : path+"/comment_info/save",
        type : "POST",
        dataType : "json",
        data : {
            "videoId" : videoId,
            "content" : content
        },
        success : function(rtn) {
            if (rtn.code=="000000") {
                // 获取评论列表
                getCommentList(pageNum);
            } else {
                javaex.message({
                    content : rtn.message,
                    type : "error"
                });
            }
        }
    });
}


/**
 * 获取该视频的播放列表
 */
function getVideoPlaylist(mediaId) {
    // 预设加载动画
    var html = '';
    html += '<div class="main-0" style="height:100px;background: url(http://173.javaex.cn/loading-circle.gif) no-repeat center center;">';
    html += '</div>';
    $("#play_list").empty();
    $("#play_list").append(html);

    $.ajax({
        url : path+"/api/getVideoPlaylist",
        type : "GET",
        dataType : "json",
        data : {
            "mediaId" : mediaId
        },
        success : function(rtn) {
            if (rtn.code=="999999") {
                return;
            }
            var list = rtn.data.list;
            if (list.length>0) {
                var html = '';
                for (var i=0; i<list.length; i++) {
                    if (videoId==list[i].videoId) {
                        $("#play_count").html(list[i].viewCount + " 次播放");
                        html += '<li id="li_video_'+videoId+'" class="v-li drama selected">';
                    } else {
                        html += '<li class="v-li drama">';
                    }
                    if (list[i].title==null || list[i].title=="") {
                        html += '<a href="'+path+'/play/'+list[i].videoId+'" class="drama-item">第'+list[i].num+'集</a>';
                    } else {
                        html += '<a href="'+path+'/play/'+list[i].videoId+'" class="drama-item">第'+list[i].num+'集 '+list[i].title+'</a>';
                    }
                    if (list[i].updateTime==today) {
                        html += '<div class="javaex-video-brand new-brand small"></div>';
                    }
                    html += '</li>';
                }

                // 先清空
                $("#play_list").empty();
                // 再填充
                $("#play_list").append(html);

                var diff = $("#li_video_"+videoId).position().top;
                if (diff>510) {
                    diff = diff-45+"px";
                    $(".javaex-play-scroll-content").animate({"scrollTop": diff}, 1000);
                }
            }
        }
    });
}


// 关闭收藏成功提示
function closeArrowLabel() {
    $(".arrow-label").hide();
}

// 播放器展开与收起
$(".full-screen").click(function() {
    if ($(".javaex-play-area").hasClass("full")) {
        // 已经展开
        $(".javaex-play-area").removeClass("full");
        $(".full-screen i").removeClass("icon-keyboard_arrow_left").addClass("icon-keyboard_arrow_right");
    } else {
        $(".javaex-play-area").addClass("full");
        $(".full-screen i").removeClass("icon-keyboard_arrow_right").addClass("icon-keyboard_arrow_left");
    }
});

// 简介展开与收起
$(".javaex-play-intro").click(function() {
    if ($(".javaex-play-content").is(":hidden")) {
        // 向下展开
        $(".javaex-play-content").slideDown();
        // 改变箭头方向向上
        $(".javaex-play-intro").addClass("selected");
    } else {
        // 向上收起
        $(".javaex-play-content").slideUp();
        // 改变箭头方向向下
        $(".javaex-play-intro").removeClass("selected");
    }
});