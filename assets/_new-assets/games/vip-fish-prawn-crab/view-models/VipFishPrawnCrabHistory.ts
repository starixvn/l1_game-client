import { getStringDateByTime, numberWithCommas } from "./../../../common/helpers/Helper";
import PaginationCommon from "./../../../common/helpers/Pagination/PaginationCommon";
import VipFishPrawnCrabHistoryItem from "./VipFishPrawnCrabHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabHistory extends cc.Component {
    @property(PaginationCommon)
    pagination: PaginationCommon = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    animalSprites: cc.SpriteFrame[] = [];

    @property(cc.Node)
    mainFrame: cc.Node = null;

    private socket: SocketIOClient.Socket;

    init(socket: SocketIOClient.Socket) {
        this.socket = socket;
    }

    onLoad() {
        this.pagination.init(this);

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    onEnable() {
        this.get_data();
    }

    get_data(page = 1) {
        this.socket && this.socket.connected && this.socket.emit("getHistory", { page: page });
    }

    onData(data) {
        const { page, pageSize, total, betLogs } = data;
        this.pagination.onSet(page, pageSize, total);
        this.content.destroyAllChildren();

        if (betLogs && betLogs.length) {
            betLogs.forEach((betLog, index) => {
                const itemNode = cc.instantiate(this.itemPrefab);
                const item = itemNode.getComponent(VipFishPrawnCrabHistoryItem);
                item.node.active = true;
                item.background.active = index % 2 > 0;

                const { time, phien, result, settlementResult, betwin } = betLog;

                item.time.string = getStringDateByTime(time);
                item.round.string = phien;

                let number = 0;
                Object.keys(result).forEach((key) => {
                    if (result[key]) {
                        number++;
                    }
                });

                item.dices[0].spriteFrame = this.animalSprites[result.dice1];
                item.dices[1].spriteFrame = this.animalSprites[result.dice2];
                item.dices[2].spriteFrame = this.animalSprites[result.dice3];

                Object.keys(settlementResult).forEach((choice) => {
                    item[choice].string = numberWithCommas(betLog[choice]);
                    if (settlementResult[choice]) {
                        item[choice].node.color = cc.Color.YELLOW;
                    } else {
                        item[choice].node.color = cc.Color.WHITE;
                    }
                });

                item.win.string = numberWithCommas(betwin);

                this.content.addChild(itemNode);
            });
        }
    }
}
