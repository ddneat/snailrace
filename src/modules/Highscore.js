import { PubSub } from './PubSub.js';

export class Highscore {
    /**
     * constructor
     * e.g.: new Highscore()
     *
     * Sets localStorage as default if no storage param is passed
     *
     * @param storage {Object} Optional
     */
    constructor(storage) {
        this.pubsub = new PubSub();

        this.storage = storage || localStorage;
        this.storage.getItem('highscore') === undefined && this.storage.setItem('highscore', "[]");
    }
    /**
     * Highscore.saveItem
     *
     * @param name {String}
     * @param time {String}
     */
    saveItem(name, time) {
        var data = JSON.parse(this.storage.getItem('highscore'));
        data.push({name: name, time: time});
        this.storage.setItem('highscore', JSON.stringify(data));

        this.pubsub.publish('highscore:saved');
    }
    /**
     * Highscore.getJSON
     *
     * @return {Array}
     */
    getJSON() {
        var storageContent = JSON.parse(this.storage.getItem('highscore'));
        if(!storageContent.length) return [];

        return storageContent.sort(function(a, b){
            return a.time < b.time ? -1 : 1;
        });
    }
    /**
     * Highscore.getHTML
     *
     * Returns an empty string as default
     *
     * @return {String}
     */
    getHTML() {
        var storageContent = this.getJSON();
        var result = "";

        for (var i = 0; i < storageContent.length && i < 10; i++) {
            var elem = storageContent[i];
            result += '<div class="highscoreEntry"><div class="highscoreName">' +
                (i + 1) + '. ' + elem.name + '</div><div class="highscoreTime">' + elem.time + '</div></div>';
        }

        return result;
    }
}
