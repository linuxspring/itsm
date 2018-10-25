; (function ($, window, tools) {
    var handler = {
        init: function () {
            this.rootWin = tools.fn.getTopElement();
            this.IndexLayer = this.rootWin.IndexLayer;
            this.$system = $('.zr-system-layout');
            this.myIndex = null;

            this.toTabShowHide();
            this.toCalendarHandle();
            this.fastChooseTime();
            this.toBeautifyTable();
        },
        // 数据tab切换
        toTabShowHide: function () {
            var _this = this,
                $wrap = $('.norm-wrap', _this.$system);
            $wrap.tabPlay({
                title: '.tab-title>li',
                content: '.data-tab-cont>.tab-cont, .filter-handle-wrap>li',
                defaultShowIndex: 0
            });
        },
        // 日历选择
        toCalendarHandle: function () {
            var _this = this,
                $wrap = $('.form-handle .calend-list', _this.$system);
            $wrap.Calendar({
                type: 1,
                autoHide: true,
                calenWidth: '240px',
                changeTimeFn: function ($el, time) {
                    $el.text(time);
                }
            });
        },
        // 快捷时间周期搜索选择
        fastChooseTime: function () {
            var _this = this,
                $wrap = $('.fast-dater', _this.$system);
            $wrap.on('click', 'li', function () {
                var $this = $(this);
                $this.addClass('cur').siblings('li').removeClass('cur');
                _this.myIndex = _this.IndexLayer.load(1, {
                    shade: [0.2, '#fff'] //0.1透明度的白色背景
                });

                // 这里模拟数据传递过程，成功后移除加载动画层
                setTimeout(function(){
                    _this.IndexLayer.close(_this.myIndex);
                }, 2000);
            });
        },
        // 表格优化
        toBeautifyTable: function () {
            var _this = this,
                $table = $('.norm-show-table', _this.$system),
                resizeTable = null;
            resizeTable = new ResizeTable($table, {
                allowChangeTdWidth: true,
                fixedCols: 2,
                maxHeight: '435px',
                successFn: function ($el) {
                    
                }
            });
            /**
             * 这里做回调，下一页操作。请需要重新在此处调用下面的回调参数中的updateTableInit方法重新计算排列。
             * 注意这里表格在进行分页操作时，需要保留原来的表头。
             */
            // resizeTable.updateTableInit();
        }
    };

    $(function () {
        handler.init();
    });
}(jQuery, window, systemTools));