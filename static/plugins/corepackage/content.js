﻿IWF.plugins['content'] = function () {

    var me = this,
        ACTCSS = "cur";
    	tab =$('.zr-layout-label-wrap').find('ul.zr-layout-label-list'),//$('.sidebar'),
        content = $('.zr-layout-cont').find('.zr-layout-iframe-wrap'); //$('#maincontent');
        //content.css('backgroud-color','transparent');
        var tabTpl = '<li><div class="zr-layout-label"><button class="t" data-toggle="tab" href="#{a}_{b}">{name}</button></div></li>';
        var colTpl = '<button class="c">&nbsp;</button>';
        //var colTpl = '<button type="button" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        var contentTpl = '<div class="zr-layout-iframe-mode" id="{a}_{b}"></div>';

    items = [];

    function itemClick(sender) {
        me.execCommand('go', { a: sender.data.a, b: sender.data.b });
    };

    function itemClose(sender) {
        var temp = sender.data;
        utils.removeItem(items, temp);
        temp.t.remove();
        temp.c.remove();
        me.execCommand('close', temp);
        temp = null;
    };

    function newTab(a,b,params, name,canClose) {
	//content.empty();
        var item = { a: a, b: b, params: params, name: name };
        var c = $(utils.replaceTpl(contentTpl, item)).appendTo(content);
        c.css('overflow-y','auto');//c.css('overflow-y','auto');
        c.height(me.height()-87);
        item.c = c;
        var t = $(utils.replaceTpl(tabTpl, item)).appendTo(tab);
        t.children().children('button:eq(0)').bind('click', item, itemClick);
        item.t = t;

        if (canClose) {
            var cols = $(colTpl).appendTo(t.children('div'));
            t.find('span').css('float','left');
            cols.css('float','right');
            cols.bind('click', item, itemClose);
        }

        items.push(item);
        return item;
    }

    function getTab(a, b) {
        for (var i = 0; i < items.length; i++) {
            if (a == items[i].a) {
                if (!b || b == items[i].b) return items[i];
            }
        }
        return null;
    }

    //添加Tab
    me.commands['addtab'] = {
        execCommand: function (key, args) {
            //content.empty();
            var temp =null;// getTab(args.a, args.b); 单文档的形式，让它全部重新去生成新的就即可，不需要从缓存中查找
            if(temp == null){
                var name = args.title || args.a + "_" + args.b;
                temp = newTab(args.a, args.b, args.params, name, args.canClose);
            }
            return temp;
        }
    };

    //取得tab页
    me.commands['gettab'] = {
        execCommand: function (key, args) {
            return getTab(args.a, args.b);
        }
    };

    //显现当前页
    me.commands['show'] = {
        execCommand: function (key, args) {
            var temp = getTab(args.a, args.b);
            //if(temp)temp.c.show();// 上下句互换
            if(temp){
                temp.c.siblings().hide();
                temp.t.children().children('button:eq(0)').click();
                temp.c.show();
            }// 上下句互换
             //if (temp && !temp.t.hasClass(ACTCSS)){
             //    temp.t.children().children('span').show();//.tab('show');
             //    temp.c.show();//.tab('show');
             //}
        }
    };
    
  //显现当前页
    me.commands['closetab'] = {
        execCommand: function (key, args) {
            itemClose({data:args});
        }
    };
};