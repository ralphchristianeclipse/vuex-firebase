import FirebaseBind from './bind';
export default function (store, fb) {
	const Vue = store._watcherVM || store._vm;
	const state = {
		auth: fb.auth(),
		database: fb.database(),
		storage: fb.storage(),
		firebase: {},
	};

	const mutations = {
		//Mutation for setting the firebaseBind object
		//Using Vue.set to make it reactive
		VUEX_FIREBASE_BINDED(state, payload) {
			if (state.firebase[payload.ref]) return;
			Vue.$set(state.firebase, payload.ref, payload);
		},
		//Unbind the firebaseBind object
		VUEX_FIREBASE_UNBINDED(state, payload) {
			Vue.$delete(state.firebase, payload.ref);
		},

		VUEX_FIREBASE_ADDED(state, {index, record}) {
			state.firebase[record._.ref].data.splice(index, 0, record);
		},
		VUEX_FIREBASE_CHANGED(state, {index, record}) {
			state.firebase[record._.ref].data.splice(index, 1, record);
		},
		VUEX_FIREBASE_REMOVED(state, {index, record}) {
			state.firebase[record._.ref].data.splice(index, 1);
		},
		VUEX_FIREBASE_MOVED(state, {index, record, newIndex}) {
			let array = state.firebase[record._.ref].data;
			array.splice(newIndex, 0, state.firebase[record._.ref].data.splice(index, 1)[0]);
		},
	};

	const getters = {
		// Auth object of firebase
		$auth(state) {
			return state.auth;
		},
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
		 _.ref = the target node ex. 'users'
		 _.key = the key for the data to send or you can omit it to use the push key
		 _.hook = used for chaining key actions based on the key value good for updating relations of nodes
		 _.time = set to true if you want to have created and updated time stamps
		 */
		async VUEX_FIREBASE_SAVE({getters}, payload) {
			let {_,...data} = {...payload},
				{key,ref,hook,time} = _ || data;
			key = key || getters.$database.ref(ref).push().key;
			let firebase = getters.$database.ref(ref).child(key);

			if (hook && key) {
				hook(key);
			}

			if (!Object.keys(data).length || !_) {
				await firebase.remove();
				return;
			}

			if (!time) {
				data.created = data.created || getters.$timestamp;
				data.updated = getters.$timestamp;
			}

			await firebase.update(data);

		},
		//Create new FirebaseBind Objects based on keys
		VUEX_FIREBASE_BIND({commit}, payload) {
			Object.keys(payload).forEach(load => {
				commit('VUEX_FIREBASE_BINDED',
					new FirebaseBind(fb.database().ref(load), payload[load], load));
			})
		},
		//Unbind based on the pass key
		VUEX_FIREBASE_UNBIND({commit, getters}, payload) {
			Object.keys(payload).forEach(load => {
				commit('VUEX_FIREBASE_UNBINDED', getters.$firebase(load));
			});
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