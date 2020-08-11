(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SilkBall = factory());
}(this, (function () { 'use strict';

    function warn(msg) {
      console.error("[SilkBall warn]: ".concat(msg));
    }
    function throwError(msg) {
      throw new Error("[SilkBall warn]: ".concat(msg));
    }

    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }

    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }

    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
    }

    function _iterableToArrayLimit(arr, i) {
      if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    //默认配置
    var DEFAULT_OPTIONS = {
      rangeBody: true,
      //限制的范围 默认为body
      magnet: true,
      //开启磁吸
      direction: 'x',
      //磁吸方向
      margin: 0,
      //开启磁吸后贴边的边距
      history: false,
      //关闭记录历史位置
      speed: 500,
      //惯性速度
      engine: 'js',
      //磁吸动画模式  js动画/css动画
      cssCubic: 'cubic-bezier(0.21, 1.93, 0.53, 0.64)',
      //贝塞尔曲线
      jsCubic: 'Bounce_easeOut'
    }; //系统配置不可更改

    var SYSTEM_OPTIONS = {
      momentumLimitDistance: 5 //最小的滑动距离，防止用户触摸点击导致距离偏移，而触发滑动

    };

    //操作dom
    function addEvent(el, type, fn) {
      el.addEventListener(type, fn, {
        passive: false,
        capture: false
      });
    }
    function removeEvent(el, type, fn) {
      el.removeEventListener(type, fn, {
        passive: false,
        capture: false
      });
    }
    function addTransition(el, time, cub) {
      el.style.transition = "transform ".concat(time, "ms ").concat(cub);
    }
    function clearTransition(el) {
      el.style.transition = 'none';
    } //判断磁吸的位置

    function magneTdirection(x, y) {
      return x <= y / 2;
    } //获取元素的位置

    function getRect(el) {
      return el.getBoundingClientRect();
    } //获取元素的父节点

    function getParentNode(el) {
      return el.parentNode;
    }

    //运行的环境
    var inBrowser = typeof window !== 'undefined';
    var ua = inBrowser && navigator.userAgent.toLowerCase();
    var isWeChatDevTools = ua && /wechatdevtools/.test(ua);
    var isAndroid = ua && ua.indexOf('android') > 0; //当前环境是否支持touch事件

    var hasTouch = inBrowser && 'ontouchstart' in window;

    function isUndef(v) {
      return v === undefined || v === null;
    }
    var requestAnimationFrame = function () {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
        return window.setTimeout(callback, 100 / 60);
      };
    }(); //获取当前时间

    function getNow() {
      return window.performance && window.performance.now ? window.performance.now() + window.performance.timing.navigationStart : +new Date();
    } //判断是否是数字

    function isNumber(v) {
      return typeof v === 'number';
    }
    /*
        保存历史位置
    */

    var LOCAL_NAME = 'zSilkBall';
    function saveLocal(local) {
      local && localStorage.setItem(LOCAL_NAME, JSON.stringify(local));
    }
    function getLocal() {
      var local = localStorage.getItem(LOCAL_NAME);
      return JSON.parse(local) || null;
    } //js实现动画

    /*
        t:当前时间
        b :初始值
        c ：变化量
        d：持续时间
    */

    var Tween = {
      Linear: function Linear(t, b, c, d) {
        return c * t / d + b;
      },
      Quad: {
        easeIn: function easeIn(t, b, c, d) {
          return c * (t /= d) * t + b;
        },
        easeOut: function easeOut(t, b, c, d) {
          return -c * (t /= d) * (t - 2) + b;
        },
        easeInOut: function easeInOut(t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t + b;
          return -c / 2 * (--t * (t - 2) - 1) + b;
        }
      },
      Cubic: {
        easeIn: function easeIn(t, b, c, d) {
          return c * (t /= d) * t * t + b;
        },
        easeOut: function easeOut(t, b, c, d) {
          return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOut: function easeInOut(t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
          return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
      },
      Quart: {
        easeIn: function easeIn(t, b, c, d) {
          return c * (t /= d) * t * t * t + b;
        },
        easeOut: function easeOut(t, b, c, d) {
          return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOut: function easeInOut(t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
          return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
      },
      Quint: {
        easeIn: function easeIn(t, b, c, d) {
          return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function easeOut(t, b, c, d) {
          return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function easeInOut(t, b, c, d) {
          if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
          return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
      },
      Sine: {
        easeIn: function easeIn(t, b, c, d) {
          return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOut: function easeOut(t, b, c, d) {
          return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOut: function easeInOut(t, b, c, d) {
          return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
      },
      Expo: {
        easeIn: function easeIn(t, b, c, d) {
          return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOut: function easeOut(t, b, c, d) {
          return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOut: function easeInOut(t, b, c, d) {
          if (t == 0) return b;
          if (t == d) return b + c;
          if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
          return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
      },
      Circ: {
        easeIn: function easeIn(t, b, c, d) {
          return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function easeOut(t, b, c, d) {
          return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOut: function easeInOut(t, b, c, d) {
          if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
          return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
      },
      Elastic: {
        easeIn: function easeIn(t, b, c, d, a, p) {
          if (t == 0) return b;
          if ((t /= d) == 1) return b + c;
          if (!p) p = d * .3;

          if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
          } else var s = p / (2 * Math.PI) * Math.asin(c / a);

          return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function easeOut(t, b, c, d, a, p) {
          if (t == 0) return b;
          if ((t /= d) == 1) return b + c;
          if (!p) p = d * .3;

          if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
          } else var s = p / (2 * Math.PI) * Math.asin(c / a);

          return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOut: function easeInOut(t, b, c, d, a, p) {
          if (t == 0) return b;
          if ((t /= d / 2) == 2) return b + c;
          if (!p) p = d * (.3 * 1.5);

          if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
          } else var s = p / (2 * Math.PI) * Math.asin(c / a);

          if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
          return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
      },
      Back: {
        easeIn: function easeIn(t, b, c, d, s) {
          if (s == undefined) s = 1.70158;
          return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function easeOut(t, b, c, d, s) {
          if (s == undefined) s = 1.70158;
          return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function easeInOut(t, b, c, d, s) {
          if (s == undefined) s = 1.70158;
          if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
          return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
        }
      },
      Bounce: {
        easeIn: function easeIn(t, b, c, d) {
          return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
        },
        easeOut: function easeOut(t, b, c, d) {
          if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
          } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
          } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
          } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
          }
        },
        easeInOut: function easeInOut(t, b, c, d) {
          if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
      }
    };

    function initMixin(SilkBall) {
      SilkBall.prototype._init = function (options) {
        //绑定配置
        this.$options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.$system = SYSTEM_OPTIONS; //判断动画参数是否存在

        if (this.$options.engine == 'js') {
          var _this$$options$jsCubi = this.$options.jsCubic.split('_'),
              _this$$options$jsCubi2 = _slicedToArray(_this$$options$jsCubi, 2),
              key = _this$$options$jsCubi2[0],
              animation = _this$$options$jsCubi2[1];

          if (Object.keys(Tween).indexOf(key) == -1) throwError("Parameter animation does not exist !");
          if (!animation) this.engineAnimation = Tween[key];
          if (!Tween[key][animation]) throwError("Parameter animation does not exist !");
          this.engineAnimation = Tween[key][animation];
        }

        if (!isNumber(this.$options.speed)) throwError("Speed must be numeric !");
        this.$options.speed = this.$options.speed < 0 ? 0 : this.$options.speed; //判定是否开启历史记录位置

        if (this.$options.history) {
          var local = getLocal();

          if (local) {
            this.moveOldX = local.x;
            this.moveOldY = local.y;

            this._translate(this.moveOldX, this.moveOldY);
          }
        } //回调函数


        this._events = {}; //绑定边距

        this.initBound(); //绑定事件

        this._addStartEvents();
      }; //绑定事件


      SilkBall.prototype._addDOMEvents = function () {
        if (hasTouch) {
          addEvent(this.$el, 'touchmove', this);
          addEvent(this.$el, 'touchcancel', this);
          addEvent(this.$el, 'touchend', this);
        } else {
          addEvent(document, 'mousemove', this); //此时的mousemove应该监听在页面上

          addEvent(document, 'mousecancel', this); //否则会出现鼠标移动过快而元素不在触发move事件

          addEvent(document, 'mouseup', this);
        }
      };

      SilkBall.prototype._addStartEvents = function () {
        if (hasTouch) {
          addEvent(this.$el, 'touchstart', this);
        } else {
          addEvent(this.$el, 'mousedown', this);
        }
      }; //解除绑定事件


      SilkBall.prototype._removeDOMEvents = function () {
        if (hasTouch) {
          removeEvent(this.$el, 'touchmove', this);
          removeEvent(this.$el, 'touchcancel', this);
          removeEvent(this.$el, 'touchend', this);
        } else {
          removeEvent(document, 'mousemove', this);
          removeEvent(document, 'mousecancel', this);
          removeEvent(document, 'mouseup', this);
        }
      }; //绑定边界


      SilkBall.prototype.initBound = function () {
        var parNodeReac = getRect(getParentNode(this.$el));
        this.boundMargin = this.$options.rangeBody ? {
          left: 0 + this.$options.margin,
          top: 0 + this.$options.margin,
          right: window.innerWidth - this.$options.margin,
          bottom: window.innerHeight - this.$options.margin
        } : {
          left: parNodeReac.left + this.$options.margin,
          top: parNodeReac.top + this.$options.margin,
          right: parNodeReac.right - this.$options.margin,
          bottom: parNodeReac.bottom - this.$options.margin
        }; //绑定初始球位置 需要考虑球的历史记录在绑定

        this.elStartBound = getRect(this.$el);
      };
    }

    function eventMixin(SilkBall) {
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
      }; //滑动开始 


      SilkBall.prototype._start = function (e) {
        if (this.$options.engine != 'js') clearTransition(this.$el); //执行动画起始时间

        this.timerstart = getNow();
        var point = e.touches ? e.touches[0] : e; //起始位置

        this.startX = point.pageX;
        this.startY = point.pageY; //获取上次移动后的位置

        this.boundX = this.moveOldX || 0;
        this.boundY = this.moveOldY || 0; //判断磁吸动画过程中重新抓取目标应当取消动画磁吸

        this.touching = true;

        this._addDOMEvents();

        this.trigger('touchStart', {
          x: this.boundX,
          y: this.boundY
        });
        e.preventDefault();
      };

      SilkBall.prototype._move = function (e) {
        var point = e.touches ? e.touches[0] : e;
        var moveX = point.pageX - this.startX,
            moveY = point.pageY - this.startY;
        var x = moveX + this.boundX,
            y = moveY + this.boundY;

        this._translate(x, y); //保存当前移动的位置


        this.moveOldX = x;
        this.moveOldY = y;
        this.trigger('touchMove', {
          x: this.moveOldX,
          y: this.moveOldY
        });
        e.preventDefault();
      };

      SilkBall.prototype._end = function (e) {
        this.touching = false;
        var point = e.touches ? e.touches[0] ? e.touches[0] : e.changedTouches ? e.changedTouches[0] : e : e; //结束时位置

        var endX = point.pageX;
        var endY = point.pageY; // 移动的水平和垂直距离

        var _ref = [endX - this.startX, endY - this.startY];
        this.distanceX = _ref[0];
        this.distanceY = _ref[1];

        //防止误碰导致惯性
        if (Math.abs(this.distanceX) < this.$system.momentumLimitDistance && Math.abs(this.distanceY) < this.$system.momentumLimitDistance) {
          return;
        } //滑动的距离和时间


        var _ref2 = [Math.sqrt(Math.pow(this.distanceX, 2) + Math.pow(this.distanceY, 2)), getNow() - this.timerstart];
        this.distance = _ref2[0];
        this.moveTime = _ref2[1];
        //速度
        this.speed = this.distance / this.moveTime * 15; //越界反弹方向 反方向为-1

        var _ref3 = [1, 1];
        this.reverseX = _ref3[0];
        this.reverseY = _ref3[1];
        this.rate = Math.min(10, this.speed);

        this._inertia();

        e.preventDefault();

        this._removeDOMEvents();
      }; //改变transition 产生移动效果


      SilkBall.prototype._translate = function (x, y) {
        if (isUndef(x) || isUndef(y)) throwError('moving distance cannot be empty!');
        x = Math.round(1000 * x) / 1000;
        y = Math.round(1000 * y) / 1000;
        this.$el.style.transform = "translate3d(".concat(x, "px,").concat(y, "px,0px)");
        this.$el.style.webkitTransform = "translate3d(".concat(x, "px,").concat(y, "px,0px)");
      };
    }

    function runMixin(SilkBall) {
      //算法磁吸
      SilkBall.prototype._algorithmEdge = function () {
        // 初始值 
        var start = 0,
            change = 0,
            during = 30; // 初始值和变化量

        var _ref = [this.moveOldX, this.moveOldY],
            initX = _ref[0],
            initY = _ref[1]; // 判断元素现在在哪个半区

        var bound = getRect(this.$el);

        if (this.$options.direction === 'x') {
          var bean = magneTdirection(bound.left - this.boundMargin.left + bound.width / 2, this.boundMargin.right - this.boundMargin.left);

          if (bean) {
            change = this.boundMargin.left - bound.left;
          } else {
            change = this.boundMargin.right - bound.right;
          }
        } else {
          var _bean = magneTdirection(bound.top - this.boundMargin.top + bound.height / 2, this.boundMargin.bottom - this.boundMargin.top);

          if (_bean) {
            change = this.boundMargin.top - bound.top;
          } else {
            change = this.boundMargin.bottom - bound.bottom;
          }
        }

        var run = function run() {
          if (this.touching) return;
          start++;
          var x = initX,
              y = initY;

          if (this.$options.direction === 'x') {
            x = this.engineAnimation(start, initX, change, during);
          } else {
            y = this.engineAnimation(start, initY, change, during);
          }

          this._translate(x, y);

          if (start < during) {
            requestAnimationFrame(run.bind(this));
          } else {
            this.moveOldX = x;
            this.moveOldY = y; //监听事件

            this.trigger('touchEnd', {
              x: this.moveOldX,
              y: this.moveOldY
            }); //历史记录

            if (this.$options.history) {
              saveLocal({
                x: this.moveOldX,
                y: this.moveOldY
              });
            }
          }
        };

        run.call(this);
      }; //css磁吸


      SilkBall.prototype._cssEdge = function () {
        addTransition(this.$el, 300, this.$options.cssCubic);
        var bound = getRect(this.$el);

        if (this.$options.direction === 'x') {
          var bean = magneTdirection(bound.left - this.boundMargin.left + bound.width / 2, this.boundMargin.right - this.boundMargin.left);

          if (bean) {
            //贴左侧
            this.moveOldX = this.boundMargin.left - this.elStartBound.left;

            this._translate(this.moveOldX, this.moveOldY);
          } else {
            //右侧
            this.moveOldX = this.boundMargin.right - this.elStartBound.left - this.elStartBound.width;

            this._translate(this.moveOldX, this.moveOldY);
          }
        } else {
          var _bean2 = magneTdirection(bound.top - this.boundMargin.top + bound.height / 2, this.boundMargin.bottom - this.boundMargin.top);

          if (_bean2) {
            //顶部
            this.moveOldY = this.boundMargin.top - this.elStartBound.top;

            this._translate(this.moveOldX, this.moveOldY);
          } else {
            //底部
            this.moveOldY = this.boundMargin.bottom - this.elStartBound.top - this.elStartBound.width;

            this._translate(this.moveOldX, this.moveOldY);
          }
        }

        this.trigger('touchEnd', {
          x: this.moveOldX,
          y: this.moveOldY
        });

        if (this.$options.history) {
          saveLocal({
            x: this.moveOldX,
            y: this.moveOldY
          });
        }
      }; //惯性


      SilkBall.prototype._inertia = function () {
        this.speed = this.speed - this.speed / this.rate;
        var inertiaX = this.reverseX * this.speed * this.distanceX * this.$options.speed * 0.00001;
        var inertiaY = this.reverseY * this.speed * this.distanceY * this.$options.speed * 0.00001;
        var bound = getRect(this.$el);

        if (inertiaX < 0 && bound.left + inertiaX < this.boundMargin.left) {
          inertiaX = this.boundMargin.left - bound.left; // 碰触边缘方向反转

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

        var x = this.moveOldX + inertiaX,
            y = this.moveOldY + inertiaY;

        this._translate(x, y); //记录当前小球的位置


        this.moveOldX = x;
        this.moveOldY = y;
        this.trigger('touchMove', {
          x: this.moveOldX,
          y: this.moveOldY
        });

        if (this.speed < 0.1) {
          //考虑磁吸
          if (this.$options.magnet) {
            this.$options.engine === 'js' ? this._algorithmEdge() : this._cssEdge();
            return;
          }

          this.trigger('touchEnd', {
            x: this.moveOldX,
            y: this.moveOldY
          });
        } else {
          requestAnimationFrame(this._inertia.bind(this));
        }
      };
    }

    function eventTrigger(SilkBall) {
      SilkBall.prototype.on = function (type, fn) {
        if (!this._events[type]) {
          this._events[type] = [];
        }

        this._events[type].push(fn);
      };

      SilkBall.prototype.trigger = function (type) {
        var _arguments = arguments;
        var events = this._events[type];
        if (!events) return;
        events.forEach(function (element) {
          var event = element;
          event && event.apply(void 0, _toConsumableArray([].slice.call(_arguments, 1)));
        });
      };
    }

    function SilkBall(el, options) {
      this.$el = typeof el === 'string' ? document.querySelector(el) : el;
      if (!this.$el) return warn("Slide element cannot be empty!");

      this._init(options);
    } //初始化配置


    initMixin(SilkBall); //处理绑定事件

    eventMixin(SilkBall); //处理磁吸/惯性

    runMixin(SilkBall); //监听事件回调

    eventTrigger(SilkBall);

    return SilkBall;

})));
//# sourceMappingURL=SilkBall.js.map
