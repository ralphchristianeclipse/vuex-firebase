import { FirebaseBind } from './bind';
export function firebaseSync(store, fb) {
    let Vue = store._watcherVM;
    const state = {
        database: fb.database(),
        storage: fb.storage(),
        firebase: {},
    };

    const mutations = {
        VUEX_FIREBASE_BINDED(state,payload) {
            if(state.firebase[payload.ref]) return;
            Vue.set(state.firebase,payload.ref,payload);  
        },
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
        
        $firebase(state) {
            return key => state.firebase[key];
        },
        $timestamp(state) {
            return fb.database.ServerValue.TIMESTAMP;
        },
        $database(state) {
            return state.database;
        },
        $storage(state) {
            return state.storage;
        },
    };

    const actions = {
        async SAVE({ getters, commit }, payload) {
            let { _ref, _key,_hook,_time, ...data } = {...payload};

            if(!_time) {
                data.created = getters.$timestamp;
                data.updated = getters.$timestamp;
            }
            if(_key) {
              await getters.$database.ref(_ref).child(_key).update(data);
            } else {
               _key = await getters.$database.ref(_ref).push(data).key;
            }
            if(_hook) {
               _hook(_key);
            }
        },
        VUEX_FIREBASE_BIND({commit},payload) {
            Object.keys(payload).forEach(load => {
                commit('VUEX_FIREBASE_BINDED',
                new FirebaseBind(fb.database().ref(load),payload[load],load));                
            })
        },
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
    FirebaseBind.store = store;
    
}