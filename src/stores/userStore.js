import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useUserStore = defineStore('user', ()=>{
    const state = reactive({user: "user1"})
    const setUser=(Nowuser) =>{
            state.user = Nowuser;
        }
    const getUser = () => {
            return state.user;
        };

    
    return {state, setUser, getUser}
});