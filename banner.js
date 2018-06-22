(function($) {
    'use strict';
        var ModuleName = 'banner';
    
        var Module = function ( ele, options ) {
            this.ele = ele;
            this.$ele = $(ele);
            this.option = options;
            var btn_class = options.button.class;
            this.$btn = $('<span class = ' + btn_class + '></span>');
            this.modeAry = ['opened', 'opening', 'closing', 'closed']; // 0: opend 1:opening 2: closeing 3:closed
            this.mode = 3;
            this.timer = -1;
            this.startCallBack = function () {
                this.timer = setInterval(this.whenTransition, 20);
            }
            this.endCallback = function () {
                if (this.timer > -1) {
                    clearInterval(this.timer);
                    this.timer = -1;
                }
            }
            this.whenTransition = function () {
                console.log('whenTransition');
            }
        };
    
        Module.DEFAULT = {
            openAtStart : true,
            autoToggle: false,
            button: {
                closeText: '收合', 
                openText: '展開', 
                class: 'btn' 
            },
            class: {
                closed: 'closed',
                closing: 'closing',
                opening: 'opening',
                opened: 'opened'
            },
            transition: true,
            whenTransition: function() {
                console.log('whenTransition');
            }
        };

        Module.prototype.init = function(){
            this.$ele.append(this.$btn);
            if(!!this.option.openAtStart){
                this.$btn.text(this.option.button.closeText);
                this.$ele.addClass(this.option.class.opened);
                this.mode = 0;

            }else{
                this.$btn.text(this.option.button.openText); 
                this.$ele.addClass(this.option.class.closed);
                this.mode = 3;
            }

        }
  
        Module.prototype.addTrans = function() {        
            if (!!this.option.transition) {                
                this.$ele.addClass('transition');
                this.startCallBack();
            }
        };

        Module.prototype.autoTrigger = function (isToOpen) {
            if (!this.option.autoToggle) return;
            
            function checkType (param) {
                return typeof param;
            }
            function isLimitedType (param) {
                return typeof param === 'number' || typeof param === 'boolean';
            }

            if (!!this.option.autoToggle && isLimitedType(this.option.autoToggle)) {
                var toggleTime = checkType(this.option.autoToggle) === 'boolean' ? 3000 : this.option.autoToggle;
                
                if (isToOpen) {
                    setTimeout(this.open.bind(this), toggleTime);
                } else {
                    setTimeout(this.close.bind(this), toggleTime);
                }
            }
        }

        Module.prototype.toggle = function () {
            if ( this.mode === 0 ) {
                this.close();
                this.autoTrigger(true);
            } else if ( this.mode === 3 ) {
                this.open();
                this.autoTrigger(false);
            }
        };


        Module.prototype.open = function() {  
            if (this.mode === 0) return;
            this.addTrans();  
            this.$btn.text(this.option.button.closeText);  
            this.$ele.removeClass(this.option.class.closed); 

            if (!!this.option.transition) {                
                this.$ele.addClass(this.option.class.opening);
                this.mode = 1; 
            } else {
                this.$ele.addClass(this.option.class.opened);
                this.mode = 0;
            }
        };
        Module.prototype.close = function() {    
            if (this.mode === 3) return;  
            this.addTrans();      
            this.$btn.text(this.option.button.openText);
            this.$ele.removeClass(this.option.class.opened);
            if (!!this.option.transition) {
                this.$ele.addClass(this.option.class.closing);
                this.mode = 2;
            } else {
                this.$ele.addClass(this.option.class.closed);
                this.mode = 3;
            }
        };

        Module.prototype.transitionEnd = function(e) {            
            if(this.mode === 2){
                this.$ele.removeClass(this.option.class.closing).addClass(this.option.class.closed);
                this.mode = 3;
            }
            if(this.mode === 1){
                this.$ele.removeClass(this.option.class.opening).addClass(this.option.class.opened);
                this.mode = 0;
            }
            this.endCallback();
            this.$ele.removeClass('transition');

        };    
    
        $.fn[ModuleName] = function ( methods, options ) {
            return this.each(function(){
                var $this = $(this);
                var module = $this.data( ModuleName );
                var opts = null;
                if ( !!module ) {
                    console.log(methods, typeof methods,typeof options);
                    if ( typeof methods === 'string' &&  typeof options === 'undefined' ) {
                        module[methods]();
                    } 
                    else if ( typeof methods === 'string' &&  (typeof options === 'object' || typeof options === 'function') ) {
                        module[methods](options);
                    } 
                    else {                       
                        console.log('unsupported options!');
                        throw 'unsupported options!';
                    }
                } else {
                    opts = $.extend( {}, Module.DEFAULT, ( typeof methods === 'object' && methods ), ( typeof options === 'object' && options ) );
                    module = new Module(this, opts);
                    module.whenTransition = opts.whenTransition;
                    $this.data( ModuleName, module );

                    module.init();

                    module.$btn.on('click', function(e) {
                        module.toggle();
                    });

                    module.$ele.on('transitionend', function(e) {
                        module.transitionEnd(e);

                    });                    
                }
            });
        };

    
})(jQuery);
