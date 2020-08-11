//默认配置
export const DEFAULT_OPTIONS = {
    rangeBody : true, //限制的范围 默认为body
    magnet : true, //开启磁吸
    direction  : 'x',//磁吸方向
    margin : 0,//开启磁吸后贴边的边距
    history : false,//关闭记录历史位置
    speed : 500,//惯性速度
    engine : 'js',//磁吸动画模式  js动画/css动画
    cssCubic : 'cubic-bezier(0.21, 1.93, 0.53, 0.64)', //贝塞尔曲线
    jsCubic : 'Bounce_easeOut'
};
//系统配置不可更改
export const SYSTEM_OPTIONS = {
    momentumLimitDistance : 5,//最小的滑动距离，防止用户触摸点击导致距离偏移，而触发滑动
};