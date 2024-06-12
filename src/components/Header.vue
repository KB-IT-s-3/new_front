<template>
    <div class="Guide">
        <div class="Title" @click="GoMain"><span class="Title_text">{{title}}</span></div>
        <div class="Home_button" @click="GoHome"><span class="Home_buttonText">Home</span></div>
        <div class="Detail_button" @click="GoDetail"><span class="Detail_buttonText">Detail</span></div>
        <div class="User_button" @click="GoUser"><span class="User_buttonText">User</span></div>
    </div>
</template>
<script>
import { useUserStore } from "@/stores/userStore.js";
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import axios from 'axios';
export default {
    setup() {
        //My Budget Tracker
        const router = useRouter()
        const userStore = useUserStore();
        const title = ref('My Budget Tracker');

        const GoHome = () => {
            if(userStore.getLogin() == true)
            {
                router.push('./home')
            }
        }
        const GoUser = () => {
            if(userStore.getLogin() == true)
            {
                router.push('./user')
            }
        }
        const GoDetail = () => {
            if(userStore.getLogin() == true)
            {
                router.push('./details')
            }
        }

        const url = 'http://localhost:3002/user'
        
        watch(() => userStore.getLogin(), (newVal) => {
            if (newVal) {
                const username = userStore.getUser()
                title.value = `${username}'s Budget Tracker`;
            } else {
                title.value = 'My Budget Tracker';
            }
        });

        return { GoHome, GoUser, GoDetail, title }
    }
}
</script>
<style scoped>
* {
    box-sizing: border-box;
}

.Guide {
    width: 100%;
    height: 80px;
    background: rgba(254, 255, 226, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 2px solid rgba(90, 91, 45, 1);
}

.Title {
    padding: 14px 24px;
    background: rgba(254, 255, 226, 1);
}

.Title_text {
    color: rgba(90, 91, 45, 1);
    font-family: Inika;
    font-weight: bold;
    font-size: 48px;
    text-align: center;
}

.User_button, .Home_button, .Detail_button{
    padding: 14px 24px;
    margin-right: 40px;
    border-radius: 8px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
    background: rgba(251, 255, 226, 1);
    border :2px solid rgba(90, 91, 45, 1);
}

.User_buttonText, .Home_buttonText, .Detail_buttonText {
    color: rgba(90, 91, 46, 1);
    font-family: Inter;
    font-weight: medium;
    font-size: 25px;
}
.User_buttonText:hover, .Home_buttonText:hover, .Detail_buttonText:hover{
    cursor: pointer;
}
/* .User_button:hover{
    transition: transform 0.3s ease;
    transform: scale(1.1);
} */
</style>