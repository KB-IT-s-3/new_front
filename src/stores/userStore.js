import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useUserStore = defineStore('user', ()=>{
    const Login = reactive({login: false})
    const User = reactive({})
    const TargetChange = reactive({change: false, value:""})
    const setTargetChange = (nowtarget)=>{
        TargetChange.value = nowtarget;
        TargetChange.change = !TargetChange.change;
        console.log('setTargetChange:', TargetChange);  // 디버깅용 로그
    }
    const getTargetChange = ()=>{
        return TargetChange.change;
    }
    const getTargetValue = ()=>{
        console.log('getTargetValue:', TargetChange.value);  // 디버깅용 로그
        return TargetChange.value;
    }
    const setUser=(Nowuser) =>{
            Object.assign(User, Nowuser);
        }
    const getUser = () => {
            return User.key;
        };
    const getUserAll = ()=>{
            return User;
    }
    const gettarget = ()=>{
        return User.target;
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

    
    return {Login, User, setUser, getUser, getUserAll, gettarget, setLogin, setLogout, getLogin, TargetChange, setTargetChange, getTargetChange, getTargetValue}
});
