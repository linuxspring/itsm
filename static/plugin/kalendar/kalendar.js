;(function($, window){
    var Kalendar = function (el, options) {
        this.$el = $(el);
        this.opts = $.extend({}, {
            type: 1,
            defaultTime: '',
        }, options);
        this.$wrap = $('<div class="zr-kalendar-wrap">');
        this.initTime = {};         // 默认时间
        this.nowTime = {};          // 当前（此时此刻的）时间
        this.tempTime = {};         // 暂存时间

        this.$el.append(this.$wrap);
        this.init();
    };

    // 小方法：为小于10的数字前面添加‘0’,并返回
    var getAdorn = function(num) {
        num ? num : '00';
        num = num > 9 ? num : '0' + String(num);
        return num;
    }

    // 小方法：根据年月日时分返回XXXX-XX-XX xx:xx的格式
    var getDateFormatMin = function(Y, M, D, h, m) {
        M = getAdorn(M + 1);
        D = getAdorn(D);
        h = getAdorn(h);
        m = getAdorn(m);
        return ( Y + '-' + M + '-' + D + ' ' + h + ':' + m );
    }

    // 小方法：根据年月日时分返回XXXX-XX-XX的格式
    var getDateFormatDay = function (Y, M, D) {
        M = getAdorn(M + 1);
        D = getAdorn(D);
        return (Y + '-' + M + '-' + D );
    }

    // 小方法：获取某年某月的某天是星期几
    var getMonthFirstWeek = function (y, m, d) {
        var dater = new Date(y, (m - 0 + 1), d);
        return dater.getDay();
    }
    // 小方法：获取某年某月个月有多少天
    var getDayCount = function (y, m) {
        function isLeapYear(year) {
            return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0) ? 29 : 28;
        }
        var days = [31, isLeapYear(y), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return days[m];
    }
    // 小方法：创建以日为单位的Html结构，并返回该对象
    var creatDayStruct = function (y, m, d) {
        var $table = $('<table class="zr-kalend-day">'),
            ohtml = '<tr>',
            start = getMonthFirstWeek(y, m, 1),
            total = getDayCount(y, m),
            num = 0,
            tempPrevM = 0,
            week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        if( m == 0 ) {
            tempPrevM = 31;
        } else {
            tempPrevM = getDayCount(y, m);
        }
        for(var k = 0; k < 7; k++) {
            ohtml += '<td><p class="w-t">' + week[k] + '</p></td>';
        }
        ohtml += '</tr>';
        for(var i = 0; i < 6; i++) {
            ohtml += '<tr>';
            for(var j = 0; j < 7; j++) {
                num = (i * 7 + j) - start + 1;
                if ( num <= 0 ) {
                    ohtml += '<td class="gray-cell"><p class="day"><span>' + ( tempPrevM - 0 + num ) + '</span></p></td>';
                } else if ( num == d ) {
                    ohtml += '<td data-date="' + getDateFormatDay(y, m, num) + '"><p class="day cur"><span>' + num + '</span></p></td>';
                } else if (num > total) {
                    ohtml += '<td class="gray-cell"><p class="day"><span>' + ( num - total ) + '</span></p></td>';
                } else {
                    ohtml += '<td data-date="' + getDateFormatDay(y, m, num) + '"><p class="day"><span>' + num + '</span></p></td>';
                }
                
            }
            ohtml += '</tr>';
        }
        $table.append(ohtml);
        return $table;
    }

    // 小方法：创建以小时为单位的Html结构，并返回该对象
    var creatHourStruct = function(y, m, d, h) {
        var $table = $('<table class="zr-kalend-hours">'),
            ohtml = '',
            t = 0;
        for(var i = 0; i < 4; i++) {
            ohtml += '<tr>';
            for(var j = 0; j < 6; j++) {
                t = ((6 * i) + j + 1);
                if( h == t) {
                    ohtml += '<td class="cur" data-date="' + getDateFormatMin(y, m, d, t, 0) + '"><p class="hours" data-time="' + t + '">' + getAdorn(t) + ' : 00</p></td>';
                }else {
                    ohtml += '<td data-date="' + getDateFormatMin(y, m, d, t, 0) + '"><p class="hours" data-time="' + t + '">' + getAdorn(t) + ' : 00</p></td>';
                }
            }
            ohtml += '</tr>';
        }
        $table.html(ohtml);
        return $table;
    }

    // 小方法：创建以月为单位的HTML结构，并返回该对象
    var creatMonthDayStruct = function(y, m, d) {
        var $table = $('<table class="zr-kalend-years">'),
            ohtml = '',
            n = 0;
        function creatMonthHtml (y, m) {
            var htmls = '<div class="zr-kalend-min-month-h">' + ( m - 0 + 1 ) + '月</div>',
                start = getMonthFirstWeek(y, m, 1),
                total = getDayCount(y, m),
                num = 0;
            htmls += '<div class="zr-kalend-min-month-c"><table class="zr-kalend-min-month-d">';
            for(var i = 0; i < 6; i++) {
                htmls += '<tr>';
                for(var j = 0; j < 7; j++) {
                    num = (i * 7 + j) - start + 1;
                    if(num > 0 && num <= total) {
                        htmls += '<td data-date="' + getDateFormatDay(y, m, num) + '"><span>' + num + '</span></td>';
                    }else {
                        htmls += '<td></td>';
                    }
                }
                htmls += '</tr>';
            }
            htmls += '</table></div>';
            return htmls;
        }
        for( var i = 0; i < 2; i++) {
            ohtml += '<tr>';
            for(var j = 0; j < 6; j++) {
                n = i * 6 + j;
                if( n === m ) {
                    ohtml += '<td class="cur"><div class="zr-kalend-min-month">' + creatMonthHtml(y, n) + '</div></td>';
                }else {
                    ohtml += '<td><div class="zr-kalend-min-month">' + creatMonthHtml(y, n) + '</div></td>';
                }
            }
            ohtml += '</tr>';
        }
        $table.html(ohtml);
        return $table;
    }

    // 日历初始化
    Kalendar.prototype.init = function () {
        var temp = [];
        
        switch (this.opts.type) {
            case 1:
                if (this.opts.defaultTime) {
                    temp = this.opts.defaultTime.split(' ');
                    if (temp.length >= 2) {
                        temp[0] = temp[0].split('-');
                        temp[1] = temp[1].split(':');
                        this.initTime.Y = getAdorn(temp[0][0]);
                        this.initTime.M = getAdorn(temp[0][1] - 1);
                        this.initTime.D = getAdorn(temp[0][2]);
                        this.initTime.h = getAdorn(temp[1][0]);
                        this.initTime.m = getAdorn(temp[1][1]);
                        this.initTime.s = getAdorn(temp[1][2]);
                        this.initTime.W = getMonthFirstWeek(temp[0][0], temp[0][1], temp[0][2]);
                    }else {
                        temp = temp.split('-');
                        this.initTime.Y = getAdorn(temp[0]);
                        this.initTime.M = getAdorn(temp[1] - 1);
                        this.initTime.D = getMonthFirstWeek(temp[0], temp[1], temp[2]);
                    }
                } else {
                    this.setNowTime();
                    this.initTime = JSON.parse(JSON.stringify(this.nowTime));
                }
                this.tempTime = JSON.parse(JSON.stringify(this.initTime));
                this.drawDayView({
                    year: this.tempTime.Y,
                    month: this.tempTime.M,
                    day: this.tempTime.D
                });
            break;
        }
    }

    // 获取系统当前时间
    Kalendar.prototype.setNowTime = function() {
        var date = new Date();
        this.nowTime.Y = date.getFullYear();
        this.nowTime.M = date.getMonth();
        this.nowTime.D = date.getDate();
        this.nowTime.W = date.getDay();
        this.nowTime.h = date.getHours();
        this.nowTime.m = date.getMinutes();
        this.nowTime.s = date.getSeconds();
    }

    // 绘制以日为基础的日历
    Kalendar.prototype.drawDayView = function(options, callBack) {
        var opts = $.extend({}, {
            year: this.tempTime.year,
            month: this.tempTime.month,
            day: this.tempTime.day
        }, options);
        var $el = creatDayStruct(opts.year, opts.month, opts.day);
        this.$wrap.html('').append($el);
        callBack && callBack($el);
    }

    // 绘制以小时为基础的日历
    Kalendar.prototype.drawHourView = function (options, callBack) {
        var opts = $.extend({}, {
            year: this.tempTime.year,
            month: this.tempTime.month,
            day: this.tempTime.day,
            hour: this.tempTime.hour
        }, options);
        var $el = creatHourStruct(opts.year, opts.month, opts.day, opts.hour);
        this.$wrap.html('').append($el);
        callBack && callBack($el);
    }

    // 绘制以日月为基础的日历
    Kalendar.prototype.drawMonthDayView = function (options, callBack) {
        var opts = $.extend({}, {
            year: this.tempTime.year,
            month: this.tempTime.month,
            day: this.tempTime.day
        }, options);
        var $el = creatMonthDayStruct(opts.year, opts.month, opts.day);
        this.$wrap.html('').append($el);
        callBack && callBack($el);
    }

    window.Kalendar = Kalendar;
}(jQuery, window));