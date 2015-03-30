import { Model } from './Model.js';

export class Snail extends Model {
    constructor(modelArray, modelName, config, loadedCallback){
        super(modelArray, modelName, config, loadedCallback);
        this.slimeCounter = 0
    }


}