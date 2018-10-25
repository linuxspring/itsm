; (function ($, window) {
    var handler = {
        init: function () {
            this.$system = $('.zr-system-layout');

            this.toTabHandle();
            this.toHandleSelect();
            this.toCalendarHandle();
            this.calendHandle();
        },
        // 下拉选项
        toHandleSelect: function () {
            var _this = this,
                $wrap = $('.form-wrap .select-input', _this.$system);
            // 调用zr-css中的jq扩展方法selectPlay（模拟下拉选项）功能
            $wrap.selectPlay({
                // 下拉选项选择了选项的回调函数
                // 提供了三个参数，分别是当前整个下拉元素对象、选择选项的文本、选择选项的data-val属性的value值
                success: function (a, b, c) {
                    console.log(a, b, c);
                }
            });
        },
        // 日历选择
        toCalendarHandle: function () {
            var _this = this,
                $wrap = $('.calend-mode-wrap .calend-list', _this.$system);
            // 调用plugin文件夹中的Calendar日历选择插件，显示日期选择功能
            $wrap.Calendar({
                type: 1,
                autoHide: true,
                calenWidth: '240px',
                changeTimeFn: function ($el, time) {
                    // 日历选择后的回调函数
                    $el.text(time);
                }
            });
        },
        // 平台日历模块的tab选择操作
        toTabHandle: function() {
            var _this = this,
                $wrap = $('.home-calendar-wrap', _this.$system);
            // 调用zr-css中的jq扩展方法tabPlay（tab切换）功能
            $wrap.tabPlay({
                title: '.data-tab-head .tab-title>li',
                content: '.data-tab-cont>.tab-cont',
                defaultShowIndex: 0
            })
        },
        // 平台日历模块上的操作
        calendHandle: function() {
            var _this = this,
                date = new Date(),
                time = {},  //默认的日期对象
                $wrap = $('.home-calendar-wrap', _this.$system),
                $mode = $('.data-tab-cont .tab-cont', $wrap),
                $chooseScrollWrap = $('.choose-scroll-wrap', $wrap);
                $tempList = null;
            // 年月日下拉滚动条
            $chooseScrollWrap.teoyallScroll({
                autoResetRraw: true,
                autoHideScroll: true,
                borderRadius: '6px'
            });
            time.Y = date.getFullYear();
            time.M = date.getMonth();
            time.D = date.getDate();
            time.h = date.getHours();
            time.m = date.getMinutes();
            $mode.each(function() {
                var $this = $(this),
                    timePattern = 0,    // 日历形式状态：0为日，1为月，2为年
                    $intervalWrap = $('.interval-wrap', $this),
                    $intervalList = $this.find('.interval-list'),
                    $calendarCont = $this.find('.calendar-cont'),
                    calend = null;
                // 初始化三个选择下拉框内容
                _this.initCalendInterval($this, time.Y, time.M, time.D);
                // 创建日历对象
                calend = new Kalendar($calendarCont);
                timePatternChangeCalen();

                // 根据状态更新日历
                function timePatternChangeCalen() {
                    if(timePattern === 0) {
                        $calendarCont.addClass('state-day').removeClass('state-month state-year');
                        dayModelHandle();
                    } else if (timePattern === 1) {
                        $calendarCont.addClass('state-month').removeClass('state-year state-day');
                        monthModelHandle();
                    }else {
                        $calendarCont.addClass('state-year').removeClass('state-month state-day');
                        yearModelHandle();
                    }
                }

                // 日期类型的操作函数
                function dayModelHandle() {
                    var $el = null;
                    var options = {
                        year: time.Y,
                        month: time.M,
                        day: time.D,
                        hour: time.h
                    };
                    calend.drawHourView(options, function($el){
                        var $el = $el;
                        _this.calendDayToHandle($el, time);
                    });
                }

                // 月份类型的操作函数
                function monthModelHandle() {
                    var $el = null;
                    var options = {
                        year: time.Y,
                        month: time.M,
                        day: time.D
                    };
                    calend.drawDayView(options, function ($el) {
                        var $el = $el;
                        _this.calendDayToHandle($el, time);
                    });
                }

                // 年份类型的操作函数
                function yearModelHandle() {
                    var $el = null;
                    var options = {
                        year: time.Y,
                        month: time.M,
                        day: time.D
                    };
                    calend.drawMonthDayView(options, function($el){
                        var $el = $el;
                        _this.calendDayToHandle($el, time);
                    });
                }

                // 根据年月，返回该年月月份的总天数
                function getMonthSumDay(y, m) {
                    var arr = [31, _this.isLeapYear(y), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    return arr[m];
                }

                // 根据勾选的日历模式操作下拉对应的选项
                function setSelectTimeShowHide() {
                    if (timePattern == 1) {
                        $intervalList.show();
                        $intervalList.eq(2).hide();
                        $intervalWrap.css('width', '145px');
                    } else if (timePattern == 2) {
                        $intervalList.show();
                        $intervalList.eq(1).hide();
                        $intervalList.eq(2).hide();
                        $intervalWrap.css('width', '82px');
                    } else {
                        $intervalList.show();
                        $intervalWrap.css('width', '208px');
                    }
                }

                /**
                 * 这里通过事件委托，给日期选择的三个下拉框绑定事件
                 * 分别点击下拉、点击选择、点击空白收起下拉
                 */
                $this.on('click', '.interval-wrap .interval-screen', function () {
                    var $that = $(this),
                        $list = $that.closest('.interval-list');
                    $tempList = $tempList ? $tempList : $wrap.find('.interval-wrap .interval-list.active');
                    $tempList && ($tempList.removeClass('active'));
                    $tempList = $list;
                    $tempList.toggleClass('active');
                    return false;
                });
                $this.on('click', '.interval-wrap .interval-time>li', function () {
                    var $that = $(this),
                        $list = $that.closest('.interval-list'),
                        $t = $list.find('.interval-screen .t');
                    $t.text($that.text());
                    $that.addClass('cur').siblings('li').removeClass('cur');
                    if ($list.hasClass('year-interval')) {
                        // 点击选择年份触发的操作
                        time.Y = parseInt($that.text());
                        _this.initCalendInterval($this, time.Y, time.M, time.D);
                    } else if ($list.hasClass('month-interval')) {
                        // 点击月份触发的操作
                        time.M = parseInt($that.text()) - 1;
                        _this.initCalendInterval($this, time.Y, time.M, time.D);
                    }else {
                        // 点击日期触发的操作
                        time.D = parseInt($that.text());
                    }
                    timePatternChangeCalen();
                });
                $(document).on('click', function () {
                    $tempList && ($tempList.removeClass('active'));
                });

                // 点击选择日/月/年模式
                $this.on('click', '.phase-wrap .p-btn', function(){
                    var $that = $(this);
                    timePattern = $that.index();
                    $that.addClass('cur').siblings('.p-btn').removeClass('cur');
                    setSelectTimeShowHide();
                    timePatternChangeCalen();
                });

                /**
                 *  点击上个/下个
                 */
                // 点击prev-btn上一个
                $this.on('click', '.home-calendar-mode>.prev-btn', function () {
                    var temp = 0;
                    if (timePattern === 0) {
                        temp = time.D - 1;
                        if(temp <= 0) {
                            if(time.M === 0) {
                                time.Y--;
                                time.M = 11;
                                time.D = 31;
                            }else {
                                time.M--;
                                time.D = getMonthSumDay(time.Y, time.M);
                            }
                        }else {
                            time.D = temp;
                        }
                    } else if (timePattern === 1) {
                        temp = time.M - 1;
                        if( temp <= 0) {
                            time.Y--;
                            time.M = 11;
                        }else {
                            time.M = temp;
                        }
                    } else {
                        time.Y--;
                    }
                    _this.initCalendInterval($this, time.Y, time.M, time.D);
                    setSelectTimeShowHide();
                    timePatternChangeCalen();
                });
                // 点击next-btn下一个
                $this.on('click', '.home-calendar-mode>.next-btn', function () {
                    var temp = 0;
                    if (timePattern === 0) {
                        temp = time.D + 1;
                        if (temp > getMonthSumDay(time.Y, time.M)) {
                            if (time.M >= 11) {
                                time.Y++;
                                time.M = 0;
                                time.D = 1;
                            } else {
                                time.M++;
                                time.D = 1;
                            }
                        } else {
                            time.D = temp;
                        }
                    } else if (timePattern === 1) {
                        temp = time.M + 1;
                        if (temp > 11) {
                            time.Y++;
                            time.M = 0;
                        } else {
                            time.M = temp;
                        }
                    } else {
                        time.Y++;
                    }
                    _this.initCalendInterval($this, time.Y, time.M, time.D);
                    setSelectTimeShowHide();
                    timePatternChangeCalen();
                });
            });
        },
        // 初始化日期选择状况
        initCalendInterval: function(el, y, m, d) {
            var _this = this,
                $el = $(el),
                monArr = [],
                time = {},
                oYearHtml = '',
                oMonthHtml = '',
                oDayHtml = '',
                year = 0,
                mon = 0,
                day = 0,
                $year = $('.year-interval', $el),
                $mon = $('.month-interval', $el),
                $day = $('.day-interval', $el);
            
            monArr = [31, _this.isLeapYear(y), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            for (var i = 0; i < 20; i++) {
                year = y - i + 5;
                if(i === 5) {
                    oYearHtml += '<li title="' + year + '年" class="cur">' + year + '年</li>';
                    $year.find('.interval-screen .t').text(year + '年');
                } else {
                    oYearHtml += '<li title="' + year + '年">' + year + '年</li>';
                }
            }
            for (var i = 0; i < 12; i++) {
                mon = (i + 1) > 9 ? (i + 1) : '0' + (i + 1);
                if( i == m ) {
                    oMonthHtml += '<li title="' + mon + '月" class="cur">' + mon + '月</li>';
                    $mon.find('.interval-screen .t').text(mon + '月');
                }else {
                    oMonthHtml += '<li title="' + mon + '月">' + mon + '月</li>';
                }
            }
            for (var i = 0; i < monArr[m]; i++) {
                day = (i + 1) > 9 ? (i + 1) : '0' + (i + 1);
                if ((i + 1) == d ) {
                    oDayHtml += '<li title="' + day + '日" class="cur">' + day + '日</li>';
                    $day.find('.interval-screen .t').text(day + '日');
                }else {
                    oDayHtml += '<li title="' + day + '日">' + day + '日</li>';
                }
            }
            $year.find('.interval-time').html(oYearHtml);
            $mon.find('.interval-time').html(oMonthHtml);
            $day.find('.interval-time').html(oDayHtml);
        },
        // 根据年份判断是否为闰年二月，是则返回29，否则为平年返回28
        isLeapYear: function (year) {
            return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0) ? 29 : 28;
        },
        // 平台日历日期模式（以小时展示），选择了时间出发需要后台查询数据，并反馈到页面是否有任务的操作
        calendDayToHandle: function ($el, time) {
            /**
             * 这个函数提供两个参数回来：
             * 第一个$el是当前创建出来的日历结构对象；
             * 第二个参数time是用户当前选择出来的时间。
             * 此处可根据time去查询后台数据，如果有相应的任务，则对$el上的元素进行操作如添加不同颜色背景的class样式等
             */
            console.log($el, time);
            /**
             * 这里模拟后台数据
             * time为后台查询到的时间
             * state为该时间状态
             * state为1表示状态：正常
             * state为2表示状态：异常
             * state为3表示状态：未到时间
             */
            var data = [
                {
                    date: '2018-05-01',
                    time: [{
                        t: '01:00',
                        state: 1
                    }, {
                        t: '02:00',
                        state: 1
                    }, {
                        t: '03:00',
                        state: 1
                    }, {
                        t: '04:00',
                        state: 1
                    }, {
                        t: '05:00',
                        state: 1
                    }]
                }, {
                    date: '2018-05-02',
                    time: [{
                        t: '01:00',
                        state: 1
                    }, {
                        t: '02:00',
                        state: 2
                    }, {
                        t: '03:00',
                        state: 2
                    }, {
                        t: '04:00',
                        state: 1
                    }, {
                        t: '05:00',
                        state: 1
                    }]
                }, {
                    date: '2018-05-03',
                    time: [{
                        t: '01:00',
                        state: 1
                    }, {
                        t: '02:00',
                        state: 1
                    }, {
                        t: '03:00',
                        state: 1
                    }, {
                        t: '04:00',
                        state: 2
                    }, {
                        t: '05:00',
                        state: 2
                    }]
                }, {
                    date: '2018-05-04',
                    time: [{
                        t: '01:00',
                        state: 3
                    }, {
                        t: '02:00',
                        state: 3
                    }, {
                        t: '03:00',
                        state: 1
                    }, {
                        t: '04:00',
                        state: 2
                    }, {
                        t: '05:00',
                        state: 1
                    }]
                }, {
                    date: '2018-05-05',
                    time: [{
                        t: '01:00',
                        state: 2
                    }, {
                        t: '02:00',
                        state: 2
                    }, {
                        t: '03:00',
                        state: 2
                    }, {
                        t: '04:00',
                        state: 2
                    }, {
                        t: '05:00',
                        state: 2
                    }]
                }, {
                    date: '2018-05-06',
                    time: [{
                        t: '01:00',
                        state: 1
                    }, {
                        t: '02:00',
                        state: 1
                    }, {
                        t: '03:00',
                        state: 1
                    }, {
                        t: '04:00',
                        state: 1
                    }, {
                        t: '05:00',
                        state: 3
                    }]
                }, {
                    date: '2018-05-07',
                    time: [{
                        t: '01:00',
                        state: 3
                    }, {
                        t: '02:00',
                        state: 3
                    }, {
                        t: '03:00',
                        state: 3
                    }, {
                        t: '04:00',
                        state: 3
                    }, {
                        t: '05:00',
                        state: 1
                    }]
                }, {
                    date: '2018-05-08',
                    time: [{
                        t: '01:00',
                        state: 3
                    }, {
                        t: '02:00',
                        state: 3
                    }, {
                        t: '03:00',
                        state: 3
                    }, {
                        t: '04:00',
                        state: 3
                    }, {
                        t: '05:00',
                        state: 3
                    }]
                }, {
                    date: '2018-05-09',
                    time: [{
                        t: '01:00',
                        state: 2
                    }, {
                        t: '02:00',
                        state: 2
                    }, {
                        t: '03:00',
                        state: 2
                    }, {
                        t: '04:00',
                        state: 2
                    }, {
                        t: '05:00',
                        state: 3
                    }]
                }, {
                    date: '2018-05-10',
                    time: [{
                        t: '01:00',
                        state: 2
                    }, {
                        t: '02:00',
                        state: 2
                    }, {
                        t: '03:00',
                        state: 2
                    }, {
                        t: '04:00',
                        state: 2
                    }, {
                        t: '05:00',
                        state: 1
                    }]
                }
            ];
            var $td = null,
                $temp = null;

            // 根据传入类型、日历td对象和后台数据添加日历提示样式
            // type为日历类型：1为以日模式，时间为单位，2是以年、月模式
            // $td为当前模式下的日历表格单元格对象
            // data为后台查询回来的数据
            function toJudgeState(type, $td, data) {
                var time1 = null;
                var time2 = null;
                var timer = null;
                var tempState = 0;
                var state = 0;
                if(type === 1) {
                    for(var i = 0; i < data.length; i++) {
                        time1 = data[i].date;
                        for(var j = 0; j < $td.length; j++) {
                            $temp = $td.eq(j);
                            timer = $temp.attr('data-date').split(' ');
                            if(time1 == timer[0]) {
                                if (data[i].hasOwnProperty('time') && data[i].time) {
                                    for(var k = 0; k < data[i].time.length; k++) {
                                        time2 = data[i].time[k].t;
                                        if (time2 == timer[1]) {
                                            if (data[i].time[k].state == 1) {
                                                $temp.addClass('state-normal');
                                            }else if (data[i].time[k].state == 2) {
                                                $temp.addClass('state-unormal');
                                            }
                                        }
                                    } 
                                }
                            }
                        }
                    }
                }else if (type === 2) {
                    for (var i = 0; i < data.length; i++) {
                        time1 = data[i].date;
                        for (var j = 0; j < $td.length; j++) {
                            $temp = $td.eq(j);
                            timer = $temp.attr('data-date');
                            if (time1 == timer) {
                                if (data[i].hasOwnProperty('time') && data[i].time) {
                                    tempState = 0;
                                    for (var k = 0; k < data[i].time.length; k++) {
                                        tempState = data[i].time[k].state;
                                        if (tempState == 3) {
                                            state = 3;
                                            break;
                                        } else if (tempState == 2) {
                                            state = 2;
                                        } else if (state == 0 && tempState == 1) {
                                            state = 1;
                                        }
                                    }
                                }else {
                                    state = 3;
                                }
                                if (state == 1) {
                                    $temp.addClass('state-normal');
                                } else if (state == 2) {
                                    $temp.addClass('state-unormal');
                                }
                            }
                        }
                    }
                }
            }

            if ($el.hasClass('zr-kalend-hours')) {
                $td = $el.find('td');
                toJudgeState(1, $td, data);
            } else if ($el.hasClass('zr-kalend-day')) {
                $td = $el.find('td');
                toJudgeState(2, $td, data);
            }else {
                $td = $el.find('.zr-kalend-min-month-d td');
                toJudgeState(2, $td, data);
            }
        }
    };

    $(function () {
        handler.init();
    });
}(jQuery, window));