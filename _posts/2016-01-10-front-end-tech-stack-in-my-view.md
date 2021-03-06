---
layout: post
title: 最近前端技术栈的一些想法吧
tags: vue front2end js
---


## React VS Vue

之前写过一个文章说一些React应注意的一些基础问题。现在你应该知道，我已经转Vue了。

我非常喜欢Vue的组件的编写方式。用`*.vue`的组件编写实在是符合正常人的思考方式。相比之下React的写法就不够人性化了。

React 写法：
{% highlight js %}
import React from 'react'

class Foo extends React.Component {
    render() {
        return (
            <h1>Hello world</h1>
        )
    }
}
export default Foo
{% endhighlight %}

Vue 写法：
{% highlight html %}
<template>
    <h1 v-text="msg"></h1>
</template>
<script>
export default {
    data() {
        return {
            msg: 'Hello world'
        }
    }
}
</script>
<style lang="stylus">
h1
    background-color #333
</style>
{% endhighlight %}

可以看出对于开发来说，Vue要舒服很多。样式可以直接写在模板文件中。每个组件写起来也都是相互独立的。非常的舒服。

而React则比较操蛋了。要写较多的代码，比如头上都得写`import React from 'react'`。结构也不是很清晰(相比于Vue的写法来说)。

React的生命周期函数是比较正经的。也都很容易懂。然而Vue从命名上来看则更容易。写出的代码即使对Vue了解不多也都能读出个七七八八。而React？冗长的函数名虽然清楚，但是让人看着就头疼。

