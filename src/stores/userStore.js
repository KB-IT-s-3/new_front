import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useUserStore = defineStore('user', ()=>{
    const state = reactive({user: "user1", login: false})
    const setUser=(Nowuser) =>{
            state.user = Nowuser;
        }
    const getUser = () => {
            return state.user;
        };
    const setLogin=() =>{
            state.login = true;
            console.log("login");
        }
    const setLogout=() =>{
            state.login = false;
            console.log("logout");
        }
    const getLogin = () => {
            return state.login;
        };

    
    return {state, setUser, getUser, setLogin, setLogout, getLogin}
});