<template>
    <div class="Guide">
        <div class="Title" @click="GoMain"><span class="Title_text">My Budget Tracker</span></div>
        <div class="User_button" @click="GoUser"><span class="User_buttonText">User</span></div>
    </div>
</template>
<script>
import { useRouter } from 'vue-router';
export default {
    setup() {
        const router = useRouter()
        const GoMain = () => {
            router.push('./')
        }
        const GoUser = () => {
            router.push('./user')
        }
        return { GoMain, GoUser }
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

.User_button {
    padding: 14px 24px;
    margin-right: 40px;
    border-radius: 8px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
    background: rgba(251, 255, 156, 1);
}

.User_buttonText {
    color: rgba(90, 91, 46, 1);
    font-family: Inter;
    font-weight: medium;
    font-size: 25px;
}
.User_buttonText:hover, .Title_text:hover{
    cursor: pointer;
}
.User_button:hover, .Title:hover{
    transition: transform 0.3s ease;
    transform: scale(1.1);
}
</style>