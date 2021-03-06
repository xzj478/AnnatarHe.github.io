---
layout: post
title: 翻译 Meteor React 制作 Todos - 07 - 在移动端运行
tags: js Meteor React
---

## 在安卓和苹果上运行你的应用

> 目前Windows平台的Meteor并不支持移动应用的构建，如果你正在使用Windows平台的Meteor，你得跳过这一步了。

现在来看，我们编写我们的应用，测试我们的应用都是在浏览器上，其实Meteor早就设计了跨平台的能力 -- 你的**待办事宜**网站也可在安卓或者苹果上运行，而只需要几个简单的命令

Meteor使得导入构建移动应用的所需工具变得很简单，只是下载所有的应用程序可能得花点儿时间，Android大概有300MB，IOS得要安装那个2GB的`Xcode`，如果你并不想安装这些工具，你也可以跳过接下来的几步。

### 运行一个IOS模拟器(仅限Mac)

如果你有一台Mac, 你可以在IOS模拟器里运行你的应用。

到应用目录输入下面一行代码：
{% highlight console %}
meteor install-sdk ios
{% endhighlight %}

这条命令会通过设定几个必须的设置来从你的项目中构建一个IOS应用
当上一条命令结束，我们输入

{% highlight console %}
meteor add-platform ios
meteor run ios
{% endhighlight %}

你将会看到一个IOS模拟器会从你正在运行的调出来~

### 在安卓模拟器上运行

打开命令行，在你的应用目录中输入：
{% highlight console %}
meteor install-sdk android
{% endhighlight %}
这将会在你的应用中，帮你安装所有需要构建一个安卓应用所需的工具。当所有的安装完成，你需要输入
{% highlight console %}
meteor add-platform android
{% endhighlight %}
在同意了许可条款后输入
{% highlight console %}
meteor run android
{% endhighlight %}

在一些初始化工作后，你将看到一个安卓模拟器调出来，在原生安卓中运行着你的应用程序。这个模拟器可能会有点慢，所以你要是很想看到真实的效果，你得拿出真实的设备让它跑。

### 在安卓设备上运行安卓应用

首先，把上面关于安卓的部分都走完，以确保你的电脑上安装了所有的安卓工具。随后，在手机上把开发者工具的**debug**模式打开，同时你的手机要通过USB连接到你的电脑。还有一件事：你在真实设备上运行之前，必须得退出安卓模拟器。

随后，执行这条命令：

{% highlight console %}
meteor run android-device
{% endhighlight %}

这个应用将会被构建，并安装到你的设备上。如果你要指定你部署的应用的服务器，你要在上面的步骤中，你得这样写命令：

{% highlight console %}
meteor run android-device --mobile-server my_app_name.meteor.com
{% endhighlight %}

### 在你的iPhone或iPad上运行程序(仅限Mac，需要苹果开发者账户)

如果你有一个`Apple`开发者账户，你也可以在你的**IOS**设备上运行你的应用。
执行这样的一条命令：

{% highlight console %}
meteor run ios-device
{% endhighlight %}

这将会为你的应用打开**Xcode**，你也可以使用Xcode来在你任意设备或模拟器上启动应用，当然，前提是Xcode支持。

在上个步骤中如果你想指定服务器，执行这样的命令：

{% highlight console %}
meteor run ios-device --mobile-server my_app_name.meteor.com
{% endhighlight %}

现在我们知道了在移动端部署和运行我们应用是有多简单。那么我们来开始为我们的应用添加更多的特性吧！