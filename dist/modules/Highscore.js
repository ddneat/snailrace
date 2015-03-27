"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var PubSub = require("./PubSub.js").PubSub;

var Highscore = exports.Highscore = (function () {
    function Highscore(storage) {
        _classCallCheck(this, Highscore);

        this.pubsub = new PubSub();

        this.storage = storage || localStorage;
        this.storage.getItem("highscore") === undefined && this.storage.setItem("highscore", "[]");
    }

    _createClass(Highscore, {
        saveItem: {
            value: function saveItem(name, time) {
                var data = JSON.parse(this.storage.getItem("highscore"));
                data.push({ name: name, time: time });
                this.storage.setItem("highscore", JSON.stringify(data));

                this.pubsub.publish("highscore:saved");
            }
        },
        getJSON: {
            value: function getJSON() {
                var storageContent = JSON.parse(this.storage.getItem("highscore"));
                if (!storageContent.length) {
                    return [];
                }return storageContent.sort(function (a, b) {
                    return a.time < b.time ? -1 : 1;
                });
            }
        },
        getHTML: {
            value: function getHTML() {
                var storageContent = this.getJSON();
                var result = "";

                for (var i = 0; i < storageContent.length && i < 10; i++) {
                    var elem = storageContent[i];
                    result += "<div class=\"highscoreEntry\"><div class=\"highscoreName\">" + (i + 1) + ". " + elem.name + "</div><div class=\"highscoreTime\">" + elem.time + "</div></div>";
                }

                return result;
            }
        }
    });

    return Highscore;
})();