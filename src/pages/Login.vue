<template lang="">
    <div class="Left"></div>
    <h1>이것은 제목입니다 허허...</h1>
    <div class="Right">
        <!-- <ul>
            <li><input type="text" v-model="id" placeholder="✉ Enter your ID" /></li>
            <li><input type="password" v-model="pwd" placeholder="🔑 Enter your password"/></li>
            <li><button class="button" @click="loginSubmitHandler">Login</button></li>
        </ul> -->
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
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from "@/stores/userStore.js";
import { useRouter } from 'vue-router';
export default {
    setup() {
        let id = ref('');
        let pwd = ref('');
        const url = 'http://localhost:3002/UserList';
        const userStore = useUserStore();
        const router = useRouter()


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
    color: rgba(90, 91, 45, 1);
    font-family: Inika;
    font-weight: bold;
    font-size: 32px;
    position: absolute;
    top: 40%;
    left: 13%;
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
    color: #aaa; /* 플레이스홀더 색상 */
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

</style>
