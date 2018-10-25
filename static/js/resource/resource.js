;(function($, window){
    var datar = [
        {
            code: '1',
            title: '宿主机1',
            child: [{
                code: '1-1',
                title: '虚拟机1'
            }, {
                code: '1-2',
                title: '虚拟机2'
            }, {
                code: '1-3',
                title: '虚拟机3',
                child: [{
                    code: '1-3-1',
                    title: '交换机1'
                }, {
                    code: '1-3-2',
                    title: '交换机2'
                }, {
                    code: '1-3-3',
                    title: '交换机3'
                }]
            }]
        }, {
            code: '2',
            title: '宿主机2',
            child: [{
                code: '2-1',
                title: '虚拟机1'
            }, {
                code: '2-2',
                title: '虚拟机2'
            }, {
                code: '2-3',
                title: '虚拟机3'
            }]
        }, {
            code: '3',
            title: '宿主机3',
            child: [{
                code: '3-1',
                title: '虚拟机1'
            }, {
                code: '3-2',
                title: '虚拟机2'
            }, {
                code: '3-3',
                title: '虚拟机3'
            }]
        }
    ];
    var handler = {
        init: function() {
            this.$system = $('.zr-system-layout');

            this.toHandleSelect();
            this.resourceTree();
            this.toBeautifyScroll();
        },
        // 下拉选项
        toHandleSelect: function () {
            var _this = this,
                $wrap = $('.form-wrap .select-input', _this.$system);
            $wrap.selectPlay({
                // 下拉选项选择了选项的回调函数
                // 提供了三个参数，分别是当前整个下拉元素对象、选择选项的文本、选择选项的data-val属性的value值
                success: function(a, b, c) {
                    console.log(a, b, c);
                }
            });
        },
        // 资源树
        resourceTree: function() {
            var _this = this,
                $resourceTree = $('.resource-tree', _this.$system),
                tree = null;
            /**
             *  这里实例化一个资源树的对象。
             *  @example var tree = new CurrentTree();
             *  对象中，提供了creatStructure方法，用于加载菜单树的结构。该方法需要2个参数，
             *  第一个参数是data（json数组形式的菜单数据，结构同上面datar的格式一样）。
             *  第二个参数是插入的某一个菜单的位置，以其中的data-key为标识，传入data-key（data-key对应json数据中的code）。
             *  第二个参数可以不填，不填该参数则会默认根据新传入的数据渲染整个菜单树的结构。
             *  @example tree.creatStructure(data, 1);
             */
            tree = new CurrentTree($resourceTree, {
                data: datar
            });
            // init是对tree创建出来的资源树进行初始化，并进行回调，回调函数提供当前调用的元素对象；
            tree.init(function($el){
                $el.on('click', '.zr-current-tree .zr-trees-mode .txt', function(){
                    var $mode = $(this).closest('.zr-trees-mode');
                    $mode.siblings('.zr-trees-mode').removeClass('cur').find('.zr-trees-mode').removeClass('cur');
                    $mode.toggleClass('cur');
                });
            });
        },
        // 滚动条优化
        toBeautifyScroll: function() {
            var _this = this,
                $wrap1 = $('.resource-tree-mode', _this.$system),
                $wrap2 = $('.resource-cont', _this.$system);
            $wrap1.teoyallScroll({
                borderRadius: '6px',
                autoHideScroll: true,
                autoResetRraw: true
            });
            $wrap2.teoyallScroll({
                borderRadius: '6px',
                autoHideScroll: true,
                autoResetRraw: true
            });
        }
    };

    $(function(){
        handler.init();
    });
}(jQuery, window));