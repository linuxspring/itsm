IWF.plugins['llxtest'] = function () {

   var me = this;
   var nav = { icon: 'icon-calendar', title: '我的测试', a: 'llx', b: 'test', index: 3, canClose: true };

   var navLeft = [
       { icon: 'icon-leaf', color: 'icon-red', title: '我的测试', a: 'llx', b: 'test' }
       , { icon: 'icon-comments', color: 'icon-blue', title: '我的测试', a: 'llx', b: 'test1' }
       , { icon: 'icon-globe', color: 'icon-yellow', title: '我的测试', a: 'llx', b: 'test2' }
       , { icon: 'icon-group', color: 'icon-green', title: '我的测试', a: 'llx', b: 'test3' }
       , { icon: 'icon-coffee', color: 'icon-blue', title: '我的测试', a: 'llx', b: 'test4' }
       , { icon: 'icon-heart', color: 'icon-red', title: '我的测试', a: 'llx', b: 'test5' }
   ];

   var leftRoot, rightRoot, barRoot;

   var scTpl = '<ul class="nav  nav-pills nav-stacked"></ul>',
       scItemTpl = '<li key="{b}"><a href="javascript:void(0);"><i class="{icon} {color}"></i>{title}</a></li>';

   var groupButton = '<div style="padding:15px;text-align:center;"><div class="btn-group">'
       + '<button type="button" class="btn btn-default">业务新建</button>'
       + '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'
       +'<span class="caret"></span>'
       +'<span class="sr-only">Toggle Dropdown</span>'
       +'</button>'
       +'<ul class="dropdown-menu" role="menu">'
       +'<li><a href="#">新建业务</a></li>'
       +'<li><a href="#">发文</a></li>'
       +'</ul>'
       + '</div></div>';



   me.addListener('init', function () { me.execCommand('addnav', nav); });

   function leftItemClick(sender) {
       me.execCommand('go', sender.data);
   }

   function addLeftButton() {
       $(groupButton).appendTo(leftRoot);
       barRoot = $(scTpl).appendTo(leftRoot);
       for (var i = 0, item; item = navLeft[i++];) {
           $(utils.replaceTpl(scItemTpl, item)).appendTo(barRoot).bind('click', item, leftItemClick);
       }
   }

   function flash(args, tab) {
       if (tab.c.children().length == 0) {
           var temp = $('<div class="row"></div>').appendTo(tab.c);
           leftRoot = $('<div class="col-md-2 mainside"></div>').appendTo(temp);
           rightRoot = $('<div class="col-md-10 col-md-offset-2" style="height:800px;">asdf</div>').appendTo(temp);
           addLeftButton();
       }
       me.execCommand('show', { a: args.a });
       utils.each(barRoot.children(), function (i,item) {
           if (item.getAttribute('key') == args.b) {
               var t = $(item).addClass('active');
               t.siblings().removeClass('active');
           }
       });
   }

   me.addListener('do', function (key, args) {
       if (args.a == nav.a) {
           var tab = me.execCommand('gettab',{a:args.a}) || me.execCommand('addtab', nav);
           flash(args,tab);
       }
   });
};