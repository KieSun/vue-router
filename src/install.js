import View from './components/view'
import Link from './components/link'

export let _Vue // 先定义一个全局_Vue避免下次重复安装

export function install (Vue) {
  // 安装过的 直接不执行后续安装操作
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue
  // 判断一个参数是否是未定义的，如果是undefined返回false，否则返回true
  const isDef = v => v !== undefined
  // 注册实例
  const registerInstance = (vm, callVal) => {
    console.log(vm.$options._parentVnode)
    let i = vm.$options._parentVnode // 拿到父级的vnode对象
    // 如果父级的vnode对象是未定义的，并且父级的vnode对象的data也是未定义的，并且i.data.registerRouteInstance也不是undefined
    // i.data.registerRouteInstance是router-view组件里面定义的，请看src/comoinents/view.js
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal) // 最后执行的是i.data.registerRouteInstance(vm, callVal)
    }
  }
  // 在全局的minxin
  Vue.mixin({
    beforeCreate () {
      // 往跟节点加入_routerRoot，_router属性
      // 等到子组件的时候，根据vue会继承父级的this.$options.router ，所以这里执行时一次
      if (isDef(this.$options.router)) {
        this._routerRoot = this // 给_routerRoot第一次赋值this
        this._router = this.$options.router // 给_router第一次赋值this.$options.router数组
        this._router.init(this) // 调用_router
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 第二次执行的时候，走else，然后在路由组件页面执行beforeCreate不断，注入_routerRoot
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })
  // 属性劫持，实现通过this.$router来访问到this._routerRoot._router的对象
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })
  // 同上
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })
  // 安装router-veiw 和 Link组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // 对路由挂钩使用相同的钩子合并策略
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
