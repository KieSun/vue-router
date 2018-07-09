# 第一周

1、直接到src文件下目录，看看整体目录划分
````
.
├── components  //  组件目录
│   ├── link.js // link组件
│   └── view.js // router-view组件
├── create-matcher.js // 路径匹配组件函数
├── create-route-map.js // 根据传入的 routes 配置生成对应的路由 map
├── history // history模式目录
│   ├── abstract.js // 基于History抽象封装新的AbstractHistory类
│   ├── base.js // 封装History类
│   ├── hash.js // 基于History抽象封装新的HashHistory类
│   └── html5.js // 基于History抽象封装新的HTML5History类
├── index.js // 项目入口
├── install.js // 安装vue-router
└── util // 工具函数目录...
    ├── async.js
    ├── dom.js
    ├── location.js
    ├── misc.js
    ├── params.js
    ├── path.js
    ├── push-state.js
    ├── query.js
    ├── resolve-components.js
    ├── route.js
    ├── scroll.js
    └── warn.js
````

### 例子

````
// 引入
import Vue from 'vue'
import VueRouter from 'vue-router'

// 1. 安装
// 这回安装 <router-view> 和 <router-link>组件
// 在组件之内注入 $router 和 $route 对象
Vue.use(VueRouter)

// 2. 定义路由组件
const Home = { template: '<div>home</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 3. 创建一个router
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})

````

由上面一个例子之中，我们先看看怎么安装VueRouter，然后看到Vue.use函数如下。

````
Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args) // 运行插件的install方法
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args) // 运行插件方法
    }
    installedPlugins.push(plugin) // 把插件存到this._installedPlugins数组里
    return this // 返回vue
}

````

然后在看看，router的install方法，直接就是install.js里面。看里面注释。

