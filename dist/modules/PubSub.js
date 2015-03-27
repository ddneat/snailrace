"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 *  Reusable ES6 Pub/Sub class.
 *
 *  Based on Luís Couto version
 *  https://github.com/phiggins42/bloody-jquery-plugins/blob/55e41df9bf08f42378bb08b93efcb28555b61aeb/pubsub.js
 *
 *  Luís Couto implemented a vanilla version of Peter Higgins' port from Dojo to jQuery
 *  https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js
 *
 *  Re-adapted using ECMAScript 6
 *
 *  @class PubSub
 */

var PubSub = exports.PubSub = (function () {
    /**
     *  constructor
     *  e.g.: new PubSub()
     *
     *  @class PubSub
     */

    function PubSub() {
        _classCallCheck(this, PubSub);

        this.cache = {};
    }

    _createClass(PubSub, {
        publish: {
            /**
             *  PubSub.publish
             *  e.g.: PubSub.publish("/Article/added", [article], this);
             *
             *  @class PubSub
             *  @method publish
             *  @param topic {String}
             *  @param args	{Object} Optional
             *  @param scope {Object} Optional
             */

            value: function publish(topic, args, scope) {
                if (this.cache[topic]) {
                    var thisTopic = this.cache[topic],
                        i = thisTopic.length - 1;

                    for (i; i >= 0; i -= 1) {
                        thisTopic[i].apply(scope || this, [args] || []);
                    }
                }
            }
        },
        subscribe: {
            /**
             *  Events.subscribe
             *  e.g.: Events.subscribe("/Article/added", Articles.validate)
             *
             *  @class PubSub
             *  @method subscribe
             *  @param topic {String}
             *  @param callback {Function}
             *  @return Event handler {Array}
             */

            value: function subscribe(topic, callback) {
                if (!this.cache[topic]) {
                    this.cache[topic] = [];
                }
                this.cache[topic].push(callback);
                return [topic, callback];
            }
        },
        unsubscribe: {
            /**
             *  Events.unsubscribe
             *  e.g.: var handle = Events.subscribe("/Article/added", Articles.validate);
             *      Events.unsubscribe(handle);
             *
             *  @class PubSub
             *  @method unsubscribe
             *  @param handle {Array}
             *  @param completly {Boolean}
             *  @return {type description }
             */

            value: function unsubscribe(handle, completly) {
                var t = handle[0],
                    i = cache[t].length - 1;

                if (this.cache[t]) {
                    for (i; i >= 0; i -= 1) {
                        if (this.cache[t][i] === handle[1]) {
                            this.cache[t].splice(this.cache[t][i], 1);
                            if (completly) {
                                delete this.cache[t];
                            }
                        }
                    }
                }
            }
        }
    });

    return PubSub;
})();