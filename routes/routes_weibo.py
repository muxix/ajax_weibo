from models.weibo import Weibo
from routes import (
    redirect,
    JinjaTemplateRender,
    current_user,
    html_response,
)
from utils import log


def index(request):
    """
    weibo 首页的路由函数
    """
    body = JinjaTemplateRender.render('weibo_index.html')
    return html_response(body)


def same_user_required(route_function):

    def f(request):
        log('same_user_required')
        u = current_user(request)
        if 'id' in request.query:
            weibo_id = request.query['id']
        else:
            weibo_id = request.json()['id']
        t = Weibo.find_by(id=int(weibo_id))

        if t.user_id == u.id:
            return route_function(request)
        else:
            return redirect('/weibo/index')

    return f


def route_dict():
    """
    路由字典
    key 是路由(路由就是 path)
    value 是路由处理函数(就是响应)
    """
    d = {
        '/weibo/index': index,
    }
    return d
