---
layout: post
title: 翻译 Meteor React 制作 Todos - 01 - 创建应用
tags: js Meteor React
---

## Before

在翻译之前我还是要简要介绍一下`Meteor`，这是一款跨时代的框架。真的，完全没有骗你。

一开始的网站是纯静态页面搭建的。

后来开始使用动态的脚本语言，比如`PHP`

后来以此构成了框架。最为出名的自然是`Ruby on Rails`。

再后来`node`的出现导致`web`开发再起风波，`MEAN`开始大行其道，但是，由于时间太短，没办法对`PHP`阵营和`RoR`阵营造成什么冲击，但是前后端统一`js`的理念已经存在了。

再后来就是现在的`Meteor`了。

我个人在首次接触的时候感觉，可能就是和`Rails`, `Laravel`差不多的东西吧，只是语言换成了`js`.

然而并不是的。

通过`Socket`来传递数据，在本地起`MiniMongo`这种事情使得`web`开发进入了新的阶段。

就先说这么多吧。我相信随着理解的深入，你会对`Meteor`有更加清晰的认识

## Installing

无论如何得先安装吧。

这里说一个可能朋友们不太高兴的话：

<span style="color: red;"> 尽量不要使用windows做开发 </span>

原因是这样的：

1. windows对我们来说可能更偏娱乐一些，在写代码的时候忍不住去看看QQ，玩玩游戏是很正常的事情。但是编程要专注。
2. windows有更多的莫名其妙的问题。经过我亲测，Linux下正常的操作到了windows就可能会报错。比如`ruby`。。。

所以，请使用`Mac`或者`Linux`做开发。

安装很简单，只需要打开`Terminal`输入：
{% highlight console %}
curl https://install.meteor.com/ | sh
{% endhighlight %}

等进度条走完就行了。

安装完成了还可以确认一下：
{% highlight console %}
meteor --version
{% endhighlight %}
只要输出不是`commend not found`就证明安装成功

---
（下面开始老老实实的翻译了）

## Creating an app

在这个教程中，我们去做一个管理**待做事宜**的简单应用，并可以和其他人合作完成某项任务

要建立应用，要打开终端，并输入
{% highlight console %}
meteor create simple-todos-react
{% endhighlight %}

这个命令将会建立一个叫做`simple-todos-react`的文件夹，并包含`meteor`应用所需要的所有文件
{% highlight console %}
simple-todos-react.js     # 一个在客户端和服务端都会被加载的主要js文件
simple-todos-react.html   # 一个主要的定义视图的HTML文件
simple-todos-react.css    # 一个定义应用样式的样式表文件
.meteor                   # Meteor 内部文件
{% endhighlight %}

运行你新建的应用：
{% highlight console %}
cd simple-todos-react
meteor
{% endhighlight %}

打开你的浏览器，并进入`http://localhost:3000`去看看应用的运行情况

你也可以在继续下一步教程之前随便玩玩这个刚刚新建的默认应用，例如，用你自己最喜欢的编辑器，试着在文件`simple-todos-react.html`的`<h1>`标签中间写一些东西。当你保存这个文件的时候，浏览器的页面将会随着新的内容自动更新，我们称之为*热推送*(hot code push)

现在，你在编辑这些文件的时候，对`Meteor`应用有了一些简单了解，那么开始去做一个简单的`React待做事宜`应用吧。如果你在这个教程中找到了*bug*或者是错误，请提交`Issue`或者给我们提交`pull request`在[Github](https://github.com/meteor/tutorials)上。

如果你觉得我翻译的很烂，来给我说吧！

邮件地址：[hele@iamhele.com](mailto:hele@iamhele.com)
