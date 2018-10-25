;(function(window){
    var systemTools = {};
    systemTools.fn = {};    // 不用创建方法出来的小方法

    // 函数节流工具
    var Choke = function (speed) {
        this.n = 0;
        this.speed = speed || 2;
    };
    Choke.prototype.play = function (callBack) {
        this.n++;
        if ( ( this.n % this.speed ) === 0 ) {
            callBack && callBack();
            if ( this.n > 10000000 ) this.n = 0;
        }
    }

    // 往上冒泡查找顶级页面
    var getTopElement = function (win) {
        var el = win || self;
        while (true) {
            if (el === top) {
                break;
            }
            el = el.parent;
        }
        return el;
    }

    // 判断url是否为数组
    var isArray = function (o) {
        return Object.prototype.toString.call(o) == '[object Array]';
    }

    // 事件绑定
    var myAddEvent = function (obj, ev, fn) {
        if (obj.attachEvent) {
            obj.attachEvent('on' + ev, fn);
        } else {
            obj.addEventListener(ev, fn, false);
        }
    }

    // 设置浏览器cookie
    var setCookie = function (name, value, expire) {
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + expire);
        document.cookie = name + '=' + value + ';expires=' + oDate;
    }

    // 获取浏览器cookie
    var getCookie = function (name) {
        var attr = document.cookie.split('; ');
        for (var i = 0; i < attr.length; i++) {
            attr2 = attr[i].split('=');
            if (attr2[0] == name) {
                return attr2[1];
            }
        }

        return '';
    }

    // 删除浏览器cookie
    var removeCookie = function (name) {
        setCookie(name, 1, -1);
    }

    systemTools.fn.getTopElement = getTopElement;
    systemTools.fn.isArray = isArray;
    systemTools.fn.myAddEvent = myAddEvent;
    systemTools.fn.setCookie = setCookie;
    systemTools.fn.setCookie = getCookie;
    systemTools.fn.removeCookie = removeCookie;
    
    systemTools.Choke = Choke;
    window.systemTools = systemTools;
}(window));