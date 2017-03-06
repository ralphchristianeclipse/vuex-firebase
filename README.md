# vuex-firebase
Sync Firebase Data to Vuex

## How to Use

'js
    import Vue from 'vue';
    import Vuex from 'vuex';
    import FireBase from 'firebase';
    import VuexFirebase from 'vuex-firebase';
    Vue.use(Vuex);
    const store = new Vuex.Store(); //pass your store object
    
    VuexFirebase(store,FireBase,Vue);
    
    then use it on Vue Root
    
    new Vue({
        el: '#app',
        beforeCreate() {
            this.$store.dispatch('VUEX_FIREBASE_BIND', {
                users: {} // select the users node in firebase
            })
        }
    })
'