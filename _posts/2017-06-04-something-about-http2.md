---
layout: post
title:  一些 HTTP/2 和 golang 的小知识
tags: http code
---

最近迁移项目，顺便一些东西也都相应升级一下。中间碰到了一些问题，记录一下。

* http/2 所有的 request, response 都转成小写了，和 HTTP/1.1可不一样。详情可以看这里 [HTTP/2 finalized - a quick overview](https://evertpot.com/http-2-finalized/)

* http/2 并不一定真的比 http/1.1快。理由看这里 [does HTTP/2 work in CORS request?](https://stackoverflow.com/questions/43482467/does-http-2-work-in-cors-request)

* http/2 并不容易关掉。得把这个 ip 上所有的 http2 关掉，才能算是关掉，否则开一个都算是 http/2。引申出来，上了 https，就很难降级了。[How to disable http2 in nginx](https://stackoverflow.com/questions/39453027/how-to-disable-http2-in-nginx) [How can I prevent nginx from serving http/2?](https://stackoverflow.com/questions/39347054/how-can-i-prevent-nginx-from-serving-http-2)

* http 的跨域中有个字段叫 `Access-Control-Allow-Origin` 不允许值为 `*`

## Golang

golang 获取当前路径
{% highlight go %}
_, filename, _, _ := runtime.Caller(1)
p := path.Join(path.Dir(filename), "../config.yml")
{% endhighlight %}
