export default class FirebaseBind {
    constructor(source, options,ref) {
        this.hooks = {
            ...options.hooks
        };
        this.error = options.error || (err => console.log(err));
        this.source = source;
        this.ref = ref;
        this.data = [];
        this.bind();
    }
    static get store() {
        return this._store;
    }
    static set store(value) {
        return this._store = value;
    }
    get source() {
        return this._source;
    }
    set source(value) {
        this._source = value;
    }
    index(key) {
        return this.data.findIndex(val => val._key == key)
    }
    reset() {
        this.source.off();
        this.data = [];
    }
    record(snap) {
        return {
            _key: snap.key,
            _ref: this.ref,
            ...snap.val()
        }
    }
    added(source) {
        source.on(`child_added`, (snap, prev) => {

            let index = prev ?
                this.index(prev) + 1 :
                0,
                record = this.record(snap),
                data = { index, record };
            if(this.data.includes(record)) return;
            if (this.hooks.added) {
                this.hooks.added(data, FirebaseBind.store);
            }
            FirebaseBind.store.commit('VUEX_FIREBASE_ADDED', data);
        }, error => {
            if (this.error) {
                this.error(error, FirebaseBind.store)
            }
        });
    }
    changed(source) {
        source.on('child_changed', snap => {
            let index = this.index(snap.key),
                record = this.record(snap),
                data = { index, record };
            if (this.hooks.changed) {
                this.hooks.changed(data, FirebaseBind.store);
            }
            FirebaseBind.store.commit(`VUEX_FIREBASE_CHANGED`, { index, record });
        }, error => {
            if (this.error) {
                this.error(error, FirebaseBind.store)
            }
        });
    }
    removed(source) {
        source.on('child_removed', snap => {
            let index = this.index(snap.key),
                record = this.record(snap),
                data = { index, record };
            if (this.hooks.removed) {
                this.hooks.removed(data, FirebaseBind.store);
            }
            FirebaseBind.store.commit(`VUEX_FIREBASE_REMOVED`, data);
        }, error => {
            if (this.error) {
                this.error(error, FirebaseBind.store)
            }
        });
    }
    moved(source) {
        source.on('child_moved', (snap, prev) => {
            let index = this.index(snap.key),
                newIndex = prev ? this.index(prev) + 1 : 0,
                record = this.record(snap),
                data;
            newIndex += index < newIndex ? -1 : 0;
            data = { index, record, newIndex }
            if (this.hooks.moved) {
                this.hooks.moved(data, FirebaseBind.store);
            }
            FirebaseBind.store.commit(`VUEX_FIREBASE_MOVED`, data);
        }, error => {
            if (this.error) {
                this.error(error, FirebaseBind.store)
            }
        })
    }
    bind() {
        this.source.off();
        ['added', 'changed', 'removed', 'moved'].forEach(event => {
            this[event](this.source);
        })

    }
}