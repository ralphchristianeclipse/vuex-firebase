# vuex-firebase
Sync Firebase Data to Vuex

## How to Use

```js
    import Vue from 'vue';
    import Vuex from 'vuex';
    import FireBase from 'firebase';
    import VuexFirebase from 'vuex-firebase';
    Vue.use(Vuex);
    
    let Store = {
        getters: {
            users(state,getters) {
                return getters.$firebase('users').data.map(user => {
                    return {
                        user
                    }
                })
            }
        }
    }
    
    const store = new Vuex.Store(Store); //pass your store object
    
    VuexFirebase(store,FireBase,Vue);
    
    //then use it on Vue Root
    
    new Vue({
        el: '#app',
        beforeCreate() {
            this.$store.dispatch('VUEX_FIREBASE_BIND', {
                users: { // select the users node in firebase
                         // this will listen to all the child_* events of the users node
                    hooks: {
                        added({index,record},store) {
                            //index of the record in the array,
                            //record is the snapshot containing _key as the snap.key and _ref as the source root "users"
                            //store used for chaining mutations
                        }
                    }
                } 
            })
        }
    })
```