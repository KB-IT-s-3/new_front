<template>
    <div class="Guide">
        <div class="Body">
            <div class="Image"><img :src = "NowUser.image" alt="User Image"></div>
            <span class="Name">이름: </span>
            <span class="Email">이메일:</span>
            <span class="Target">목표예산:</span>
            <span class="Gender">성별:</span>
            <span class="Age">나이:</span>
            <input class="Name_tag" v-model="NowUser.name" @change = "UpdateData"></input>
            <input class="Age_tag" v-model="NowUser.age" @change = "UpdateData"></input>
            <input class="Gender_tag" v-model="NowUser.gender" @change = "UpdateData"></input>
            <input class="Email_tag" v-model="NowUser.email" @change = "UpdateData"></input>
            <input class="Target_tag" v-model="NowUser.target" @change = "UpdateData"></input>
        </div>

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
            <div class="Point">
                <img src = "../../public/point.png">
            </div>
        </div>
    </div>

</template>

<script>
import { onMounted, reactive } from 'vue';
import axios from 'axios';
import {useUserStore} from "@/stores/userStore.js";
export default{
    setup(){
        let Lists = reactive([])
        let NowUser = reactive([])
        const url = 'http://localhost:3002/user'
        let usernumber 
        const userStore = useUserStore();

        

        const ChangeNumber = ()=>{
            const str = userStore.getUser()
            const regex = /[^0-9]/g;
            const result = str.replace(regex, "");
            const usernumber = parseInt(result);
            console.log(usernumber)
            return usernumber
        }


        onMounted( async ()=>{  
            const result = await requestList()
            Object.assign(Lists, result) 
            usernumber = ChangeNumber()
            Object.assign(NowUser, Lists[usernumber-1])
        }) 
        const requestList = async()=>{
            const response = await axios.get(url)
            return response.data
        }

        const ChangeUser = (number)=>{
            usernumber = number
            Object.assign(NowUser, Lists[usernumber-1])
            userStore.setUser(NowUser.name)
            console.log(usernumber)
        }


        const UpdateData = async(e)=>{
            try{
                const response = await axios.put(`${url}/${NowUser.id}`, {age:NowUser.age, name:NowUser.name, email:NowUser.email, target:NowUser.target, gender:NowUser.gender, image:NowUser.image}) 
                const result = await requestList()
                Object.assign(Lists, result) 
                Object.assign(NowUser, Lists[usernumber-1])
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
.Guide {
    width: 100%;
    height: 1200px;
    background: rgba(254, 255, 226, 1);
    position: relative;
    overflow: hidden;
}
.Body{
    margin-left: 100%;
}
.Image {
    width: 382px;
    height: 537px;
    background: rgba(253, 253, 253, 1);
    position: absolute;
    top: 74px;  /*74*/
    left: 15%;
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
.Name { top: 74px; left: 45%; } 
.Age { top: 203px; left: 45%; }
.Gender { top: 332px; left: 45%; }
.Email { top: 446px; left: 44%; }
.Target { top: 564px; left: 43%; } 

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
    left: 56%;
    margin-left: 5%;
}
.Name_tag { top: 74px; } 
.Age_tag { top: 203px; }
.Gender_tag { top: 332px;  }
.Email_tag { top: 446px;  }
.Target_tag { top: 564px; }

.sidebar {
    position: fixed;
    top: 0;
    right: -98%;
    width: 100%;
    height: 100%;
    background-color:rgba(254, 255, 226, 1);
    transition: right 0.5s ease;
}
.sidebar:hover {
    right: -80%;
    background-color: rgba(251, 255, 156, 1);
}
.sidebar-content>span:hover{
    cursor: pointer;
    transition: transform 0.3s ease;
    transform: scale(1.1);
}

.sidebar-content {
    padding: 20px;
}
.Point{
    position: relative;
    top: 420px;
}
.Point>img{
    width: 2%;
    transform: scaleX(-1);
}
.User1Box, .User2Box, .User3Box, .User4Box{
    /* width: 300px; */
    width:12%;
    height: 84px;
    background: rgba(255, 255, 255, 1);
    opacity: 1;
    position: absolute;
    border: 1px solid rgba(90, 91, 46, 1);
    border-radius: 8px;
}
.User1Box { top: 106px; left: 4%; }
.User2Box { top: 236px; left: 4%; }
.User3Box { top: 366px; left: 4%; }
.User4Box { top: 496px; left: 4%; }

.User1Text, .User2Text, .User3Text, .User4Text{
    /* width: 299px; */
    width:10%;
    color: rgba(90, 91, 46, 1);
    position: absolute;
    font-family: Inter;
    font-weight: Medium;
    /* font-size: 32px; */
    font-size: 250%;
    opacity: 1;
    text-align: center;
}
.User1Text { top: 121px; left: 5%; }
.User2Text { top: 251px; left: 5%; }
.User3Text { top: 381px; left: 5%; }
.User4Text { top: 511px; left: 5%; }
</style>