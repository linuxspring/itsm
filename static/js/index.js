; (function ($, window, layui){
    // 首页上左侧系统菜单树结构
    var menuData = [
        {
            code: '1',
            title: '全局视图',
            icon: './static/images/common/icon-5.png',
            url: '',
            child: [{
                code: '1-1',
                title: '用户列表',
                icon: '',
                url: 'usermgr'
            }, {
                code: '1-2',
                title: '巡检视图',
                icon: '',
                url: 'inspect'
            }]
        }
        // , {
        //     code: '2',
        //     title: '可信感知',
        //     icon: './static/images/common/icon-6.png',
        //     url: 'feel/feel.html'
        // }, {
        //     code: '3',
        //     title: '可信报告',
        //     icon: './static/images/common/icon-7.png',
        //     url: '',
        //     child: [{
        //         code: '3-1',
        //         title: '报告详情',
        //         icon: '',
        //         url: 'report/report.html'
        //     }]
        // }, {
        //     code: '4',
        //     title: '监控器',
        //     icon: './static/images/common/icon-8.png',
        //     url: 'https://mail.163.com/'
        // }, {
        //     code: '5',
        //     title: '知识库',
        //     icon: './static/images/common/icon-9.png',
        //     url: '',
        //     child: [{
        //         code: '5-1',
        //         title: '新建知识库',
        //         icon: '',
        //         url: 'knowledge/add-knowledge.html'
        //     }]
        // }, {
        //     code: '6',
        //     title: '指标集',
        //     icon: './static/images/common/icon-10.png',
        //     url: '',
        //     child: [{
        //         code: '6-1',
        //         title: '权重配置',
        //         icon: '',
        //         url: 'norm/norm-collocat.html'
        //     }]
        // }, {
        //     code: '7',
        //     title: '资源树',
        //     icon: './static/images/common/icon-11.png',
        //     child: [{
        //         code: '7-1',
        //         title: '资源菜单树',
        //         icon: '',
        //         child: [{
        //             code: '7-1-1',
        //             title: '一级菜单·菜单树一',
        //             icon: '',
        //             child: [{
        //                 code: '7-1-1',
        //                 title: '二级菜单·菜单树一',
        //                 icon: '',
        //                 child: [{
        //                     code: '7-1-1-1',
        //                     title: '三级级菜单·百度搜索',
        //                     icon: '',
        //                     url: 'http://www.baidu.com'
        //                 }, {
        //                     code: '7-1-1-2',
        //                     title: '三级级菜单·腾讯官网',
        //                     icon: '',
        //                     url: 'http://www.qq.com'
        //                 }, {
        //                     code: '7-1-1-3',
        //                     title: '资源树',
        //                     icon: '',
        //                     url: 'resource/resource.html'
        //                 }]
        //             }, {
        //                 code: '7-1-2',
        //                 title: '二级菜单·菜单树二',
        //                 icon: '',
        //                 child: [{
        //                     code: '7-1-2-1',
        //                     title: '三级级菜单·广州市人民政府官网',
        //                     icon: '',
        //                     url: 'http://www.gz.gov.cn/'
        //                 }, {
        //                     code: '7-1-2-2',
        //                     title: '三级级菜单·中信银行',
        //                     icon: '',
        //                     url: 'http://www.citicbank.com/'
        //                 }]
        //             }]
        //         }]
        //     }]
        // }, {
        //     code: '8',
        //     title: '系统设置',
        //     icon: './static/images/common/icon-12.png',
        //     url: 'http://www.gdcy.gov.cn'
        // }
    ];
    var handler = {
        init: function() {
            this.$system = $('.zr-system-layout');
            this.$layoutMain = $('.zr-layout-main', this.$system);
            this.$leftMode = $('.zr-layout-left', this.$system);
            this.$rightMode = $('.zr-layout-right', this.$system);
            this.lock = true;   //左侧菜单是否锁定
            this.menuState = true;     // 左侧菜单是否折叠收起来
            this.layui = layui;
            this.indexLayer = null;
            this.layoutTab = null;

            this.initLock();
            this.sideMenuScroll();
            this.sideMenuDraw();
            this.takeUpSideMenu();
            this.toLockMenu();
            this.toUseLayUi();
            this.toUseLayoutTab();
            this.backHome();
            this.moveChangeLeftWidth();
        },
        // 根据页面上的选择进行锁定/非锁定初始化
        initLock: function() {
            var _this = this,
                $li = $('.nav-lock>li.cur', _this.$leftMode);
            if($li.hasClass('on')) {
                this.lock = true;   //锁定
            }else {
                this.lock = false;   //非锁定
            }
        },
        // 使用layui样式框架
        toUseLayUi: function() {
            var _this = this;
            _this.layui.use(['layer'], function () {

                // 这里使用layer（弹窗/弹出层/加载层等功能模块）
                _this.indexLayer = _this.layui.layer;

                /**
                 *  将Layer（系统弹出层）对象加载在顶部index页面window上
                 *  此处是为了方便在后面嵌套在首页index内的同域iframe子页面可以调用到该方法，
                 *  在首页上弹窗操作、加载动画、遮罩等等功能操作
                 */
                window.IndexLayer = _this.indexLayer; 
            });
        },
        // 使用tab标签页打开超链接
        toUseLayoutTab: function() {
            var _this = this;
            /**
             * LayoutTab是系统点击某个链接可以iframe子页面形式在index首页上打开的功能模块
             * 该方法通过挂载到index根页面的window对象上可以支持index本页面上元素、也可支持跟index同域的iframe子页面调用；
             * 该方法支持在当前ifraem子页面中打开超链接页面，也可以支持新建一个tab标签iframe窗口打开超链接。
             * 该方法仅需要在index页面上进行实例化一次。
             * @example layoutTab = new LayoutTab(element, options);
             * 该实例化对象中，需要两个参数，第一个参数是调用的元素对象，
             * 第二个参数options是相关配置，其中maxTab（number型）是控制用户最多打开几个tab标签后提示用户不能打开太多，否则会导致系统卡顿。
             * 
             * 公共方法：openTabWin
             * 该方法是LayoutTab中打开标签页的方法。适合在用户动作后要跳转页面的时候调用（比如用户点击了一个超链接）
             * 该方法中一个参数（options配置）
             * options中的API：type（number型，1为在当前ifraem中打开链接地址模式；2为新建tab标签页打开链接模式）
             * options中的API: labelTitle（string型，tab上的标题文本文字）；
             * options中的API: url（string型或者Array型，要打开的链接地址）；
             * options中的API: winStartMountFn（回调函数，刚刚触发打开超链接，但是页面还没有loading）；
             * options中的API: winAfterLoadFn（回调函数，超链接页面loading完成后触发的回调）；
             * options中的API: failOpenFn（回调函数，超链接页面打开失败触发的回调，比如超过设定的最多页面数）；
             * @example layoutTab.openTabWin(options);
             */
            _this.layoutTab = new LayoutTab('.zr-layout-cont', {
                maxTab: 10
            });
            // 对_this.layoutTab的初始化，仅需要做一次。
            _this.layoutTab.init();

            /**
             *  将LayoutTab对象加载在顶部index页面window上
             *  此处是为了方便在后面嵌套在首页index内的同域iframe子页面可以调用到该方法，
             *  并在首页上实现类似浏览器的页签跳转页面功能。
             */
            window.LayoutTab = _this.layoutTab; 
        },
        // 调用上面创建的layoutTab对象，打开超链接
        toOpenWinFn: function (type, title, url, callBack) {
            var _this = this,
                state = 1;  // 打开页面状态，用于在回调函数中，能够知道状态。
            function handle() {
                _this.layoutTab.openTabWin({
                    type: type,
                    labelTitle: title,
                    url: url,
                    winStartMountFn: function ($iframe, $mode) {
                        // 窗口刚刚新建完成，超链接刚刚挂载，页面开始加载
                        var mode = $mode.get(0);
                        // 这里的PageLoadProg是iframe顶部的类加载进度条的方法实例。优化页面加载交互
                        prog = new PageLoadProg(mode, {
                            type: 2
                        });
                        state = 1;  //刚打开
                        callBack && callBack(state);
                    },
                    winAfterLoadFn: function ($iframe, $mode) {
                        // 页面loading加载完成后触发
                        prog.removeProg();
                        state = 2;  //已经打开
                        callBack && callBack(state);
                    },
                    failOpenFn: function() {
                        state = 3;  //打开失败
                        callBack && callBack(state);
                    }
                });
            }

            if (_this.lock) {
                // 锁定情况下
                setTimeout(function () {
                    handle();
                }, 30);
            } else {
                // 非锁定情况下等收缩动画完成后才打开
                setTimeout(function () {
                    handle();
                }, 300);
            }
            
        },
        // 侧边栏滚动条
        sideMenuScroll: function() {
            var _this = this,
                $wrap = $('.nav-mode-wrap', _this.$leftMode);
            $wrap.teoyallScroll({
                borderRadius: '6px',
                autoHideScroll: true,
                autoResetRraw: true
            });
        },
        // 侧边栏功能树渲染
        sideMenuDraw: function() {
            var _this = this,
                $navMode = $('.nav-mode', _this.$leftMode),
                tree = null;
            
            /**
             *  这里实例化一个菜单树的对象。
             *  @example var tree = new MenuTree();
             *  对象中，提供了creatMenu方法，用于加载菜单树的结构（此功能用在做懒加载菜单树，一次性加载完成的菜单树不需要此操作）。该方法需要3个参数，
             *  第一个参数是需要将新菜单树结构加载进去的元素对象。
             *  第二个参数是data（json数组形式的菜单数据，结构同上面menuData的格式一样）。
             *  第三个参数是插入的某一个菜单的位置，以其中的data-key为标识，传入data-key（data-key对应json数据中的code）。
             *  第三个参数可以不填，不填该参数则会默认根据新传入的数据渲染整个菜单树的结构。
             *  @example tree.creatMenu(element, data, 1);
             */
            tree = new MenuTree($navMode);
            // init是对MenuTree创建出来的资源树进行初始化，并进行回调，回调函数提供当前调用的元素对象；
            tree.init(menuData, function(el){
                var $el = $(el);
                $el.on('click', '.nav-tree .nav-list', function(){
                    var $this = $(this),
                        $trees = $this.parents('.nav-tree').siblings('.nav-tree'),
                        $list = $this.parent(),
                        $menu = $list.find('>.nav-menu'),
                        n = $trees.length,
                        $nearTree = $trees.filter(':lt(' + n + ')'),
                        $nearList = $nearTree.find('.nav-menu').removeClass('fadeInDown'),
                        $t = $this.find('.t'),
                        title = $t.text(),
                        url = $t.attr('data-url'),
                        prog = null;
                    $nearTree.removeClass('cur');
                    $nearTree.find('.nav-tree').removeClass('cur');
                    
                    if (url) {
                        if (_this.menuState) {
                            _this.$layoutMain.removeClass('min-show');
                            _this.menuState = false;
                        } else {
                            _this.$layoutMain.addClass('min-show');
                            _this.menuState = true;
                        }
                        // 如果存在着地址，则在新的tab标签上打开窗口
                        // _this.toOpenWinFn(2, title, url, function (state) {
                        //     if (state === 3) {
                        //         $list.removeClass('cur');
                        //     }
                        // });
                        if(url=='inspect'){
                            var data={ icon: 'icon-sitemap',color: 'icon-red', 'a': 'home', 'b': 'index' };
                            var me=window.framework;
                            me.execCommand('go',data);
                        }else{
                            var data={ icon: 'icon-sitemap',color: 'icon-red', 'a': url, 'b': url };
                            var me=window.framework;
                            me.execCommand('go',data);
                        }

                    }
                    if(_this.lock) {
                        // 锁定情况下
                        if (_this.menuState) {
                            _this.$layoutMain.removeClass('min-show');
                            _this.menuState = false;
                        }
                    }else {
                        // 非锁定情况下
                        if (_this.menuState && !url) {
                            _this.$layoutMain.removeClass('min-show');
                            _this.menuState = false;
                        } else if (!_this.menuState && url){
                            _this.$layoutMain.addClass('min-show');
                            _this.menuState = true;
                        }
                    }
                    $list.addClass('cur');
                    $menu.addClass('animated').addClass('fadeInDown');
                });
            });
        },
        // 收起左边菜单栏
        takeUpSideMenu: function() {
            var _this = this;
            _this.$leftMode.on('click', '.nav-flex', function(){
                if (_this.menuState) {
                    _this.$layoutMain.removeClass('min-show');
                    _this.menuState = false;
                } else {
                    _this.$layoutMain.addClass('min-show');
                    _this.menuState = true;
                }
            });
        },
        // 锁定/解锁菜单
        toLockMenu: function() {
            var _this = this,
                $navLock = $('.nav-lock', _this.$leftMode);
            $navLock.on('click', '>li', function(){
                var $this = $(this);
                if ($this.hasClass('on')) {
                    _this.lock = true;
                }else {
                    _this.lock = false;
                }
                $this.addClass('cur').siblings('li').removeClass('cur');
            });
        },
        // 点击logo返回首页操作
        backHome: function() {
            var _this = this,
                $logo = $('.logo-mode', _this.$system),
                title = $logo.attr('data-title'),
                url = $logo.attr('data-src');
            $logo.on('click', function(){
                _this.toOpenWinFn(2, title, url);
            });
        },
        // 拖拽改变左侧菜单栏的宽度
        moveChangeLeftWidth: function() {
            var _this = this,
                l = 200,
                minW = 200,
                maxW = $('body').outerWidth() / 2;
                $mask = $('<div class="zr-layout-move-mask">');
                $move = $('.zr-layout-move', _this.$system),
                zIndex = $move.css('zIndex'),
                allow = true;
            $mask.css({
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                zIndex: zIndex,
                cursor: 'col-resize'
            });
            $(window).on('resize', function(){
                maxW = $('body').outerWidth() / 2;
            });
            // 改变左边菜单栏宽度
            $move.on('mousedown', function(event){
                var startX = event.pageX,
                    moveX = 0,
                    n = l;
                $('body').append($mask);
                $move.addClass('line-moveing');
                $(document).on('mousemove.moveMoveXXX', function(event){
                    moveX = event.pageX - startX;
                    n = l + moveX;
                    if( n < minW ) {
                        n = minW;
                        allow = false;
                    }else if (n > maxW) {
                        n = maxW;
                        allow = false;
                    }else {
                        allow = true;
                    }
                    if (allow) {
                        $move.css('left', n - 1 + 'px');
                        _this.$leftMode.addClass('no-animat').css('width', n + 'px');
                    }
                });
                $(document).on('mouseup.moveUpXXX', function(){
                    l = n;
                    $move.css('left', l - 1 + 'px');
                    _this.$leftMode.css('width', l + 'px');
                    _this.$leftMode.removeClass('no-animat');
                    $move.removeClass('line-moveing');
                    $mask.remove();
                    $(document).off('mousemove.moveMoveXXX').off('mouseup.moveUpXXX');
                });
                return false;
            });
        }
    };

    $(function(){
        handler.init();
    });
}(jQuery, window, layui));