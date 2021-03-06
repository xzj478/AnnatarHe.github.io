---
layout: post
title: 在服务端加速并安全化网站
tags: nginx http2
---

## 背景

我自己有两个站点：

* [iamhele.com](https://www.iamhele.com)
* [大学狗们](https://www.daxuedogs.com)

一个在国内，一个在美帝。

看起来似乎美帝的速度问题比较严重？然而事实上是两个都需要很多工作要做。

这一篇就说说我最近对这两个站点做的一些安全和速度提升的工作。

## webpack 提速

先说第一个站点，这个是用webpack + react 做的简历页面。压根没什么太多的想法。

然而做出来却是有相当严重的问题。

第一次做出来就直接打包出来。

然后我看了这个js文件足足有2.1MB大小。

惊呆了，怎么回这么大。

后来到处找性能提升的方法，最后在文档那边说，先试试Uglify吧。

然后发现这个js文件从2.1MB直降到260Kb。

当时高兴坏了，同时也在怀疑为什么一个Uglify就能提升十倍的性能？

源码是要看的，过一段等研究一下再写一篇。

那么 260kb还能不能再提升了呢？

当然是有的，在后面一点儿我会继续做介绍

对了，[源码在这里](https://github.com/AnnatarHe/iamhele.com)

## PHP7

最近两天出了PHP7了嘛，然后我就在大学狗那个服务器那边编译上了，开了OPC，性能还是不错的。

不过没有具体测试。

上一篇博客介绍了编译PHP7的一些东西，有兴趣可以去看看。

开OPC是这样的：

{% highlight console %}
zend_extension=opcache.so
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
opcache.fast_shutdown=1
opcache.enable_cli=1
{% endhighlight %}

## SSL

这一节涉及到一些安全的内容。

要知道现在安全形势越来越严峻了，随便一个半大自诩为“黑客”的孩子都能拿个什么脚本来攻击网站。

https在防XSS方面还是很给力的。

最简单的就是狗屎运营商再也不能随便在你网站脸上贴广告了。

最近[let's encrypt](https://letsencrypt.org/)开源了，可以看到不远的将来，https一定是趋势。

我用的是从[WoSign](https://buy.wosign.com/free/?lan=cn)那边申请的免费证书。

安全性能不是很高，但是挡住一部分攻击还是可以的。

说实话，我最恶心的运营商广告。真无耻。

沃通的申请时很简单的，只要验证好了就会给个文件下来，然后解压，选择Nginx文件夹里面的两个东西，上传到服务器。

## 编译 Nginx

Ubuntu 官方的源里面的版本太低了，不给力，只能自己下载编译。

{% highlight console %}
$ wget http://nginx.org/download/nginx-1.9.10.tar.gz
$ tar -zxvf nginx-1.9.10.tar.gz
$ cd nginx-1.9.10
$ ./configure --user=nginx --group=nginx --prefix=/opt/nginx --with-http_gzip_static_module --with-http_ssl_module --sbin-path=/usr/sbin/nginx --conf-path=/opt/nginx/nginx.conf --pid-path=/var/run/nginx.pid --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-http_v2_module
$ make
$ sudo make install
{% endhighlight %}

新建文件：`/etc/init.d/nginx`

{% highlight bash %}
#!/bin/sh

### BEGIN INIT INFO
# Provides:	  nginx
# Required-Start:    $local_fs $remote_fs $network $syslog $named
# Required-Stop:     $local_fs $remote_fs $network $syslog $named
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the nginx web server
# Description:       starts nginx using start-stop-daemon
### END INIT INFO

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/usr/sbin/nginx
NAME=nginx
DESC=nginx

# Include nginx defaults if available
if [ -r /etc/default/nginx ]; then
	. /etc/default/nginx
fi

test -x $DAEMON || exit 0

. /lib/init/vars.sh
. /lib/lsb/init-functions

# Try to extract nginx pidfile
PID=$(cat /opt/nginx/nginx.conf | grep -Ev '^\s*#' | awk 'BEGIN { RS="[;{}]" } { if ($1 == "pid") print $2 }' | head -n1)
if [ -z "$PID" ]
then
	PID=/run/nginx.pid
fi

# Check if the ULIMIT is set in /etc/default/nginx
if [ -n "$ULIMIT" ]; then
	# Set the ulimits
	ulimit $ULIMIT
fi

#
# Function that starts the daemon/service
#
do_start()
{
	# Return
	#   0 if daemon has been started
	#   1 if daemon was already running
	#   2 if daemon could not be started
	start-stop-daemon --start --quiet --pidfile $PID --exec $DAEMON --test > /dev/null \
		|| return 1
	start-stop-daemon --start --quiet --pidfile $PID --exec $DAEMON -- \
		$DAEMON_OPTS 2>/dev/null \
		|| return 2
}

test_nginx_config() {
	$DAEMON -t $DAEMON_OPTS >/dev/null 2>&1
}

#
# Function that stops the daemon/service
#
do_stop()
{
	# Return
	#   0 if daemon has been stopped
	#   1 if daemon was already stopped
	#   2 if daemon could not be stopped
	#   other if a failure occurred
	start-stop-daemon --stop --quiet --retry=TERM/30/KILL/5 --pidfile $PID --name $NAME
	RETVAL="$?"

	sleep 1
	return "$RETVAL"
}

#
# Function that sends a SIGHUP to the daemon/service
#
do_reload() {
	start-stop-daemon --stop --signal HUP --quiet --pidfile $PID --name $NAME
	return 0
}

#
# Rotate log files
#
do_rotate() {
	start-stop-daemon --stop --signal USR1 --quiet --pidfile $PID --name $NAME
	return 0
}

#
# Online upgrade nginx executable
#
# "Upgrading Executable on the Fly"
# http://nginx.org/en/docs/control.html
#
do_upgrade() {
	# Return
	#   0 if nginx has been successfully upgraded
	#   1 if nginx is not running
	#   2 if the pid files were not created on time
	#   3 if the old master could not be killed
	if start-stop-daemon --stop --signal USR2 --quiet --pidfile $PID --name $NAME; then
		# Wait for both old and new master to write their pid file
		while [ ! -s "${PID}.oldbin" ] || [ ! -s "${PID}" ]; do
			cnt=`expr $cnt + 1`
			if [ $cnt -gt 10 ]; then
				return 2
			fi
			sleep 1
		done
		# Everything is ready, gracefully stop the old master
		if start-stop-daemon --stop --signal QUIT --quiet --pidfile "${PID}.oldbin" --name $NAME; then
			return 0
		else
			return 3
		fi
	else
		return 1
	fi
}

case "$1" in
	start)
		[ "$VERBOSE" != no ] && log_daemon_msg "Starting $DESC" "$NAME"
		do_start
		case "$?" in
			0|1) [ "$VERBOSE" != no ] && log_end_msg 0 ;;
			2) [ "$VERBOSE" != no ] && log_end_msg 1 ;;
		esac
		;;
	stop)
		[ "$VERBOSE" != no ] && log_daemon_msg "Stopping $DESC" "$NAME"
		do_stop
		case "$?" in
			0|1) [ "$VERBOSE" != no ] && log_end_msg 0 ;;
			2) [ "$VERBOSE" != no ] && log_end_msg 1 ;;
		esac
		;;
	restart)
		log_daemon_msg "Restarting $DESC" "$NAME"

		# Check configuration before stopping nginx
		if ! test_nginx_config; then
			log_end_msg 1 # Configuration error
			exit 0
		fi

		do_stop
		case "$?" in
			0|1)
				do_start
				case "$?" in
					0) log_end_msg 0 ;;
					1) log_end_msg 1 ;; # Old process is still running
					*) log_end_msg 1 ;; # Failed to start
				esac
				;;
			*)
				# Failed to stop
				log_end_msg 1
				;;
		esac
		;;
	reload|force-reload)
		log_daemon_msg "Reloading $DESC configuration" "$NAME"

		# Check configuration before reload nginx
		#
		# This is not entirely correct since the on-disk nginx binary
		# may differ from the in-memory one, but that's not common.
		# We prefer to check the configuration and return an error
		# to the administrator.
		if ! test_nginx_config; then
			log_end_msg 1 # Configuration error
			exit 0
		fi

		do_reload
		log_end_msg $?
		;;
	configtest|testconfig)
		log_daemon_msg "Testing $DESC configuration"
		test_nginx_config
		log_end_msg $?
		;;
	status)
		status_of_proc -p $PID "$DAEMON" "$NAME" && exit 0 || exit $?
		;;
	upgrade)
		log_daemon_msg "Upgrading binary" "$NAME"
		do_upgrade
		log_end_msg 0
		;;
	rotate)
		log_daemon_msg "Re-opening $DESC log files" "$NAME"
		do_rotate
		log_end_msg $?
		;;
	*)
		echo "Usage: $NAME {start|stop|restart|reload|force-reload|status|configtest|rotate|upgrade}" >&2
		exit 3
		;;
