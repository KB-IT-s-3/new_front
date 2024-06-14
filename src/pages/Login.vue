<template lang="">
    <div class="Left"></div>
    <h1>My Budget Tracker</h1>
    <p>"Logging in is the gateway to your financial journey, where security meets access and your financial management begins."</p>
    <div class="Right">
        <ul>
            <li class="input-container">
                <span class="icon">✉</span>
                <input type="text" v-model="id" placeholder="Enter your ID" />
            </li>
            <li class="input-container">
                <span class="icon">🔑</span>
                <input type="password" v-model="pwd" placeholder="Enter your password" />
            </li>
            <li><button class="button" @click="loginSubmitHandler">로그인</button></li>
        </ul>
    </div>
</template>

<script>
//저장된 아이디는 admin1~4 / 비번은 pwd1~4
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from "@/stores/userStore.js";
import { useRouter } from 'vue-router';
export default {
    setup() {
////변수 선언
        let id = ref('');
        let pwd = ref('');
        const url = 'http://localhost:3002/UserList';
        const userStore = useUserStore();
        const router = useRouter()

////아이디& 비번 확인
        const loginSubmitHandler = async () => {
            try {
                const result = await requestList();
                const user = result.find(user => user.id === id.value && user.pwd === pwd.value);
                if (user) {
                    userStore.setUser(user);    
                    userStore.setLogin();
                    router.push('./home')
                    alert('로그인 성공');
                } else {
                    alert('아이디 또는 비밀번호가 일치하지 않습니다.');
                }
            } catch (error) {
                console.error('로그인 요청 중 에러 발생:', error);
                alert('로그인 요청 중 문제가 발생했습니다. 나중에 다시 시도하세요.');
            }
        };
////json으로 부터 로그인 정보 받기
        const requestList = async () => {
            const response = await axios.get(url);
            return response.data;
        };

        return { id, pwd, loginSubmitHandler };
    },
};
</script>

<style scoped>
ul {
    list-style-type: none;
    width: 50%;
    position:absolute;
    top:40%;
    left:30%;
}
.input-container {
    position: relative;
}
.icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    font-size: 16px;
}
h1{
    width: 33%;
    color: rgba(90, 91, 45, 1);
    font-family: Inika;
    font-weight: bold;
    font-size: 32px;
    position: absolute;
    top: 40%;
    left: 10%;
    text-align: right;
}
p{
    width: 33%;
    color: rgba(90, 91, 45, 1);
    font-family: Inika;
    font-weight: bold;
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 9%;
    text-align: right;
}
.Right{
    width: 50%;
    height: 1024px;
    position:absolute;
    left:50%;
    background-color: white;
}
.Left{
    width: 50%;
    height: 1204px;
    background: rgba(252,255,178,1);
    opacity: 1;
    position: absolute;
    top: 3%;
    left: -12%;
    border-radius: 50%;
    transform: rotate(-34deg);

}

input {
    width: 100%;
    padding: 10px 10px 10px 30px;
    font-size: 16px;
    color: rgba(90, 91, 45, 1);
    font-family: Inika;
    font-weight: bold;
    border: none;
    border-bottom: 2px solid rgba(90, 91, 45, 1); 
    outline: none;

}
input::placeholder {
    color: #aaa; 
}
.button{
    width: 30%;
    margin-top: 20%;
    margin-left: 40%;
    font-family: Inika;
    font-weight: bold;
    font-size: 20px;
    color: rgba(90, 91, 45, 1);
}


.character{
    position:absolute;
    top:10%;
    left:35%;
}

@media (max-width: 1500px) {
    .button{
        font-size: 15px;
    }
}
@media (max-width: 1300px) {
    .button{
        font-size: 10px;
    }
}
@media (max-width: 1100px) {
    .button{
        font-size: 5px;
    }
}


</style>
