(function ($) {

    //表单设计器
    $.fn.FormDesigner = function (options) { 
	this.empty();
	var defaults = {
		plugins: {},
	            commands: {},
	            allListeners: {},
	            /*添加监听*/
	            addListener: function (types, listener) {
	                types = utils.trim(types).split(' ');
	                for (var i = 0, ti; ti = types[i++];) {
	                    if (!me.allListeners[ti]) me.allListeners[ti] = [];
	                    me.allListeners[ti].push(listener);
	                }
	            },
	            /*触发事件*/
	            fireEvent: function () {
	                var types = arguments[0];
	                types = utils.trim(types).split(' ');
	                for (var i = 0, ti; ti = types[i++];) {
	                    var listeners = me.allListeners[ti];
	                    if (listeners) {
	                        for (var j = 0, l; l = listeners[j++];) {
	                            l.apply(me, arguments);
	                        }
	                    }
	                }
	            },
	            /*执行命令*/
	            execCommand: function (cmdName) {
	                var key = cmdName.toLowerCase();
	                var result, cmd = me.commands[key];
	                if (!cmd) return null;

	                me.fireEvent('beforeexeccommand', key);
	                arguments[0] = key;
	                result = cmd.apply(me, arguments);
	                me.fireEvent('afterexeccommand', key);
	                return result;
	            },
	            tools: [],
	            code: {}
		};
		
	    
	
	var me = $.extend(defaults, options);
	//me.main = $('<div class="col-md-8">sss</div>').appendTo(this);
	//me.prop=$('<div class="col-md-2">ddd</div>').appendTo(this);
	
	me.rootPanel = $(this);
	me.rootPanel.css('padding-left',0).css('padding-right',0);
	me.main = $('<div class="col-md-9" style="height:520px;"></div>').appendTo(me.rootPanel);
        me.viewPanel = $('<div class="col-md-3" style="position:relative;height:100%;overflow:hidden;"></div>').appendTo(me.rootPanel);
        me.viewPanel.css('padding-left',0).css('padding-right',0);
        me.toolPanel = $('<div  style="width:100%;"></div>').appendTo(me.main);
        me.statePanel = $('<div  style="width:100%;border-bottom:1px solid #ccc;float:left;"></div>').appendTo(me.main);
        me.contentPanel = $('<div style="width:100%;height:100%;overflow:hidden;"></div>').appendTo(me.main);
        
        me.codeView = $('<textarea class="form-control" style="height:100%;"></textarea>').appendTo(me.contentPanel).hide();
               
        me.frame = $('<iframe width="100%" height="100%" src="javascript:void(function(){document.open();'
                + 'document.write(\'<!DOCTYPE html><html><head><link href=ref/dist/css/bootstrap.min.css rel=stylesheet type=text/css>'
                +'<link href=resources/formdesign.css rel=stylesheet type=text/css>'
                +'<link rel=stylesheet type=text/css href=ref/dist/css/bootstrap-treeview.min.css >'
                +'<script src=ref/dist/js/jquery.min.js></script>'
                + '<style type=text/css>body{margin:0px;min-height:200px;font-family:微软雅黑;font-size:14px;}</style>'
                + '</head><body>&nbsp;</body></html>\');document.close();}())" frameborder="0"></iframe>').appendTo(me.contentPanel);
        
        function activateEvent(e) {
            if (e.button == 2) return;
            if (e.type == 'keydown' && (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)) return;
            if (e.keyCode == 46) {
                me.execCommand('remove');
                return;
            }
            me.fireEvent('oncursor');
        }
        //document 加载所有资源后才执行load函数，IE没有问题
        me.frame.bind('load',function (e) {

            me.document = me.frame[0].contentWindow.document;
            me.body = me.document.body;
            me.body.contentEditable = true;
            me.body.designMode='On';
            // IE FF chrom 不一样
            me.getSelection = function () {
                if (!me._tempSelection){
                    //me._tempSelection = me.document.getSelection();
                    if (me.document.getSelection) {
                	me._tempSelection = me.document.getSelection();
                    }else if (window.getSelection) {
                	//me._tempSelection = window.getSelection();
                    }
                    else if (me.document.selection) {
                        // IE
                	me._tempSelection = me.document.selection.createRange();
                    }
                }
                return me._tempSelection;
            };

            me.getRange = function () {
                return me.getSelection().getRangeAt(0);
            };

            me.frame.bind('activate', function () { me.fireEvent('activate'); });
            utils.on(me.document, ['mouseup', 'keydown'], activateEvent);

            for (var pi in me.plugins) {
                me.plugins[pi].call(me);
            };
            
            me.toolbar = me.toolPanel.ToolBar({ data: utils.sort(me.tools) });

            me.fireEvent('ready');
        
        });
        
	 /*常用命令*/
        me.plugins['commoncommands'] = function () {
            
            function getContextualFragment(r, args) {
                if (r.createContextualFragment) return r.createContextualFragment(args);
                else {
                    var frag = me.document.createDocumentFragment(),
                        div = me.document.createElement("div");
                    frag.appendChild(div);
                    div.outerHTML = args;
                    return frag;
                }
            }

            /*内置插入命令*/
            me.commands['insert'] = function (key, args) {
                var range = me.getRange();
                var fragment = getContextualFragment(range, args);
                //var fragment =  range.createContextualFragment(args);
                range.insertNode(fragment);
            };

            me.commands['append'] = function (key, args) {
                if (me.selectNode) $(me.selectNode).append(args);
            };

            me.commands['remove'] = function (key, args) {
                me.getRange().deleteContents();
            };

            /*向上移动选中单元*/
            me.commands['moveup'] = function (key, arg) {
                var sel = me.getSelection();
                var range = me.getRange();
                var index = range.startOffset - 1;
                if (index >= 0) {
                    var node = range.extractContents();
                    range.setStart(range.startContainer, index);
                    range.setEnd(range.startContainer, index);
                    range.insertNode(node);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            };

            /*向下移动选中单元*/
            me.commands['movedown'] = function (key, arg) {
                var sel = me.getSelection();
                var range = me.getRange();
                if (range.endOffset < range.endContainer.childElementCount) {
                    var index = range.startOffset + 1;
                    var node = range.extractContents();
                    range.setStart(range.startContainer, index);
                    range.setEnd(range.startContainer, index);
                    range.insertNode(node);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            };

            me.commands['clear'] = function () {
                var range = me.getRange();
                var text = utils.trim2(range.toString());
                var fragment = range.createContextualFragment(text);
                range.deleteContents();
                range.insertNode(fragment);
            };

            me.commands['link'] = function (key, arg) {
                var range = me.getRange();
                var text = utils.trim2(range.toString());
                if (text) {
                    text = '<a href="' + arg + '">' + text + '</a>';
                    var fragment = range.createContextualFragment(text);
                    range.deleteContents();
                    range.insertNode(fragment);
                }
            };

            me.commands['format'] = function (key, arg) {
                var range = me.getRange();
                var txt = range.toString();
                if (txt && arg) {
                    var temp = me.document.createElement(arg);
                    temp.innerText = txt;
                    range.deleteContents()
                    range.insertNode(temp);
                    range.selectNode(temp);
                }
            }
            
            me.commands['selectnode'] = function (key, node) {
                var sel = me.getSelection();
                var range = sel.getRangeAt(0);
                range.selectNode(node);

                sel.removeAllRanges();
                sel.addRange(range);

                if (node != me.selectNode) {
                    me.selectNode = node;
                    me.execCommand('statebar');
                    me.fireEvent('selectchange');
                }
            };
            
            function setCodeToView() {
                $(me.body).html(utils.trim3(me.code.html));
                me.codeView.val(me.code.html + '\n' + getJSCode());
            }

            function getJSCode() {
                if (!me.hideJS) {
                    var js = '<script>\nfunction ' + (me.formKey || 'formRoot') + "(me){\n";
                    if (me.code.myjs) js += '\n' + me.code.myjs + '\n\n';
                    js += me.execCommand('getautojs');
                    js += '\n};\n</script>';
                    return js;
                } else {
                    return "";
                }
            }
            
            me.commands['load'] = function (key, args) {
                me.code = {};
                var reg = /([\s\S]+)<script>([\s\S]+)<\/script>/i;
                var jsReg = /{([\s\S]+)(me\.vm [\s\S]+)}/i;
                if (temp = args.match(reg)) {
                    me.code.html = utils.trim(temp[1]);
                    if (jsTemp = temp[2].match(jsReg)) {
                        me.code.myjs = utils.trim(jsTemp[1]);
                        me.code.autojs = utils.trim(jsTemp[2]);
                    }
                } else {
                    me.code.html = utils.trim(args);
                }

                setCodeToView();
                me.fireEvent('befterload');
            };
            

            /*内置视图切换命令*/
            me.commands['view'] = function (key, arg) {
                me.fireEvent('befterviewchange', me.body, me.codeView);
                if (!arg) {
                    me.execCommand('load', me.codeView.val());
                    me.frame.show();
                    me.codeView.hide();
                    me.fireEvent('viewchange', me.body, me.codeView);
                } else {
                    me.code.html = utils.getDomHtml(me.body);
                    setCodeToView();
                    me.codeView.show();
                    me.frame.hide();
                    me.fireEvent('viewchange', me.body, me.codeView);
                }
            };
            
            /*取得表单源码*/
            me.commands['getcode'] = function () {
                if (me.frame.is(":hidden")) return me.codeView.val();
                else {
                    me.code.html = utils.getDomHtml(me.body);
                    return me.code.html + '\n' + getJSCode();
                }
            };
            
            me.addListener('oncursor', function (e) {
                var sel = me.getSelection();
                if (!sel.focusNode) return;
                //这里返回的数据不准确，也就是取到的控件不匹配，是影响表单设计器不好用的主要原因
                var tnode = (sel.focusNode.childNodes.length == 0||sel.focusOffset==0) ? sel.focusNode :
                    sel.focusNode.childNodes[sel.focusOffset - 1];
                //
                if (tnode != me.selectNode) {
                    me.selectNode = tnode;
                    me.execCommand('statebar');
                    me.fireEvent('selectchange');
                }
            });
            
            
            
        }
        
        me.plugins['statebar'] = function () {
            var nodeList = [];

            function onStatebarClick() {
                me.execCommand('selectnode', this.tag);
            };

            function setNodeList(node) {
                var name = node.nodeName.toLowerCase();
                if (name != 'body') {
                    nodeList.push({ text: name, tag: node, type: 'link', click: onStatebarClick });
                    setNodeList(node.parentNode);
                } else {
                    nodeList.push({ text: '元素路径:', type: 'text' });
                }
            }

            me.commands['statebar'] = function () {
                nodeList.splice(0, nodeList.length);
                if (me.selectNode) {
                    setNodeList(me.selectNode);
                }
                me.statePanel.ToolBar({ data: nodeList.reverse() }).css('margin-top',0);
            };
        };
	
	me.plugins['defaultplugins']=function(e){
	    
	    var tpls = {
	                input: '<input class="form-control" type="text" style="width:95%;">',
	                button: '<input class="btn btn-default" type="button" value="确定" style="width:98%;">',
	                checkbox: '<input  type="checkbox">',
	                radio: '<input  type="radio">',
	                select: '  <select class="form-control" name="select" style="width:95%;"></select>',
	                textarea: '<textarea class="form-control" style="width:95%;height:50px;"></textarea>'
	            };
	    
	    function insertControl(e) {
                var t = tpls[e.data.key];
                if (!t) t = tpls.input;
                me.execCommand('insert', t);
            }

            function formatClick(e) {
                me.execCommand('format', e.data.key);
            }

            function insertLink() {
                var url = prompt("输入链接地址:", "javascript:void(0);");
                if (url) me.execCommand('link', url);
            }

            function changeView(e) {
        	this.select=!e.data.select;
        	for(var i=0,it;it=me.tools[i++];){
        	    if(it.icon=='retweet'){
        		it.select=this.select;
        		break;
        	    }
        	}
                me.execCommand('view', this.select);
            }

            function clearHTML() {
                me.execCommand('clear');
            };
	    
            function changeDataSource(e) {
                me.fireEvent('resourceTpl',$(this));
            };
            
            function inputOutputTpl(e) {
        	var el=$(this);el.key=e.data.key;
                me.fireEvent('inputOutputTpl',el);
            };
            
            function insetNullUnit(e) {
        	var el=$(this);el.key=e.data.key;
                me.fireEvent('insetNullUnit',el);
            };
            
            function moveSelectItem(e) {
        	var el=$(this);el.key=e.data.key;
                me.fireEvent('moveSelectItem',el);
            };
            
            function saveForm(e) {
        	var el=$(this);el.key=e.data.key;
                me.fireEvent('saveForm',el);
            };
            
	    me.tools.push({text:'', title: '切换视图', icon: 'retweet',select: false, index: 61, click:changeView });
	    me.tools.push({text:'', title: '预览', icon: 'eye-open', index: 61, click: changeView });
	    me.tools.push({ type: 'split', index: 1 });
	    me.tools.push({text:'', title: '加粗', key: 'strong', icon: 'bold', click: formatClick, index: 23 });
	    me.tools.push({text:'', title: '下划线', key: 'u', icon: 'underline', click: formatClick, index: 24 });
	    me.tools.push({text:'', title: '链接', icon: 'link', click: insertLink, index: 25 });
	    me.tools.push({text:'', title: '格式清除', icon: 'remove-circle', click: clearHTML, index: 26 });
            me.tools.push({ type: 'split', index: 31 });
            me.tools.push({text:'', title: '单行文本框', key: 'input', icon: 'minus', click: insertControl, index: 32 });
            me.tools.push({text:'', title: '多行文本框', key: 'textarea', icon: 'list', click: insertControl, index: 33 });
            me.tools.push({text:'', title: '多选框', key: 'checkbox', icon: 'ok-sign', click: insertControl, index: 34 });
            me.tools.push({text:'', title: '单选框', key: 'radio', icon: 'ok-circle', click: insertControl, index: 35 });
            me.tools.push({text:'', title: '下拉框', key: 'select', icon: 'sort-by-alphabet', click: insertControl, index: 36 });
            me.tools.push({ text:'',title: '按钮', key: 'button', icon: 'stop', click: insertControl, index: 37 });
	    me.tools.push({ type: 'split', index: 21 });
	    me.tools.push({text:'', title: '数据源管理', icon: 'sort', index: 61, click: changeDataSource });
	    me.tools.push({text:'', title: '插入列表', key: 'list', icon: 'list', index: 62, click: inputOutputTpl });
	    me.tools.push({text:'', title: '插入输入模块', key: 'input', icon: 'edit', index: 62, click: inputOutputTpl });
	    me.tools.push({text:'', title: '插入只读模块', key: 'output', icon: 'hand-right', index: 63, click: inputOutputTpl });
	    me.tools.push({text:'', title: '插入空单元', icon: 'hand-right', index: 64, click: insetNullUnit });
	    me.tools.push({text:'', title: '向前移动选中单元', key: 'up', icon: 'arrow-up', index: 64, click: moveSelectItem });
	    me.tools.push({text:'', title: '向后移动选中单元', key: 'down', icon: 'arrow-down', index: 64, click: moveSelectItem });
	    //me.tools.push({ text: '设为输入框', icon: '22,12', index: 65 });
	    me.tools.push({text:'', title: '保存', icon: 'save', index: 68, click: saveForm });

	}
	
	//开始渲染
	me.render=function(){
	    
	}
	return me;
    }

})(jQuery);