esac

:
{% endhighlight %}

粘贴进去了，然后赋权，执行

{% highlight console %}
$ sudo chmod 755 /etc/init.d/nginx
$ sudo service nginx start
{% endhighlight %}

这个时候贴上证书吧，顺便记得https监听的是443端口

就像这样：

{% highlight console %}
server {
     listen       443 ssl default_server;
     server_name  domain.com;
     ssl_certificate      /path/to/ssl/domain.crt;
     ssl_certificate_key  /path/to/ssl/domain.key;
     ssl_session_timeout  5m;
     error_page 404 /404.html;
     location / {
         root   /path/to/app;
         index  index.html index.htm;
     }
}
{% endhighlight %}

这个时候因为监听的是443，80端口还要做一个301重定向

{% highlight console %}
server {
        listen       80;
        server_name  *.domain.com;
        return 301 https://www.domain.com$request_uri;
}
{% endhighlight %}

好了，差不多都好了。

这个时候关于ssl就已经完成了。安全性较之之前的http有了一定的提升。

我也觉得挺好的。至少url前面有个绿色的小锁，看起来是挺棒的，这个逼装的还是挺好的吧。

接下来要做更高的性能提升工作了。

## HTTP2

关于HTTP2我并不做过多讲解了。因为我确实理解不够，只是稍微会用一点

