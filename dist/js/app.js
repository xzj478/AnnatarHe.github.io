"use strict";!function(){window.location.protocol.indexOf("s")<0&&(window.location.protocol="https")}(),function(){function e(){new Promise(function(e,n){var r=t.value.toLowerCase().trim(),o=posts.filter(function(e){return e.title.toLowerCase().indexOf(r)>0||e.url.toLowerCase().indexOf(r)>0});e(o)}).then(function(e){var n="",t=!0,r=!1,o=void 0;try{for(var c,i=e[Symbol.iterator]();!(t=(c=i.next()).done);t=!0){var a=c.value;n+='\n                <li>\n                    <a href="'+a.url+'">\n                        <span class="title">'+a.title+'</span>\n                        <span class="url">'+a.url+"</span>\n                    </a>\n                </li>\n                "}}catch(s){r=!0,o=s}finally{try{!t&&i["return"]&&i["return"]()}finally{if(r)throw o}}return n}).then(function(e){r.innerHTML=e})}var n=document.querySelector(".search__action"),t=document.querySelector(".search__input"),r=document.querySelector(".search__result--lists");t.addEventListener("input",e,!1),n.addEventListener("click",e,!1)}(),function(){function e(){r.remove("show"),r.add("hide")}var n=document.querySelector(".searchTrigger"),t=(document.querySelector(".search__close"),document.querySelector(".search__mask")),r=t.classList;n.addEventListener("click",function(){r.remove("hide"),r.add("show")},!1),t.addEventListener("click",function(n){var t=n.target.classList,r=t.contains("search__mask")?!0:!1,o=t.contains("search__close")?!0:!1,c=t.contains("fa-close")?!0:!1;(r||o||c)&&e()},!1),document.body.addEventListener("keydown",function(n){var t=n.keyCode;r.contains("show")&&27==t&&e()},!1)}();
//# sourceMappingURL=app.js.map
