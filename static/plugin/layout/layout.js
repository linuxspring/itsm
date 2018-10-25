;(function () {
    var PageLoadProg = function(obj, options) {
        this.oHtml = obj;
        this.oProg = document.createElement('div');
        this.maxW = 100;
        this.w = 0;
        this.timer = null;
        this.oStyle = null;
        var progColor = '#0ae';
        var type = 1;
        var styles = '.zr-system-prog { position: fixed; top: 0; left: 0; width:0; height: 2px; z-index: 999999; transition: opacity .3s; }';
        var speed = 0;
        var _this = this;
        

        var myAddEvent = function (obj, ev, fn) {
            if (obj.attachEvent) {
                obj.attachEvent('on' + ev, fn);
            } else {
                obj.addEventListener(ev, fn, false);
            }
        }

        if (options) {
            progColor = options.progColor || '#0ae';
            type = options.type || 1;
        }

        progColor && (styles += '.zr-system-prog { background-color: ' + progColor + '}');

        if (document.createStyleSheet) {
            this.oStyle = document.createElement('div');
            this.oStyle.innerHTML = '<span style="display: none">x</span><style>' + styles + '</style>';
        }else {
            this.oStyle = document.createElement('style');
            this.oStyle.innerHTML = styles;
        }

        this.oProg.setAttribute('id', 'zr-system-prog');
        this.oProg.setAttribute('class', 'zr-system-prog');
        this.oHtml.insertBefore(this.oStyle, this.oHtml.children[0]);
        this.oHtml.insertBefore(this.oProg, this.oHtml.children[0]);

        _this.loading();

        if(type == 1) {
            myAddEvent(window, 'load', function(){
                _this.removeProg();
            });
        }
        
    };
    PageLoadProg.prototype.loading = function() {
        var _this = this;
        function play() {
            if (_this.w >= 95 && _this.w < 100) {
                _this.w = 95;
            } else {
                _this.w += ((_this.maxW - _this.w) / 30);
            }
            _this.oProg.style.width = _this.w + '%';
            clearTimeout(_this.timer);
            _this.timer = setTimeout(function () {
                if (_this.w == 100) {
                    clearTimeout(_this.timer);
                } else {
                    play();
                }
            }, 30);
        }
        play();
    };
    PageLoadProg.prototype.removeProg = function() {
        var _this = this;
        _this.w = 100;
        _this.oProg.style.width = _this.w + '%';
        clearTimeout(_this.timer);
        _this.timer = setTimeout(function () {
            _this.oProg.style.opacity = 0;
            clearTimeout(_this.timer);
            _this.timer = setTimeout(function () {
                _this.oHtml.removeChild(_this.oProg);
                _this.oHtml.removeChild(_this.oStyle);
                clearTimeout(_this.timer);
            }, 30);
        }, 500);
    }
    window.PageLoadProg = PageLoadProg;
}());