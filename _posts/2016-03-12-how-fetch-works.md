---
layout: post
title: Fetch 源码解析
---

最近总是用fetch，而且没什么事情做，就做个源码分析吧。

[fetch 源码](https://github.com/github/fetch/blob/master/fetch.js)并不多，只有380多行。其实挺易学的

## 执行函数

首先，整个代码是包裹在一个自执行函数里面的，颇为意外，我还以为会是分解的多个文件呢。

不过一想也是，整个代码也就没多少，也不是什么大项目，没必要模块化那么清楚了。

所以说在浏览器只要引入文件就可以了。如果用ES6 module引入则只能这样

{% highlight js %}
require('fetch')
// 或者
import 'fetch'
{% endhighlight %}

有意思的是整个函数并没有直接引用window，而是这样实现

{% highlight js %}
(function(self) {
    // 代码...
})(typeof self !== 'undefined' ? self : this)
{% endhighlight %}

不传入参数的时候自动是`this`，那么这个this一般都是window。问题在于，这货都自执行了，为什么多此一举？

是个问题。

## 检测

{% highlight js %}
'use strict'
if (self.fetch) {
    return
}
{% endhighlight %}

这里首先定义严格模式，然后检测有没有fetch，有的话就什么都不做了。

## 两个辅助函数

这两个函数分别是`normalizeName`, `normalizeValue`，从名字可以看出，是过滤字符串的。

`name`的过滤还用了正则，从Error信息来看，是给header过滤用的

## Headers

第一个class。我觉得prototype的方式虽然看起来吊吊的，然而有点儿分散了。还是用ES6更加清楚一点。

先罗列一下几个函数。

* constructor(headers)
* append(name, value)
* delete(name)
* get(name)
* getAll(name)
* has(name)
* set(name, value)
* forEach(callback, thisArg)

constructor 接受一个参数，Object或Headers类型。无论哪个类型都是加入到自己属性中。

其他的光看名字就能理解了。

`forEach`其实还是蛮好玩的。

{% highlight js %}
Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
        this.map[name].forEach(function(value) {
            callback.call(thisArg, value, name, this)
        }, this)
    }, this)
}
{% endhighlight %}

这里的this有三个，还有个thisArg。可以说还是挺复杂的。经过[查资料](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)得知。原来`Array.prototype.forEach`的第二个参数是指回调函数里的this。其实是绑定了this的

那么，这里的两个this都是被绑定的，不，其实是三个，因为最内层的`callback.call(..., this)`还是最外层的this，即Headers。

所以才能在调用的时候特别方便。直接用`this.append(name, value)`。哎，辛苦了。

## 几个helper

这里又来了几个helper

* consumed(body)
* fileReaderReady(reader)
* readBlobAsArrayBuffer(blob)
* readBlobAsText(blob)
* support

首先是第一个，这个单词意思是有没有用过这个东西。

看到这里真为自己羞愧，因为太差，命名还是人家老外专业。

然后是几个reader。用Promise了。这几个reader是浏览器内置的。无须担心。

只是Promise的使用导致兼容性其实是个问题。PC端IE全面未实现。chrome 32才实现。移动端更惨一点儿。Android 4.4没实现，IOS7未实现。好在有[polyfill](https://www.npmjs.com/package/es6-promise)

support 还是蛮有意思的。用几个 **in** 来测试兼容性。

## Body

到了Body了。回忆下用法。Body是怎么用的呢？

{% highlight js %}
const form = document.querySelect('#form')
fetch('/url', {
    method: 'post',
    body: new FormData(form)
})
{% endhighlight %}

那么来看看如何实现的。首先定义一个类变量来表示body是不是被用过了。

然后定一个`_initBody(body)`的函数。从名字看出是初始化。

首先的几个if else先判定输入的body是什么鬼，分别给赋值。然后一个大if给设置header，因为不同的body有不同的`content-type`

然后如果支持blob就执行解析。顺便做两个函数`blob`, `arrayBuffer`, 还顺带一个`text`解析。

否则是文本了，解析一下，通过`Promise.resolve`来传递数据。同时也创建了个`text`解析。

如果支持formData就把文本decode了。也创建了个`json()`方法。

## Request

首先做了个methods的数组，就是HTTP的几种方法。

然后定一个helper，用来过滤method

然后到正文了。先列举下它的方法。

* constructor(input, options = {})
* clone()

这里其实才是整个入口。这里有个棒棒的特性，如果你是重复定义的request，那么它也能解析，什么意思呢

{% highlight js %}
let req = fetch('/url')
fetch(req).then(doSomeThings())
{% endhighlight %}

就是这样，它可以复用之前的参数。如果是正常的那么就直接贴到url了。这里的`Request.prototype.isPrototypeOf(input)`用得精髓啊！

`options`就是很容易理解了。就是一些参数写进去嘛。做了很多默认值的设置，让用户可以更简单地使用。当然还有容错。

一切就绪就会initBody,前面说过了。

## Helpers again

又来了几个helpers。显示解析body的函数，前面有过调用。把body解析出来然后附加到FormData上，再返回出去。实现很漂亮！

{% highlight js %}
function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
        if (bytes) {
            var split = bytes.split('=')
            var name = split.shift().replace(/\+/g, ' ')
            var value = split.join('=').replace(/\+/g, ' ')
            form.append(decodeURIComponent(name), decodeURIComponent(value))
            }
        })
    return form
}
{% endhighlight %}

再看看前面的使用，得知其实text的body也用了formData哦～

`headers(xhr)`是调用Header class的，从xhr上得到headers，然后给Headers class，最后返回出去。等等看哪里会调用。

这里无头无脑来了个`Body.call(Request.prototype)`，不知何意。

## Response

这里来了个Response。看这个名字也能猜出来了。

* constructor(bodyInit, options = {})
* clone()
* error // 静态函数
* redirect(url, status) // 静态函数

在最后一行又一个`this._initBody(bodyInit)`，纳闷，没定义这个函数啊。那这个this是什么意思。

别急，下面还有一句`Body.call(Response.prototype)`。哦，终于明白了，原来是调用的Body的this啊！

上面的Request也是调用的Body的this

然后把`Headers`, `Request`, `Response`都绑定到了self(window)上！我总觉得这样并不合适。污染全局变量哎

然后是在self(window)上挂载全局变量，也是主角`fetch`

整个被包裹在一个大的Promise上。下面就没什么有意思的东西了，都是调用上面写好的函数，一般的xhr发送

最后还特别友情地加了一行

{% highlight js %}
self.fetch.polyfill = true
{% endhighlight %}

告诉大家可以检测一下

完.
