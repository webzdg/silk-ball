import { requestAnimationFrame ,saveLocal} from '../util/util'
import { getRect ,addTransition,magneTdirection} from '../util/dom'
//绑定磁吸/惯性事件
export function runMixin(SilkBall) {
    //算法磁吸
    SilkBall.prototype._algorithmEdge = function () {
         // 初始值 
         let [start,change,during] = [0,0,30];
         // 初始值和变化量
         let [initX,initY] = [ this.moveOldX, this.moveOldY];
         // 判断元素现在在哪个半区
         let bound = getRect(this.$el);
         if(this.$options.direction === 'x'){
            let bean = magneTdirection(bound.left - this.boundMargin.left + bound.width / 2,this.boundMargin.right - this.boundMargin.left)
            if (bean) {
                change = this.boundMargin.left - bound.left;
            } else {
                change = this.boundMargin.right - bound.right;
            }
         }else{
            let bean = magneTdirection(bound.top - this.boundMargin.top + bound.height / 2,this.boundMargin.bottom - this.boundMargin.top)
            if (bean) {
                change = this.boundMargin.top -  bound.top;
            } else {
                change = this.boundMargin.bottom - bound.bottom;
            }
        }
        const run = function () {
            if(this.touching) return
            start++;
            let[x,y] = [initX,initY];
            if(this.$options.direction === 'x'){
                x = this.engineAnimation(start, initX, change, during);
            }else{
                y = this.engineAnimation(start, initY, change, during);
            }
            this._translate(x, y);

            if (start < during) {
                requestAnimationFrame(run.bind(this));
            } else {
                this.moveOldX = x;
                this.moveOldY = y;
                //监听事件
                this.trigger('touchEnd',{
                    x : this.moveOldX,
                    y : this.moveOldY
                })
                //历史记录
                if(this.$options.history){
                    saveLocal({
                        x : this.moveOldX,
                        y : this.moveOldY
                    })
                }
            }
        };
        run.call(this);
    }
    //css磁吸
    SilkBall.prototype._cssEdge = function(){
        addTransition(this.$el,300,this.$options.cssCubic);
        let bound = getRect(this.$el);
        if(this.$options.direction === 'x'){
            let bean = magneTdirection(bound.left - this.boundMargin.left + bound.width / 2,this.boundMargin.right - this.boundMargin.left)
            if(bean){//贴左侧
                this.moveOldX = this.boundMargin.left-this.elStartBound.left;
                this._translate(this.moveOldX, this.moveOldY)
                
            }
            else{//右侧
                this.moveOldX = this.boundMargin.right - this.elStartBound.left - this.elStartBound.width;
                this._translate(this.moveOldX, this.moveOldY)
            }
        }else{
            let bean = magneTdirection(bound.top - this.boundMargin.top + bound.height / 2,this.boundMargin.bottom - this.boundMargin.top)
            if(bean){//顶部
                this.moveOldY = this.boundMargin.top-this.elStartBound.top;
                this._translate(this.moveOldX, this.moveOldY)
            }
            else{//底部
                this.moveOldY = this.boundMargin.bottom - this.elStartBound.top - this.elStartBound.width;
                this._translate(this.moveOldX, this.moveOldY)
            }
        }
        this.trigger('touchEnd',{
            x : this.moveOldX,
            y : this.moveOldY
        })
        if(this.$options.history){
            saveLocal({
                x : this.moveOldX,
                y : this.moveOldY
            })
        }
    }
    //惯性
    SilkBall.prototype._inertia = function () {
        this.speed = this.speed - this.speed / this.rate;
        let inertiaX = this.reverseX * this.speed * this.distanceX * this.$options.speed * 0.00001;
        let inertiaY = this.reverseY * this.speed * this.distanceY * this.$options.speed * 0.00001;
        let bound = getRect(this.$el);
        if (inertiaX < 0 && bound.left + inertiaX < this.boundMargin.left) {
            inertiaX = this.boundMargin.left - bound.left;
            // 碰触边缘方向反转
            this.reverseX *= -1;
        } else if (inertiaX > 0 && bound.right + inertiaX > this.boundMargin.right) {
            inertiaX = this.boundMargin.right - bound.right;
            this.reverseX *= -1;
        }
        if (inertiaY < 0 && bound.top + inertiaY < this.boundMargin.top) {
            inertiaY = this.boundMargin.top - bound.top;
            this.reverseY *= -1;
        } else if (inertiaY > 0 && bound.bottom + inertiaY > this.boundMargin.bottom) {
            inertiaY = this.boundMargin.bottom - bound.bottom;
            this.reverseY *= -1;
        }
        var x = this.moveOldX + inertiaX, y = this.moveOldY + inertiaY;
        
        this._translate(x, y)
        //记录当前小球的位置
        this.moveOldX = x;
        this.moveOldY = y;
        this.trigger('touchMove',{
            x : this.moveOldX,
            y : this.moveOldY
        })
        if (this.speed < 0.1) {
            //考虑磁吸
            if(this.$options.magnet){
                this.$options.engine === 'js' ? this._algorithmEdge() : this._cssEdge();
                return
            }
            
            this.trigger('touchEnd',{
                x : this.moveOldX,
                y : this.moveOldY
            })
        } else {
            requestAnimationFrame(this._inertia.bind(this));
        }
    }
}