IWF.plugins['index'] = function () {

    var me = this;
    me.ruleTree = [];
    var nav = {icon: 'icon-globe', color: 'icon-blue', title: '巡检视图', a: 'home', b: 'index'};

    var navLeft = [
        {icon: 'icon-leaf', color: 'icon-red', title: '我的测试', a: 'llx', b: 'test'}
        , {icon: 'icon-comments', color: 'icon-blue', title: '我的测试', a: 'llx', b: 'test1'}
        , {icon: 'icon-globe', color: 'icon-yellow', title: '我的测试', a: 'llx', b: 'test2'}
        , {icon: 'icon-group', color: 'icon-green', title: '我的测试', a: 'llx', b: 'test3'}
        , {icon: 'icon-coffee', color: 'icon-blue', title: '我的测试', a: 'llx', b: 'test4'}
        , {icon: 'icon-heart', color: 'icon-red', title: '我的测试', a: 'llx', b: 'test5'}
    ];

    var leftRoot, rightRoot, barRoot;

    me.addListener('init', function () {
        me.execCommand('addtab', nav);
    });

    me.addListener('initurl', function () {
        me.execCommand('go', nav);
    });
    function init() {
        nav.key = nav.a;
        if (me.execCommand('rules', nav)) {
            me.execCommand('addnav', nav);
        }
    }

    me.addListener('init', init);

    function itemClick(data) {
        var ps = {json: utils.fromJSON(data), userid: me.options.userInfo.id}
        $.post('/ServiceFramework/rule/savemodule.data', ps, function (js, scope) {
            me.execCommand('go', data);
        });

    }


    function LoadLeftList() {
        var ps = {key: '', userid: me.options.userInfo.id}
        $.getJSON('/ServiceFramework/rule/mlist.data', ps, function (js, scope) {
            leftRoot.listNav({
                data: js, click: function (data) {
                    itemClick(data);
                }
            });
        });
    }

    function ImageClick(it) {
        var This = it.data;
        var ps = {id: This.id}
        $.getJSON('/ServiceFramework/wc/save.data', ps, function (js, scope) {
            if (js.success) {

            } else {
                $.fn.alert({success: true, msg: js.msg});
            }
        });
    }

    function ShowUserImage(el, ds, config) {
        el.empty();
        var row = $('<ul class="row list-group"></ul>').appendTo(el);
        row.css('padding-top', 8);
        for (var i = 0; i < ds.length; i++) {
            var it = ds[i];
            var cls = true ? 'ok' : 'user';
            var tpl = '<li style="padding:5px;" class="list-group-item item-check"><div><i style="font-size:22px;color:#5CB85C;" class="glyphicon glyphicon-' + cls + '"></i></div></li>';
            it.Name = it.Name ? it.Name : it.cnname;

            var itemImg = $(utils.replaceTpl(tpl, it)).appendTo(row);
            itemImg.bind('click', it, function (e) {
                $(this).find('i').toggleClass('glyphicon-user');
                $(this).find('i').toggleClass('glyphicon-ok');
                var it = e.data;
                it.ID = it.id ? it.id : it.ID;
                ImageClick(it);
            });
        }
    }

    function ShowWorkday(el, ds, config) {
        el.empty();
        var row = $('<ul class="row list-group"></ul>').appendTo(el);
        row.css('padding-top', 8);
        for (var i = 0; i < ds.length; i++) {
            var it = ds[i];
            var tpl = '<li style="padding:5px;" class="list-group-item item-check"><div style="padding-top:3px;padding-bottom:3px;color:#5CB85C;">{Name}</div></li>';
            it.Name = it.Name ? it.Name : it.cnname;
            var itemImg = $(utils.replaceTpl(tpl, it)).appendTo(row);

        }
    }

    function LoadList(keyword, index, size) {
        var ps = {
            keyword: '' || keyword,
            isDeleted: 0,
            type: 0,
            fromdate: '',
            todate: '',
            index: index,
            size: size
        };
        $.getJSON('/ServiceFramework/wc/listwc2.data', ps, function (json, scope) {
            var data = json.data;

        });
    }

    function InitUI(el) {
        me.checkUIam = $('<div class="col-md-7">a</div>').appendTo(el);
        me.checkUIpm = $('<div class="col-md-7">a</div>').appendTo(el);
        me.infoUi = $('<div class="col-md-5">b</div>').appendTo(el);
        var ds = [{id: 1, cnname: '周一上午', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期二', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期三', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期四', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期五', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期六', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '星期日', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}]

        ShowUserImage(me.checkUIam, ds);
        ShowUserImage(me.checkUIpm, ds);
    }

    function Createworkday(el) {
        $('<div class="row"><h3 style="text-align:center;">签到足迹</h3></div>').appendTo(el);
        me.dayHead = $('<div class="row" style="border-top:solid 1px #DDD;padding:5px;"></div>').appendTo(el);
        $('<div class="col-md-3" style="text-align:center;">星期</div>').appendTo(me.dayHead).css('padding-left', 0).css('padding-right', 0);
        $('<div class="col-md-3" style="text-align:center;">上午</div>').appendTo(me.dayHead).css('padding-left', 0).css('padding-right', 0);
        $('<div class="col-md-3" style="text-align:center;">下午</div>').appendTo(me.dayHead).css('padding-left', 0).css('padding-right', 0);

        me.workday = $('<div class="row"></div>').appendTo(el);
        me.all = $('<div class="col-md-3"></div>').appendTo(me.workday);
        me.am = $('<div class="col-md-3"></div>').appendTo(me.workday);
        me.pm = $('<div class="col-md-3"></div>').appendTo(me.workday);
        var ds = [{id: 1, cnname: '周一', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周二', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周三', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周四', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周五', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周六', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}
            , {id: 1, cnname: '周日', cometime: '2015-7-02 10:12:12', gotime: '2015-7-02 18:12:12'}]

        //LoadList('',1,25);
        ShowWorkday(me.all, ds);
        ShowUserImage(me.am, ds);
        ShowUserImage(me.pm, ds);
    }

    function renderBlockInfo(el) {
        var tpl='<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">'
            +'<div class="databox radius-bordered databox-shadowed databox-graded">'
            +'<div class="databox-left bg-themesecondary">'
            +'<div class="databox-piechart">'
            +'<div data-toggle="easypiechart" class="easyPieChart" data-barcolor="#fff" data-linecap="butt" data-percent="50" data-animate="500" data-linewidth="3" data-size="47" data-trackcolor="rgba(255,255,255,0.1)"><span class="white font-90">50%</span></div>'
            +'</div>'
            +'</div>'
            +'<div class="databox-right">'
            +'<span class="databox-number themesecondary">14</span>'
            +'<div class="databox-text darkgray">NEW TASKS</div>'
            +'<div class="databox-stat themesecondary radius-bordered">'
            +'<i class="stat-icon icon-lg fa fa-tasks"></i>'
            +'</div>'
            +'</div>'
            +'</div>'
            +'</div>'
        $(utils.replaceTpl(tpl, {})).appendTo(el);
        renderBlockAlarmInfo(el);
        renderBlockAlarm2(el);
    }

    function renderBlockAlarmInfo(el) {
        var tpl='<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">'
            +'<div class="databox radius-bordered databox-shadowed databox-graded">'
            +'<div class="databox-left bg-themethirdcolor">'
            +'<div class="databox-piechart">'
            +'<div data-toggle="easypiechart" class="easyPieChart" data-barcolor="#fff" data-linecap="butt" data-percent="15" data-animate="500" data-linewidth="3" data-size="47" data-trackcolor="rgba(255,255,255,0.2)"><span class="white font-90">15%</span></div>'
            +'</div>'
            +'</div>'
            +'<div class="databox-right">'
            +'<span class="databox-number themethirdcolor">1</span>'
            +'<div class="databox-text darkgray">NEW MESSAGE</div>'
            +'<div class="databox-stat themethirdcolor radius-bordered">'
            +'<i class="stat-icon  icon-lg fa fa-envelope-o"></i>'
            +'</div>'
            +'</div>'
            +'</div>'
            +'</div>';
        $(utils.replaceTpl(tpl, {})).appendTo(el);
    }
    
    function renderBlockAlarm2(el) {
        var tpl='<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">'
            +'<div class="databox radius-bordered databox-shadowed databox-graded">'
            +'<div class="databox-left bg-themeprimary">'
            +'<div class="databox-piechart">'
            +'<div id="users-pie" data-toggle="easypiechart" class="easyPieChart" data-barcolor="#fff" data-linecap="butt" data-percent="76" data-animate="500" data-linewidth="3" data-size="47" data-trackcolor="rgba(255,255,255,0.1)"><span class="white font-90">76%</span></div>'
            +'</div>'
            +'</div>'
            +'<div class="databox-right">'
            +'<span class="databox-number themeprimary">98</span>'
            +'<div class="databox-text darkgray">NEW USERS</div>'
            +'<div class="databox-state bg-themeprimary">'
            +'<i class="fa fa-check"></i>'
            +'</div>'
            +'</div>'
            +'</div>'
            +'</div>';
        $(utils.replaceTpl(tpl, {})).appendTo(el);
    }

    function LoadTask(keyword, index, size) {
        var ps = {
            keyword: keyword || '',
            isDeleted: 0,
            type: 0,
            fromdate: '',
            todate: '',
            userid: 1,//me.options.userInfo.id,
            index: index,
            size: size
        };
        var pageConfig = {
            total: 0,
            pageSize: 20,
            pageCount: 0,
            pageIndex: 1,
            pageclick: function (pageIndex, pageSize) {
                LoadTask('', pageIndex, pageSize);
            }
        };

        $.getJSON(me.rootPath + 'task/view.data', ps, function (js, scope) {
            //var js={data:[],pageSize:20,pageCount:123,pageIndex:1,pageCount:23,total:1243}
            //me.flowTool.PageBar(pageConfig, js);
            //    config.data=js.data;
            //    me.litchiGrid=me.gridEl.iwfGrid(config);
            RenderTable(js.rows);

            me.pageCount=1;
            if(parseInt(js.total)%parseInt(js.pageSize)==0){
                me.pageCount=parseInt(js.total)/parseInt(js.pageSize);
            }else{
                me.pageCount=parseInt(js.total)/parseInt(js.pageSize)+1;
                me.pageCount=parseInt(me.pageCount);
            }
            me.iwfPage.empty();
            $('<div>总共'+js.total+'条记录，当前页为第'+me.pageIndex+'页，每页5条，一共'+me.pageCount+'页</div>').appendTo(me.iwfPage);
            //me.dataGrid = me.ztreeEl.iTreeTable({setting: setting, data: js.rows, config: config});
            //me.dataGrid.expandAll(true);
        });
    }

    function RenderTable(data) {
        me.iwfGrid.empty();
        var t=$('<table class="zr-table-cont zr-table-main"></table>').appendTo(me.iwfGrid);
        var tr=$('<tr class="zr-tr"></tr>').appendTo(t);

        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">编号</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">巡检名称</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">巡检状态</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">开始时间</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">结束时间</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">巡检类型</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">系统类型</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">表达式</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">描述</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">创建时间</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">操作</span></th>').appendTo(tr);

        for (var i=0;i<data.length;i++) {
            var trTemp=$('<tr class="zr-tr"></tr>').appendTo(t);
            var item = data[i];
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.id+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.plan_name+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.plan_status+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.begin_time+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.end_time+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.plan_type+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.sys_type+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.cron_expression+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.plan_desc+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.create_time+'</span></td>').appendTo(trTemp);
            var tdDel=$('<td class="zr-tr-cell zr-td"><div class="zr-table-handle"><a href="javascript:;" class="t">删除</a><a href="javascript:;" style="margin-left: 15px;" class="t">修改</a></div></td>').appendTo(trTemp);
            tdDel.find('a:eq(0)').bind('click',item,function (e) {
                DelTask(e.data);
            });
            tdDel.find('a:eq(1)').bind('click',item,function (e) {
                AddTask(e.data);
            });
        }
    }
    function AddTask(row) {
        me.mainEl.empty();
        me.mainEl.load('/static/page/inspect/add-inspect.html',function (e1) {
            if (row) {
                var uname = me.mainEl.find('#name').val(row.plan_name);
                var company = me.mainEl.find('#core').val(row.cron_expression);
                var tel = me.mainEl.find('#ip').val(row.ip);
                var remark = me.mainEl.find('#remark').val(row.plan_desc);
            }
            me.mainEl.find('#inspectCommit').bind('click', function (e) {
                var uname = me.mainEl.find('#name').val();
                var company = me.mainEl.find('#core').val();
                var ip = me.mainEl.find('#ip').val();
                var remark = me.mainEl.find('#remark').val();
                if(!uname){
                    layer.msg('名称必需填写');
                    return;
                }
                var ps = {
                    plan_name: uname||'批量测试2台Linux',
                    plan_status: 0,
                    begin_time: '2018-10-24 17:17:25',
                    end_time: '2018-11-24 17:17:25',
                    plan_type: 1,
                    ip: ip,id:-1,
                    sys_type: 1,
                    cron_expression: company||'03 14 11 06 07 ?',
                    plan_desc: remark||'安全巡检'
                }
                if(row){
                    ps.id=row.id;
                }
                $.getJSON(me.rootPath + 'task/save.data', {json: utils.fromJSON(ps)}, function (json, scope) {
                    if (json.success) {
                        layer.msg("添加成功");
                        //LoadTask('', 1, 5);
                        LoadInspectList(me.mainEl);
                    }
                });
            });

            me.mainEl.find('#inspectReset').bind('click',function (e) {
                var uname=me.mainEl.find('#name').val('');
                var company=me.mainEl.find('#core').val('');
                var tel=me.mainEl.find('#ip').val('');
                var remark=me.mainEl.find('#remark').val('');
            });
            me.mainEl.find('#inspectBack').bind('click',function (e) {
                LoadInspectList(me.mainEl);
            });
        });
    }

    function DelTask(row) {

        $.getJSON(me.rootPath + 'task/del.data', {id:row.id}, function (json, scope) {
            if(json.success){
                layer.msg('删除成功');
                LoadTask('', me.pageIndex, 5);
            }
        });
    }

    function LoadInspectList(el) {
        el.empty();
        var pEl=$('<P style="margin: 20px;"></P>').appendTo(el);
        me.iwfGrid=$('<div class="zr-table-wrap" style="padding:0px 20px;"></div>').appendTo(el);
        me.iwfPage=$('<div class="zr-table-wrap" style="margin: 20px;"></div>').appendTo(el);
        var btnGroupEl=$('<div class="layui-btn-group"></div>').appendTo(pEl);
        var bEl1=$('<button class="layui-btn layui-btn-normal">增加</button>').appendTo(btnGroupEl);
        //var bEl3=$('<button class="layui-btn layui-btn-normal">删除</button>').appendTo(btnGroupEl);
        var bEl2=$('<button class="layui-btn layui-btn-normal">首页</button>').appendTo(btnGroupEl);
        var bElPrev=$('<button class="layui-btn layui-btn-normal">上一页</button>').appendTo(btnGroupEl);
        var bElNext=$('<button class="layui-btn layui-btn-normal">下一页</button>').appendTo(btnGroupEl);

        me.pageIndex=1;
        LoadTask('', 1, 5);
        bEl1.bind('click',function (e) {
            AddTask();
        });

        bEl2.bind('click',function (e) {
            LoadTask('', 1, 5);
        });
        bElPrev.bind('click',function (e) {
            if(me.pageIndex<=1){
                me.pageIndex=1;
                layer.msg("已经是第一页");
            }else{
                me.pageIndex-=1;
            }
            LoadTask('', me.pageIndex, 5);
        });
        bElNext.bind('click',function (e) {
            if((me.pageIndex+1)>me.pageCount){
                me.pageIndex=me.pageCount;
                layer.msg("已经是最后一页");
            }else{
                me.pageIndex+=1;
            }
            LoadTask('', me.pageIndex, 5);
        });
    }

    function flash(args, tab) {
        if (tab.c.children().length == 0) {
            me.mainEl=$('<div class="" style="margin-left:0;margin-right:0px;"></div>').appendTo(tab.c);
            LoadInspectList(me.mainEl);
            // body.bind('click', function (e) {
            //     var data = {icon: 'icon-sitemap', color: 'icon-red', 'a': 'linkroad', 'b': 'linkroad'};
            //     var me = window.framework;
            //     me.execCommand('go', data);
            // });
            //var temp = $('<div class="row" style="margin-left:0;margin-right:0px;"></div>').appendTo(body);
            //renderBlockInfo(temp);
        }
        me.execCommand('show', {a: args.a});
        //me.fireEvent(args.b, tab.c);
    }

    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            flash(args, tab);
        }
    });
};