IWF.plugins['alarm'] = function () {

    var me = this;
    var nav = { icon: 'icon-calendar', title: '用户列表', a: 'usermgr', b: 'usermgr', index: 3,canClose:true };

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

        $.getJSON(me.rootPath + 'user/view.data', ps, function (js, scope) {
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
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">用户名称</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">登录账号</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">添加时间</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">手机号码</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">是否管理员</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">公司</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">电子邮箱</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">是否在职</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">最近登录时间</span></th>').appendTo(tr);
        var th=$('<th class="zr-tr-cell zr-th th-1"><span class="t">操作</span></th>').appendTo(tr);

        for (var i=0;i<data.length;i++) {
            var trTemp=$('<tr class="zr-tr"></tr>').appendTo(t);
            var item = data[i];
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.id+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.chname+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.username+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.date_joined+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.phone+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.is_superuser+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.company+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.email+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.is_staff+'</span></td>').appendTo(trTemp);
            var th=$('<td class="zr-tr-cell zr-td"><span class="t">'+item.last_login+'</span></td>').appendTo(trTemp);
            var tdDel=$('<td class="zr-tr-cell zr-td"><div class="zr-table-handle"><a href="javascript:;" class="t">删除</a></div></td>').appendTo(trTemp);
            tdDel.bind('click',item,function (e) {
                DelTask(e.data);
            });
        }
    }
    function AddTask() {
        var ps={
            chname:'中软用户',
            phone:'18588499892',
            username:'gzcss_'+utils.guid(),
            is_superuser:1,
            is_staff:1,
            email:'381263761@qq.com',
            company:'广州中软信息技术有限公司'
        }

        $.getJSON(me.rootPath + 'user/save.data', {json:utils.fromJSON(ps)}, function (json, scope) {
            if(json.success){
                layer.msg("添加成功");
                LoadTask('', 1, 5);
            }
        });
    }

    function DelTask(row) {
        if(row.id==1){
            layer.msg('管理员不能删除');
            return;
        }
        $.getJSON(me.rootPath + 'user/del.data', {id:row.id}, function (json, scope) {
            if(json.success){
                layer.msg('删除成功');
                LoadTask('', me.pageIndex, 5);
            }
        });
    }

    function LoadInspectList(el) {
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
            var temp = $('<div class="row no-padding no-margin"></div>').appendTo(tab.c);
            //temp.load('page/knowledge/add-knowledge.html',function (e) {

            //});
            var tEl = $('<table class="layui-hide" id="demo" lay-filter="test"></table>').appendTo(temp)
            LoadInspectList(temp);
        }
        me.execCommand('show', {a: args.a});

    }


    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab',{a:args.a}) || me.execCommand('addtab', nav);
            flash(args,tab);
        }
    });
};
