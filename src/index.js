import FirebaseBind from './bind';
export default function(store, fb,Vue) {

    const state = {
        database: fb.database(),
        storage: fb.storage(),
        firebase: {},
    };

    const mutations = {
        //Mutation for setting the firebaseBind object
        //Using Vue.set to make it reactive
        VUEX_FIREBASE_BINDED(state,payload) {
            if(state.firebase[payload.ref]) return;
            Vue.set(state.firebase,payload.ref,payload);  
        },
        //Unbind the firebaseBind object
        VUEX_FIREBASE_UNBINDED(state,payload) {
            Vue.delete(state.firebase,payload.ref);  
        },
        
        VUEX_FIREBASE_ADDED(state, { index, record }) {
            state.firebase[record._ref].data.splice(index, 0, record);
        },
        VUEX_FIREBASE_CHANGED(state, { index, record }) {
            state.firebase[record._ref].data.splice(index, 1, record);
        },
        VUEX_FIREBASE_REMOVED(state, { index, record }) {
            state.firebase[record._ref].data.splice(index, 1);
        },
        VUEX_FIREBASE_MOVED(state, { index, record, newIndex }) {
            let array = state.firebase[record._ref].data;
            array.splice(newIndex, 0, state.firebase[record._ref].data.splice(index, 1)[0]);
        },
    };

    const getters = {
        // Get the FirebaseBind Object by passing its key or source
        $firebase(state) {
            return key => state.firebase[key];
        },
        //Firebase timestamp
        $timestamp(state) {
            return fb.database.ServerValue.TIMESTAMP;
        },
        //Getter for firebase.database()
        $database(state) {
            return state.database;
        },
        //firebase.storage()
        $storage(state) {
            return state.storage;
        },
    };

    const actions = {
        /*
            _ref = the target node ex. 'users'
            _key = the key for the data to send or you can omit it to use the push key
            _hook = used for chaining key actions based on the key value good for updating relations of nodes
            _time = set to true if you want to have created and updated time stamps
        */
        async VUEX_FIREBASE_SAVE({ getters, commit }, payload) {
            let { _ref, _key,_time,_hook, ...data,created,updated } = {...payload};
            console.log(data);
                _key = _key || getters.$database.ref(_ref).push().key;
                
                if(!_time) {
                    created = created || getters.$timestamp;
                    updated = getters.$timestamp;
                }
                
                await getters.$database.ref(_ref).child(_key).update({...data,created,updated});

            if(_hook && _key) {
               _hook(_key);
            }
        },
        //Create new FirebaseBind Objects based on keys
        VUEX_FIREBASE_BIND({commit},payload) {
            Object.keys(payload).forEach(load => {
                commit('VUEX_FIREBASE_BINDED',
                new FirebaseBind(fb.database().ref(load),payload[load],load));                
            })
        },
        //Unbind based on the pass key
        VUEX_FIREBASE_UNBIND({commit,getters},payload) {
            commit('VUEX_FIREBASE_UNBINDED',getters.$firebase(payload));
        }
    };
    
    let VuexFirebase = {
        state,
        getters,
        mutations,
        actions
    };
    
    store.registerModule('VuexFirebase', VuexFirebase);
    //Set the static store for FirebaseBind class
    FirebaseBind.store = store;
    
}