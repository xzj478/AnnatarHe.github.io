---
layout: post
title: React 注意事项
tags: react js
---

## Warning

你首先要熟悉基础的React语法

## What's React

[React](https://github.com/facebook/react) 是一个不存在的网络公司**Facebook**出的JavaScript视图框架。

他们官网写着

> JUST THE UI
>
> VIRTUAL DOM
>
> DATA FLOW

这三个特性。

当我第一次看到的时候在想，这丫的弱爆了，人家动辄就*MVC*，*MVVM*的框架，你竟然只写了一个UI？

当然，当时我的想法肯定是错的。

React拥有非常高的性能，结合单向数据流还有组件化思想，可以很舒服的做出现代化的前端产品。

## Start

首先，得有开发环境。

Node的安装推荐用[nvm](https://github.com/creationix/nvm)，我在上一篇《编译我的开发环境》里有写。

主要是在项目里得加入编译jsx到正常的js

{% highlight console %}
$ npm install --save gulp browserify babelify vinyl-source-stream babel-core
{% endhighlight %}

在`gulpfile.babel.js`里加上任务

{% highlight js %}
import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

gulp.task('jsx', () => {
  return browserify('src/app.js')
    .transform(babelify.configure({
        stage:0
    }))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/'));
});
{% endhighlight %}

这样，开发环境就大功告成了。

然而，然而。

起初的时候要写React这种代码是比较痛苦的。

平常就是写HTML，然后主要通过jQuery调整页面，完成一些显示的功能。

而React是强迫组件化，强制性的用组件化来构造前端。

这里写我的Live template吧，直接复制粘贴到WebStorm就可以啦

{% highlight js %}
import React from 'react';

class $className$ extends React.Component {

  render() {
    return (
        $content$
      );
  }
}

export default $className$;
{% endhighlight %}

## ES2015

看到这里，如果同学你不熟悉ES2015的语法可能就感觉看不懂这是什么了，这还是JavaScript么？

如果真的对ES2015语法不太熟悉，可以看看阮一峰老师的书：[ECMAScript 6入门](http://es6.ruanyifeng.com/#docs/intro)

我非常的喜欢ES6的语法，因为写起来非常的清晰明了。看着舒服。

只是绝大部分浏览器现在并不能完全支持ES6，所以需要babel转义。

上面的gulp的jsx task就是完成这样的转义。

## Spell Component

这个问题和中文有关。

当初我因为英文不过关，老是把`Component`写成`Components`或者`component`或者`components`。

这几种都是不行的。都会造成错误，注意一定一定严格的用`Component`，所以我建议直接复制我的Live template。

## Use strict

其实挺纠结的。因为用babel的话他会转义代码，写不写'use strict'其实一个样。

然而我还是建议加上'use strict'。

如果放弃babel，那么我们也可以写出严格的js代码，这样多好。

## bind(this)

这里有些很奇怪的问题。有一些情况下这样写会出错

{% highlight js %}
class App extends React.Component {

  handleChange(e) {
    console.log(this);
  }

  render() {
    return (
      <input type="text" onChange={this.handleChange} />
    );
  }
}
{% endhighlight %}

对，这个this，有时候不知道为什么this指向就会变。大概是在0.12这个版本左右吧。我最近没有碰到了。

如果你碰到了这样的问题，可能加一个绑定当前this会有效：

{% highlight html %}
<input type="text" onChange={this.handleChange.bind(this)} />
{% endhighlight %}

这个问题并没有深究，留待再碰到再解决吧。

## Ajax

不可避免的，构建SPA肯定是要用到Ajax的。

我有时候也想用`Fetch`，但是，这次我怂了。 浏览器兼容性实在是太差了。

chrome 42 才支持。不能指望其他浏览器跟上了。

言归正传，一般情况下Ajax数据是要传到`state`里面的，所以一般是这样的：

{% highlight js %}
class App extends React.Component {

  fetchSomething() {
    $.ajax({
      url: 'http://foo.com',
      dataType: 'json',
      method: 'GET',
      success: function(res) {
        this.setState({ res: res });
        }
      });
  }

  render() {
    return (...);
  }
}
{% endhighlight %}

如果你真的这样写，恭喜你，你会碰到两个坑！

一个是`this`，在success中的this指向可是XMLHttpRequest的对象哦，并不是App 的class。这个时候一般用的是在外面保存this,然后里面调用

{% highlight js %}
let that = this;

that.setState({});
{% endhighlight %}

第二个坑更隐蔽。我当初愣是没想起来。

异步！

即使经常写原生js也很容易忽视这个问题。

ajax请求默认是异步的，也就是说，数据尚未传送到客户端的时候，js几乎(严谨一点，实际上应该是能跑几遍的)就已经跑完了客户端的所有代码。V8那个效率，你懂的。

问题来了。数据没有到，那么this.setState也就没有触发，那么后面用数据怎么办？

GG

好了，既然原理知道了，那么解决方法也就呼之欲出了，在Ajax请求的时候改成同步的

{% highlight js %}
$.ajax({
  url: '/foo/bar',
  dataType: 'json',
  async: false,
  success: function(res){
    this.setState({res});
  }
})
{% endhighlight %}

这里也就造成了一个问题，Ajax请求在了主线程上。网络堵塞就完蛋了。。。额，再说吧。

## constructor

constructor是ES6的class的构造函数，在React中用处非常的大

{% highlight js %}
class App extends React.Component {
  constructor(props) {
    super(props);

    // do something

    this.state = {
      author: 'Annatar'
    }
  }

  render() {
    return (...);
  }
}
{% endhighlight %}

构造函数必须传入props，并且在第一行就得首先调用父类的构造函数。

state的设置在constructor中并不是setState了，而是变成了赋值。就像上面的那样

我就在constructor中调用Ajax。。。

## Props

这个是深坑啊。埋了我好长时间。。。

你要是老老实实跟着官网写props，就像这样

{% highlight js %}
class App extends React.Component {

  static PropTypes = {
    url: React.PropTypes.string.isRequired
  }

  static defaultProps = {
    url: '/foo/bar'
  }

  render() {
    return (...);
  }
}
{% endhighlight %}

哈哈，正常情况是会报错的！

我经过查资料才得知`static`目前是`ES7`草案上的属性，但是React官方已经推荐用了。

默认的babel并没有开启ES7的转义。所以会报错，不认识。

所以我在gulp配置文件中把babelify的stage改成了0.表示所有属性都用，

然后就通过了

## React-dom

我目前碰到的最深的坑，没有之一。

我记得之前的写法是`React.render(<App />, document.body)`，嗯，挺正常的。好

后来升级到0.14.0，要引入react-dom，写成这样也挺好的：

{% highlight js %}
import ReactDOM from 'react-dom';

import App from './app';
ReactDOM(<App />, document.body);
{% endhighlight %}

嗯，挺好的。看着不错嘛。

但是。。。为毛小版本的升级*0.14.2*就要换成`ReactDOM.render`！

最坑的是`react-router`这个项目里面的readme里写的是错误的写法！

我当时困惑了足足两个小时。后来哪里都确定了没有问题。就是找不出原因，后来就输出ReactDOM才发现里面丫的藏着一个render方法。这才正确。

一定记得，多看文档。注意，注意，注意，千万只看官方的文档，其他的谁都不可靠！

{% highlight js %}
import ReactDOM from 'react-dom';

import App from './app';
ReactDOM.render(<App />, document.body);
{% endhighlight %}

## react-router

上面讲了react-router的坑爹文档。这里得说说react-router的坑爹版本号

安装的时候千万别懒省事，不然就直接拷贝：
{% highlight console %}
$ npm install --save history react-router@latest
{% endhighlight %}

我当时就是懒得打最后的`@latest`，导致怎么都没办法显示效果。也是找了大半天的问题。后来才发现Router是undefined

别懒省事就成了。

## Others

关于Flux理解不够深，也没有用。

反正我现在看到`react-router`就后背凉飕飕的。`Redux`也是这个团队做的吧。感觉菊花一紧。。。

## Not End

从一开始的别扭，到现在不写React的别扭，转变其实还是蛮大的。

关于React的探索，这里并不是终点。

其他的，动画，Flux，React-Native，Meteor都是未来要研究的东西。

好好学习吧，少年~
