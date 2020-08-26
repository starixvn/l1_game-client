
import { numberWithCommas, getStringDateByTime, nFormatter } from '../../../common/helpers/Helper';
const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyWheelHistoryItem extends cc.Component {

    @property(cc.Label)
    id: cc.Label = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    result: cc.Label = null;

    updateData(data) {
        this.id.string = '';
        this.time.string = getStringDateByTime(data.time);
        this.result.string = data.result.toString();
    }

    onDestroy() {
        this.node.destroy();
    }
}
