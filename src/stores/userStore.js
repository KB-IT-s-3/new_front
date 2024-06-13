import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useUserStore = defineStore('user', ()=>{
    const Login = reactive({login: false})
    const User = reactive({})
    const setUser=(Nowuser) =>{
            Object.assign(User, Nowuser);
            console.log(User)
        }
    const getUser = () => {
            return User.key;
        };
    const getUserAll = ()=>{
            return User;
    }
    const setLogin=() =>{
            Login.login = true;
            console.log("login");
        }
    const setLogout=() =>{
            Login.login = false;
            console.log("logout");
        }
    const getLogin = () => {
            return Login.login;
        };

    
    return {Login, User, getTarget, setUser, getUser, getUserAll, setLogin, setLogout, getLogin}
});