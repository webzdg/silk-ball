import {warn} from './util/debug'
import {initMixin} from './SilkBall/init';
import {eventMixin} from './SilkBall/event';
import {runMixin} from './SilkBall/run';
import {eventTrigger} from './SilkBall/trigger';
function SilkBall(el,options){
    this.$el = typeof el === 'string' ? document.querySelector(el) : el;
    if(!this.$el)   return warn("Slide element cannot be empty!");
    this._init(options)
}
//初始化配置
initMixin(SilkBall);
//处理绑定事件
eventMixin(SilkBall);
//处理磁吸/惯性
runMixin(SilkBall)
//监听事件回调
eventTrigger(SilkBall)
export default SilkBall;