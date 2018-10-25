IWF.plugins['inspect'] = function () {

    var me = this;
    var nav = {icon: 'icon-calendar', title: '巡检视图', a: 'inspect', b: 'inspect', index: 3, canClose: true};

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
            tdDelfind('a:eq(0)').bind('click',item,function (e) {
                DelTask(e.data);
            });
            tdDelfind('a:eq(1)').bind('click',item,function (e) {
                AddTask(e.data);
            });
        }
    }
    function AddTask() {
        me.mainEl.empty();
        me.mainEl.load('/static/page/user/add-inspect.html',function (e1) {
            if (row) {
                var uname = me.mainEl.find('#username').val(row.chname);
                var company = me.mainEl.find('#company').val(row.company);
                var tel = me.mainEl.find('#tel').val(row.phone);
                var remark = me.mainEl.find('#qq').val();
            }
            me.mainEl.find('#userCommit').bind('click', function (e) {
                var uname = me.mainEl.find('#username').val();
                var company = me.mainEl.find('#company').val();
                var tel = me.mainEl.find('#tel').val();
                var remark = me.mainEl.find('#qq').val();
                var ps = {
                    plan_name: '批量巡检2台Linux',
                    plan_status: 0,
                    begin_time: '2018-10-24 17:17:25',
                    end_time: '2018-11-24 17:17:25',
                    plan_type: 1,
                    sys_type: 1,
                    cron_expression: '03 14 11 06 07 ?',
                    plan_desc: '安全巡检'
                }

                $.getJSON(me.rootPath + 'task/save.data', {json: utils.fromJSON(ps)}, function (json, scope) {
                    if (json.success) {
                        layer.msg("添加成功");
                        LoadTask('', 1, 5);
                    }
                });
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
            me.mainEl = $('<div class="row no-padding no-margin"></div>').appendTo(tab.c);
            //temp.load('page/knowledge/add-knowledge.html',function (e) {

            //});
            LoadInspectList(me.mainEl);
        }
        me.execCommand('show', {a: args.a});

    }

    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab', {a: args.a}) || me.execCommand('addtab', nav);
            flash(args, tab);
        }
    });
};
