---
layout: post
title: 一些简单的前端面试题
tags: fe interview
---

最近有几次面试，也碰到过一些人，写下一些面试的东西，希望对自己或者别人有些帮助。

## 你觉得HTML哪里难

我说出了在之前文章中写过的语义化，不管别人怎么看，我始终认为语义化是一个比较考验经验和开发人员是否谨慎认真的东西，虽然不难，却需要细心。

## 谈谈闭包

说实话，这种题目我是嗤之以鼻的，这种老掉牙老生常谈的东西还要讲？

然而知道是一回事，表达又是一回事。

比如:

{% highlight js %}
for(var index = 0; index < 100; index++) {
    (function(_i) {
        // do something
    })(index)
}
{% endhighlight %}

我自己明白是怎么回事，却是说不出口。

后来经过指导大概的解释应该是这样的：

> 这是一个典型的闭包。
>
> 内层的函数使用了外部的数据，所以在GC的时候要保存这个数据在内存中，不能销毁。

## Regex

正则我自以为还算凑活，一些东西能写出来.

那么这样一个场景：

只匹配`a123abchdfdsa`中的第一个`a`，而且不匹配`afsdfd`中的第一个a。

我听到的时候觉得可能要用取反的那个`^`，然而实际场景中，这个方法并没有卵用。

`?=pattern`, 最后答案其实并不属于*javascript*了，因为这里似乎并不是js的语法。

[正则表达式](https://zh.wikipedia.org/wiki/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F)

## 似懂非懂

还有一些似懂非懂的东西，比如Promise是否属于ES2015规范？

我那个时候拿不准，回来之后翻了一下[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)确实是属于ES2015的。

还是应该再很细的知识上下足功夫。

## React 性能调优

我恬不知耻的在简历上写了**对React性能优化有一定的认识**，其实毛都不会。就是了解点儿皮毛而已。

据我所知的情况就是要严格控制`shouldComponentUpdate`这个生命周期函数来限制rerender。还有数据尽量Immutable。其他的同构这种我暂时还没接触过，没敢说出来，怕被问死。

现在被问的都有心理阴影了，我是不是该划掉这一行。

## React 两个兄弟组件通信

我满以为自己React还算是写了一段时间的。

结果被问了这个问题就当场懵逼了。

我满脑子是*Redux*这种顶层数据管理的东西。也有想到了ReactContext这个，但是想了想，还是跟父组件有关系。

通过Props传还是跟父组件有关系。怎么办。

后来查了一些文章。[ReactJS组件间沟通的一些方法](http://www.alloyteam.com/2016/01/some-methods-of-reactjs-communication-between-components/)

发现自己对原生browser还是没有想清楚. 可以通过全局事件这样的事情来做的！

真的好蠢 T_T

现在觉得用locaStorage也能做啊。绑定window的storage事件来做交互啊！

好蠢 T_T

## 渐变色

问我CSS有哪些问题，我说可能兼容性吧。

然后作死给自己填坑，说比如背景色渐变，兼容性就很蛋疼。

然后问。。。低版本IE怎么达成这样的效果。。。

我很少做兼容性，听到这个问题感觉又被操翻了。而且还是自己给自己挖的坑。。。

好好的日子不过干嘛作！

后来被提醒说IE的滤镜。

回来以后疯狂补课：

[关于IE中CSS-filter滤镜小知识](https://www.qianduan.net/guan-yu-ie-zhong-css-filter-lv-jing-xiao-zhi-shi/)

## 其他

其他的就不是技术相关了，吹了一会儿经济学，幸好我经济学学的还行。差点儿吹起来宗教相关，幸亏打住了。

Ukulele弹得差，说了一点儿。

## 质数

路上碰到一个MIT的PhD。偶然说到这道题，他说好些master都不会写。好在还会写 T_T

我的天。。。我这几天又翻了几页**SICP**，发现自己竟然不会了。

似乎要用到费马小定理：

> 如果 n 是一个素数，a 是小于 n 的任意正整数，那么 a 的 n 次方与 a 模 n 同余

{% highlight scheme %}
(define (expmod base exp m)
    (cond ((= exp 0) 1)
    ((even? exp)
     (remainder (square (expmod base (/ exp 2) m))
                m))
    (else
     (remainder (* base (expmod base (- exp 1) m))
                m))))

(define (fermat-test n)
    (define (try-it a)
        (= (expmod a n n) a))
    (try-it (+ 1 (random (- n 1)))))

(define (fast-prime? n times)
    (cond ((= times 0) true)
          ((fermat-test n) (fast-prime? n (- times 1)))
          (else false)))
{% endhighlight %}

## 总结

我就是个菜鸡，回家老老实实学习吧。

