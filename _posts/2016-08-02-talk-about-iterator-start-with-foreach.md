---
layout: post
title: 从 forEach 开始谈谈迭代
tags: js
---

## forEach

今天从 forEach 开始谈谈迭代吧。

forEach 作为一个比较出众的遍历操作，之前有很多库都对其进行过各种包装，然而我还是发现很多人并不是非常理解 forEach。

比如[第二个参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) this 的使用。

往常都习惯这么做：

{% highlight js %}
const self = this
arr.forEach(function(item) {
    // do something with this
})
{% endhighlight %}

然而如果使用第二个参数就可以这样：

{% highlight js %}
arr.forEach(function(item) {
    // do something with this
}, this)
{% endhighlight %}

省去了一个中间的self，看起来更优美了

那么有没有更好的处理方式呢？

有的：

{% highlight js %}
arr.forEach(item => {
    // do something
})
{% endhighlight %}

由于 arrow function 的特性，自动绑定父 scope 的 this， 会更加简洁，而且少了个`function`关键字，可读性更好。

## for

说到循环必定要说到for循环了。js里面的for循环有好几种使用方式：

C 系列 for 循环：

{% highlight js %}
for (let index = 0; index < arr.length; index++) {
    // do something
}
{% endhighlight %}

index 是 arr 的索引，在循环体中通过 `arr[index]` 调用当前的元素，我非常不喜欢这种方式，因为要写两个分号！

还有另一种比较简单的方式：

{% highlight js %}
for (let key in obj) {
    // do something
}
{% endhighlight %}

不过这个方式一般用来遍历对象，下文有说。

关于 for 循环还有 ES2015 规定的一种

{% highlight js %}
for (let item of arr) {
    // do something
}
{% endhighlight %}

这种遍历方式和之前的最大区别在于`item`，它是**value**而非**key**，可以直接迭代出内容。

不过这种方式我个人用的不多，因为很多情况下我更喜欢用array下的方法。对于对象的遍历更倾向于`for...in`

## map 系列

这一块是js的函数式领域了。

`Array.prototype`下挂载着几个非常好用的遍历函数。比如`map`

它会遍历arr下的所有内容，做操作之后返回数据，形成一个新的数组：

{% highlight js %}
const arr = [1, 2, 3]
arr.map(current => current * 5)
{% endhighlight %}

在 react 最常用。经常用来遍历数据，形成dom：

{% highlight js %}
someRender() {
    return this.state.data.map((current, index) => {
        return <li key={index}>{ current }</li>
    })
}
{% endhighlight %}

不过 map 有一点不好的地方在于不能控制循环的流程，如果不能完成，就返回**undefined**继续下一次迭代。所以遇到可能会返回undefined的情况应该用forEach或者for循环遍历

还有filter用法和map一模一样，只是它用来过滤数据。非常的好用。

## arguments

说到遍历不得不提及**arguments**, 在function()中的所有参数，奇怪的是它并不是一个数组。只是一个类数组。

一般需要转成数组：

{% highlight js %}
function foo() {
    const args = Array.prototype.slice.call(arguments)
    return Array.isArray(args)
}
{% endhighlight %}

但是我个人并不认同这样的方法，有了新的 ES2015 就不要用这么丑的语法了

{% highlight js %}
function foo(...args) {
    // args 是数组
}
{% endhighlight %}

ES2015 的 rest 语法使得剩余参数都传入args里面，比之前的还要调Array的方法要轻松不少。

## object

对象的遍历是非常常用的功能。

我个人更喜欢用`for...in`语法，但是有一点需要注意：

{% highlight js %}
for (let index in obj) {
    if(obj.hasOwnProperty(index)) {
        // do something
    }
}
{% endhighlight %}

因为除非强制指定，否则对象都是不纯净的。都会有`__proto__`属性，也会被迭代出来。需要过滤一下。

好了，如何创建纯净的对象？

{% highlight js %}
const plainObj = Object.create(null)
{% endhighlight %}

最轻的obj结构，内部没有任何多余的属性。
