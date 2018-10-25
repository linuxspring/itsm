; (function ($, window) {
    var handler = {
        init: function () {
            this.$system = $('.zr-system-layout');
            
            this.toHandleSelect();
            this.toTabShowHide();
            this.toCalendarHandle();
        },
        // 下拉选项
        toHandleSelect: function() {
            var _this = this,
                $wrap = $('.form-wrap .select-input', _this.$system);
            $wrap.selectPlay();
        },
        // 数据tab切换
        toTabShowHide: function() {
            var _this = this,
                $wrap = $('.norm-wrap', _this.$system);
            $wrap.tabPlay({
                title: '.tab-title>li',
                content: '.data-tab-cont>.tab-cont, .filter-handle-wrap>li',
                defaultShowIndex: 0
            });
        },
        // 日历选择
        toCalendarHandle: function() {
            var _this = this,
                $wrap = $('.exhibit-right .calend-list', _this.$system);
            $wrap.Calendar({
                type: 1,
                autoHide: true,
                calenWidth: '240px',
                changeTimeFn: function ($el, time) {
                    $el.text(time);
                }
            });
        }
    };

    $(function () {
        handler.init();
    });
}(jQuery, window));