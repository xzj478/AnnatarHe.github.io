---
layout: post
title: koa 浅析
tags: node javascript js koa
---

最近一直在看Node API 还有几本书。顺便看了下Koa源码。

略有心得，记下。

## Native node server

之前的node官网在首页写出了一段非常简单的构建http服务的代码。

{% highlight js %}
import http from 'http'

const server = http.createServer((req, res) => {
    res.end('Hello world')
})

server.listen(3000, () => console.log('server is running'))
{% endhighlight %}

用ES2015稍微修改了一下。

这段代码虽然很简单，却是每个node http server必须的起手式。

首先引入[http module](https://nodejs.org/dist/latest-v6.x/docs/api/http.html)。底层是用的TCP模块。

然后调用`createServer`方法。这里是一个回调函数，接收一个`http request` 和一个`http response`.

在response中的end方法中结束。

然后监听3000端口。

虽然原理十分复杂，然而node使得整个流程看起来非常简单。

接下来看看koa的源码

## koa

koa的源码非常的少。只有四个文件，总共加一起去掉注释大概只有1000行左右。

先看看koa的用法

{% highlight js %}
import koa from 'koa'

const app = new koa()

app.use(ctx => {
    ctx.body = 'hello world'
})

app.listen(3000, () => console.log('koa server is running'))
{% endhighlight %}

根据用法一步步了解node server。

## koa application

http server是基于事件的，可以看到**koa**继承了**events**模块。随后在**callback()**中绑定了error事件。得以处理错误消息。

来一步一步看吧。

在创建对象的一步各种初始化。调用events的初始化。使得koa可以可以绑定各种事件。然后是初始化中间件，context, request, response对象，运行环境，subdomain什么的。

随后看use()函数。就是中间件的插入。做了一些判断就push到中间件数组里。后面用来使用。

然后是listen()函数。到这里，整个server才开始真正的运行。

以callback()作为回调函数创建server。

ok, 到了koa比较核心的地方了。

先看createContext()就是一些赋值操作，用以使得koa的对象更容易阅读理解，没有什么特殊操作。

## middlewares

这里我一开始想到的方法特别粗暴。

{% highlight js %}
let middlewares = []

for(let func of middlewares) {
    func(context)
}
{% endhighlight %}

这样写确实是可以用，然而问题在于异步。

众所周知。Node的一大卖点就是异步。然而这样导致异步没办法等待。

koa1的实现是generator。koa2是Promise。

中间件的问题解决[在这里](https://github.com/koajs/koa/blob/v2.x/lib%2Fapplication.js#L135)

追根溯源找到[koa-compose](https://github.com/koajs/compose/blob/next/index.js)

一步步递归地调用中间件。

## req, res, context

其他的几个文件都是对request, response, context这些对象的一些简单组合和重命名。

其实有时候看API没有翻源码有用。