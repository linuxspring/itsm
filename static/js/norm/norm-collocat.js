; (function ($, window, tools) {
    var handler = {
        init: function () {
            this.rootWin = tools.fn.getTopElement();
            this.IndexLayer = this.rootWin.IndexLayer;
            this.$system = $('.zr-system-layout');
            this.myIndex = null;

            this.toHandleSelect();
            this.toBeautifyTable();
        },
        // 下拉选项
        toHandleSelect: function () {
            var _this = this,
                $wrap = $('.form-wrap .select-input', _this.$system);
            $wrap.selectPlay();
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