最后我列出了几个关于HTTP2的博客，有意愿的可以看看。

我只关心HTTP2的性能提升。

通过TCP的多路复用有效的提升了速度。在Nginx中开启这个很简单。只要在ssl后面加一个http2就好了

{% highlight console %}
server {
     listen       443 ssl http2 default_server;
     server_name  domain.com;
{% endhighlight %}

现在只要支持http2的浏览器就会用http2协议了，而不支持的也会自动退回到http1.1

## HSTS

不要以为上了HTTPS就很安全了，实际上每次懒省事都是通过301跳转到https的，而这一段路，是非常不安全的！因为很有可能有有心人剥离ssl。

更安全的做法是用上HSTS，在所设定的时限中必须通过https才能访问，这就一定程度上减少了ssl剥离攻击。

开启的方法也很简单，加上一个http header就可以了，默认为你是Nginx的web server

{% highlight console %}
server {
    add_header "Strict-Transport-Security: max-age=31536000; includeSubdomains; preload";
}
{% endhighlight %}

## gzip压缩

好了，这里继续提升性能。

在前面的步骤上我把js的bundle压缩到了260kb，虽然有了相当大的性能提升，然而还可以做的更多

比如gzip。

只要在nginx的配置文件中这么写上就可了

{% highlight console %}
gzip  on;
gzip_types
      text/css
      text/console
      text/javascript
      application/javascript
      application/json
      application/x-javascript
      application/xml
      application/xml+rss
      application/xhtml+xml
      application/x-font-ttf
      application/x-font-opentype
      application/vnd.ms-fontobject
      image/svg+xml
      image/x-icon
      application/rss+xml
      application/atom_xml;
gzip_comp_level 5;
gzip_vary on;
{% endhighlight %}

我的260kb的js文件经过gzip压缩，只有60kb大小了，又是相当不错的提升。

现在可以感觉网页更快了。

## 缓存

是时候开启缓存了。

这一步要求要给前端文件一个唯一的时间戳样的东西，可以要求浏览器强制刷新的东西。

类似于`/build/output/app-1ce2f7093b.js`的文件名

在nginx的配置文件中这么写一点儿吧，注意要是`server{}`中

{% highlight console %}
location ~*  \.(jpg|jpeg|png|gif|ico|css|js)$ {
   expires 365d;
}
{% endhighlight %}

## 移除信息

在header上的php version可能会暴露一些信息，最好隐藏掉

在php.ini中设置这样一行就可以了。

{% highlight console %}
expose_php = Off;
{% endhighlight %}

Nginx的版本号最好也能隐藏一下啊

在nginx.conf中设置下

{% highlight console %}
server_token off;
{% endhighlight %}

## 完毕

{% highlight console %}
$ sudo service php7-fpm restart
$ sudo service nginx restart
{% endhighlight %}

这个阶段我所能了解到的关于web服务器的性能提升差不多就是这样了。剩下的大概是代码层面，和数据库部分的提升了。

谢谢你能看到这里哈~

## References

* [How to remove nginx & PHP versions from HTTP Header](http://blog.laimbock.com/2014/04/11/how-to-remove-nginx-php-versions-from-http-header/)
* [Make Browsers Cache Static Files On nginx](https://www.howtoforge.com/make-browsers-cache-static-files-on-nginx)
* [OPCache 安装](http://php.net/manual/zh/opcache.installation.php)
* [HTTP/2 头部压缩技术介绍](https://imququ.com/post/header-compression-in-http2.html)
* [HTTP/2 新特性浅析](http://io.upyun.com/2015/05/13/http2/)
* [HTTP/2 介绍](http://gaott.info/http2-intro/)
