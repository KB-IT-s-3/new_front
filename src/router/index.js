import { createRouter, createWebHistory } from "vue-router";

import Details from '@/pages/Details.vue'
import DetailsAdd from '@/pages/DetailsAdd.vue'
import Home from '@/pages/Home.vue'
import User from '@/pages/User.vue'
import Login from '@/pages/Login.vue'  


const router = createRouter({
    history: createWebHistory(),
    routes : [
        {path:'/details', component:Details},
        {path:'/detailsadd', component:DetailsAdd},
        {path:'/user', component:User},
        {path:'/home', component:Home},
        {path:'/', component:Login},
    ]   
})
export default router;