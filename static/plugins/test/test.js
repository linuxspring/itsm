//IWF.plugins['test'] = function () {
    
//    var me = this;
//    var nav = { icon: 'icon-calendar', title: '日程安排', a: 'me', b: 'test', index: 3 };

//    function init() {
//        me.execCommand('addnav', nav);
//    }
        
//    me.addListener('init', init);

//    function flash(tab) {
//        $('<div>asdfsdf</div>').appendTo(tab.c);
//    }

//    me.addListener('do', function (key, args) {
//        if (args.a == nav.a && args.b == nav.b) {
//            var tab = me.execCommand('addtab', nav);
//            flash(tab);
//            me.execCommand('show', args);
//        }
//    });
//};