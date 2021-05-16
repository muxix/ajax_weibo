// WEIBO API
// 获取所有 weibo
var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
//    r = ajax('GET', path, '', callback)
//    callback(r)
}

var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(weibo_id, callback) {
    var path = `/api/weibo/delete?id=${weibo_id}`
    ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

var apiCommentAdd = function(form, callback) {
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(comment_id, callback) {
    var path = `/api/comment/delete?id=${comment_id}`
    ajax('GET', path, '', callback)
}

var apiCommentUpdate = function(form, callback) {
    var path = '/api/comment/update'
    ajax('POST', path, form, callback)
}

var weiboTemplate = function(weibo) {
    var t = `
        <div class="weibo-cell" data-id="${weibo.id}">
            <span class="weibo-content">${weibo.content}</span>
            <br>
            <span>创建时间：${weibo.created_time}</span>
            <span>更新时间：${weibo.updated_time}</span>
            <br>
            <button class="weibo-delete">删除微博</button>
            <button class="weibo-edit">编辑微博</button>
            <br>
            <span>评论：</span>
            <br>
            <div id="id-comment-list">
    `
    if (weibo.comments)
    for(var i = 0; i < weibo.comments.length; i++) {
        var comment = weibo.comments[i]
        var commentCell = commentTemplate(comment)
        t = t + commentCell
    }
    t = t + `
            </div>
            <input id="id-input-comment" class="comment-add-input">
            <button id="id-button-comment-add" class="comment-add">添加评论</button>
            <br>
            <br>
            </div>
        </div>
    `
    return t
}

var commentTemplate = function(comment) {
    var c = `
        <div class="comment-cell" data-id_comment="${comment.id}">
            <span class="comment-content">${comment.content}</span>
            <button id="id-button-comment-edit" class="comment-edit">编辑评论</button>
            <button id="id-button-comment-delete" class="comment-delete">删除评论</button>
            <br>
        </div>
    `
    return c
}

var weiboUpdateTemplate = function(content) {
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input" value="${content}">
            <button class="weibo-update">更新微博</button>
        </div>
    `
    return t
}

var commentUpdateTemplate = function(content) {
    var c = `
        <div class="comment-update-form">
            <input class="comment-update-input" value="${content}">
            <button class="comment-update">更新评论</button>
        </div>
    `
    return c
}

var insertWeibo = function(weibo) {
    var weiboCell = weiboTemplate(weibo)
    // 插入 weibo-list
    var weiboList = e('#id-weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

var insertComment = function(comment, weiboId) {
    var commentCell = commentTemplate(comment)
    var weiboList = e('#id-weibo-list')
    var weiboCell = weiboList.querySelectorAll('[data-id]', weiboList)
        for(var i = 0; i < weiboCell.length; i++) {
        if (weiboCell[i].dataset['id'] == weiboId) {
            var weiboCellSelected = weiboCell[i]
            break
        }
    }
    var commentList = e('#id-comment-list', weiboCellSelected)
    commentList.insertAdjacentHTML('beforeend', commentCell)
}

var insertUpdateForm = function(content, weiboCell) {
    var updateForm = weiboUpdateTemplate(content)
    weiboCell.insertAdjacentHTML('beforeend', updateForm)
}

var insertCommentUpdateForm = function(content, commentCell) {
    var updateForm = commentUpdateTemplate(content)
    commentCell.insertAdjacentHTML('beforeend', updateForm)
}

var loadWeibos = function() {
    apiWeiboAll(function(weibos) {
        log('load all weibos', weibos)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)
        }
    })
}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(weibo) {
            if (weibo.error_message) {
                alert(weibo.error_message)
            } else {
                // 收到返回的数据, 插入到页面中
                insertWeibo(weibo)
            }
        })
        input.value = ''
    })
}


var bindEventWeiboDelete = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-delete')) {
        log('点到了删除按钮')
        weiboId = self.parentElement.dataset['id']
        apiWeiboDelete(weiboId, function(r) {
            if (r.error_message) {
                alert(r.error_message)
            } else {
                log('apiWeiboDelete', r.message)
                // 删除 self 的父节点
                self.parentElement.remove()
                alert(r.message)
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboEdit = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-edit')) {
        log('点到了编辑按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        var weiboSpan = e('.weibo-content', weiboCell)
        var content = weiboSpan.innerText
        // 插入编辑输入框
        insertUpdateForm(content, weiboCell)
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboUpdate = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-update')) {
        log('点到了更新按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        log('update weibo id', weiboId)
        input = e('.weibo-update-input', weiboCell)
        content = input.value
        var form = {
            id: weiboId,
            content: content,
        }

        apiWeiboUpdate(form, function(weibo) {
            if (weibo.error_message) {
                alert(weibo.error_message)
            } else {
                // 收到返回的数据, 插入到页面中
                log('apiWeiboUpdate', weibo)

                var weiboSpan = e('.weibo-content', weiboCell)
                weiboSpan.innerText = weibo.content

                var updateForm = e('.weibo-update-form', weiboCell)
                updateForm.remove()
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}


var bindEventCommentAdd = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event){
    log(event)
    // 通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-add')) {
        log('点到了添加评论按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        log('comment-add weibo id', weiboId)
        input = e('.comment-add-input', weiboCell)
        content = input.value
        var form = {
            weibo_id: weiboId,
            content: content,
        }
        apiCommentAdd(form, function(comment) {
            if (comment.error_message) {
                alert(comment.error_message)
            } else {
                // 收到返回的数据, 插入到页面中
                insertComment(comment, weiboId)
            }
        })
        input.value = ''
    }
})}


var bindEventCommentDelete = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-delete')) {
        log('点到了删除按钮')
        commentId = self.parentElement.dataset['id_comment']
        apiCommentDelete(commentId, function(r) {
            if (r.error_message) {
                alert(r.error_message)
            } else {
                log('apiCommentDelete', r.message)
                // 删除 self 的父节点
                self.parentElement.remove()
                alert(r.message)
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}


var bindEventCommentEdit = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-edit')) {
        log('点到了编辑按钮')
        commentCell = self.closest('.comment-cell')
        commentId = commentCell.dataset['id_comment']
        var commentSpan = e('.comment-content', commentCell)
        var content = commentSpan.innerText
        // 插入编辑输入框
        insertCommentUpdateForm(content, commentCell)
    } else {
        log('点到了 comment cell')
    }
})}


var bindEventCommentUpdate = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-update')) {
        log('点到了更新按钮')
        commentCell = self.closest('.comment-cell')
        commentId = commentCell.dataset['id_comment']
        log('update comment id', commentId)
        input = e('.comment-update-input', commentCell)
        content = input.value
        var form = {
            id: commentId,
            content: content,
        }

        apiCommentUpdate(form, function(comment) {
            if (comment.error_message) {
                alert(comment.error_message)
            } else {
                // 收到返回的数据, 插入到页面中
                log('apiCommentUpdate', comment)

                var commentSpan = e('.comment-content', commentCell)
                commentSpan.innerText = comment.content

                var updateForm = e('.comment-update-form', commentCell)
                updateForm.remove()
            }
        })
    } else {
        log('点到了 comment cell')
    }
})}


var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentAdd()
    bindEventCommentDelete()
    bindEventCommentEdit()
    bindEventCommentUpdate()
}

var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()
