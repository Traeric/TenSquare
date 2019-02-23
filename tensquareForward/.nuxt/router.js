import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _d8f9fd4a = () => interopDefault(import('../pages/friend/index.vue' /* webpackChunkName: "pages/friend/index" */))
const _003b1600 = () => interopDefault(import('../pages/gathering/index.vue' /* webpackChunkName: "pages/gathering/index" */))
const _5d9ddbad = () => interopDefault(import('../pages/label/index.vue' /* webpackChunkName: "pages/label/index" */))
const _f92c3d1a = () => interopDefault(import('../pages/login_register.vue' /* webpackChunkName: "pages/login_register" */))
const _24e6b963 = () => interopDefault(import('../pages/manager.vue' /* webpackChunkName: "pages/manager" */))
const _4a0d69a6 = () => interopDefault(import('../pages/manager/index.vue' /* webpackChunkName: "pages/manager/index" */))
const _1edac681 = () => interopDefault(import('../pages/manager/account.vue' /* webpackChunkName: "pages/manager/account" */))
const _486178da = () => interopDefault(import('../pages/manager/dynamic.vue' /* webpackChunkName: "pages/manager/dynamic" */))
const _5dfc6946 = () => interopDefault(import('../pages/manager/myanswer.vue' /* webpackChunkName: "pages/manager/myanswer" */))
const _358eb25c = () => interopDefault(import('../pages/manager/mycollect.vue' /* webpackChunkName: "pages/manager/mycollect" */))
const _2863d780 = () => interopDefault(import('../pages/manager/myfocus.vue' /* webpackChunkName: "pages/manager/myfocus" */))
const _5940556e = () => interopDefault(import('../pages/manager/myquestion.vue' /* webpackChunkName: "pages/manager/myquestion" */))
const _24c42ebd = () => interopDefault(import('../pages/manager/myreaded.vue' /* webpackChunkName: "pages/manager/myreaded" */))
const _6904f707 = () => interopDefault(import('../pages/manager/myshare.vue' /* webpackChunkName: "pages/manager/myshare" */))
const _06a5184a = () => interopDefault(import('../pages/qa.vue' /* webpackChunkName: "pages/qa" */))
const _aa668166 = () => interopDefault(import('../pages/qa/index.vue' /* webpackChunkName: "pages/qa/index" */))
const _7e245ef0 = () => interopDefault(import('../pages/qa/label/_label/index.vue' /* webpackChunkName: "pages/qa/label/_label/index" */))
const _91cb875c = () => interopDefault(import('../pages/qa/label/_label/submit.vue' /* webpackChunkName: "pages/qa/label/_label/submit" */))
const _4918c780 = () => interopDefault(import('../pages/qa/label/_label/problem/_id.vue' /* webpackChunkName: "pages/qa/label/_label/problem/_id" */))
const _4aa54012 = () => interopDefault(import('../pages/recruit/index.vue' /* webpackChunkName: "pages/recruit/index" */))
const _93c379f6 = () => interopDefault(import('../pages/spit/index.vue' /* webpackChunkName: "pages/spit/index" */))
const _7a2c1b99 = () => interopDefault(import('../pages/wechatLogin.vue' /* webpackChunkName: "pages/wechatLogin" */))
const _67f81975 = () => interopDefault(import('../pages/spit/submit.vue' /* webpackChunkName: "pages/spit/submit" */))
const _59540900 = () => interopDefault(import('../pages/gathering/item/_id.vue' /* webpackChunkName: "pages/gathering/item/_id" */))
const _7ae46f9a = () => interopDefault(import('../pages/label/item/_id.vue' /* webpackChunkName: "pages/label/item/_id" */))
const _334167a9 = () => interopDefault(import('../pages/recruit/item/_id.vue' /* webpackChunkName: "pages/recruit/item/_id" */))
const _6deffc4a = () => interopDefault(import('../pages/spit/item/_id.vue' /* webpackChunkName: "pages/spit/item/_id" */))
const _139af0f0 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected
  if (to.matched.length < 2) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/friend",
      component: _d8f9fd4a,
      name: "friend"
    }, {
      path: "/gathering",
      component: _003b1600,
      name: "gathering"
    }, {
      path: "/label",
      component: _5d9ddbad,
      name: "label"
    }, {
      path: "/login_register",
      component: _f92c3d1a,
      name: "login_register"
    }, {
      path: "/manager",
      component: _24e6b963,
      children: [{
        path: "",
        component: _4a0d69a6,
        name: "manager"
      }, {
        path: "account",
        component: _1edac681,
        name: "manager-account"
      }, {
        path: "dynamic",
        component: _486178da,
        name: "manager-dynamic"
      }, {
        path: "myanswer",
        component: _5dfc6946,
        name: "manager-myanswer"
      }, {
        path: "mycollect",
        component: _358eb25c,
        name: "manager-mycollect"
      }, {
        path: "myfocus",
        component: _2863d780,
        name: "manager-myfocus"
      }, {
        path: "myquestion",
        component: _5940556e,
        name: "manager-myquestion"
      }, {
        path: "myreaded",
        component: _24c42ebd,
        name: "manager-myreaded"
      }, {
        path: "myshare",
        component: _6904f707,
        name: "manager-myshare"
      }]
    }, {
      path: "/qa",
      component: _06a5184a,
      children: [{
        path: "",
        component: _aa668166,
        name: "qa"
      }, {
        path: "label/:label?",
        component: _7e245ef0,
        name: "qa-label-label"
      }, {
        path: "label/:label?/submit",
        component: _91cb875c,
        name: "qa-label-label-submit"
      }, {
        path: "label/:label?/problem/:id?",
        component: _4918c780,
        name: "qa-label-label-problem-id"
      }]
    }, {
      path: "/recruit",
      component: _4aa54012,
      name: "recruit"
    }, {
      path: "/spit",
      component: _93c379f6,
      name: "spit"
    }, {
      path: "/wechatLogin",
      component: _7a2c1b99,
      name: "wechatLogin"
    }, {
      path: "/spit/submit",
      component: _67f81975,
      name: "spit-submit"
    }, {
      path: "/gathering/item/:id?",
      component: _59540900,
      name: "gathering-item-id"
    }, {
      path: "/label/item/:id?",
      component: _7ae46f9a,
      name: "label-item-id"
    }, {
      path: "/recruit/item/:id?",
      component: _334167a9,
      name: "recruit-item-id"
    }, {
      path: "/spit/item/:id?",
      component: _6deffc4a,
      name: "spit-item-id"
    }, {
      path: "/",
      component: _139af0f0,
      name: "index"
    }],

    fallback: false
  })
}
