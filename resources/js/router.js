import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Vuex
import store from "./store";

// File Views
import LoginUser from './views/user/LoginUser.vue';
import RegisterUser from './views/user/RegisterUser.vue';
import LogoutUser from './views/user/LogoutUser.vue';
import Home from './views/service/main.vue';
import BuffShare from './views/service/buff-share.vue';
import BuffComment from './views/service/buff-comment.vue';
import Buff from './views/service/buff.vue';
import BuffShareOrCommentConfirm from './views/service/buff-confirm.vue';
import Payment from './views/service/payment.vue';
import PaymentOrder from './views/service/payment-order.vue';
import PaymentOrderConfirm from './views/service/payment-order-confirm.vue';
import Contact from './views/service/contact.vue';
import SettingUser from './views/service/settings-user.vue';
import ManageUser from './views/service/manage-user.vue';
import SettingFacebook from './views/service/settings-facebook.vue';
import SettingNotification from './views/service/settings-notification.vue';
import SettingPayment from './views/service/settings-payment.vue';

const routes = [
    // Service & Home
    { path: '/', name: 'home', component: Home, meta: { title: 'SupportLive' }},

    { path: '/buff', name: 'buff-share', component: BuffShare, meta: { requiresAuth: true, title: 'SupportLive | Facebook Buff Share' }},
    { path: '/buff', name: 'buff-comment', component: BuffComment, meta: { requiresAuth: true, title: 'SupportLive | Facebook Buff Comment' }},
    // Buff Like, View, Live
    { path: '/buff', name: 'buff', component: Buff, meta: { requiresAuth: true, title: 'SupportLive | Facebook Buff Service' }},

    { path: '/payment', name: 'payment', component: Payment, meta: { requiresAuth: true, title: 'SupportLive | Payment' }},
    { path: '/payment/:order_code', name: 'payment-order', component: PaymentOrder, meta: { requiresAuth: true, title: 'SupportLive | Payment Confirm' }},
    { path: '/user/:username/profile', name: 'setting-user', component: SettingUser, meta: { requiresAuth: true, title: 'SupportLive | Profile' }},
    { path: '/contact', name: 'contact', component: Contact, meta: { title: 'SupportLive | Contact' }},

    // Admin
    { path: '/buff/:id/confirm', name: 'buff-share-or-comment-confirm', component: BuffShareOrCommentConfirm, meta: { requiresAdmin: true, title: 'SupportLive | Facebook Confirm Buff' }},
    { path: '/payment/:order_code/confirm', name: 'payment-order-confirm', component: PaymentOrderConfirm, meta: { requiresAdmin: true, title: 'SupportLive | Payment Confirm' }},
    
    { path: '/manage-user', name: 'manage-user', component: ManageUser, meta: { requiresAdmin: true, title: 'SupportLive | Manage User' }},

    { path: '/settings-facebook', name: 'settings-facebook', component: SettingFacebook, meta: { requiresAdmin: true, title: 'SupportLive | Facebook Settings' }},
    { path: '/settings-notification', name: 'settings-notification', component: SettingNotification, meta: { requiresAdmin: true, title: 'SupportLive | Notifications Settings' }},
    { path: '/settings-payment', name: 'settings-payment', component: SettingPayment, meta: { requiresAdmin: true, title: 'SupportLive | Payment Settings' }},

    // User
    { path: '/login', name: 'login', component: LoginUser, meta: { requiresVisitor: true, title: 'SupportLive | Login' }},
    { path: '/register', name: 'register', component: RegisterUser, meta: { requiresVisitor: true, title: 'SupportLive | Register' }},
    { path: '/logout', name: 'logout', component: LogoutUser},

    { path: '/:pathMatch(.*)*', redirect: { name: 'home' }}
    //requiresAuth : Nếu chưa Login thì không được truy cập
    //requiresVisitor : Nếu đã Login thì không được truy cập
];

const router = new VueRouter({
    mode:'history',
    routes
});

window.popStateDetected = false
window.addEventListener('popstate', () => {
  window.popStateDetected = true
})

// READ TITLE
router.beforeEach((to, from, next) => {
    let title = to.meta.title || 'SupportLive';
    document.title = title;
    next();

    const isBackButton = window.popStateDetected
    window.popStateDetected = false

    if (isBackButton) {
        next({
            name: 'home',
        })
        window.location.reload()
    } else if (to.meta.requiresAuth) {
        if (!store.getters.loggedIn) {
            next({
                name: 'login',
            })
        } else {
            next()
        }
    } else if (to.meta.requiresAdmin) {
        if (!store.getters.loggedIn) {
            next({
                name: 'login',
            })
        } else {
            if (store.getters.getUser.roles != '1') {
                next({
                    name: 'home',
                })
            } else {
                next()
            }
        }
    } else if (to.meta.requiresVisitor) {
        if (store.getters.loggedIn) {
            next({
                name: 'home',
            })
        } else {
            next()
        }
    } else {
        next()
    }
});

export default router;