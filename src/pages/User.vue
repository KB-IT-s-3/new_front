<template>
    <div class="Guide">
        <div class="Image"><img :src = "NowUser.image" alt="User Image"></div>
        <span class="Name">이름: </span>
        <span class="Email">이메일:</span>
        <span class="Target">목표예산:</span>
        <span class="Gender">성별:</span>
        <span class="Age">나이:</span>
        <input class="Name_tag" v-model="NowUser.name" ></input>
        <input class="Age_tag" v-model="NowUser.age" @change = "UpdateData"></input>
        <input class="Gender_tag" v-model="NowUser.gender"></input>
        <input class="Email_tag" v-model="NowUser.email"></input>
        <input class="Target_tag" v-model="NowUser.target"></input>


        <div class="sidebar">
        <div class="sidebar-content">
            <div class="User1Box" ></div>
            <div class="User2Box" ></div>
            <div class="User3Box" ></div>
            <div class="User4Box" ></div>
            <span class="User1Text" @click = "ChangeUser(1)">User1</span>
            <span class="User2Text" @click = "ChangeUser(2)">User2</span>
            <span class="User3Text" @click = "ChangeUser(3)">User3</span>
            <span class="User4Text" @click = "ChangeUser(4)">User4</span>
        </div>
    </div>

    </div>

</template>

<script>
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import {useUserStore} from "@/stores/userStore.js";
export default{
    setup(){
        let Lists = reactive([])
        let NowUser = reactive([])
        let usernumber = 1
        const url = 'http://localhost:3002/user'

        const userStore = useUserStore();
        console.log(userStore.getUser())
        const gettingname = userStore.getUser;
        const numberString = gettingname.replace(/\D/g, '');
        const number = parseInt(numberString, 10);
        console.log(number)

        onMounted( async ()=>{  
            const result = await requestList()
            Object.assign(Lists, result) 
            Object.assign(NowUser, Lists[usernumber-1])
            userStore.setUser(NowUser.name)
        }) 
        const requestList = async()=>{
            const response = await axios.get(url)
            return response.data
        }
        const ChangeUser = (number)=>{
            usernumber = number
            Object.assign(NowUser, Lists[usernumber-1])
            userStore.setUser(NowUser.name)
        }

        const UpdateData = async(e)=>{
            try{
                const response = await axios.put(`${url}/${NowUser.id}`, NowUser) 
                console.log(response.data)
                }catch(err){
                    alert(err.response.data)
                }
        }
        

        return{ NowUser, requestList, ChangeUser, UpdateData, userStore}
    }
}
</script>
<style scoped>
* {
    box-sizing: border-box;
}
body {
    font-size: 14px;
}
.Guide {
    width: 100%;
    height: 844px;
    background: rgba(254, 255, 226, 1);
    position: relative;
    overflow: hidden;
}
.Image {
    width: 382px;
    height: 537px;
    background: rgba(253, 253, 253, 1);
    position: absolute;
    top: 74px;
    left: 49px;
    border: 1px solid rgba(90, 91, 46, 1);
    border-radius: 15px;
    display: flex;
}
img{
    width: 100%
}
.Name, .Age, .Gender, .Email, .Target {
    width: 426px;
    color: rgba(90, 91, 46, 1);
    position: absolute;
    font-family: Inika;
    font-weight: bold;
    font-size: 40px;
    text-align: center;
}
.Name { top: 74px; left: 589px; }
.Age { top: 203px; left: 589px; }
.Gender { top: 332px; left: 589px; }
.Email { top: 446px; left: 573px; }
.Target { top: 564px; left: 559px; }
.Name_tag, .Age_tag, .Gender_tag, .Email_tag, .Target_tag {
    width: 357px;
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
}
.Name_tag { top: 74px; left: 899px; }
.Age_tag { top: 203px; left: 899px; }
.Gender_tag { top: 332px; left: 899px; }
.Email_tag { top: 446px; left: 899px; }
.Target_tag { top: 564px; left: 899px; }

.sidebar {
    position: fixed;
    top: 0;
    right: -97%;
    width: 100%;
    height: 100%;
    background-color: rgba(251, 255, 156, 1);
    transition: right 0.3s ease;
}
.sidebar:hover {
    right: -75%;
}
.sidebar-content {
    padding: 20px;
}
.User1Box, .User2Box, .User3Box, .User4Box{
    width: 353px;
    height: 84px;
    background: rgba(255, 255, 255, 1);
    opacity: 1;
    position: absolute;
    border: 1px solid rgba(90, 91, 46, 1);
    border-radius: 8px;
}
.User1Box { top: 106px; left: 45px; }
.User2Box { top: 236px; left: 45px; }
.User3Box { top: 365px; left: 45px; }
.User4Box { top: 503px; left: 45px; }

.User1Text, .User2Text, .User3Text, .User4Text{
    width: 299px;
    color: rgba(90, 91, 46, 1);
    position: absolute;
    font-family: Inter;
    font-weight: Medium;
    font-size: 32px;
    opacity: 1;
    text-align: center;
}
.User1Text { top: 125px; left: 68px; }
.User2Text { top: 255px; left: 68px; }
.User3Text { top: 384px; left: 68px; }
.User4Text { top: 522px; left: 68px; }
</style>