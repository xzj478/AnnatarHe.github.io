"use strict";!function(){window.location.protocol.indexOf("s")<0&&(window.location.protocol="https"),document.addEventListener("visibilitychange",function(){var e=document.title;return function(){"hidden"==document.visibilityState?document.title="别在其他网站瞎逛游了，快回来～":document.title=e}}())}(),function(){function e(){new Promise(function(e,t){var o=n.value.toLowerCase().trim(),r=posts.filter(function(e){return e.title.toLowerCase().indexOf(o)>0||e.url.toLowerCase().indexOf(o)>0});e(r)}).then(function(e){var t="",n=!0,o=!1,r=void 0;try{for(var i,c=e[Symbol.iterator]();!(n=(i=c.next()).done);n=!0){var a=i.value;t+='\n                <li>\n                    <a href="'+a.url+'">\n                        <span class="title">'+a.title+'</span>\n                        <span class="url">'+a.url+"</span>\n                    </a>\n                </li>\n                "}}catch(s){o=!0,r=s}finally{try{!n&&c["return"]&&c["return"]()}finally{if(o)throw r}}return t}).then(function(e){o.innerHTML=e})}var t=document.querySelector(".search__action"),n=document.querySelector(".search__input"),o=document.querySelector(".search__result--lists");n.addEventListener("input",e,!1),t.addEventListener("click",e,!1)}(),function(){function e(){o.remove("show"),o.add("hide")}var t=document.querySelector(".searchTrigger"),n=(document.querySelector(".search__close"),document.querySelector(".search__mask")),o=n.classList;t.addEventListener("click",function(){o.remove("hide"),o.add("show")},!1),n.addEventListener("click",function(t){var n=t.target.classList,o=!!n.contains("search__mask"),r=!!n.contains("search__close"),i=!!n.contains("fa-close");(o||r||i)&&e()},!1),document.body.addEventListener("keydown",function(t){var n=t.keyCode;o.contains("show")&&27==n&&e()},!1)}();
//# sourceMappingURL=app.js.map