从这里可以看出我其实是非常偏爱Vue的。然而Vue自然也是有短板，最最最让人难过的是生态。React周边的库简直不要太多。
还有很多类似[AmazeUI-react](http://amazeui.org), [ant-design](http://ant.design)的库可以非常快速的构建原型产品。Flux则更是让人耳目一新。严格的单向数据流相信在刚刚出来的时候一定是突破性的。
还有细腻的Virtual DOM，使得性能提升非常的精确。
还有杀手级的React-native，没的说，前端攻城师们看到都疯了。

与之相对的Vue就比较弱了。没有出名的库，大型项目的数据管理的Vuex也是刚出的。和React-native相对应的似乎有一个，阿里巴巴的Weex，不过没有开源，而我看来开源对他们来说似乎也不是很愿意。

在知乎上看到徐飞说Vue在2016会有腾飞，我也比较相信的。所以最近已经把重心押宝到了Vue

对于代码内容，我瞥过几眼react的源码，长，长，长。。。难读。
Vue的源码就比较正常了，虽然风格会乱变，但至少正常。最近在读，有什么进展会写出来的。

## Stylus VS Sass

我其实是十分喜欢Sass的，因为它确实写起来比普通的CSS舒服多了。有一些函数，变量，继承什么的，好多特性。

我之所以切换到了Stylus，是因为。。。node-sass太难装了。实在是太难太难装了。似乎是因为node-gyp在windows平台的编译特别困难。

总之我是编译了两天之后实在是装不上只能硬着头皮看了Stylus文档，然后在项目中用了Stylus。

只能说用起来真舒服。

我不说什么基础的语法了，只能说语法非常优美。写起来像是正常人用的。而且安装很简单。

好像还有什么`PostCSS`和`cssNext`的东西。我觉得Stylus暂时是足够我使用了。

对了，我比较推荐的目录方式是这样的。

    --- src
      |-- styles
        |-- normalize.styl
        |-- variables.styl
        |-- animates.styl
        |-- global.styl
        |-- forms.styl
        |-- lists.styl
        |-- ...其他全局组件

这里不包含单独的在`*.vue`中的独特的样式。

其实在Sass中也可以用这样的目录格式。

在单独的文件中，目前比较推荐的做法是`BEM`的命名方式。三个字母的意思是`Block`, `Element`, `Modifier`。我记得[laracasts.com](https://laracasts.com)有个课程，可以去看看。

我觉得这样的目录和命名方式都是蛮好的，当然如果你有更好的方案也欢迎写给我说说。

## Global State

全局状态在非常非常小的项目中没什么卵用。但是只要稍微上点儿规模就会产生相当大的问题。

我之前用React写过daxuedogs的表单注册页面，结构其实现在想想也并不复杂。而复杂的地方在于状态。。。比如按钮的一个`disabled`属性，什么时候有这个属性，什么时候没有呢？很简单吗？并没有。

用户在提交表单后可以影响这个值，用户在输入已注册的用户数据，通过Ajax也可以影响这个值，在组件初始化之后从服务端获取数据之后的数据也可以影响这个值。

看吧，现在只有三个操作可以控制，然而真正的大型项目中，几十个操作控制一个状态也并不是不可能的。

这个时候可是相当的乱了。

Flux的出现让人看到了希望。

说说Vuex吧，也是单向数据流的。只不过我觉得它更好理解，可能是中文文档的功劳吧。反正Redux我是看不懂。

而且比较害怕Redux，这货版本号的更迭近乎疯狂，API一天一变都是会出现的。

我觉得Vuex的文档写的非常好，如果你看不懂Redux可以试着看看Vuex，相信我，你差不多会明白的。

## Flex VS Float

这里是布局的环节，自从我在我的简历项目：[iamhele.com](https://www.iamhele.com)中用了Flex布局后就再也不想用传统的方式了。

众所周知，float比较操蛋，尤其是一个`clear:both`的坑简直不要太多。各种兼容Hack都要考虑一下。

Flex就比较正常了。除了兼容性比较差以外，布局是非常舒服的。其实硬说兼容性差也是没道理的，能兼容到IE10呢，加上autoprefixer就差不多了。只是里面有一些特性可能要注意：
比如`flex-wrap:wrap`似乎在微信里不能用。

关于兼容性，我之前也写过文章说过，总是兼容低版本会使得历史总是停步不前。千万种不好。

## Components

我觉得组件最好最好的一点在于耦合的降低。

在一开始的想法是页面正式编写之前先写几个commonComponents。比如`Alert`, `Loading`这种的。

正式开始写页面的时候又感觉和业务不够合适，于是重写了新的`Alert`组件。结果仍旧是运行的很好。要改的地方根本不多。实在懒也可以不改。只是风格可能不一致。

想想，普通的页面，一张页面一张页面地改。。。那酸爽。囧

其实更可以在任何新项目之前先把老项目的`commonComponents`文件夹复制过去，一点儿问题都没有，反正是很通用的。新开个类似于Bootstrap的Vue版项目可能要比普通的情况简单很多。而且源码可读。

不过我最近并没有这个计划，我十分相信，在2016年会出现很棒的类似`ant.design`的项目。

## Webpack VS Gulp

前端变化快，太快了，非常的快。

我记得年初的时候我还在琢磨`Grunt`插件怎么写，然后就不知道怎么回事，就写了了`gulpfile.js`。当我享受gulp带来的舒适的时候，好像大家突然就转到了webpack了。。。

这个变化好快好快。

我犹记得上次D2，阿里一个title特别高的人说，他20年前写的js现在根本看不懂，而20年前写的Java依旧在生产环境跑的好好的。

像js这样的变化让人实在是难以追上。然而每次追上之后那种畅快也是用老旧工具的人所不能体会的。

我在一开始是拒绝webpack的，因为我觉得gulp就挺好的。什么功能也都齐全，watch也不慢。

然而在某次写react的时候尝试一下了以后，我发现回不去了。

超快的加载速度，自动reload，打包，压缩，合并。各种各种功能简直不要太开心。

然而我也知道，webpack也绝不是终点。上次在知乎看到贺老说下一代的打包工具看得我高潮迭起。什么自动转义，http2，自动发布cdn什么的。棒棒的。

## 技术栈

目前来看，最合适的技术栈应该是

* webpack + React + redux + react-router + TypeScript + PostCSS/CSSNext

我目前用的是纯Vue技术栈了

* webpack + Vue + Vuex + Vue-router + ES2015 + Stylus

这个文章写了快一周，算了，暂时就这样了。push!
