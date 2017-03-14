# vuex-firebase
Sync Firebase Data to Vuex

### Installation
    npm install vuex-firebase --save
    
### Update
    Changed the scope of _key and _ref to
    _: {
        ref: '',
        key: ''
    }
    This change is for deleting purposes
### How to Use

```js
    import Vue from 'vue';
    import Vuex from 'vuex';
    import FireBase from 'firebase';
    import VuexFirebase from 'vuex-firebase';
    Vue.use(Vuex);
    
    let Store = {
        getters: {
            posts(state,getters) {
              return getters.$firebase('posts').data.map(post => {
                return {
                    post,
                    user: getters.users.find(({user}) => user._.key == post.user);
                } 
              });
            },
            users(state,getters) {
                return getters.$firebase('users').data.map(user => {
                    return {
                        user
                    }
                })
            }
        }
    }
    let config = {
        //Firebase config
    }
    FireBase.initializeApp(config);
    const store = new Vuex.Store(Store); //pass your store object
    
    VuexFirebase(store,FireBase);
    
    //then use it on Vue Root
    
    new Vue({
        el: '#app',
        store,
        data() {
          return {
              user: {
                  _: {
                    ref: 'users',
                    time: true, // if you don't want a time stamp to be added
                    hook: key => {
                        //a hook for the key of the user object useful when you're adding by push and you want to chain it
                        //add a post when a user is added
                        let post = {
                            _: {
                                ref: 'posts'
                            },
                            title: 'Welcome New User',
                            body: 'Start binding vuex to firebase with VuexFirebase'
                            user: key
                        }
                    }
                  },
                  name: 'Ralph',
                  age: 21
              },
              post: {
                  _: {
                    ref: 'posts',
                  },
                  title: 'My New Post',
                  body: 'This is a cool post',
                  user: 'KEY'
              }
          }  
        },
        mounted() {
        
            // this will save the user on the 'users' node based on _ref value;
            this.$store.dispatch('VUEX_FIREBASE_SAVE',this.user);
            // will add the user by push key if no _key is specified inside the object
            this.$store.dispatch('VUEX_FIREBASE_SAVE',this.post);
            
            //passing it with a key will update or add the user on 'users 'node;
            this.$store.dispatch('VUEX_FIREBASE_SAVE',{...this.user,_.key: 'KEY'});
            // same as this also
            this.user._.key = 'KEY';
            this.$store.dispatch('VUEX_FIREBASE_SAVE',this.user);
            
            // passing only the _ will delete the user on 'users' node;
            this.$store.dispatch('VUEX_FIREBASE_SAVE',this.user._);
            
        }
    })
    // You can use it here on initialization or dispatch in any vue component
    store.dispatch('VUEX_FIREBASE_BIND', { // also remember that the nodes will be sequentially listen so please put the main node to the upper par
        users: { // select the users node in firebase
                 // this will listen to all the child_* events of the users node
            hooks: {
                added({index,record},store) { // added hook when child_added event is fired
                    //index of the record in the array,
                    //record is the snapshot containing _key as the snap.key and _ref as the source root "users"
                    //store used for chaining mutations
                    record.age += 1;
                    store.dispatch('SOME_MUTATION',record); // or send the record to another mutation for other purposes
                    // this will alter the record before storing it on the main data state
                },
                changed({index,record},store) {}, // child_changed event hook,
                moved({index,record},store) {}, // child_moved event hook
                removed({index,record},store) { // child_removed event hook useful for cascade deleting or using with firebase storage deletions
                    let posts = store.getters.posts.filter(({post}) =? post._.key == record._.key);
                    posts.forEach(({post}) => { // must be equal to post object in getters.posts using object destructuring
                        store.dispatch('VUEX_FIREBASE_SAVE',post._); // delete the posts owned by the user
                    })
                } 
            }
        },
        posts: {},
    }),
    // You can also unbind it using
    store.dispatch('VUEX_FIREBASE_UNBIND',{
        users: {}, // unbind both of this
        posts: {} 
    })
```
