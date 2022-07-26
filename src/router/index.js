import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
// import tableRouter from './modules/table'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const constantRoutes = [
  {
    path: "/kanbang",
    component: () => import("@/views/kanbang"),
    hidden: true
  },
  {
    path: "/diaLogue",
    component: () => import("@/views/dia-logue")
  },
  {
    path: "/scatter",
    component: () => import("@/views/scatter")
  },
  //大数据科卫一楼展厅看板投屏
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: resolve => require(["@/views/redirect"], resolve)
      }
    ]
  },
  {
    path: "/login",
    component: resolve => require(["@/views/login"], resolve),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "index",
        component: resolve => require(["@/views/welcome"], resolve),
        name: "Dashboard",
        meta: {
          title: "首页",
          icon: "iconshouye-copy"
        }
      }
    ]
  },
  {
    path: "/auth-redirect",
    component: resolve => require(["@/views/login/auth-redirect"], resolve),
    hidden: true
  },
  {
    path: "/404",
    component: resolve => require(["@/views/error-page/404"], resolve),
    hidden: true
  },
  {
    path: "/401",
    component: resolve => require(["@/views/error-page/401"], resolve),
    hidden: true
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
