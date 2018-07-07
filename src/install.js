import View from './components/view'
import Link from './components/link'

export let _Vue

export function install (Vue) {
  // 避免重复安装
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  // 简单工具函数，判断不为 undefined
  const isDef = v => v !== undefined

  // TODO:
  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  // 全局混合策略 影响后面的vue实例 mixin 生命周期钩子将优先执行
  Vue.mixin({
    beforeCreate () {
      console.log('this.$options.router', this.$options.router)
      // 判断是否有 VueRouter 实例，有就复制 并执行 init 方法
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        // 使用 Vue.util 暴露的 defineReactive 建立响应式的 _route 对象
        // TODO: Vue.util 哪里暴露的 ？
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 没有就找父级原素以及顶级原素
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  // 给原型添加 $router $route
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  // 注册 router-view router-link 组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  // 自定义合并策略
  // optionMergeStrategies 声明在vue/src/core/config.js 暂时没找到在哪里赋值的
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
