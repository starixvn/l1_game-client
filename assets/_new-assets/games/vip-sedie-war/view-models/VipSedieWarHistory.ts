import SedieHistory from '../../xoc-xoc/view-models/SedieHistory';
import VipSedieWarHistoryItem from './VipSedieWarHistoryItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedieWarHistory extends SedieHistory {

    onData(data: any) {
        const { page, pageSize, total, betLogs } = data;
        this.pagination.onSet(page, pageSize, total);
        this.content.destroyAllChildren();

        if (betLogs && betLogs.length) {
            betLogs.map((betLog, index) => {
                const itemNode = cc.instantiate(this.itemPrefab);
                itemNode.active = true;
                this.content.addChild(itemNode);

                const item = itemNode.getComponent(VipSedieWarHistoryItem);
                item.getMiniPanel = () => this.node.parent;
                item.setData(betLog);
            });
        }
    }
}
