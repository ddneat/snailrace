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
export class PubSub {
    /**
     *  constructor
     *  e.g.: new PubSub()
     *
     *  @class PubSub
     */
    constructor() {
        this.cache = {};
    }
    /**
     *  PubSub.publish
     *  e.g.: PubSub.publish("/Article/added", [article], this);
     *
     *  @class PubSub
     *  @method publish
     *  @param topic {String}
     *  @param args	{Array}
     *  @param scope {Object} Optional
     */
    publish (topic, args, scope) {
        if (this.cache[topic]) {
            var thisTopic = this.cache[topic],
                i = thisTopic.length - 1;

            for (i; i >= 0; i -= 1) {
                thisTopic[i].apply( scope || this, args || []);
            }
        }
    }
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
     subscribe (topic, callback) {
        if (!this.cache[topic]) {
            this.cache[topic] = [];
        }
        this.cache[topic].push(callback);
        return [topic, callback];
    }
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
    unsubscribe (handle, completly) {
        var t = handle[0],
            i = cache[t].length - 1;

        if (this.cache[t]) {
            for (i; i >= 0; i -= 1) {
                if (this.cache[t][i] === handle[1]) {
                    this.cache[t].splice(this.cache[t][i], 1);
                    if(completly){ delete this.cache[t]; }
                }
            }
        }
    }
}