import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import uglify from 'rollup-plugin-uglify';
export default {
    input: './src/index.js',//入口
    output: {
      file: 'dist/SilkBall.js',//出口
      name : 'SilkBall',//打包后导出的全局变量名
      format: 'umd',//模块规范
      sourcemap : true//开启源代码调试
    },
    plugins : [
        babel({
            exclude:'node_modules/**' //忽略node_modules文件夹
        }),
        process.env.ENV === 'development'?serve({
            open : true,//项目启动自动打开网页
            openPage : '/public/index.html',//打开的网页路径
            port : 3000, //端口
            contentBase : ""
        }):null, //如果是开发模式我们开启服务
        (process.env.NODE_ENV === 'production' && uglify()),
    ]
  };