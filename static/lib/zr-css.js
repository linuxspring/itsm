;(function($){
    //模拟下拉框
    $.fn.selectPlay = function(options) {
        var opts = $.extend(true, {
            style: '',
            event: 'click',
            trigger: function(){},
            success: function(){}
        }, options);
        return this.each(function(){
            var $this = $(this);
            var $viewSpan = $('.select-view span', $this);
            var $viewEm = $('.select-view em', $this);
            var $input = $('.select-view input', $this);
            var $selectOption = $('.select-option', $this);
            if(opts.style) {
                $this.addClass(opts.style);
            }
            if($input.val()){
                $selectOption.find('.o-data').each(function(){
                    if($input.val() == $(this).attr('data-val')){
                        $(this).addClass('cur');
                    }
                });
            }
            $this.off(opts.event).on(opts.event, '.select-view', function(e){
                var $self = $(this);
                var $parent = $self.parents('.select-input');
                if(!($parent.attr('data-disable') == 'true') || !$parent.attr('data-disable')) {
                    if(opts.trigger) {
                        opts.trigger($this);
                    }
                    if($selectOption.hasClass('show')){
                        $selectOption.removeClass('show');
                        $viewEm.removeClass('active');
                    }else {
                        $selectOption.addClass('show');
                        $viewEm.addClass('active');
                    }
                    return false;
                }
            });
            $selectOption.off('click').on('click', '.o-data', function(){
                var $that = $(this);
                var text = $that.text();
                var value = $that.attr('data-val');
                $selectOption.find('.o-data').removeClass('cur');
                $that.addClass('cur');
                $viewSpan.text(text);
                $input.val(value);
                $selectOption.removeClass('show');
                $viewEm.removeClass('active');
                if(opts.success) {
                   opts.success($this, text, value); 
                }
            });
            $(document).off('click').on('click', function(){
                $selectOption.removeClass('show');
                $viewEm.removeClass('active');
            });
        });
    };
    //展开收缩
    $.fn.shrink = function(options) {
        var opts = $.extend(true, {
            style: '',
            event: 'click',
            hideHeight: '28px',
            wrap: '.zr-shrink',
            content: '.zr-shrink-con',
            btn: '.zr-shrink-btn',
            show: function(){},
            hide: function(){}
        }, options);
        return this.each(function(){
            var $this = $(this);
            var $obj = $(opts.wrap, $this);
            var $btn = $this.find(opts.btn);
            var oldH = opts.hideHeight;
            var $content = $(opts.content, $this);
            var h = $content.outerHeight(true);
            var swit = false;
            if(opts.style) {
                $this.addClass(opts.style);
            }
            if(h > parseInt(oldH)) {
                $obj.css('height', oldH);
                $btn.on(opts.event, function(){
                    if(!swit) {
                        h = $content.outerHeight(true);
                        $obj.css('height', h + 'px');
                        swit = true;
                        if(opts.show) {
                            opts.show($this);
                        }
                    }else {
                        $obj.css('height', oldH);
                        swit = false;
                        if(opts.hide) {
                            opts.hide($this);
                        }
                    }
                });
            }
        });
    };
    //tab切换
    $.fn.tabPlay = function(options) {
        var opts = $.extend(true, {
            style: '',
            event: 'click',
            title: '.zr-tab-title',
            content: '.zr-tab-con',
            defaultShowIndex: 0,
            success: function(){}
        }, options);
        return this.each(function(){
            var $this = $(this);
            var $title = $(opts.title, $this);
            var conArray = opts.content.split(',');
            if(opts.style) {
                $this.addClass(opts.style);
            }
            for(var i = 0; i < conArray.length; i++) {
                var $con = $(conArray[i], $this);
                $con.eq(opts.defaultShowIndex).show().siblings(opts.content).hide();
            }
            $title.eq(opts.defaultShowIndex).addClass('cur').siblings(opts.title).removeClass('cur');
            $this.on(opts.event, opts.title, function(){
                var $self = $(this);
                $self.addClass('cur').siblings(opts.title).removeClass('cur');
                for(var i = 0; i < conArray.length; i++) {
                    var $con = $(conArray[i], $this);
                    $con.hide();
                    $con.eq($self.index()).show();
                }
                if(opts.success) {
                    opts.success($this);
                }
            });
        });
    };
    //左右隐藏切换
    $.fn.leftRightSwitch = function(options) {
        var opts = $.extend(true, {
            style: '',
            prevBtn: '.prev',
            nextBtn: '.next',
            wrap: '.zr-switch-wrap',
            contentUl: '.zr-switch-ul',
            contentLi: '.zr-switch-li', //滚动的具体li元素
            type: '1',  //滚动模式，1为逐个逐个滚动，2为整屏滚动
            autoChoose: false,   //滚动的同时是否自动选择li元素
            success: function(){},  //滚动后促发的回调函数
            afterClickLi: function(){}  //单击选中某个li元素后回调，提供该li的index下标参数
        }, options);
        return this.each(function(){
            var $this = $(this);
            var $ul = $(opts.contentUl, $this);
            var $li = $(opts.contentLi, $this);
            var $wrap = $(opts.wrap, $this);
            var $prev = $(opts.prevBtn, $this);
            var $next = $(opts.nextBtn, $this);
            var liW = $li.outerWidth(true);
            var ulW = liW * $li.length;
            var wrapW = $wrap.innerWidth();
            if(opts.style) {
                $this.addClass(opts.style);
            }
            if(ulW > wrapW) {
                var n = 0,
                    m = 0,
                    left = 0,
                    index = 0,
                    time = $ul.css('transition');
                $ul.css({
                    width: liW * $li.length + 'px',
                    transition: 'none'
                });
                setTimeout(function(){
                    $ul.css('transition', time);
                });
                if(opts.type == 1) {
                    m = $li.length - Math.ceil(wrapW / liW);
                    left = liW;
                    $li.each(function(){
                        var $this = $(this);
                        var go = 0;
                        if($this.hasClass('cur')){
                            n = $this.index();
                            index = n;
                            go = n * left;
                            if(go > ulW - wrapW) {
                                n = m;
                                go = ulW - wrapW;
                            }
                            $ul.css('left', -go + 'px');
                        }
                    });
                }else if(opts.type == 2) {
                    var k = 0;
                    m = Math.ceil(ulW / wrapW) - 1;
                    left = wrapW;
                    $li.each(function(){
                        var $this = $(this);
                        var go = 0;
                        if($this.hasClass('cur')){
                            k = $this.index();
                            go = parseInt ( k * liW / wrapW ) ;
                            n = go;
                            $ul.css('left', -go * left + 'px');
                        }
                    });
                }

                function successRoll(index) {
                    if(opts.success) {
                        opts.success();
                    }
                    if(opts.autoChoose) {
                        $li.eq(index).addClass('cur').siblings().removeClass('cur');
                    }
                }
                $prev.on('click', function(){
                    if(n <= 0) {
                        n = 0;
                    }else {
                        n--;
                    }
                    if(index <= 0) {
                        index = 0;
                    }else {
                        index--;
                    }
                    $ul.css('left', -n * left + 'px');
                    successRoll(index);
                });
                $next.on('click', function(){
                    if(n >= m ) {
                        n = m
                    }else {
                        n++;
                    }
                    if(index >= $li.length - 1) {
                        index = $li.length - 1;
                    }else {
                        index++;
                    }
                    $ul.css('left', -n * left + 'px');
                    successRoll(index);
                });
                $li.off('click.b').on('click.b', function(){
                    var $self = $(this);
                    $self.addClass('cur').siblings().removeClass('cur');
                    index = $self.index();
                    if(opts.afterClickLi) {
                        opts.afterClickLi(index);
                    }
                });
            }
        });
    };
}(jQuery));