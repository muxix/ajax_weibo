import time

from models import Model


class Weibo(Model):
    """
    保存 weibo 数据的 model
    """

    def __init__(self, form):
        super().__init__(form)
        self.content = form.get('content', '')
        self.user_id = form.get('user_id', None)
        self.created_time = form.get('created_time', -1)
        self.updated_time = form.get('updated_time', -1)

    @classmethod
    def add(cls, form, user_id):
        t = Weibo(form)
        t.user_id = user_id
        t.created_time = int(time.time())
        t.updated_time = t.created_time
        t.save()

        return t
