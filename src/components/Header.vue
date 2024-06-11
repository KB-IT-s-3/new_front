<template>
    <div class = "Guide">
        <div class="Title" @click = "GoMain"><span class="Title_text">My Budget Tracker</span></div>
        <div class="User_button" @click = "GoUser"><span class="User_buttonText">User</span></div>
    </div>
</template>
<script>
import { useRouter } from 'vue-router';
    export default{
        setup(){
            const router = useRouter()
            const GoMain = ()=>{
                router.push('./')
            }
            const GoUser = ()=>{
                router.push('./user')
            }
            return {GoMain, GoUser}
        }
    }
</script>
<style scoped>
* {
    box-sizing: border-box;
}
.Guide {
    width: 100%;
    height: 180px;
    background: rgba(254, 255, 226, 1);
    position: relative;
}
.Title, .User_button {
    padding: 14px 24px;
    margin: 8px;
    position: absolute;
    border-radius: 8px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
}
.Title {
    width: 535px;
    height: 100px;
    top: 24px;
    left: 0;
    background: rgba(254, 255, 226, 1);
}
.Title_text {
    width: 535px;
    color: rgba(90, 91, 45, 1);
    position: absolute;
    top: 14px;
    left: 52px;
    font-family: Inika;
    font-weight: bold;
    font-size: 48px;
    text-align: center;
}
.User_button {
    width: 80px;
    height: 80px;
    top: 34px;
    left: 1321px;
    background: rgba(251, 255, 156, 1);
}
.User_buttonText {
    width: 57px;
    color: rgba(90, 91, 46, 1);
    position: absolute;
    top: 21px;
    left: 15px;
    font-family: Inter;
    font-weight: medium;
    font-size: 25px;
}
</style>