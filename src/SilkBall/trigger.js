import { throwError ,log} from "../util/debug";
export function eventTrigger(SilkBall){
    SilkBall.prototype.on = function(type,fn){
        if(!this._events[type]){
            this._events[type] = [];
        }
        this._events[type].push(fn);
    }
    SilkBall.prototype.trigger = function(type){
        let events = this._events[type];
        if(!events) return
        events.forEach(element => {
            let event = element;
            event && event(...[].slice.call(arguments, 1))
        });
    }
}