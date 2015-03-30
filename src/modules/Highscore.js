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
        this.storage = storage || localStorage;
        this.storage.getItem('highscore') === undefined && this.storage.setItem('highscore', "[]");
    }
    /**
     * Highscore.saveItem
     *
     * @param name {String}
     * @param time {Number}
     * @param callback {function} optional
     */
    saveItem(name, time, callback) {
        var data = JSON.parse(this.storage.getItem('highscore')) || [];
        data.push({name: name, time: time});
        this.storage.setItem('highscore', JSON.stringify(data));
        callback && callback();
    }
    /**
     * Highscore.getJSON
     *
     * @return {Array}
     */
    getJSON() {
        var storageContent = JSON.parse(this.storage.getItem('highscore'));
        if(!storageContent) return [];

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
