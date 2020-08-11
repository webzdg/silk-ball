# 丝滑球
一个能让元素实现惯性移动、反弹、磁吸效果的插件
# 安装
```
npm i silk-ball -S
```
# 使用
```
import SilkBall from 'silk-ball'
let silkBall = new SilkBall(el,options);
```
# 配置
- rangeBody
- magnet
- direction
- margin
- history
- speed
- engine
- cssCubic
- jsCubic
## rangeBody
>`rangeBody:true`

该参数决定滑动的元素是否是全屏范围内滑动、反弹，默认为`true`,否则，在该元素的**父元素范围内滑动**
## magnet
>`magnet:true`

该参数决定是否开启磁吸效果，当惯性速度减至0，默认会贴边，如果你关闭该值的话，当惯性结束时则停止运动。
## direction
>`direction:x`

该参数决定的是磁吸的方向，默认为水平方向磁吸，否则就在垂直方向上磁吸贴边。

## margin
>`margin:0`

该值规定的是反弹、磁吸与边界的距离，言简意赅就是你想离边界多少还是反弹或者磁吸停止距离边界的距离
## history
>`history:false`

该值是决定你是否保留上次小球的**停止**的位置，不会在小球运动时保存位置。
当你开启磁吸时：保存的位置则是磁吸的位置
关闭磁吸时：位置则是惯性结束时的位置
## speed
>`speed:500`

该值决定的是滑动脱手时惯性滑动的速度，不过我不建议你修改该值。当值越大，惯性滑动越快，值为0时：相当于您关闭了惯性滑动

## engine
>`engine:'js'`

该值决定你使用那种磁吸方式：
1、css `transition`
2、js 动画
## cssCubic
>`cssCubic:cubic-bezier(0.21, 1.93, 0.53, 0.64)`

取值是贝塞尔曲线，如果使用的引擎是css模式它将决定你磁吸贴边的动画效果
## jsCubic
>`jsCubic:Bounce_easeOut`

取值是贝塞尔曲线，如果使用的引擎是js动画模式它将决定你磁吸贴边的动画效果。
取值：`Linear、Quad_easeIn、Quad_easeOut、Quad_easeInOut、Cubic_easeIn、Cubic_easeOut、Cubic_easeInOut、Quart_easeIn、Quart_easeOut、Quart_easeInOut、Quint_easeIn、Quint_easeOut、Quint_easeInOut、Sine_easeIn、Sine_easeOut、Sine_easeInOut、Expo_easeIn、Expo_easeOut、Expo_easeInOut、Circ_easeIn、Circ_easeOut、Circ_easeInOut、Bounce_easeIn、Bounce_easeOut、Bounce_easeInOut`
您可以试着尝试下。