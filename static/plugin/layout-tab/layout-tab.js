// 这里传入三个参数分别是$(jQuery的别称)、window（当前浏览器对象）、tools（自定义小工具），Swiper弹窗插件
;(function($, window, tools){
    function LayoutTab (obj, options) {
        var opts = $.extend({}, {
                skin: '',
                overstepType: 1,
                maxTab: 10
            }, options);

        this.win = tools.fn.getTopElement(window);
        this.$el = $(this.win.document.body).find(obj);
        this.$labelWrap = $('.zr-layout-label-wrap', this.$el);
        this.$labelUl = $('.zr-layout-label-list', this.$labelWrap);
        this.$iframeWrap = $('.zr-layout-iframe-wrap', this.$el);
        this.$iframeMode = $('.zr-layout-iframe-mode', this.$iframeWrap);
        this.curLabelLi = null,
        this.curIframeMode = null;
        this.overstepType = opts.overstepType;
        this.maxTab = opts.maxTab;
        this.tabNum = 0;

        var init = this.$el.attr('data-init');
        if ( !init ) {
            this.$el.attr('data-init', true);
            this.initHandle = true;
        }else {
            this.initHandle = false;
        }
        opts.skin && ( this.$el.addClass(opts.skin) );
    }

    // 初始化对象（仅一次）
    LayoutTab.prototype.init = function() {
        var _this = this,
            choke = null;
        if ( _this.initHandle ) {
            _this.tabNum = _this.$labelWrap.find('li').length;
            _this.curLabelLi = _this.curLabelLi ? _this.curLabelLi : _this.$labelWrap.find('li.cur');
            _this.curIframeMode = _this.curIframeMode ? _this.curIframeMode : _this.$iframeMode.filter('.cur');
            choke = new tools.Choke(4);
            _this.refreshTab();
            $(_this.win).on('resize', function(){
                choke.play(function(){
                    _this.refreshTab();
                });
            });
            // tab标签页切换（iframe模块对应显示隐藏）
            _this.$labelWrap.on('click', '.zr-layout-label', function (event) {
                event.stopPropagation();
                var $this = $(this),
                    $li = $this.parent(),
                    $mode = null,
                    now = $li.index();
                $mode = _this.$iframeMode.eq(now);
                _this.showHideTab($li, $mode);
                return false;
            });

            // tab点击关闭按钮
            _this.$labelWrap.on('click', '.zr-layout-label .c', function (event) {
                event.stopPropagation();
                var $this = $(this),
                    $li = $this.closest('li'),
                    now = $li.index(),
                    $nextLi = null,
                    $prevLi = null,
                    $mode = null;
                if ($li.hasClass('cur')) {
                    $nextLi = $li.next();
                    $prevLi = $li.prev();
                    
                    if( $nextLi.length > 0 ) {
                        $mode = _this.$iframeMode.eq(now + 1);
                        _this.showHideTab($nextLi, $mode);
                    }else if ( $prevLi.length > 0 ) {
                        $mode = _this.$iframeMode.eq(now - 1);
                        _this.showHideTab($prevLi, $mode);
                    }
                }
                $li.remove();
                _this.$iframeMode.eq(now).remove();
                _this.tabNum--;
                _this.$iframeMode = $('.zr-layout-iframe-mode', _this.$iframeWrap);
                _this.refreshTab();
                return false;
            });
        }
    }

    // 刷新重新计算标签页大小
    LayoutTab.prototype.refreshTab = function () {
        var _this = this,
            $ul = _this.$labelUl,
            $li = $('>li', $ul),
            n = $li.length,
            maxW = $('.zr-layout-label-mode', _this.$labelWrap).innerWidth(),
            w = 0;

        $ul.css('width', 'auto');
        $li.css('width', 'auto');
        w = $ul.outerWidth(true);

        if (w > maxW) {
            $ul.css('width', '100%');
            $li.css('width', (100 / n) + '%');
        }
    }

    // 显示或隐藏标签页和对应的iframe模块
    LayoutTab.prototype.showHideTab = function($li, $mode) {
        var _this = this;
        _this.curLabelLi = _this.curLabelLi ? _this.curLabelLi : _this.$labelWrap.find('li.cur');
        _this.curIframeMode = _this.curIframeMode ? _this.curIframeMode : _this.$iframeMode.filter('.cur');
        _this.curLabelLi.removeClass('cur');
        _this.curIframeMode.removeClass('cur');
        _this.curLabelLi = $li;
        _this.curIframeMode = $mode;
        _this.curLabelLi.addClass('cur');
        _this.curIframeMode.addClass('cur');
    }

    // 查询定位是否有某个地址已经打开，打开则跳转到该标签
    LayoutTab.prototype.toAlreadyOpenTab = function (url) {
        var _this = this,
            $li = null,
            $mode = null,
            state = false;
        if (url) {
            for (var i = 0; i < _this.$iframeMode.length; i++) {
                if (_this.$iframeMode.eq(i).find('.zr-layout-label-iframe:first').attr('src') === url) {
                    $li = _this.$labelWrap.find('li:eq(' + i + ')');
                    $mode = _this.$iframeMode.eq(i);
                    _this.showHideTab($li, $mode);
                    state = true;
                    break;
                }
            }
        }
        return state;
    }

    // 打开新页面
    LayoutTab.prototype.openTabWin = function(options) {
        var opts = $.extend({}, {
            type: 1,
            icon: '',
            url: '',
            labelTitle: '',
            winStartMountFn: $.noop,
            winAfterLoadFn: $.noop,
            failOpenFn: $.noop
        }, options);
        var _this = this,
            urlArr = [];
        // 这里定义的是当前签页签需要的变量；
        var $p = null,
            $iframe = null,
            state = false;
        // 这里定义的是新页签需要的变量；
        var iframeHtml = '',
            $iframes = '',
            liHtmle = '',
            $li = null,
            $mode = null;

        function creatPageWay(callBack) {
            switch (_this.overstepType) {
                case 1:
                    if (_this.tabNum >= _this.maxTab) {
                        if (layer) {
                            layer.open({
                                type: 0,
                                title: 0,
                                content: '页面打开太多会引起系统奔溃！'
                            });
                        }else {
                            alert('超出了');
                        }
                        opts.failOpenFn && opts.failOpenFn();
                    } else {
                        callBack && callBack();
                    }
                break;
            }
        }

        if(tools.fn.isArray(opts.url)) {
            urlArr = opts.url;
        }else {
            urlArr[0] = opts.url;
        }
        state = _this.toAlreadyOpenTab(urlArr[0]);
        if (!state) {
            if(opts.type == 1) {
                // 这里是在当前页签打开
                $p = _this.curLabelLi.find('p.t');
                $p.html(opts.labelTitle).attr('title', opts.labelTitle);
                for (var i = 0; i < urlArr.length; i++) {
                    $iframe = _this.curIframeMode.find('.zr-layout-label-iframe').eq(i);
                    if ($iframe.length > 0) {
                        //$iframe.css('height', ( 100 / urlArr.length ) + '%').attr('src', urlArr[i]);
                    }else {
                        $iframe = '<iframe class="zr-layout-label-iframe" frameborder="0" src="' + urlArr[i] + '" style="height: ' + (100 / urlArr.length) + '%"></iframe>';
                        _this.curIframeMode.append($iframe);
                    }
                }
            }else if ( opts.type == 2) {
                // 这里是在新的选项卡页签打开
                creatPageWay(function(){
                    $li = $('<li class="cur">');
                    $mode = $('<div class="zr-layout-iframe-mode cur">');
                    if (opts.icon) {
                        liHtmle = '<div class="zr-layout-label"><img src="' + opts.icon + '" class="i"><button class="t" title="' + opts.labelTitle + '">' + opts.labelTitle + '</button><button class="c">&nbsp;</button></div>';
                    } else {
                        liHtmle = '<div class="zr-layout-label"><button class="t" title="' + opts.labelTitle + '">' + opts.labelTitle + '</button><button class="c">&nbsp;</button></div>';
                    }
                    $li.html(liHtmle);
                    for (var i = 0; i < urlArr.length; i++) {
                        iframeHtml += '<iframe class="zr-layout-label-iframe" frameborder="0" src="' + urlArr[i] + '" style="height: ' + (100 / urlArr.length) + '%"></iframe>';
                    }
                    $iframes = $(iframeHtml);
                    $iframe = $iframes.eq(0);
                    $mode.html('').append($iframes);
                    _this.$labelUl.append($li);
                    _this.$iframeWrap.append($mode);
                    _this.tabNum++;
                    _this.$iframeMode = $('.zr-layout-iframe-mode', _this.$iframeWrap);
                    _this.showHideTab($li, $mode);
                    _this.refreshTab();
                });
            }
            
            if($iframe) {
                opts.winStartMountFn && opts.winStartMountFn($iframe, _this.curIframeMode);
                $iframe.on('load.iframeA', function () {
                    opts.winAfterLoadFn && opts.winAfterLoadFn($(this), _this.curIframeMode);
                });
            }
        }
    }
    
    window.LayoutTab = LayoutTab;
}(jQuery, window, systemTools));