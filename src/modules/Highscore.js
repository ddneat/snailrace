import { PubSub } from './PubSub.js';

export class Highscore {

    constructor(storage) {
        this.pubsub = new PubSub();

        this.storage = storage || localStorage;
        this.storage.getItem('highscore') === undefined && this.storage.setItem('highscore', "[]");
    }

    saveItem(name, time) {
        var data = JSON.parse(this.storage.getItem('highscore'));
        data.push({name: name, time: time});
        this.storage.setItem('highscore', JSON.stringify(data));

        this.pubsub.publish('highscore:saved');
    }

    getJSON() {
        var storageContent = JSON.parse(this.storage.getItem('highscore'));
        if(!storageContent.length) return [];

        return storageContent.sort(function(a, b){
            return a.time < b.time ? -1 : 1;
        });
    }

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
