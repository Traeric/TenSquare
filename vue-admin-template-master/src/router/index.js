import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/
export const constantRouterMap = [
    { path: '/login', component: () => import('@/views/login/index'), hidden: true },
    { path: '/404', component: () => import('@/views/404'), hidden: true },
    // 基本信息管理
    {
        path: '/example',
        component: Layout,
        redirect: '/example/table',
        name: 'Example',
        meta: { title: '基本信息管理', icon: 'example' },
        children: [
            {
                path: 'table',
                name: 'Table',
                component: () => import('@/views/table/index'),
                meta: { title: '城市管理', icon: 'table' }
            },
            {
                path: 'tree',
                name: 'Tree',
                component: () => import('@/views/tree/index'),
                meta: { title: '标签管理', icon: 'tree' }
            }
        ]
    },
    // 活动管理
    {
        path: '/gathering',
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('@/views/table/gathering'),
                meta: { title: '活动管理', icon: 'form' }
            }
        ]
    },
    // 招聘管理
    {
        path: "/recruit",
        component: Layout,
        meta: { title: '招聘管理', icon: 'example' },
        children: [
            {
                path: 'recruit',
                component: () => import('@/views/table/recruit'),
                meta: {
                    title: "招聘信息",
                    icon: "tree",
                },
            },
            {
                path: 'enterprise',
                component: () => import('@/views/table/enterprise'),
                meta: {
                    title: "企业管理",
                    icon: "table",
                }
            }
        ],
    },
    // 文章管理
    {
        path: "/article",
        component: Layout,
        meta: { title: '文章管理', icon: 'form' },
        children: [
            // 频道
            {
                path: "channel",
                component: () => import("@/views/table/channel"),
                meta: {title: "频道管理", icon: "table"}
            },
            // 专栏
            {
                path: "column",
                component: () => import("@/views/table/column"),
                meta: {title: "专栏审核", icon: "tree"},
            },
            // 文章
            {
                path: "article",
                component: () => import("@/views/table/article"),
                meta: {title: "文章审核", icon: "example"},
            },
        ],
    },
    { path: '*', redirect: '/404', hidden: true }
];

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})
