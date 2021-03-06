---
layout: post
title: 翻译 Meteor React 制作 Todos - 06 - 部署应用
tags: js Meteor React
---

## 部署你的应用

现在你有了一个可以运行的**待办事宜**的应用，你可以分享给你的朋友们！
Meteor使得发布你的应用到其他人可以使用的互联网变得非常的简单。

同样是在你的应用文件夹的命令行中输入：
{% highlight console %}
meteor deploy my_app_name.meteor.com
{% endhighlight %}

只要你回答完了提示信息的问题而且上传也完成了，你就可以在任何时候任何地点，登陆`http://my_app_name.meteor.com`使用你的应用。

试着在多种不同的设备上打开你的应用，比如你的手机，你基友的电脑上。添加，删除，确认完成这些操作，你将会看到你的应用的界面响应非常的快。。这是因为Meteor并不会在更新用户界面之前等着服务端的响应数据。我们会在第11节讨论这些。

恭喜啦，你刚刚完成了一个可以正常运行的应用程序，你可以和你的小伙伴们一起使用，在接下来的步骤里，我们将会添加更多的功能 -- 包括多用户，私有任务还有搜索。

现在咱们先绕过这些，来看看在我们写完一个web应用的时候，我们同时也写好了一个不错的移动应用！