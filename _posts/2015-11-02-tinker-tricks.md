---
layout: post
title: Tinker 小技巧
tags: snippets php
---

首先祝自己生日快乐啦 ^_^

## What's the tinker ?

`Tinker`是laravel带的一个命令行的php交互工具。

有时候一个很简单的测试可能需要在代码里改东西，然而可能只会写一行代码。

这种工具学名叫做[REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)，
Ruby有irb，node也有console，python有，而php没有。

之前的调试是异常痛苦的，一个中型项目，只需要测的是ORM，然而还得在controller里写好多东西，还得加上var_dump

然而有了tinker，一切都变得好用了。

Tinker只是在laravel中的名字，其实人家真名叫做[psysh](https://github.com/bobthecow/psysh/)。

非常的好用。

安装这种东西我就不说了，他们的readme写的很好。

laravel项目在安装完依赖以后可以输入命令进入：

{% highlight console %}
$ php artisan tinker
{% endhighlight %}

## Basic

很简单的，先写上几行简单的：

{% highlight console %}
$foo = 'bar';
echo $foo
{% endhighlight %}

很简单的，就像是在chrome的console里面写代码一样。

## ORM

为了给代码作色，我就用php的语法写了，但是其实是像一个console的，我相信你懂的

一定记得，和在工程中写代码是一样的

获取某个集合
{% highlight php %}
<?php 
App\User::all()
# << 会返回所有users的collections，可以清楚的看到
App\User::find(1)
# << 会返回id为1的用户数据
App\User::find(1)->articles()->get()
# << 关联查询，获取这个用户的所有文章
 ?>
{% endhighlight %}

命名空间也是一样的
{% highlight php %}
<?php 
use App\User;
# << 会返回false，别担心，已经成功了
User::all();
# << 好了，成功了
 ?>
{% endhighlight %}

## Factory

开发环境的假数据的是个问题吧？

这个东西不能没有，没有了就不好看效果了。

有数据吧，还得去写数据。小项目三五分钟写完，而稍微多一点儿的怎么办？三五个小时？

laravel作为php中最好的框架，怎么可能会让这么痛苦的事情发生？

factory就很容易解决喽~

在路径为 **projectName / database /factories /ModelFactory.php**里写入下面的

{% highlight php %}
<?php 
$factory->define(App\User::class, function (Faker\Generator $faker) {
  return [
    'name' => $faker->name,
    'email' => $faker->email,
    'password' => bcrypt(123123),
    // 从另一个factory中创建数据，获取id
    'branch_id' => factory('App\Branch')->create()->id,
    'remember_token' => str_random(10),
  ];
});
 ?>
{% endhighlight %}

然后就可以在tinker里面这么写：

{% highlight php %}
<?php 
// 创建5个用户放到数据库里
factory('App\User', 5)->create();

// 创建数据，只是展示，并不存数据库
factory('App\User', 5)->make();
 ?>
{% endhighlight %}

是不是很方便呢？
