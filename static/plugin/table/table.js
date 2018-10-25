;(function($, window){

    // 获取第一行td的宽度组成数组，并返回该数组
    var getThWidth = function($td) {
        var arr = [];
        for(var i = 0; i < $td.length; i++) {
            arr[i] = $td.eq(i).outerWidth();
        }
        return arr;
    }

    // 获取线条的left值，并返回该数组
    var getThLeft = function ($td) {
        var arr = [];
        var n = $td.length;
        for (var i = 0; i < n; i++) {
            if(i === 0) {
                arr[i] = $td.eq(i).outerWidth();
            }else {
                arr[i] = arr[i - 1] + $td.eq(i).outerWidth();
            }
        }
        return arr;
    }

    // 创建线条，并返回html结构
    var creatLine = function(arr, len) {
        var ohtml = '';
        len = len ? len : arr.length;
        for(var i = 0; i < arr.length; i++) {
            if(i < len) {
                ohtml += '<div class="zr-table-line" style="left: ' + arr[i] + 'px" data-eq="' + i + '"></div>';
            }
        }
        return ohtml;
    }

    // 设置th或td的宽度
    var setThOrTdWidth = function($tr, arr) {
        var $el = null;
        for (var i = 0; i < $tr.length; i++) {
            $el = $tr.eq(i).children();
            for (var j = 0; j < arr.length; j++) {
                $el.eq(j).css('width', arr[j]);
            }
        }
    }

    // 设置line的left值
    var setLineWidth = function($el, arr) {
        for(var i = 0; i < arr.length; i++) {
            $el.filter('[data-eq="' + i + '"]').css('left', arr[i]);
        }
    }

    // 计算返回固定行的宽度
    var getFixedColWrapWidth = function(arr, n) {
        var len = 0;
        for (var i = 0; i < n; i++) {
            len += arr[i];
        }
        return len;
    }

    var ResizeTable = function(el, options) {
        this.opts = $.extend({}, {
            allowChangeTdWidth: false,      // 是否允许拖拽改变单元格宽度
            fixedRows: 0,                   // 从顶部固定几行
            fixedCols: 0,                   // 从顶部固定几列
            maxHeight: 0,                   // 表格可视区最大高度
            successFn: $.noop               // 初始化挂载完毕成功调用的回调函数，提供一个参数：调用该插件的对象el
        }, options);
        this.$el = $(el);
        this.$wrapper = null;
        this.$mask = $('<div class="zr-table-wrap-mask">');
        this.$wrap = null;      // 放主表格的包装器
        this.$mode = null;      // 放主表格的模块
        this.$rowWrap = null;
        this.$leftWrap = null;
        this.$rightWrap = null;
        this.$leftTopWrap = null;
        this.$rightTopWrap = null;
        this.$rowTable = null;
        this.$leftColTable = null;
        this.$topLeftWrap = null;
        this.$topLeftTable = null;
        this.$line = null;
        this.$table = null;
        this.$tableTr = null;
        this.$firstTd = null;
        this.$tr = null;
        this.$cell = null;  //对象内所有的th和td的单元格
        this.$th = null;    //对象内所有的th
        this.$td = null;    // 对象内所有的td
        this.$leftLineWrap = null;
        this.widthArr = [];     // 每行单元格的宽度
        this.leftArr = [];      // 可拖拽线条的left值
        this.scrollLeft = 0;    // 向右滚动的距离
        this.scrollTop = 0;     // 向上滚动的距离
        this.wrapWidth = 0;     // 可视区的宽度
        this.wrapHeight = 0;    // 可视区的高度
        this.tableWidth = 0;
        this.tableHeight = 0;
        var _this = this;

        // 对表格进行初始化
        this.init();

        this.opts.successFn && this.opts.successFn(this.$el);

        // 可拖拽改变单元格的宽度
        if (this.opts.allowChangeTdWidth) {
            this.$el.on('mousedown', '.zr-table-line', function (event) {
                var $this = $(this),
                    startX = event.pageX,
                    moveX = 0,
                    $temp = null,
                    $tempCell = null,
                    // $tempTd = null,
                    m = 0,
                    m2 = 0,
                    index = $(this).attr('data-eq');
                $('body').append(_this.$mask);
                $this.addClass('active');
                $temp = _this.$line.filter('[data-eq="' + index + '"]');
                $tempCell = _this.$th.filter('.zr-tr-cell:nth-child(' + (index - 0 + 1) + ')');

                $(document).on('mousemove.zrTableMove', function (event) {
                    moveX = event.pageX - startX;
                    m = _this.leftArr[index] + moveX;
                    m2 = _this.widthArr[index] + moveX;
                    if (m <= 40) {
                        m = 40;
                        m2 = 40;
                    } else if (m < _this.leftArr[index - 1] + 40) {
                        m = _this.leftArr[index - 1] + 40;
                        m2 = 40;
                    }
                    $temp.css('left', m);
                });
                $(document).on('mouseup.zrTableUp', function () {
                    _this.leftArr[index] = m;
                    _this.widthArr[index] = m2;
                    $tempCell.css('width', m2);
                    // $tempTd.css('width', m2);
                    _this.updateChangeWidthResult();
                    _this.$mask.remove();
                    $this.removeClass('active');
                    $(document).off('mousemove.zrTableMove').off('mouseup.zrTableUp');
                });
                return false;
            });
            $(window).on('resize', function(){
                var w = _this.$wrap.get(0).clientWidth;
                if(w != _this.wrapWidth ) {
                    _this.wrapWidth = w;
                    _this.updateChangeWidthResult();
                }
            });
        }
    }

    ResizeTable.prototype.init = function(callBack) {
        var _this = this,
            $mode = $('<div class="zr-table-main-mode">'),
            $wrap = $('<div class="zr-table-main-wrap">');
        this.$wrapper = $('.zr-table-wrap', this.$el);
        this.$table = $('.zr-table-main', this.$el);
        this.$table.wrap($mode);
        this.$mode = $('.zr-table-main-mode', this.$el);
        this.$mode.wrap($wrap);
        this.$wrap = $('.zr-table-main-wrap', this.$el);
        this.$table.addClass('zr-table-nowrap zr-table-ellipsis');
        
        //如果有固定行，则创建固定行
        if( this.opts.fixedRows ) {
            this.$rowWrap = $('<div class="zr-table-row-wrap">');
            this.$wrapper.prepend(this.$rowWrap);
        }
        //如果有固定列，则创建固定列
        if (this.opts.fixedCols ) {
            this.$leftWrap = $('<div class="zr-table-col-wrap">');
            this.$leftLineWrap = $('<div class="zr-table-col-line-wrap">');
            this.$wrapper.prepend(this.$leftWrap);
        }
        // 固定行固定列
        if (this.opts.fixedRows && this.opts.fixedCols) {
            this.$topLeftWrap = $('<div class="zr-table-top-left-wrap">');
            this.$wrapper.prepend(this.$topLeftWrap);
        }
        this.updateTableInit();
        callBack && callBack(this.$el, this.$table);
    };

    // 固定行
    ResizeTable.prototype.fixedRows = function() {
        var $tr = null;
        this.$rowWrap.css('width', this.wrapWidth);
        this.$rowTable = this.$table.clone(true).removeClass('zr-table-main');
        $tr = this.$rowTable.find('.zr-tr');
        $tr.filter(':gt(' + ( this.opts.fixedRows - 1 ) + ')').remove();
        this.$rowWrap.html('').append(this.$rowTable);
    }

    // 固定列 
    ResizeTable.prototype.fixedCols = function() {
        var $tr = null;
        this.$leftColTable = this.$table.clone(true).removeClass('zr-table-main');
        this.$leftWrap.css({
            width: getFixedColWrapWidth(this.widthArr, this.opts.fixedCols),
            height: this.wrapHeight
        });
        $tr = this.$leftColTable.find('.zr-tr');
        for(var i = 0; i < $tr.length; i++) {
            $tr.eq(i).find('.zr-tr-cell:gt(' + (this.opts.fixedCols - 1) + ')').remove();
            // $tr.eq(i).find('.zr-td:gt(' + (this.opts.fixedCols - 1) + ')').remove();
        }
        this.$leftWrap.html('').append(this.$leftColTable);
        this.$wrapper.find('>.zr-table-line').remove();
        this.opts.allowChangeTdWidth && (this.$wrapper.append($(creatLine(this.leftArr, this.opts.fixedCols))));
    }

    // 固定行和固定列
    ResizeTable.prototype.fixedRowsAndFixedCols = function() {
        var $tr = null;
        this.$topLeftTable = this.$table.clone(true).removeClass('zr-table-main');
        this.$topLeftWrap.css({
            width: getFixedColWrapWidth(this.widthArr, this.opts.fixedCols),
            maxHeight: this.wrapHeight
        });
        $tr = this.$topLeftTable.find('.zr-tr').filter(':gt(' + (this.opts.fixedRows - 1) + ')').remove();
        for (var i = 0; i < $tr.length; i++) {
            $tr.eq(i).find('.zr-tr-cell:gt(' + (this.opts.fixedCols - 1) + ')').remove();
            // $tr.eq(i).find('.zr-td:gt(' + (this.opts.fixedCols - 1) + ')').remove();
        }
        this.$topLeftWrap.html('').append(this.$topLeftTable);
    }

    // 滚动操作
    ResizeTable.prototype.scrollHandle = function() {
        var _this = this;
        _this.$wrap.on('scroll', function(){
            var $this = $(this);
            _this.scrollLeft = $this.scrollLeft(),
            _this.scrollTop = $this.scrollTop();
            _this.updateElementLeftAndTop();
        });
    }

    // 更新line对象、th对象和td对象
    ResizeTable.prototype.updateElement = function() {
        this.$tr = this.$wrapper.find('.zr-tr');
        this.$cell = this.$wrapper.find('.zr-tr-cell');
        this.$th = this.$wrapper.find('.zr-th');
        this.$td = this.$wrapper.find('.zr-td');
        this.$line = this.$wrapper.find('.zr-table-line');
    }

    // 更新scrollLeft和scrollTop 
    ResizeTable.prototype.updateElementLeftAndTop = function() {
        if (this.opts.fixedRows) {
            this.$rowWrap.scrollLeft(this.scrollLeft);
        }
        if (this.opts.fixedCols) {
            if(this.scrollLeft > 0) {
                this.$leftWrap.css('boxShadow', 'rgb(204, 204, 204) 12px 0px 14px -7px');
            }else {
                this.$leftWrap.css('boxShadow', 'none');
            }
            this.$leftWrap.scrollTop(this.scrollTop);
        }
    }

    // 更新拖住变更宽度更新数据
    ResizeTable.prototype.updateChangeWidthResult = function() {
        this.widthArr = getThWidth(this.$firstTd);
        this.leftArr = getThLeft(this.$firstTd);
        setLineWidth(this.$line, this.leftArr);
        setThOrTdWidth(this.$tr, this.widthArr);
        if (this.opts.fixedCols) {
            this.$leftWrap.css('width', getFixedColWrapWidth(this.widthArr, this.opts.fixedCols));
        }
        if (this.opts.fixedRows && this.opts.fixedCols) {
            this.$topLeftWrap.css('width', getFixedColWrapWidth(this.widthArr, this.opts.fixedCols));
        }
    }

    /**
     * 更新初始化整个表格结构
     * 此处对表格元素进行的任何修改、新增、删除、翻页等都需要调用此函数进行更新，否则会出错
     */
    ResizeTable.prototype.updateTableInit = function() {
        this.$tableTr = $('.zr-tr', this.$table);
        this.$firstTd = $('.zr-tr:eq(0) .zr-tr-cell', this.$table);
        // if (!(this.$firstTd && this.$firstTd.length > 0)) {
        //     this.$firstTd = $('.zr-tr:eq(0) .zr-td', this.$table);
        // }
        this.$wrap.css({
            // width: this.$el.css('width'),
            width: '100%',
            height: this.opts.maxHeight ? this.opts.maxHeight : this.$el.css('height'),
            overflow: 'auto'
        });
        this.wrapWidth = this.$wrap.get(0).clientWidth;        
        this.wrapHeight = this.$wrap.get(0).clientHeight;
        this.widthArr = getThWidth(this.$firstTd);
        this.leftArr = getThLeft(this.$firstTd);
        this.opts.allowChangeTdWidth && (this.$mode.append($(creatLine(this.leftArr))));
        setThOrTdWidth(this.$tableTr, this.widthArr);
        this.$table.css('table-layout', 'fixed');
        this.opts.fixedRows && this.fixedRows();
        this.opts.fixedCols && this.fixedCols();
        (this.opts.fixedRows && this.opts.fixedCols) && this.fixedRowsAndFixedCols();
        this.updateElement();
        this.scrollHandle();
        this.tableWidth = this.$table.outerWidth(true);
        this.tableHeight = this.$table.outerHeight(true);

        if(this.tableHeight < this.wrapHeight) {
            if(this.opts.fixedCols) {
                this.$leftWrap.css({
                    height: this.tableHeight
                });
            }
        }else {
            if (this.opts.fixedCols) {
                this.$leftWrap.css({
                    height: this.wrapHeight
                });
            }
        }
    }

    window.ResizeTable = ResizeTable;
}(jQuery, window));