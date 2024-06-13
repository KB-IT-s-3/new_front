<template>
    <div :class="['Guide', { 'header-active': isHeaderActive }]">
        <div class="Title" @click="GoMain"><span class="Title_text">{{title}}</span></div>
        <span :class="['Home_buttonText', { 'home-active': isSidebarActive }]" @click="GoHome">Home</span>
        <span :class="['Detail_buttonText', { 'detail-active': isSidebarActive }]" @click="GoDetail">Detail</span>
        <span :class="['User_buttonText', { 'user-active': isSidebarActive }]" @click="SidebarOn">User</span>
    </div>
    <div :class="['sidebar', { 'sidebar-active': isSidebarActive }]">
        <div class="sidebar-content">
            <div class="logout" @click = "Logout">Logout</div>
            <div class="sidebarOut" @click = "SidebarOff"><img src = "../../public/point.png"></div>
            <div class="Image"><img :src = "NowUser.image" alt="User Image"></div>
            <input class="Name_tag" v-model="NowUser.name" @change = "UpdateData"></input>
            <input class="Age_tag" v-model="NowUser.age" @change = "UpdateData"></input>
            <input class="Gender_tag" v-model="NowUser.gender" @change = "UpdateData"></input>
            <input class="Email_tag" v-model="NowUser.email" @change = "UpdateData"></input>
            <input class="Target_tag" v-model="NowUser.target" @change = "UpdateData"></input>
        </div>
        <img src="../../public/character.png" class="character">
    </div>
</template>
<script>
import { useUserStore } from "@/stores/userStore.js";
import axios from 'axios';
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
export default {
    setup() {
////변수
        const router = useRouter()
        const userStore = useUserStore();
        const title = ref('My Budget Tracker');
        const isSidebarActive = ref(false);
        const isHeaderActive = ref(false);
        const url = 'http://localhost:3002/UserList'
        const NowUser = reactive([])

////라우터 이동
        const GoHome = () => {
            SidebarOff()
            router.push('./home')
        }
        const GoDetail = () => {
            SidebarOff()
            router.push('./details')
        }
        const Logout = ()=>{
            userStore.setLogout();
            SidebarOff()
            router.push('./')
        }

////로그인 여부 파악& header lock& 현재 유저 정보 받아오기
        watch(() => userStore.getLogin(), (newVal) => {
            if (newVal) {
                const List = userStore.getUserAll()
                Object.assign(NowUser, List);
                title.value = `${NowUser.name}'s Budget Tracker`;
                isHeaderActive.value = true;

            } else {
                title.value = 'My Budget Tracker';
                isHeaderActive.value=false;
            }
        });

        
////사이드바 제어
        const SidebarOn = () => {
            isSidebarActive.value = true;
        };
        const SidebarOff = () => {
            isSidebarActive.value = false;
        };

//// 사이드 바 사용자 정보 업데이트
        const UpdateData = async(e)=>{
            console.log(NowUser)
            // console.log(`${url}/${NowUser.item}`)
            // console.log(`${url}/${NowUser.key}`)
            // console.log(`${url}/${NowUser.value.key}`)
            try{
                const response = await axios.put(`${url}/${NowUser.id}`, {id:NowUser.id, pwd:NowUser.pwd, key:NowUser.key, name:NowUser.name, age:NowUser.age, email:NowUser.email, gender:NowUser.gender, target:NowUser.target, image:NowUser.image}) 
                console.log(response)
            }catch(err){
                    alert(err.response) 
                }
        }

        return { GoHome, GoDetail, title, Logout, SidebarOn, SidebarOff, isSidebarActive, NowUser, UpdateData, isHeaderActive }
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
    position: relative;
    display: none;
}
.header-active{
    display: block;
}

.Title {
    padding: 0px 0px;
    flex-grow: 1;
    background: rgba(254, 255, 226, 1);
    max-width: 60%;  /* 선의 위치를 맞춤 */
    position: relative; 
}

.Title_text {
    color: rgba(90, 91, 45, 1);
    font-family: Inika;
    font-weight: bold;
    font-size: 48px;
    text-align: center;
}

.Title::after {
    content: "";
    position: absolute;
    bottom: -2px;  /* 선을 타이틀 밑에 배치 */
    width: 130%;  /* 선의 길이를 설정 */
    border-bottom: 2px solid rgba(90, 91, 45, 1);
}

.User_buttonText, .Home_buttonText, .Detail_buttonText {
    color: rgba(90, 91, 46, 1);
    margin-top: 10px;
    position: absolute;
    top:3.5%;
    font-family: Inter;
    font-weight: large;
    font-size: 30px;
    transition: left 0.5s ease;
}
.Home_buttonText{
    left: 55%;
    margin-right: 20px
}
.Detail_buttonText{
    left: 70%;
}
.User_buttonText{
    left: 85%;
}
.home-active{
    left:56%;
}
.detail-active{
    left:66%;
}
.user-active{
    left:96%;
}
.User_buttonText:hover, .Home_buttonText:hover, .Detail_buttonText:hover, .sidebarOut, .logout{
    cursor: pointer;
}

.sidebar>.character{
    width: 13%;
    position: absolute;
    top: 800px;
    left: 4%
}
.sidebar {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100%;
    background-color:rgba(254, 255, 226, 1);
    transition: right 0.5s ease;
}
.sidebar-active {
    right: -80%;
    background-color: rgba(251, 255, 156, 1);
}


.sidebar-content {
    padding: 20px;
}

.sidebarOut{
    position: absolute;
    width: 5%;
    top: 30px;
}
.sidebarOut>img{
    width: 30%;
}

.logout{
    position: absolute;
    width:4.5%;
    top: 25px;
    left:15%;
    color: rgba(90, 91, 46, 1);
    border: 2px solid rgba(90, 91, 46, 1);
    border-radius: 8px;
    font-family: Inter;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
}

.Name_tag, .Age_tag, .Gender_tag, .Email_tag, .Target_tag {
    width: 220px;
    height: 66px;
    background: rgba(255, 255, 255, 1);
    position: absolute;
    border: 1px solid rgba(90, 91, 46, 1);
    border-radius: 8px;
    color: rgba(90, 91, 46, 1);
    position: absolute;
    font-family: Inika;
    font-weight: bold;
    font-size: 35px;
    text-align: center;
    left: 0%;
    margin-left: 5%;
}
.Name_tag { top: 300px; } /*429*/ 
.Age_tag { top: 400px; }
.Gender_tag { top: 500px;  }
.Email_tag { top: 600px;  font-size: 20px;}
.Target_tag { top: 700px; }

.Image {
    width: 8%;
    background: rgba(253, 253, 253, 1);
    position: absolute;
    top: 75px;  /*74*/
    left: 7%;
    border: 1px solid rgba(90, 91, 46, 1);
    border-radius: 15px;
    display: flex;
}
img{
    width: 100%
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .Title {
        max-width: 100%;
    }

    .Title_text {
        font-size: 24px;
    }

    .User_buttonText, .Home_buttonText, .Detail_buttonText {
        font-size: 16px; 
        margin-left: 5px;
        margin-top: 5px;
    }

    .Title::after {
        left: 0;
        width: 100%;
    }
}

</style>