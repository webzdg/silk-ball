import { throwError } from '../util/debug';
import { isUndef, getNow } from '../util/util'
import { clearTransition } from '../util/dom'
//处理绑定事件
export function eventMixin(SilkBall) {
    SilkBall.prototype.handleEvent = function (e) {
        switch (e.type) {
            case 'touchstart':
            case 'mousedown':
                this._start(e);
                break;
            case 'touchmove':
            case 'mousemove':
                this._move(e);
                break;
            case 'touchcancel':
            case 'touchend':
            case 'mousecancel':
            case 'mouseup':
                this._end(e);
                break;
        }
    }
    //滑动开始 
    SilkBall.prototype._start = function (e) {
        if(this.$options.engine != 'js')    clearTransition(this.$el)
        //执行动画起始时间
        this.timerstart = getNow();
        let point = e.touches ? e.touches[0] : e
        //起始位置
        this.startX = point.pageX;
        this.startY = point.pageY;

        //获取上次移动后的位置
        this.boundX = this.moveOldX || 0 ;
        this.boundY = this.moveOldY || 0 ;
        //判断磁吸动画过程中重新抓取目标应当取消动画磁吸
        this.touching = true;
        this._addDOMEvents();
        this.trigger('touchStart',{
            x : this.boundX,
            y : this.boundY
        })
        e.preventDefault();
    }
    SilkBall.prototype._move = function (e) {
        let point = e.touches ? e.touches[0] : e;

        let [moveX,moveY] = [point.pageX - this.startX,point.pageY- this.startY];
        let [x,y] = [moveX + this.boundX,moveY + this.boundY];
        
        this._translate(x,y)


        //保存当前移动的位置
        this.moveOldX = x;
        this.moveOldY = y;
        
        this.trigger('touchMove',{
            x : this.moveOldX,
            y : this.moveOldY
        })
        e.preventDefault();
    }
    SilkBall.prototype._end = function (e) {
        this.touching = false;
        
        let point = e.touches ? (e.touches[0] ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e)) : e;

        //结束时位置
        let endX = point.pageX;
        let endY = point.pageY;

        // 移动的水平和垂直距离
        [this.distanceX, this.distanceY] = [endX - this.startX, endY - this.startY];

        //防止误碰导致惯性
        if (Math.abs(this.distanceX) < this.$system.momentumLimitDistance && Math.abs(this.distanceY) < this.$system.momentumLimitDistance) {
            return;
        }
        //滑动的距离和时间
        [this.distance, this.moveTime] = [Math.sqrt(Math.pow(this.distanceX, 2) + Math.pow(this.distanceY, 2)), getNow() - this.timerstart]
        //速度
        this.speed = this.distance / this.moveTime * 15;

        //越界反弹方向 反方向为-1
        [this.reverseX, this.reverseY] = [1, 1];
        this.rate = Math.min(10, this.speed);
        this._inertia();
        e.preventDefault();
        this._removeDOMEvents();
    }
    //改变transition 产生移动效果
    SilkBall.prototype._translate = function (x, y) {
        if (isUndef(x) || isUndef(y)) throwError('moving distance cannot be empty!');
        x = Math.round(1000 * x) / 1000;
        y = Math.round(1000 * y) / 1000;
        this.$el.style.transform = `translate3d(${x}px,${y}px,0px)`;
        this.$el.style.webkitTransform = `translate3d(${x}px,${y}px,0px)`;
    }
}