function baseform() {
    var me = this;

    /*将两个参数集成一个参数*/
    me.caseUser = {};
    if (me.caseInfo) for (key in me.caseInfo) { me.caseUser[key] = me.caseInfo[key] };
    if (me.userInfo) for (key in me.userInfo) { me.caseUser[key] = me.userInfo[key] };

    /*增加一个随机ID*/
    me.toParams = function (arg) {
        arg.sid = me.sid;
        return utils.params(arg);
    };

    /*字符串转换成json*/
    me.toJSON = function (str) {
        return utils.toJSON(str);
    };

    /*json转换成字符串*/
    me.fromJSON = function (object) {
        return utils.fromJSON(object);
    };

    me.jsonToArray = function (json) {
        var arr = [];
        if (json) {
            for (key in json) {
                arr.push(json[key]);
            }
        }
        return arr;
    }

    me.formateDate = function (dateStr) {
        if (!dateStr) return "";
        var date = new Date(Date.parse(dateStr.replace(/-/g, "/")));
        return utils.formatDate(date, 'yyyy-MM-dd');
    }

    //初始化表单工作流绑定权限
    me.initWorkFlowFormRule  =function() {
        var ruleUI = $.find('[rule]');
        var offId = "0" + me.caseInfo.flowid, onId = me.caseInfo.flowid;
        function checkRule(rule) {
            var rs = rule.split(';');
            //默认为隐藏
            var v = false;
            for (var i = 0; i < rs.length; i++) {
                if (rs[i].indexOf(offId) == 0) {
                    //如果有隐藏属性，则默认为显示
                    v = true;
                    if (rs[i].indexOf(me.caseInfo.actid) > 0) return false;
                } else if (rs[i].indexOf(onId) == 0 && rs[i].indexOf(me.caseInfo.actid) > 0) {
                    return true;
                }
            }
            return v;
        }
        $.each(ruleUI, function (index, ui) {
            if (!checkRule(ui.getAttribute('rule'))) $(ui).hide();
        });
    }


    //重新格式化查询语句，替换掉变量
    me.formatQuery = function(queryInfo) {
        var re = /@([^@]+)@/ig;
        var v = [];
        for (var i = 0; i < queryInfo.length; i++) {
            var qi = queryInfo[i];
            var temp = {};
            for (key in qi) temp[key] = qi[key];
            if (qi.Condition) {
                temp.Condition = [];
                var ss = queryInfo[i].Condition[0].split(',');
                for (var j = 0; j < ss.length; j++) {
                    temp.Condition.push(ss[j].replace(re, function (sender, key) {
                        var keys = key.split('\.');
                        return (keys.length > 1) ? me.getValue(keys[0], keys[1]) : me.getValue('', key);
                    }));
                }
            }
            v.push(temp);
        }
        return v;
    }

    //给特定表特定字段签名,或者签某个值，政府项目（例如广西环科院项目)常用
    me.onSignature = function(cname, v) {
        if (me.vm[cname]) me.vm[cname](v || userInfo.CnName);
    }

    //更新表单数据
    me.updateForm = function (data, name) {
        if (name && me.vm[name]) {
            (typeof me.vm[name] == "function") ? me.vm[name](data) : me.vm[name] = data;
        }
        for (key in data) {
            var tname = (name) ? key + '_' + name : key;
            if (me.vm[tname]) {
                if (typeof me.vm[tname] == "function") me.vm[tname](data[key]);
                else me.vm[tname] = data[key];
            }
        }
    };

    me.replaceTpl = function (v) {
        var tv = v.replace(/\{now\}/g, utils.now());
        tv = utils.replaceTpl(tv, me.caseUser,me);
        return tv;
    }

    //取得表单、当前业务、当前登录用户数据
    me.getValue = function(name, key) {
        var tkey = key + "_" + name;
        if (me.vm[tkey]) {
            return (typeof me.vm[tkey] == "function") ? me.vm[tkey]() : me.vm[tkey];
        }
        if (me.caseInfo[key]) return me.caseInfo[key];
        if (me.userInfo[key]) return me.userInfo[key];
        return "";
    }

    me.del = function (tbName, condition, callback) {
        var params = { TableName: tbName, Condition: (condition instanceof Array) ? condition : [condition] };
        $.getJSON("/ServiceFramework/form/delete.data", { content: me.fromJSON(me.toParams(params)) }, function (json) {
            callback(json);
        });
    }

    me.save = function (saveInfo, callback, symbol) {
        var params = { content: me.fromJSON((saveInfo instanceof Array) ? saveInfo : [saveInfo]), sid:me.sid };
        if (symbol) params.symbol = symbol;
        $.post("/ServiceFramework/form/save.data", me.toParams(params), function (json) {
            var result = me.toJSON(json)
            //alert(result.msg);
            callback(result);
        });
    }

    me.query = function (queryInfo, callback) {
        var params = { content: me.fromJSON((queryInfo instanceof Array) ? queryInfo : [queryInfo]) };
        $.get("/ServiceFramework/form/query.data", me.toParams(params), function (json) {
            callback(me.toJSON(json));
        });
    }

    /*行点击时更新当前业务表单*/
    me.onChildRowClick = function (sender, data) {
        var name = sender.bindName;
        var tempData = {};
        for (key in data) {
            tempData[key + '_' + name] = data[key];
        }
        me.updateForm(tempData);
    }

    /*保存行数据*/
    me.onChildRowSave = function (sender, data) {
        var mySaveInfo = me.saveInfo()[0];
        var aid = me.getValue(mySaveInfo.TableName, "autoid");
        if (aid) {
            mySaveInfo.Condition = ['autoid=' + aid];
            me.save(mySaveInfo, function (json) {
                alert(json.msg);
                if (json.success && me.saveReady) me.saveReady(json);
                else if (json.success && me.onquery) me.onquery();
            })
        }
    };

    /*删除行数据*/
    me.onChildRowDelete = function (sender, data) {
        if (confirm("你决定删除当前数据吗？")) {
            var tbName = sender.bindName,
                condition = "autoid=" + data.autoid;
            me.del(tbName, condition, function (json) {
                if (json.success && me.onquery) me.onquery();
                alert(json.msg);
            });
        }
    }
}


