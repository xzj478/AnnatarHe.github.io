---
layout: post
title: 翻译 Meteor React 制作 Todos - 09 - 添加用户账户
tags: js Meteor React
---

> 这篇中有几个点是受到瑛那同学的指导翻译出来的，表示感谢

## 添加多用户账户

Meteor带来了一套账户系统然后顺便还带了用户界面来让你可以在几分钟之内在你的应用中添加多用户功能

> 目前，这套UI组件使用Blaze作为默认的UI引擎，在未来，可能会以React的专有组件来将其替换。


为了开启这套账户系统和UI界面，我们需要去添加相关的包。在你的应用目录中，执行下面的命令：
{% highlight console %}
meteor add accounts-ui accounts-password
{% endhighlight %}

### 用React来包装一个Blaze组件

为了从`accounts-ui`这个包中使用Blaze UI组件，我们需要用React的组件来把他包装一下。
来创建一个叫`AccountsUIWrapper`的新组件吧。

{% highlight js %}
// 新文件 AccountsUIWrapper

AccountsUIWrapper = React.createClass({
  componentDidMount() {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template.loginButtons,
      React.findDOMNode(this.refs.container));
  },
  componentWillUnmount() {
    // Clean up Blaze view
    Blaze.remove(this.view);
  },
  render() {
    // Just render a placeholder container that will be filled in
    return <span ref="container" />;
  }
});
{% endhighlight %}

我们只需要在App组件中定义一下就可以包含这个组件了：
{% highlight html %}
  Hide Completed Tasks
</label>

<!-- 定义开始 -->
<AccountsUIWrapper />
<!-- 定义结束 -->

<form className="new-task" onSubmit={this.handleSubmit} >
  <input
    type="text"
{% endhighlight %}

然后，添加下面的代码来进行账户界面的设定。使用`username`，而不是`email`

{% highlight js %}
// 在 simple-todos-react.jsx 文件

if (Meteor.isClient) {

	// 加入开始
  // 这段代码只会在客户端执行
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
	// 加入结束

  Meteor.startup(function () {
{% endhighlight %}

### 添加用户关联功能

现在你已经可以创建账户并登录你的应用程序了。这看起来挺牛B的，但是现在的用户登录和退出其实并不是有用的。
我们得添加下面两条特性：

1. 只对已登陆用户展示新任务的输入框
2. 展示每个应用的创建者

为了达成这样的效果，我们得在`tasks`集合中添加两条字段

1. `owner` -- 创建任务的用户`_id`
2. `username` -- 创建任务的用户的`username`。我们将会把`username`存放在任务对象的字典中，这样我们就不用在每次展示任务的时候从`user`表里面拿数据了

首先，在`handleSubmit`的事件监听上添加一些代码来保存相应的字段

{% highlight js %}

Tasks.insert({
  text: text,
  createdAt: new Date(),            // 当前时间
  // 添加开始
  owner: Meteor.userId(),           // 已登陆用户的_id
  username: Meteor.user().username  // 已登陆用户的用户名
  // 添加结束
});
{% endhighlight %}

修改`getMeteorData`中的`return`语句来获取当前登录用户的个人信息
{% highlight js %}
// App.jsx
    return {
      tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
      // 添加开始
      incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
      // 添加结束
    };
  },
{% endhighlight %}


然后，在`render`方法上，添加判断语句使之只在用户登录后才会显示。

{% highlight js %}
// 在App.jsx文件中
  <AccountsUIWrapper />

	// 修改开始
  { this.data.currentUser ?
    <form className="new-task" onSubmit={this.handleSubmit} >
      <input
        type="text"
        ref="textInput"
        placeholder="Type to add new tasks" />
    </form> : ''
  }
  // 修改结束
</header>

<ul>
{% endhighlight %}

最后，添加语句，使之可以在每个文本之前显示用户名
{% highlight js %}
          checked={this.props.task.checked}
          onClick={this.toggleChecked} />
 
				// 修改开始
        <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </span>
        // 修改结束

      </li>
    );
  }
{% endhighlight %}

在你的浏览器中，添加一些任务，然后你会看到你的用户名出现了。那些这一步骤之前的老任务并不会有附上名字。尽管删掉就是了

现在，用户可以登陆，我们也可以跟踪每一个任务的所属用户。让我们来更深层次的思考一下我们刚刚发现的概念。

### 自动的账户界面

> 这段翻译的不好，最好看原版：[https://www.meteor.com/tutorials/react/adding-user-accounts](https://www.meteor.com/tutorials/react/adding-user-accounts)

如果我们的应用有`accounts-ui`包，我们必须去做的是通过渲染被包含的UI组件来添加登陆下拉框。这个下拉框会检测登陆方法是否被加入到了app中，并适当的展示控制(界面)。在我们这一部分，开启了login方法的只有`accounts-password`，因此，下拉框展示了password字段。如果你比较喜欢更进一步，你也可以添加`accounts-facebook`包，这样就可以在你的应用中开启`Facebook`登陆方式 -- Facebook按钮将会自动的在你的下拉框中出现。

### 从已登陆用户中获取信息

在你的`getMeteorData`方法中，你可以使用`Meteor.user()`来确认用户是否已登陆，你也可以通过这个来获取信息。例如：`Meteor.user().username`包含了已登陆用户的用户名。你也可以用`Meteor.userId()`来调整当前用户的`_id`

在下一个步骤，我们将学习如何在服务器端通过数据验证来使我们的应用更加安全