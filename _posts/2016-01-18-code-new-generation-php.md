---
layout: post
title: 开始编写新时代的PHP吧
tags: php
---

## New Generation

时至今日(2016-01-18)， PHP已经发展到了`PHP 7.0.2`，然而大量的资料和代码依旧停留在上个时代，甚至是上上个时代。

如果你没有尝试过新生活，跟着我的这篇博文来试试新时代的PHP吧～

ps: 如果你在2017年以后看到这篇文章，那么这就应该属于标配了。

## autoload and namespace

翻阅众多的先前代码，不难发现`require`和`include`是一个比较头疼的问题。后来的`require_once`这种的也是不够给力的。毕竟大项目很难处理繁杂的require。我之前看到有人中小型的项目都要写长长的一个`require.php`文件.

后来的PHP版本出了`autoloade`是挺好用，但我们还有更好用的方式

其实各种文件依赖也不全是痛点，更痛苦的是没办法用包管理，简单地说：不能痛快的复制粘贴了！

[composer](https://getcomposer.org)一定程度上解决了这几个问题，先来看看更好的依赖解决方案.

在自己的PHP项目中新建一个文件叫`composer.json`。

{% highlight json %}
{
    "autoload": {
        "psr-4": {
            "Acme\\": "src/"
        }
    }
}
{% endhighlight %}

然后运行`composer install`, 或者`composer auto-dump`

然后编写`index.php`

{% highlight php %}
<?php 
// index.php
require 'vendor/autoload.php';
(new Acme\Bootstrap)->start();
 ?>
{% endhighlight %}

其中`Acme`是随便的名字，作为命名空间使用。比如这样的文件

{% highlight php %}
<?php 
// src/bootstrap.php
namespace Acme;
class Bootstrap {
    public function start() {
        return 'start';
    }
}
 ?>
{% endhighlight %}

这个时候运行`php index.php`看起来是不是吊吊的？

## return

PHP发布到了版本7之后性能得到极大的提升。可以说是免费无痛的性能提升，跟换HHVM还是不一样的。

那么想要得到更多的性能提升除了开`opc`之外，还应该等待新版的php7.1的到来。7.1版本加入了JIT，使得运行速度再度提升。

但是php官方的说法是给定返回值的可以比较容易判定预期值，使得降低数据类型的判断成本。HHVM就是假定所有的数据类型不会改变才会有如此之巨大的性能升级。

其实php7.0就已经支持强类型了。拥抱改变吧

{% highlight php %}
<?php 
class Foo {
    public function add(int $x, int $y): int {
        return $x + $y;
    }
}

echo (new Foo)->add(1,2);
 ?>
{% endhighlight %}

其实还有一种严格模式，更js的开启方法差不多。。。不多说了，查手册吧。

## PDO

PDO已经普及的很多了，我想在这里再安利一下. 

PDO的预处理语句可以一定程度上降低SQL注入的漏洞。还有事务处理，还可以一定程度上降低重复书写代码什么的（鬼才信）。。。总之就是一万个好！

千万千万别用`mysql_*`系的函数了，已经被废弃了。`mysqli_*`系的函数其实各项性能都不错。只是因为只针对mysql，所以还是用PDO吧。

PDO大家都蛮熟的了，我就不写了。

## stop $_GET

我一开始学PHP时候写的代码屎一样，各种检测都没做。实体转换也不改。
现在我正式安利[filter_input](http://php.net/manual/zh/function.filter-input.php)

通过名字差不多都能看出意思了。`过滤变量`，具体用法

{% highlight php %}
<?php 
$search_url = filter_input(INPUT_GET, 'search', FILTER_SANITIZE_ENCODED);
 ?>
{% endhighlight %}

当然，它还有系列用法。去看看文档吧

## try laravel

试试laravel吧。虽说有一定的学习成本，但是其强大程度几乎是在`php`世界里最给力的框架。

## localhost

自从5.3以后，php支持了命令行的server搭建。

{% highlight console %}
php -S localhost:8000 -t /path/to/dir/
{% endhighlight %}

S 大概是`server`的简称。

t 指的是目录

还有一定要注意的是仅仅只能作为开发使用。其内部并不像node一样有什么异步非阻塞特性。并发量稍微起来一点就GG。一定要注意

再说了，拿nginx配置多简单。

## PsyShell

php 和其他语言不太一样的地方在于没有PECL。这样让测试起来其实不太舒服。

这个拓展非常好的解决了这个问题。输入`psysh`就可以进入命令行，尽情的输入php代码吧。

## Swoole

Swoole拓展挺给力的。各种类似于node的特性，非阻塞，异步什么的。多进程用起来尤其的舒服。

推荐作为服务端尝试一下