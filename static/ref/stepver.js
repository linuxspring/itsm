(function ($) {
	$.fn.stepper=function(options){
		var defaults = {
            click: function (sender) {
                alert(9);
            }
        };

        var me = this;
        me.opts = $.extend(defaults, options);
        
        me.render=function(data){
        	var pel=$('<ol class="flowstep"></ol>').appendTo(me);
        	var tpl='<div class="{statusCls}">'
				+'<div class="step-name">{cnname}</div>'
            	+'<div class="step-no">{text}</div>'
				+'<div class="step-time">'
				+'<div class="step-time-wraper">{createtime}</div>'
				+'</div></div>';
                        
        	
        	pel.width(me.width());
        	var len=data.length;
        	for(var i=0;i<len;i++){
        		var stepEl=$('<li></li>').appendTo(pel);
        		stepEl.width(me.width()/(data.length));
        		if(i==0){
        			stepEl.addClass('step-first');
        		}else if((i+1)==len){
        			stepEl.addClass('step-last');
        		}
        		
        		var item=data[i];
        		
        		if(item.status==0){
        			item.text='';
        			item.statusCls="step-done";
        		}else if(item.status==1){
        			item.statusCls="step-cur";
        		}else{
        			item.createtime='';
        			item.statusCls="step-will";
        		}
        		var tplEl=$(utils.replaceTpl(tpl,item)).appendTo(stepEl);
        		
        	}
        }
		me.render(me.opts.data);
		
		return me;
	}
})(jQuery);