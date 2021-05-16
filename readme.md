# 基于 AJAX 的仿微博应用
## 目录
  - [项目地址](#项目地址)
  - [测试账号](#测试账号)
  - [项目简介](#项目简介)
  - [项目部署](#项目部署)
  - [项目功能演示](#项目功能演示)
## 项目地址
<http://106.53.29.230:3000>

[[回到目录]](#目录)

## 测试账号
用户名：test  密码：123

[[回到目录]](#目录)

## 项目简介
  - 本项目是基于 Socket 与 HTTP 协议实现的完整 Web 框架，并以该框架和 AJAX 技术为基础实现的仿微博应用：
    - 实现了路由注册和路由分发、HTTP 请求的接收和解析以及 HTTP 响应的生成和返回，使用多线程实现并发访问；
    - 采用 MVC 架构，数据与视图解耦；
    - 自制基于 MySQL 的 ORM；
    - 使用 Jinja2 模板；
    - 使用 AJAX 技术，异步处理用户请求。
    - 仿微博应用，功能包括：
      - 用户注册、登录；
      - 微博新增、编辑、删除、用户权限验证；
      - 评论新增、编辑、删除、用户权限验证；
      - Cookie/Session 管理、密码 Hash 加盐保护。

[[回到目录]](#目录)

## 项目部署
```bash
nohup python3.6 server.py &
```
[[回到目录]](#目录)

## 项目功能演示
  - 用户登录

[[回到目录]](#目录)

![weibo1_login](/readme_gif/weibo1_login.gif)

  - 微博新增、编辑、删除

[[回到目录]](#目录)

![weibo2_crud](/readme_gif/weibo2_crud.gif)

  - 评论新增、编辑、删除

[[回到目录]](#目录)

![weibo3_comment](/readme_gif/weibo3_comment.gif)

  - 用户权限验证

[[回到目录]](#目录)

![weibo4_authorization](/readme_gif/weibo4_authorization.gif)
