(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vuex-firebase"] = factory();
	else
		root["vuex-firebase"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FirebaseBind = function () {
    function FirebaseBind(source, options, ref) {
        _classCallCheck(this, FirebaseBind);

        this.hooks = _extends({}, options.hooks);
        this.error = options.error || function (err) {
            return console.log(err);
        };
        this.source = source;
        this.ref = ref;
        this.data = [];
        this.bind();
    }

    _createClass(FirebaseBind, [{
        key: 'index',
        value: function index(key) {
            return this.data.findIndex(function (val) {
                return val._.key == key;
            });
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.source.off();
            this.data = [];
        }
    }, {
        key: 'record',
        value: function record(snap) {
            return _extends({
                _: {
                    key: snap.key,
                    ref: this.ref
                }
            }, snap.val());
        }
    }, {
        key: 'added',
        value: function added(source) {
            var _this = this;

            source.on('child_added', function (snap, prev) {

                var index = prev ? _this.index(prev) + 1 : 0,
                    record = _this.record(snap),
                    data = { index: index, record: record };
                if (_this.data.includes(record)) return;
                if (_this.hooks.added) {
                    _this.hooks.added(data, FirebaseBind.store);
                }
                FirebaseBind.store.commit('VUEX_FIREBASE_ADDED', data);
            }, function (error) {
                if (_this.error) {
                    _this.error(error, FirebaseBind.store);
                }
            });
        }
    }, {
        key: 'changed',
        value: function changed(source) {
            var _this2 = this;

            source.on('child_changed', function (snap) {
                var index = _this2.index(snap.key),
                    record = _this2.record(snap),
                    data = { index: index, record: record };
                if (_this2.hooks.changed) {
                    _this2.hooks.changed(data, FirebaseBind.store);
                }
                FirebaseBind.store.commit('VUEX_FIREBASE_CHANGED', { index: index, record: record });
            }, function (error) {
                if (_this2.error) {
                    _this2.error(error, FirebaseBind.store);
                }
            });
        }
    }, {
        key: 'removed',
        value: function removed(source) {
            var _this3 = this;

            source.on('child_removed', function (snap) {
                var index = _this3.index(snap.key),
                    record = _this3.record(snap),
                    data = { index: index, record: record };
                if (_this3.hooks.removed) {
                    _this3.hooks.removed(data, FirebaseBind.store);
                }
                FirebaseBind.store.commit('VUEX_FIREBASE_REMOVED', data);
            }, function (error) {
                if (_this3.error) {
                    _this3.error(error, FirebaseBind.store);
                }
            });
        }
    }, {
        key: 'moved',
        value: function moved(source) {
            var _this4 = this;

            source.on('child_moved', function (snap, prev) {
                var index = _this4.index(snap.key),
                    newIndex = prev ? _this4.index(prev) + 1 : 0,
                    record = _this4.record(snap),
                    data = void 0;
                newIndex += index < newIndex ? -1 : 0;
                data = { index: index, record: record, newIndex: newIndex };
                if (_this4.hooks.moved) {
                    _this4.hooks.moved(data, FirebaseBind.store);
                }
                FirebaseBind.store.commit('VUEX_FIREBASE_MOVED', data);
            }, function (error) {
                if (_this4.error) {
                    _this4.error(error, FirebaseBind.store);
                }
            });
        }
    }, {
        key: 'bind',
        value: function bind() {
            var _this5 = this;

            this.source.off();
            ['added', 'changed', 'removed', 'moved'].forEach(function (event) {
                _this5[event](_this5.source);
            });
        }
    }, {
        key: 'source',
        get: function get() {
            return this._source;
        },
        set: function set(value) {
            this._source = value;
        }
    }], [{
        key: 'store',
        get: function get() {
            return this._store;
        },
        set: function set(value) {
            return this._store = value;
        }
    }]);

    return FirebaseBind;
}();

exports.default = FirebaseBind;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (store, fb) {
	var Vue = store._watcherVM || store._vm;
	var state = {
		auth: fb.auth(),
		database: fb.database(),
		storage: fb.storage(),
		firebase: {}
	};

	var mutations = {
		//Mutation for setting the firebaseBind object
		//Using Vue.set to make it reactive
		VUEX_FIREBASE_BINDED: function VUEX_FIREBASE_BINDED(state, payload) {
			if (state.firebase[payload.ref]) return;
			Vue.$set(state.firebase, payload.ref, payload);
		},

		//Unbind the firebaseBind object
		VUEX_FIREBASE_UNBINDED: function VUEX_FIREBASE_UNBINDED(state, payload) {
			Vue.$delete(state.firebase, payload.ref);
		},
		VUEX_FIREBASE_ADDED: function VUEX_FIREBASE_ADDED(state, _ref) {
			var index = _ref.index,
			    record = _ref.record;

			state.firebase[record._.ref].data.splice(index, 0, record);
		},
		VUEX_FIREBASE_CHANGED: function VUEX_FIREBASE_CHANGED(state, _ref2) {
			var index = _ref2.index,
			    record = _ref2.record;

			state.firebase[record._.ref].data.splice(index, 1, record);
		},
		VUEX_FIREBASE_REMOVED: function VUEX_FIREBASE_REMOVED(state, _ref3) {
			var index = _ref3.index,
			    record = _ref3.record;

			state.firebase[record._.ref].data.splice(index, 1);
		},
		VUEX_FIREBASE_MOVED: function VUEX_FIREBASE_MOVED(state, _ref4) {
			var index = _ref4.index,
			    record = _ref4.record,
			    newIndex = _ref4.newIndex;

			var array = state.firebase[record._.ref].data;
			array.splice(newIndex, 0, state.firebase[record._.ref].data.splice(index, 1)[0]);
		}
	};

	var getters = {
		// Auth object of firebase
		$auth: function $auth(state) {
			return state.auth;
		},

		// Get the FirebaseBind Object by passing its key or source
		$firebase: function $firebase(state) {
			return function (key) {
				return state.firebase[key];
			};
		},

		//Firebase timestamp
		$timestamp: function $timestamp(state) {
			return fb.database.ServerValue.TIMESTAMP;
		},

		//Getter for firebase.database()
		$database: function $database(state) {
			return state.database;
		},

		//firebase.storage()
		$storage: function $storage(state) {
			return state.storage;
		}
	};

	var actions = {
		/*
   _.ref = the target node ex. 'users'
   _.key = the key for the data to send or you can omit it to use the push key
   _.hook = used for chaining key actions based on the key value good for updating relations of nodes
   _.time = set to true if you want to have created and updated time stamps
   */
		VUEX_FIREBASE_SAVE: function VUEX_FIREBASE_SAVE(_ref5, payload) {
			var _this = this;

			var getters = _ref5.getters;
			return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
				var _payload, _, data, _ref6, key, ref, hook, time, firebase;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_payload = _extends({}, payload), _ = _payload._, data = _objectWithoutProperties(_payload, ['_']), _ref6 = _ || data, key = _ref6.key, ref = _ref6.ref, hook = _ref6.hook, time = _ref6.time;

								key = key || getters.$database.ref(ref).push().key;
								firebase = getters.$database.ref(ref).child(key);


								if (hook && key) {
									hook(key);
								}

								if (!(!Object.keys(data).length || !_)) {
									_context.next = 8;
									break;
								}

								_context.next = 7;
								return firebase.remove();

							case 7:
								return _context.abrupt('return');

							case 8:

								if (!time) {
									data.created = data.created || getters.$timestamp;
									data.updated = getters.$timestamp;
								}

								_context.next = 11;
								return firebase.update(data);

							case 11:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, _this);
			}))();
		},

		//Create new FirebaseBind Objects based on keys
		VUEX_FIREBASE_BIND: function VUEX_FIREBASE_BIND(_ref7, payload) {
			var commit = _ref7.commit;

			Object.keys(payload).forEach(function (load) {
				commit('VUEX_FIREBASE_BINDED', new _bind2.default(fb.database().ref(load), payload[load], load));
			});
		},

		//Unbind based on the pass key
		VUEX_FIREBASE_UNBIND: function VUEX_FIREBASE_UNBIND(_ref8, payload) {
			var commit = _ref8.commit,
			    getters = _ref8.getters;

			Object.keys(payload).forEach(function (load) {
				commit('VUEX_FIREBASE_UNBINDED', getters.$firebase(load));
			});
		}
	};

	var VuexFirebase = {
		state: state,
		getters: getters,
		mutations: mutations,
		actions: actions
	};

	store.registerModule('VuexFirebase', VuexFirebase);
	//Set the static store for FirebaseBind class
	_bind2.default.store = store;
};

var _bind = __webpack_require__(0);

var _bind2 = _interopRequireDefault(_bind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/***/ })
/******/ ]);
});