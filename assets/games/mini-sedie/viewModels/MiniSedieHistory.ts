import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import SedieHistoryBase from '../../_base/view-models/SedieHistoryBase';
import MiniSedieHistoryItem from './MiniSedieHistoryItem';

const { ccclass, property } = cc._decorator;
@ccclass
export default class MiniSedieHistory extends SedieHistoryBase {
    private readonly dataObserverKey = "MiniSedieHistory";

    onEnable() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
        this.get_data();
    }

    receivedData(data) {
        if (data.miniSedie && data.miniSedie.history) {
            this.onData(data.miniSedie.history);
        }
    }

    get_data(page = 1) {
        cc.RedT.send({ g: { miniSedie: { getHistory: { page: page } } } });
    }

    bindItemRowData(betLog, index) {
        const itemNode = this.bindCommonData(betLog, index);
        const item = itemNode.getComponent(MiniSedieHistoryItem);

        const { settlementResult } = betLog;

        Object.keys(settlementResult).forEach((choice) => {
            item[choice].string = numberWithCommas(betLog[choice]);
            if (settlementResult[choice]) {
                item[choice].node.color = cc.Color.YELLOW;
            } else {
                item[choice].node.color = cc.Color.WHITE;
            }
        });

        this.content.addChild(itemNode);
    }
}
