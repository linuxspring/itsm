IWF.plugins['linkroad'] = function () {

    var me = this;
    var nav = { icon: 'icon-calendar', title: '链路性能视图', a: 'linkroad', b: 'linkroad', index: 3,canClose:true };

    function getCombinArr(arr) {
        var allArr=[];var sArr=[];
        for (var i = 0; i < arr.length; i++) {
            var it = arr[i];
            if(i%2==0) {
                allArr.push(it);
            }else{
                sArr.push(it);
            }
        }
        return {a:allArr,b:sArr};
    }
    function renderCisiList(el,o) {
        for (var i = 0; i < o.a.length; i++) {
            var it = o.a[i];
            var itb = o.b[i];
            var groupEl=$('<li></li>').appendTo(el);

                if(it.isPast==0) {
                    var upEl=$('<div class="ciscoUp"></div>').appendTo(groupEl);
                }else{
                    var upEl=$('<div class="ciscoUpDisable"></div>').appendTo(groupEl);
                }

                if(itb.isPast==0) {
                    var downEl=$('<div class="ciscoDown"></div>').appendTo(groupEl);
                }else{
                    var downEl=$('<div class="ciscoDownDisable"></div>').appendTo(groupEl);
                }


            

        }
    }

    var config={
        columns:[
            { title : '进货日期', text : '{PurchDate}', width : '120px' ,align:'center'},
            { title : '进货日期', text : '{PurchDate}', width : '120px' ,align:'center'},
            { title : '进货日期', text : '{PurchDate}', width : '120px' ,align:'center'},
            { title : '进货日期', text : '{PurchDate}', width : '120px' ,align:'center'},
            { title : '进货日期', text : '{PurchDate}', width : '120px' ,align:'center'},
        ]
    }

    function loadTable(el) {
        $.fn.iTable = function (options) {

            var tableTpl='<table class="table table-hover"></table>';
            this.empty();

            var me = $(utils.replaceTpl(tpl, options)).appendTo(this);
            var defaults = {
                click: function (sender) {
                    alert(9);
                }
            };
            var trTpl='<tr></tr>';
            var tdTpl='<td></td>';

            function renderHead(el) {
                var headTpl='<thead class="bordered-darkorange"></thead>';
                var headEl=$(headTpl).appendTo(el);
                for (var i = 0; i < me.opts.columns.length; i++) {
                    var col = me.opts.columns[i];
                    var tdEl = $(utils.replaceTpl(tdTpl, col)).appendTo(headEl);
                }

            }
            
            function renderData(arr, el) {
                for (var i = 0; i < arr.length; i++) {
                    var trEl=$(trTpl).appendTo(el);
                    var row = arr[i];
                    for (var i = 0; i < me.opts.columns.length; i++) {
                        var col = me.opts.columns[i];
                        var tdEl = $(utils.replaceTpl(tdTpl, col)).appendTo(trEl);
                    }
                    var tdEl = $(utils.replaceTpl(tdTpl, row)).appendTo(trEl);
                    
                }
            }

            renderHead(me);
            renderData(me.otps.data, me);

            me.opts = $.extend(defaults, options);
            me.body=me.find('.widget-buttons');
            if(me.opts.toolbar)$(utils.replaceTpl(btnTpl, options)).appendTo(me.body);
            return me;
        }

    }

    function loadTree(el){
        var DataSourceTree = function (options) {
            this._data = options.data;
            this._delay = options.delay;
        };

        DataSourceTree.prototype = {

            data: function (options, callback) {
                var self = this;

                setTimeout(function () {
                    var data = $.extend(true, [], self._data);

                    callback({data: data});

                }, this._delay)
            }
        };
        var treeDataSource3 = new DataSourceTree({
            data: [
                {
                    name: 'Resources <div class="tree-actions"></div>',
                    type: 'folder',
                    'icon-class': 'palegreen',
                    additionalParameters: {id: 'F11'}
                },
                {
                    name: 'Projects <div class="tree-actions"></div>',
                    type: 'folder',
                    'icon-class': 'blueberry',
                    additionalParameters: {id: 'F12'}
                },
                {name: 'Nike Promo 2013', type: 'item', additionalParameters: {id: 'I11'}},
                {name: 'IPO Reports', type: 'item', additionalParameters: {id: 'I12'}}
            ],
            delay: 400
        });

        el.TreeView({data: treeDataSource3});



    }



    function drawimage(ctx,canvasImage) {
        //保存画布当前状态
        ctx.save();
        //开始一个新的绘制路径
        ctx.beginPath();
        //设置线条颜色为蓝色
        ctx.strokeStyle = "red";
        //设置路径起点坐标
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 180);
        ctx.lineTo(230, 191);
        ctx.lineTo(256, 100);
        //先关闭绘制路径。注意，此时将会使用直线连接当前端点和起始端点。
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(canvasImage, 0, 0,256,191);
        ctx.restore();
    }

    function drawGroupPlane(ctx,x,y,w,h,v) {
        //保存画布当前状态
        ctx.save();
        //开始一个新的绘制路径
        ctx.beginPath();
        //设置线条颜色为蓝色

        //设置路径起点坐标
        ctx.moveTo(x-w/2+v, y-h/2);
        ctx.lineTo(x+w/2, y-h/2);
        ctx.lineTo(x+w/2-v, y+h/2);
        ctx.lineTo(x-w/2, y+h/2);

        ctx.lineWidth = 1;
        //先关闭绘制路径。注意，此时将会使用直线连接当前端点和起始端点。
        ctx.closePath();
        ctx.strokeStyle = "red";
        //ctx.clip();
        ctx.stroke();
        //ctx.drawImage(canvasImage, 0, 0,256,191);
        //ctx.restore();
    }

    function drawGroupPlane(ctx,x,y,w,h,v,c) {
        //保存画布当前状态
        ctx.save();
        //开始一个新的绘制路径
        ctx.beginPath();
        //设置线条颜色为蓝色

        //设置路径起点坐标
        ctx.moveTo(x-w/2+v, y-h/2);
        ctx.lineTo(x+w/2, y-h/2);
        ctx.lineTo(x+w/2-v, y+h/2);
        ctx.lineTo(x-w/2, y+h/2);



        ctx.lineWidth = 1;
        //先关闭绘制路径。注意，此时将会使用直线连接当前端点和起始端点。
        ctx.closePath();
        ctx.strokeStyle = "red";
        //ctx.clip();
        ctx.stroke();
        //ctx.drawImage(canvasImage, 0, 0,256,191);
        //ctx.restore();
    }

    function randC(){
        return 'rgba('+(~~(Math.random()*255))+","+(~~(Math.random()*255))+","+(~~(Math.random()*255))+",0.5"+")";
    }

    function getCubeData(a,b,c) {
        var x = a||100,
            y = b||100,
            z = c||100;
        var points = [
            [0,0],
            [x,0],
            [x,-y],
            [0,-y],
            [z*Math.cos(45*Math.PI/180),-z*Math.sin(45*Math.PI/180)],
            [z*Math.cos(45*Math.PI/180),-y-z*Math.sin(45*Math.PI/180)],
            [x+z*Math.cos(45*Math.PI/180),-z*Math.sin(45*Math.PI/180)],
            [x+z*Math.cos(45*Math.PI/180),-y-z*Math.sin(45*Math.PI/180)]
        ];
        var faces = [
            [points[4],points[5],points[7],points[6]], //后
            [points[0],points[4],points[6],points[1]], //下
            [points[0],points[3],points[5],points[4]], //左
            [points[1],points[2],points[7],points[6]], //右
            [points[2],points[3],points[5],points[7]], //上
            [points[0],points[3],points[2],points[1]], //前
        ]
        return faces;
    }
    function getCubeData2(x,y,w,h,v,c) {
        // var x = a||100,
        //     y = b||100,
        //     z = c||100;
        var z=100;
        var points = [
            [0,0],
            [x,0],
            [x,-y],
            [0,-y],
            [z*Math.cos(45*Math.PI/180),-z*Math.sin(45*Math.PI/180)],
            [z*Math.cos(45*Math.PI/180),-y-z*Math.sin(45*Math.PI/180)],
            [x+z*Math.cos(45*Math.PI/180),-z*Math.sin(45*Math.PI/180)],
            [x+z*Math.cos(45*Math.PI/180),-y-z*Math.sin(45*Math.PI/180)]
        ];

        points[5]=[x-w/2+v, y-h/2];
        points[7]=[x+w/2, y-h/2];
        points[2]=[x+w/2-v, y+h/2];
        points[3]=[x-w/2, y+h/2];

        points[4]=[x-w/2+v, y-h/2+c];
        points[6]=[x+w/2, y-h/2+c];
        points[1]=[x+w/2-v, y+h/2+c];
        points[0]=[x-w/2, y+h/2+c];

        var faces = [
            [points[4],points[5],points[7],points[6]], //后
            [points[0],points[4],points[6],points[1]], //下
            [points[0],points[3],points[5],points[4]], //左
            [points[1],points[2],points[7],points[6]], //右
            [points[2],points[3],points[5],points[7]], //上
            [points[0],points[3],points[2],points[1]], //前
        ]
        return faces;
    }

    function drawCube(ctx,fill,x,y,w,h,v,z){
        ctx.save();
        //ctx.translate(x,y);
        //var faces=getCubeData2(500,5,200);
        //var faces=getCubeData2(400,200,630,160,160,5);
        var faces=getCubeData2(x,y,w,h,v,z);
        for(var i=0,len=faces.length;i<len;i++){
            var p = faces[i];
            ctx.beginPath();
            for(var j=0,l=p.length;j<l;j++){
                if(j==0){
                    ctx.moveTo(p[j][0],p[j][1]);
                }else{
                    ctx.lineTo(p[j][0],p[j][1]);
                }
            }
            ctx.closePath();
            if(fill){
                ctx.fillStyle = randC();
                ctx.fill();
            }else{
                ctx.stroke();
            }
        }
        ctx.restore();
    }
    var layer=1,isMove=false;
    function addEvent(el) {
        var offX,offY;
        var ctx = el[0].getContext("2d");
        el.bind('click',function (e) {

        }).bind('dblclick',function (e) {

        }).bind('mousedown',function (e) {
            isMove=true;
            offX=e.clientX,offY=e.clientY;
        }).bind('mousemove',function (e) {
            offX=e.clientX-offX,offY=e.clientY-offY;
            moveToPoint(el,ctx,el[0].width,el[0].height,offX,offY);

        }).bind('mouseup',function (e) {
            isMove=false;
            //offX=e.clientX,offY=e.clientY;
        }).bind('mousewheel',function (e) {
            var delta = event.wheelDelta;
            if (delta > 0) {
                //鼠标向上滚，上图标显示，下图标隐藏
                layer=layer*1.2;
                el[0].width=el[0].width*2;
                el[0].height=el[0].height*2;
                init2d(el,true);
            } else {
                //鼠标向下滚，下图标显示，上图标隐藏
                layer=layer*0.8;
                el[0].width=el[0].width*0.5;
                el[0].height=el[0].height*0.5;

                init2d(el,true);
            }
        });
    }

    function moveToPoint(el,ctx,w,h,offsetX,offsetY) {
        if(!isMove)return;
        ctx.translate(w/2+offsetX,h/2+offsetY);
        ctx.restore();
        init2d(el,true);
    }

    function clear(ctx,width,height,pan) {
        //var ctx = el[0].getContext("2d");
        //ctx.height=el[0].height;
        ctx.scale(1, 1);
        ctx.clearRect(0,0,width,height);
        //if(pan){
            ctx.translate(width/2,height/2);
        //}

    }


    function init2d(el,pan) {

        var ctx = el[0].getContext("2d");
        ctx.translate(el[0].width/2,el[0].height/2);
        //clear(ctx,el[0].width,el[0].height,pan);
        //ctx.scale(layer, layer);
        // var canvasImage=new Image();
        // canvasImage.src = "resources/canvas/test.png";
        // canvasImage.onload = function() {
        //     drawimage(ctx,this);
        // };
        drawGroupPlane(ctx,400,400,630,160,160,10);
        //drawGroupPlane(ctx,400,210,630,160,160);
        //drawCube(ctx,400,400,true);
        drawCube(ctx,true,-300,15,630,160,160,5);
        //ctx.scale(1, 0.5);
        drawCube(ctx,true,520,15,630,160,160,5);

    }


    function init(el) {
        // renderer
        // var renderer = new THREE.WebGLRenderer({
        //     canvas: el[0]
        // });
        // renderer.setClearColor(0xf2f2f2); // black
        //
        // // scene
        // var scene = new THREE.Scene();
        //
        // // camera
        // var camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000);
        // camera.position.set(0, 0, 5);
        // scene.add(camera);
        //
        // // a cube in the scene
        // var cube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
        //     new THREE.MeshBasicMaterial({
        //         color: 0xff0000
        //     })
        // );
        // scene.add(cube);
        //
        // // render
        // renderer.render(scene, camera);
        //import { SpotLight } from 'three';

        var scene = new THREE.Scene();

        var camera = new THREE.PerspectiveCamera(75, me.width()/me.height(), 0.1, 1000);
        camera.position.set(10,10,10);
        camera.lookAt(scene.position);
        var renderer = new THREE.WebGLRenderer({
            canvas: el[0]
        });
        renderer.setClearColor(0xf2f2f2);
        renderer.setSize(me.width(), me.height());
        //renderer.appendTo(el);
        //el[0].appendChild(renderer.domElement);




        var geometry = new THREE.BoxGeometry(2,2,2);

        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(4,0,0);
        scene.add(cube);
        var light = new THREE.SpotLight(0xfff888);
        light.position.z = 5;
        light.position.x = 5;
        light.position.y = 5;

        scene.add(light);

        var light2 = new THREE.AmbientLight( 0x404040 ); // soft white light
        scene.add( light2 );
        //var cubeCamera = new THREE.CubeCamera( 1, 100000, 128 );
        //scene.add( cubeCamera );
        var pnlGeo = new THREE.PlaneGeometry(4, 4, 4);
        var pnl=new THREE.Mesh(pnlGeo, new THREE.MeshBasicMaterial({color: 'red'}));
        pnl.position.set(0,4,0);
        scene.add(pnl);
        //camera.position.z = 5;

        var arrowHelperY = new THREE.ArrowHelper( new THREE.Vector3(0,1,0), new THREE.Vector3( 0, 0, 0 ), 10, 'green' );
        //scene.add( arrowHelperY );
        var arrowHelperX = new THREE.ArrowHelper( new THREE.Vector3(1,0,0), new THREE.Vector3( 0, 0, 0 ), 10, 0xff0000 );
        scene.add( arrowHelperX );
        var axes = new THREE.AxisHelper(10);
        scene.add(axes);
        var grid1=new THREE.GridHelper();
        var grid3=new THREE.GridHelper(3,3,0xf0f0f0,0xffffff);
        scene.add(grid3);
        function render() {
            requestAnimationFrame(render);
            //cube.rotation.x += 0.1;
            //cube.rotation.y += 0.1;
            //requestAnimationFrame( render );
            renderer.render(scene, camera);
        }

        render();
    }

    function updateFrame (gl) {
        gl.viewport ( 0, 0, me.width(), me.height() );
        gl.clearColor(0.4, 0.4, 0.7, 1);
        gl.clear ( gl.COLOR_BUFFER_BIT );
        setTimeout(
            function(){updateFrame(gl)},
            20);
    }



    function flash(args, tab) {
        if (tab.c.children().length == 0) {
            var temp = $('<div class="row no-padding no-margin"></div>').appendTo(tab.c);
            //temp.load('page/knowledge/add-knowledge.html',function (e) {
                
            //});
            var webglcanvas = $('<canvas style="width:100%;height:500px;"></canvas>');
            webglcanvas[0].width=1314;
            webglcanvas[0].height=550;
            webglcanvas.appendTo(temp);
            //init(webglcanvas);
            addEvent(webglcanvas);

            init2d(webglcanvas);
            //var gl = webglcanvas[0].getContext("experimental-webgl");
            setTimeout(
                function(){
                    //updateFrame(gl);
                },
                20);
        }
        me.execCommand('show', { a: args.a });

    }

    me.addListener('do', function (key, args) {
        if (args.a == nav.a) {
            var tab = me.execCommand('gettab',{a:args.a}) || me.execCommand('addtab', nav);
            flash(args,tab);
        }
    });
};
