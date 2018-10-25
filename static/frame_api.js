IWF = window.IWF = {};
IWF.plugins = {};
IWF.ui = {};
IWF.version = "1.0.0.1";
IWF.shortName = "办公商城";
IWF.extName = "业务审批系统";
IWF.name = "云管理平台";
IWF.company = "广州中软信息技术有限公司";
IWF.sid = null;

(function () {
    var reg = new RegExp("(^|&)sid=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        IWF.sid = unescape(r[2]);;
        //document.write('<script type="text/javascript" src="login.data?action=getalljs&sid=' + IWF.sid + '"></script>');
    }

    var paths = [
        'core/utils.js',
        'core/eventbase.js',
        'core/framework.js',
        //'core/ui.js',
        'core/component.js',
        'ref/baseform.js',
        'plugins/corepackage/actions.js',
        'plugins/corepackage/navigate.js',
        'plugins/corepackage/banner.js',
        'plugins/corepackage/hashmanage.js',
        'plugins/corepackage/content.js',
        'plugins/corepackage/eventframe.js',
        'plugins/corepackage/messagebox.js',
        'plugins/corepackage/filemanage.js',
        'plugins/corepackage/rules.js',
        'plugins/corepackage/index.js',
        'plugins/viewpackage/linkroad.js',
        'plugins/viewpackage/inspect.js',
        'plugins/viewpackage/usermgr.js',
        'plugins/test/llxtest.js'
    ];

    for (var i = 0, pi; pi = paths[i++];) {
        document.write('<script type="text/javascript" src="/static/' + pi + '"></script>');
    }
})();
