---
layout: post
title: 翻译 Meteor React 制作 Todos - 05 - 更新删除
tags: js Meteor React
---

## 确认完成和删除任务

到现在为止，我们只有一个和集合互动的方法 -- 在文档中进行插入操作。
现在，我们来学习如何进行更新和删除操作。

先来给`task`组件添加两个元素： 一个确认选框和一个删除按钮，并给他们带上各自的事件监听

在`Task.jsx`中写入下面的内容

{% highlight js %}
// Task component - represents a single todo item
Task = React.createClass({
  propTypes: {
    task: React.PropTypes.object.isRequired
  },

	// 添加内容开始
  toggleChecked() {
    // 当按下按钮时，设定确认值为当前的相反值
    Tasks.update(this.props.task._id, {
      $set: {checked: ! this.props.task.checked}
    });
  },
 
  deleteThisTask() {
    Tasks.remove(this.props.task._id);
  },
  // 添加内容结束
 
  render() {
  	// 添加下面一行的内容
    // 当任务被完成的时候给它们一个不同的class
    // 这样，通过CSS中的设置后，它们会看起来更好一些。
    const taskClassName = this.props.task.checked ? "checked" : "";
 
    return (

    	// 添加内容开始
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask}>
          &times;
        </button>
 
        <input
          type="checkbox"
          readOnly={true}
          checked={this.props.task.checked}
          onClick={this.toggleChecked} />
 
        <span className="text">{this.props.task.text}</span>
      </li>
      //添加内容结束

    );
  }
});
{% endhighlight %}

### 更新

在上面的代码中，我们在确认属性被改变的时候调用了`Tasks.update`方法。

这个在集合中的`update`函数需要两个参数，第一个参数是一个选择器，一个集合中子集的身份证，第二个参数是指定更新数据，在匹配到的子集里要干点儿什么

在这个部分，选择器就是本任务的`_id`，更新数据的参数就是使用`$set`去切换`checked`的值，它代表着此任务是否被完成了。

### 删除

在上面的代码中使用了`Tasks.remove`来删除任务。这个`remove`函数需要一个参数，一个确定集合中那个子项应该被被删除的身份证号码。