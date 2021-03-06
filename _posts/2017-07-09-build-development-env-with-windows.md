---
layout: post
title: 组机并用 windows 打造开发环境
tags: life windows
---

## 组装电脑

最近特别想组装一台电脑。起因是我用了 Mac 半年之后感觉并不是那么的好。它也不是我梦想中的完美开发环境，依旧很痛苦。被折磨了很久就想自己组一台电脑。

作为一个程序员，我肯定是想上高配。无奈钱包不够，只给了自己 4k 的预算。不过。。。。最后还是超支了，到了 7k T_T

由于我第一台电脑的 CPU 是 AMD 家的，是在小学时候买的。感觉并不好，电脑会很卡。而且网上风评也都是 AMD 的 CPU 一直是被压着打的节奏。所以一开始完全没有考虑用 AMD 的。后来本来是准备上 i5。查了一些信息之后发现不用买显卡，这样剩下的预算就飙到了 i7，感觉 i7 7700 挺不错的。然后就放在了购物车里面。

关于显卡是选择了 i7 7700 之后看到它自带集显，而我平常很少打游戏，所以很明显一个集成显卡已经够用了。所以没有考虑。

在准备下单的前一天，同事无意中说了一句“这样还不如买 AMD 的 Ryzen”。我起初内心是非常抵触的。可是回家以后查了一些资料发现这颗 CPU 很强大啊。于是就上了 Ryzen 1700. 八核十六线程，主频 3GHz。这颗 CPU 定好以后就选择了技嘉的 B350 主板，感觉还可以。之后发现这颗 CPU 没有集显，只得又配了一个微星的 1050ti 显卡。然后是加了一块 M2 接口的 240G 建兴 SSD，海盗船 的 16G 内存条，西数 1T 的机械硬盘，海盗船 450W 的电源，最后是先马的机箱。对了，还有一个无线网卡。

这一套下来接近7k了。非常的心疼。

在这台机器之前我对于组装电脑一窍不通，下单之后找了很多的装机视频去看。最后自己动手把机器装了起来。整个过程除了腰疼以外还有满满的成就感！

组装电脑的时候发生了一些故障，搞得我以为翻车了。后来证实是因为HDMI的线有可能存在插不稳的现象。内存条有时候换换位置会好的。显示器没信号了试试重新搜索信号即可。

## 搭建开发环境

我先装了 Windows 10. 装完之后问题很多，平均每一个小时死机一次，经常蓝屏。这些都可以稳定复现。我当时在怀疑，Windows 不是号称全宇宙最强的兼容性么？怎么会做出这种东西？之后找原因大概是因为显卡驱动的问题。随后在心惊胆战中成功升级了系统到新版。现在非常的稳定，什么问题都没有。一切如常。

## 真的开始搭环境了

第一人称到此结束。

首先需要打开 windows 子系统。 Control Panel -> Programs -> Turn Windows features on or off -> Windows Subsystem for Linux。

然后重启电脑，打开 cmd， 输入 bash。即可从 Windows store 下载 bash，等待结束就可以进入熟悉的 bash 环境了。

Mac 有 Homebrew 可以安装各种东西，其实 Windows 现在也有了： [Choco](https://chocolatey.org/)。用法和 homebrew, apt 几乎一样。

Windows 的 cmd 应该是这个世界上最丑的命令行了吧？不改造一下我根本不想在里面敲命令。

Windows 目前有个叫做 [hyper.js](https://hyper.is/) 作为命令行很不错。下面来安装一下。

{% highlight console %}
$ choco install node.js
$ choco install hyper
{% endhighlight %}

Mac 里面有 spotlight 这样的神器，可以快速启动应用。其实 Windows 里面现在也有，Windows 键很少有人用到，但是它已经是很强大的了。按下 `Win 键`，然后输入什么内容，它就会搜索内容。然后按下 Enter 就会打开应用了。

Hyper.js 应该已经安装好了。现在到用户目录下找到一个叫做 `.hyper.js` 的文件，在其中找到这个选项，修改一下

{% highlight js %}
{ shell: 'C:\\Windows\\System32\\bash.exe' }
{% endhighlight %}

然后进入 bash，先换源

{% highlight console %}
$ sudo sed -i 's/archive.ubuntu.com/mirrors.163.com/g' /etc/apt/sources.list
$ sudo sed -i 's/security.ubuntu.com/mirrors.163.com/g' /etc/apt/sources.list
{% endhighlight %}

{% highlight console %}
$ apt update
$ apt upgrade
# 安装 fish shell
$ sudo apt-add-repository ppa:fish-shell/release-2
$ sudo apt-get update
$ sudo apt-get install fish
{% endhighlight %}

{% highlight console %}
# 生成新用户
$ useradd -m -G sudo username
$ passwd username
{% endhighlight %}

这个时候可以在windows那边改变启动的用户

{% highlight console %}
LxRun.exe /setdefaultuser username
{% endhighlight %}

随后进入 Hyper 。

{% highlight console %}
# 安装 oh-my-fish
$ curl -L https://get.oh-my.fish | fish
# 安装主题
$ omf install robbyrussell
# 生成公私钥
$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
{% endhighlight %}

然后将 `~/.ssh/id_rsa.pub` 中的内容复制到 github 的 ssh 中，然后就可以拉代码了~

这里还有一个步骤，将 fish shell 作为默认 shell。这里不能用之前 linux 的经验靠命令去处理了。而是需要先启动 bash，然后进入 fish。

{% highlight console %}
# Launch Fish
if [ -t 1 ]; then
  cd ~
  exec fish
fi
{% endhighlight %}

期间还需要下载 [visual studio](https://www.visualstudio.com/)，有社区版的，免费。记得一定要装上"Windows Universal CRT SDK"

之后需要把`capslock`改键成 `Ctrl`：新建一个 `remap.reg`，拷贝进去。之后双击执行，重启电脑即可。
{% highlight console %}
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
"Scancode Map"=hex:00,00,00,00,00,00,00,00,02,00,00,00,1d,00,3a,00,00,00,00,00
{% endhighlight %}


到这里一个 Windows 下的开发环境已经搭建完毕了。是不是很棒！

ps: 最近 windows 的 gvim 好像也抽风了。搞得字体没办法上下对齐，很气。

![](https://ww1.sinaimg.cn/large/8112eefdgy1fi0tkxnxnfj20s40jt74d.jpg)

## References

* [How to set up the perfect modern dev environment on Windows](https://char.gd/blog/2017/how-to-set-up-the-perfect-modern-dev-environment-on-windows)

* [How to change default user in WSL Ubuntu bash on Windows 10](https://askubuntu.com/questions/816732/how-to-change-default-user-in-wsl-ubuntu-bash-on-windows-10)

* [Bash on Windows 实际体验如何？](https://www.zhihu.com/question/42228124)

* [Map capslock to control in windows 10](https://superuser.com/questions/949385/map-capslock-to-control-in-windows-10)

* [Fish as Default Shell on Windows 10](https://www.kennethreitz.org/essays/fish-as-default-shell-on-windows-10)

* [Cannot find corecrt.h: $(UniversalCRT_IncludePath) is wrong](https://stackoverflow.com/questions/38290169/cannot-find-corecrt-h-universalcrt-includepath-is-wrong)
