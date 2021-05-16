from utils import log
from routes import json_response, current_user
from models.weibo import Weibo
from models.comment import Comment


# 本文件只返回 json 格式的数据，而不是 html 格式
# json_response() 内含 json.dump()
def all(request):
    weibos = Weibo.all_json()
    comments = Comment.all_json()

    for w in weibos:
        w['comments'] = []
        for c in comments:
            if c['weibo_id'] == w['id']:
                w['comments'].append(c)

    return json_response(weibos)


def add(request):
    # 浏览器用 ajax 发送 json 格式的数据来到后端
    # request.json() 解析 json 格式数据转字典
    form = request.json()
    # 创建一个 weibo
    u = current_user(request)
    t = Weibo.add(form, u.id)
    # model.json() 对象数据转字典
    return json_response(t.json())


def delete(request):
    weibo_id = int(request.query['id'])
    Weibo.delete(weibo_id)

    comments = Comment.all()
    for c in comments:
        if c.weibo_id == weibo_id:
            comment_id = c.id
            Comment.delete(comment_id)

    d = dict(
        message="成功删除 weibo"
    )
    return json_response(d)


def update(request):
    form = request.json()
    log('api weibo update form', form)
    t = Weibo.update(**form)
    return json_response(t.json())


def comment_add(request):
    form = request.json()
    u = current_user(request)
    t = Comment.add(form, u.id)
    return json_response(t.json())


def comment_delete(request):
    comment_id = int(request.query['id'])
    Comment.delete(comment_id)
    d = dict(
        message="成功删除 评论"
    )
    return json_response(d)


def comment_update(request):
    form = request.json()
    log('api comment update form', form)
    t = Comment.update(**form)
    return json_response(t.json())


def weibo_login_required(route_function):

    def f(request):
        u = current_user(request)
        error = {}
        if not u.is_guest():
            log('登录用户', route_function)
            return route_function(request)
        else:
            log('游客用户')
            error['error_message'] = "权限不足：请登录"
            return json_response(error)

    return f


def weibo_owner_required(route_function):

    def f(request):
        u = current_user(request)
        if 'id' in request.query:
            weibo_id = request.query['id']
        else:
            weibo_id = request.json()['id']
        w = Weibo.find_by(id=int(weibo_id))

        error = {}
        if w.user_id == u.id:
            return route_function(request)
        else:
            error['error_message'] = "权限不足：不是此微博用户"
            return json_response(error)

    return f


def comment_owner_required(route_function):

    def f(request):
        u = current_user(request)
        if 'id' in request.query:
            comment_id = request.query['id']
        else:
            comment_id = request.json()['id']
        c = Comment.find_by(id=int(comment_id))

        weibo_id = c.weibo_id
        weibo = Weibo.find_by(id=int(weibo_id))
        weibo_user_id = weibo.user_id
        error = {}
        if (c.user_id == u.id) or (weibo_user_id == u.id):
            return route_function(request)
        else:
            error['error_message'] = "权限不足：不是此微博或此评论用户"
            return json_response(error)

    return f


def route_dict():
    d = {
        '/api/weibo/all': all,
        '/api/weibo/add': weibo_login_required(add),
        '/api/weibo/delete': weibo_owner_required(delete),
        '/api/weibo/update': weibo_owner_required(update),
        '/api/comment/add': weibo_login_required(comment_add),
        '/api/comment/delete': comment_owner_required(comment_delete),
        '/api/comment/update': comment_owner_required(comment_update),
    }
    return d