IWF.FormAttachment = function () {

    var This = this;
    var container;

    this.init = function (cID, opts) {
        container = $(cID);
        if (container) {
            This.buildFilelist(opts);
            if (opts.editable) This.buildFilebar(opts);
        }
    }

    this.buildFilelist = function (opts) {
        var filelist = $('<div id="filelist"></div>').appendTo(container);
        var caseid = opts.caseid;
        var editable = opts.editable;
        if (caseid) {
            $.getJSON("file.data?action=getfiles", { sid: IWF.sid, caseid: caseid }, function (data) {
                if (data && data.length) {
                    $(data).each(function (i, item) {
                        var fileItem = $('<div class="fileItem"><a href="../' + item.url + '">' + item.name + '</div>').appendTo($('#filelist'));

                        if (editable) {
                            var delBtn = $('<span><i class="icon-remove color-red"></i></span>').appendTo(fileItem);
                            delBtn.click(function () {
                                var btn = $(this);
                                if (confirm('是否删除' + item.name + '？')) {
                                    This.deleteFile(caseid, item.name, function () {
                                        btn.parent().remove();
                                    });
                                }
                            });
                        }

                        if (This.isImg(item.name)) {
                            $('<div class="fileImg"><img src="../' + item.url + '"/></div>').appendTo($(fileItem));
                        }
                    });
                } else {
                    if (!editable) container.html('无');
                }
            });
        }
    }

    var imgExt = '.jpg.jpeg.png.gif.bmp';
    this.isImg = function (filename) {
        if (filename && filename.indexOf('.') > -1) {
            var dot = filename.lastIndexOf('.');
            if (dot > -1) {
                var suffix = filename.substring(dot, filename.length);
                if (imgExt.indexOf(suffix) > -1) return true;
            }
            return false;
        }
    }

    this.deleteFile = function (caseid, filename, callback) {

        $.getJSON("file.data?action=deletefile", { sid: IWF.sid, caseid: caseid, filename: filename }, function (data) {
            if (data.success) {                
                if (callback) callback();
                alert('已删除：' + filename);
            }
        });
    }

    var canUpload = true;
    uploadToggle = function (on) {
        var btn = $('#uploadfiles');
        if (!on) {
            btn.removeClass('btn-primary');
            btn.addClass('btn-default');
            canUpload = false;
        } else {
            btn.removeClass('btn-default');
            btn.addClass('btn-primary');
            canUpload = true;
        }
    }

    this.buildFilebar = function (opts) {

        var filebar = $('<div id="filebar"></div>').appendTo(container);
        $('<button id="pickfiles" type="button" class="btn btn-success btn-sm"><i class="icon-plus"></i> 选择文件</button>').appendTo(filebar);
        $('<button id="uploadfiles" type="button" class="btn btn-default btn-sm" style="margin-left:10px;"><i class="icon-upload-alt"></i> 上传</button>').appendTo(filebar);

        var uploader = new plupload.Uploader({
            runtimes: 'html5,html4',
            browse_button: 'pickfiles',
            url: 'file.data?action=upload&sid=' + IWF.sid + "&caseid=" + opts.caseid,
            filters: {
                max_file_size: opts.filesize ? opts.filesize : '10mb',
                mime_types: [
                    { title: "Accept files", extensions: opts.extensions ? opts.extensions : "*" }
                ],
                prevent_duplicates: true
            },

            init: {
                PostInit: function () {
                    //$('#filelist').html('');
                    $('#uploadfiles').click(function () {
                        if (canUpload) {
                            uploadToggle(false);
                            uploader.start();
                        }
                        return false;
                    });
                },

                FilesAdded: function (up, files) {

                    uploadToggle(true);

                    plupload.each(files, function (file) {
                        $('<div class="fileItem" id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <span class="color-green"><em>准备上传 </em></span></div>').appendTo($('#filelist'));

                        var delBtn = $('#' + file.id + ' span');
                        $('<i class="icon-remove color-red"></i>').appendTo(delBtn);
                        delBtn.click(function () {
                            var btn = $(this);
                            if (file.percent == 100) {
                                if (confirm('是否删除' + file.name + '？')) {
                                    This.deleteFile(opts.caseid, file.name, function () {
                                            uploader.removeFile(file);
                                            btn.parent().remove();
                                    });
                                }
                            } else {
                                uploader.removeFile(file);
                                btn.parent().remove();
                            }
                        });
                    });
                },

                UploadProgress: function (up, file) {
                    $('#' + file.id + ' em').html(file.percent + '% ');
                    if (file.percent == 100) {
                        var fileItem = $('#' + file.id);
                        if (fileItem.find('.fileImg').length == 0) {
                            $('<div class="fileImg"><img src="../upfiles/' + opts.caseid + '/' + file.name + '"/></div>').appendTo(fileItem);
                        }
                    }
                },

                Error: function (up, err) {
                    alert(err.message);
                }
            }
        });

        uploader.init();
    }

}