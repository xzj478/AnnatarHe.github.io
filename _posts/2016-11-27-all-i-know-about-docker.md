---
layout: post
title: 关于 Docker 我所知的一切
---

## 说在前面

本文不介绍 docker 的基础命令，只是说一些我与 docker 的历程和一些了解。

需要补习 docker 基础的同学请[点击这里](https://docs.docker.com)

## 略微接触

我大概去年就有接触过 Docker。跑过一些 image。不过那个时候了解并不多，并不是很深入，也没有更多的应用上。

那个时候开发环境还是本地跑起来。我的 Ubuntu 上装了各种数据库，还有 Redis，各种 ruby, python, java, node, go, php 的运行环境。哦，对了，还有 nginx, Apache 什么的。

反正很乱。

后来接触了 Vagrant。就本地跑 Vagrant 了。但是我很快发现这货太慢了，安装个环境要等好久，而且我依旧不想用虚拟机，资源耗费有些多。

那一段时间接触了 docker 但是没有上的原因分为两块：

第一块主要是在 Ubuntu 上

1. Ubuntu 作为我的开发环境，我认为它就是做开发的，装多一些也没什么问题。
2. docker 命令太长了，看着就有点害怕。
3. docker 很少用命令行，都是命令解决，而且官方不建议进入到 container 内部，我有些担心无法控制。

第二块主要是在 Windows 上：

1. docker 依旧需要虚拟机，我很不喜欢。
2. docker 还需要 docker-machine 这些东西，很烦。
3. Windows 的 cmd 实在太丑了，根本不想看。

## 开始应用

听闻 Docker 发布了 docker native for mac. 心里其实已经准备好了使用的。

买了 MacBook 以后，第一装 Xcode，第二就是装 Docker。

然后我折腾了好久，在 docker hub 里找 jekyll 的 docker 镜像，竟发现它无论怎么样都会报错，而且还没有国内景象。无奈之下自己 build 了一个[用于 jekyll 的 docker 镜像](https://hub.docker.com/r/annatarhe/jekyll/)

现在跑起来感觉好多了。

因为做毕设，我毕设后端用的 Go 写的，框架是 revel，依旧是在 docker hub 上找。找是找到了，但是一个个都是一两年前的，感觉这些人压根就不维护的，看了几个 dockerfile 竟然还是从 google 那边拉源码编译，这要跑在我这大天朝网络肯定是挂的。

然后没什么办法就自己 build 一个吧。然后 [docker 的 revel 镜像](https://hub.docker.com/r/annatarhe/revel/) 就这样出来了。

最近就是把 docker-compose 弄好，然后把整个web应用跑起来就行了。

## 感受

docker 是个好东西。

* 一定程度上解决了我这种不想把开发环境和生活环境搅和在一起的微强迫症患者

* 性能也够好，每次几乎无等待就能把 container 跑起来

* 多个应用也可以相互组合，用起来就会有那种干净的感觉

* 下载速度够快，我用了 daoCloud 的镜像，每次 pull 镜像都特别的快。[推荐](https://www.daocloud.io)

* Dockerfile 语法特别简单，花半天刷一遍文档就够了

其他的就是要愿意自己动手，别人的镜像有时候很不靠谱。其实上面也说了，语法很简单，自己 build 难度不大。

## Trick

其实也不算是 trick，只能是一些提醒吧。

1. run 一个 container 出错了，查了十分钟还没搞好请果断停下，自己 build， 别用他的包了。

2. build 的时候，`FROM`要多想想，别总从基础包做，费劲，到时候生成的还可能会大一些。比如要 build 一个 jekyll，可以从 ruby 的 image 开始，而不用从基础的 ubuntu 开始。

3. 涉及到`墙`的问题，用两个环境变量来设置代理，因为命令行并不执行代理：

{% highlight bash %}
ENV http_proxy http://your.proxy.site:port
ENV https_proxy http://your.proxy.site:port
{% endhighlight %}

4. 涉及到端口暴露的，要确定在 container 内部跑的程序的 host 是 `0.0.0.0` 而不是 `127.0.0.1` 或 `localhost`。这是我基础没学好的代价，请看到的同学谨记 😞 [What is the difference between 0.0.0.0, 127.0.0.1 and localhost?](http://stackoverflow.com/questions/20778771/what-is-the-difference-between-0-0-0-0-127-0-0-1-and-localhost)

## 杂谈

说起来，我还记得那个 sf 举办 D-day 的下午。那名来自苏宁 title 很高的雷姓讲师。

他讲的时候台下绝大多数人都想努力听讲，可是很快就撑不住了，听众就像上学时坐在后排的同学那样昏昏欲睡。

如果可以，我真想回到那个时间再听一遍他讲的内容。

现在想起来全是干货。

Docker 用起来简单，原理也简单。可是其实现和大规模应用，没那么简单。
