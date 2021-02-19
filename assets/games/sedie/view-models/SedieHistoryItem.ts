import MiniSedieHistoryItem from '../../mini-sedie/viewModels/MiniSedieHistoryItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieHistoryItem extends MiniSedieHistoryItem {
    @property(cc.Label)
    red2: cc.Label = null;

    public itemCallback = () => {};

    _betLog: any;

    get betLog() {
        return this._betLog;
    }

    set betLog(value: any) {
        this._betLog = value;
        this.itemCallback();
    }
}
