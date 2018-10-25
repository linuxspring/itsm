;(function($, window){
    var CurrentTree = function(el, options) {
        this.opts = $.extend({}, {
            skin: '',
            data: '',
        }, options);
        this.$el = $(el);

        this.opts.skin && ( this.$el.addClass(this.opts.skin) );
    };

    // 静态方法：创建菜单树层结构并返回该结构对象
    CurrentTree.getCreatHtml = function (n, d) {
        var $wrap = $('<div class="zr-trees-wrap">'),
            $title = null,
            $mode = null,
            oHtml = null;
        n++;
        for (var i = 0; i < d.length; i++) {
            $title = $('<div class="zr-trees-title">');
            $mode = $('<div class="zr-trees-mode">');
            oHtml = '';
            $wrap.append($mode);
            $mode.attr('data-key', d[i].code).attr('data-lay', n - 1);
            if (d[i].hasOwnProperty('icon') && d[i].icon) {
                oHtml = '<img src="" class="zr-trees-img">'
                    + '<p class="txt" title="' + d[i].title + '">'
                    + '<span class="t">' + d[i].title + '</span>'
                    + '</p>';
            } else {
                oHtml = '<p class="txt" title="' + d[i].title + '">'
                    + '<span class="t">' + d[i].title + '</span>'
                    + '</p>';
            }
            $title.html(oHtml);
            $mode.append($title);
            if (d[i].hasOwnProperty('child') && d[i].child) {
                $mode.append(CurrentTree.getCreatHtml(n, d[i].child));
            }
        }
        return $wrap;
    };

    // 菜单树初始化
    CurrentTree.prototype.init = function (callBack) {
        this.creatStructure(this.opts.data);
        callBack && callBack(this.$el);
    };

    // 创建菜单树结构
    CurrentTree.prototype.creatStructure = function (data, key) {
        var n = 0,
            $wrap = null,
            $mode = null;
        if (key === undefined || key === null) {
            n = 0;
            $wrap = CurrentTree.getCreatHtml(n, data);
            $wrap.addClass('zr-current-tree');
            this.$el.append($wrap);
        }else {
            $mode = $('.zr-trees-mode[data-key="' + key + '"]', this.$el);
            n = $mode.attr('data-lay');
            $wrap = CurrentTree.getCreatHtml(n, data);
            $mode.append($wrap);
        }
    };

    window.CurrentTree = CurrentTree;
}(jQuery, window));