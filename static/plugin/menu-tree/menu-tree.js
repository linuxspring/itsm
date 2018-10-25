;(function($, window){
    var MenuTree = function(el, options) {
        this.opts = $.extend({}, {
            
        }, options);
        this.$el = $(el);
    }
    MenuTree.prototype.init = function (data, callBack) {
        var _this = this;
        _this.creatMenu(_this.$el, data, 0);
        callBack && callBack(this.$el);
    }
    MenuTree.prototype.creatMenu = function(el, data, n) {
        n = n ? n : 0;
        $(el).append(creatHtml(data, n));

        function creatHtml(d, n) {
            var $navMenu = $('<div class="nav-menu">');
            var htmls = '';
            var url = '';
            if(d) {
                n++;
                for (var i = 0; i < d.length; i++) {
                    var $tree = $('<div class="nav-tree" data-eq="' + n + '" data-key="' + d[i].code + '">');
                    htmls = '';
                    url = d[i].url ? (' data-url="' + d[i].url + '"') : '';
                    switch (n) {
                        case 1:
                            if (d[i].hasOwnProperty('child') && d[i].child) {
                                htmls += '<div class="nav-list">'
                                        + '<p class="menu nav-icon" title="' + d[i].title + '">'
                                            + '<img src="' + d[i].icon + '" alt="" class="n-i">'
                                            + '<span class="t"' + url + '>' + d[i].title + '</span>'
                                            + '<icon class="h">&nbsp;</icon>'
                                        + '</p>'
                                    + '</div>';
                            }else {
                                htmls += '<div class="nav-list">'
                                        + '<p class="menu nav-icon" title="' + d[i].title + '">'
                                            + '<img src="' + d[i].icon + '" alt="" class="n-i">'
                                            + '<span class="t"' + url + '>' + d[i].title + '</span>'
                                        + '</p>'
                                    + '</div>';
                            }
                        break;
                        case 2:
                            $navMenu.addClass('nav-menu-fixed');
                            htmls += '<div class="nav-list">'
                                + '<p class="menu nav-icon" title="' + d[i].title + '">'
                                        + '<icon class="icon">&nbsp;</icon>'
                                         + '<span class="t"' + url + '>' + d[i].title + '</span>'
                                    + '</p>'
                                + '</div>';
                        break;
                        default:
                            htmls += '<div class="nav-list">'
                                + '<p class="menu nav-icon" title="' + d[i].title + '">'
                                    + '<span class="t"' + url + '>' + d[i].title + '</span>'
                                    + '</p>'
                                + '</div>';
                    }
                    $tree.html(htmls);
                    if (d[i].hasOwnProperty('child') && d[i].child) {
                        $tree.append(creatHtml(d[i].child, n));
                    }
                    $navMenu.append($tree); 
                }
            }
            return $navMenu;
        }
    }
    window.MenuTree = MenuTree;
}(jQuery, window));

