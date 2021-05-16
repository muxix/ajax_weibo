from models import Model
from models.user import User


class Comment(Model):
    """
    保存 评论 数据的 model
    """
    def __init__(self, form, user_id=-1):
        super().__init__(form)
        self.content = form.get('content', '')
        self.user_id = form.get('user_id', user_id)
        self.weibo_id = int(form.get('weibo_id', -1))

    def user(self):
        u = User.find_by(id=self.user_id)
        return u

    @classmethod
    def add(cls, form, user_id):
        t = Comment(form)
        t.user_id = user_id
        t.save()

        return t
