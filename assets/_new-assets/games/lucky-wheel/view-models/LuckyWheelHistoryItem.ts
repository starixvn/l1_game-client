
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
        this.id.string = data.id;
        this.time.string = getStringDateByTime(data.time);

        if (data.result == 0) {
            this.result.string = `Chúc bạn may mắn!`;
        } else {
            this.result.string = `${data.result} Xu`;
        }
    }

    onDestroy() {
        this.node.destroy();
    }
}
