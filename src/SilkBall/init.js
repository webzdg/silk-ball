import {DEFAULT_OPTIONS,SYSTEM_OPTIONS} from '../util/options';
import {throwError} from '../util/debug';
import {addEvent,removeEvent,getRect,getParentNode} from '../util/dom'
import {hasTouch} from '../util/runEnv';
import {Tween,isNumber,getLocal} from '../util/util';

export function initMixin(SilkBall){
    SilkBall.prototype._init = function(options){
        //绑定配置
        this.$options = Object.assign({},DEFAULT_OPTIONS,options);
        this.$system = SYSTEM_OPTIONS;
        //判断动画参数是否存在
        if(this.$options.engine == 'js'){
            let [key,animation] = this.$options.jsCubic.split('_');
            if(Object.keys(Tween).indexOf(key) == -1)   throwError("Parameter animation does not exist !")
            if(!animation)  this.engineAnimation = Tween[key];
            if(!Tween[key][animation]) throwError("Parameter animation does not exist !")
            this.engineAnimation = Tween[key][animation];
        }  
        if(!isNumber(this.$options.speed)) throwError("Speed must be numeric !")
        this.$options.speed = this.$options.speed < 0 ? 0 : this.$options.speed;
        //判定是否开启历史记录位置
        if(this.$options.history){
            let local = getLocal();
            if(local){
                this.moveOldX = local.x;
                this.moveOldY = local.y;
                this._translate(this.moveOldX,this.moveOldY)
            }
        }
        //回调函数
        this._events = {};
        //绑定边距
        this.initBound();
        //绑定事件
        this._addStartEvents();
    }
    //绑定事件
    SilkBall.prototype._addDOMEvents = function(){
        if(hasTouch){
            addEvent(this.$el,'touchmove',this);
            addEvent(this.$el,'touchcancel',this);
            addEvent(this.$el,'touchend',this);
        }
        else{
            addEvent(document,'mousemove',this);//此时的mousemove应该监听在页面上
            addEvent(document,'mousecancel',this);//否则会出现鼠标移动过快而元素不在触发move事件
            addEvent(document,'mouseup',this);
        }
    }
    SilkBall.prototype._addStartEvents = function(){
        if(hasTouch){
            addEvent(this.$el,'touchstart',this);
        }
        else{
            addEvent(this.$el,'mousedown',this);
        }
    }
    //解除绑定事件
    SilkBall.prototype._removeDOMEvents = function () {
        if(hasTouch){
            removeEvent(this.$el,'touchmove',this);
            removeEvent(this.$el,'touchcancel',this);
            removeEvent(this.$el,'touchend',this);
        }
        else{
            removeEvent(document,'mousemove',this);
            removeEvent(document,'mousecancel',this);
            removeEvent(document,'mouseup',this);
        }
    }
    //绑定边界
    SilkBall.prototype.initBound = function () {
        let parNodeReac = getRect(getParentNode(this.$el));
        this.boundMargin = this.$options.rangeBody ? {
            left : 0 + this.$options.margin,
            top : 0 + this.$options.margin,
            right : window.innerWidth - this.$options.margin,
            bottom : window.innerHeight - this.$options.margin
        } : {
            left : parNodeReac.left + this.$options.margin,
            top : parNodeReac.top + this.$options.margin,
            right : parNodeReac.right - this.$options.margin,
            bottom : parNodeReac.bottom - this.$options.margin
        };
        //绑定初始球位置 需要考虑球的历史记录在绑定
        this.elStartBound = getRect(this.$el);
    }
}