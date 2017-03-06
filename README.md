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
        data() {
          return {
              user: {
                  _ref: 'users',
                  name: 'Ralph',
                  age: 21
              }
          }  
        },
        beforeCreate() {
            this.$store.dispatch('VUEX_FIREBASE_BIND', {
                users: { // select the users node in firebase
                         // this will listen to all the child_* events of the users node
                    hooks: {
                        added({index,record},store) {
                            //index of the record in the array,
                            //record is the snapshot containing _key as the snap.key and _ref as the source root "users"
                            //store used for chaining mutations
                            record.age += 1;
                            store.dispatch('SOME_MUTATION',record);
                            // this will alter the record before storing it on the main data state
                        }
                    }
                } 
            })
        },
        mounted() {
            // this will save the user on the 'users' node based on _ref value;
            this.$store.dispatch('VUEX_FIREBASE_SAVE',this.user);
            //passing it with a key will update or add the user on 'users 'node;
            this.$store.dispatch('VUEX_FIREBASE_SAVE',{...this.user,_key: 'KEY'});
            // passing only the _key and _ref will delete the user on 'users' node;
            this.$store.dispatch('VUEX_FIREBASE_SAVE',{_key: 'KEY',_ref: 'users'});
            
        }
    })
```