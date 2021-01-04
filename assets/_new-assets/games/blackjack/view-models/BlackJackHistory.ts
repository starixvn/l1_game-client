import { getStringDateByTime, numberWithCommas } from "../../../common/helpers/Helper";
import PaginationCommon from "../../../common/helpers/Pagination/PaginationCommon";
import NewCard from "../../../common/new-card/view-models/NewCard";
import BlackJackHistoryItem from "./BlackJackHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlackJackHistory extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    private socket: SocketIOClient.Socket;

    init(socket: SocketIOClient.Socket) {
        this.socket = socket;
    }

    onLoad() {
        this.pages.init(this);

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

    onData(data: any) {
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.children.forEach((child) => child.destroy());

        data.betLogs.forEach((log) => {
            const historyItemPrefab = cc.instantiate(this.itemPrefab);
            const item = historyItemPrefab.getComponent(BlackJackHistoryItem);
            const isSplit = log.splitFrom || log.actions.includes("split");
            item.time.string = getStringDateByTime(log.time);
            item.time.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

            item.handId.string = log.id;
            item.handId.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

            item.split.active = isSplit;
            item.bet.string = numberWithCommas(log.bet);
            item.win.string = numberWithCommas(log.betwin);
            item.win.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

            // cards for dealer
            this.initCards(log.result, item.dealerCards);
            this.convertResult(item.dealerResult, log.settlementResult, log.result, isSplit);

            // cards for player
            this.initCards(log.cards, item.playerCards);
            this.convertResult(item.playerResult, log.total, log.cards, isSplit);
            item.playerResult.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

            this.content.addChild(historyItemPrefab);
        });
    }

    initCards(cards: any, cardsNode: cc.Node) {
        cards.forEach((playerCard) => {
            const node = cc.instantiate(this.cardPrefab);
            const cardComponent = node.getComponent(NewCard);

            cardComponent.setCard(playerCard);
            cardComponent.faceUp();
            node.scaleX = 0.23;
            node.scaleY = 0.255;
            cardsNode.addChild(node);
        });
    }

    convertResult(resultLabel: cc.Label, result, array, isSplit: boolean) {
        if (result > 21) {
            resultLabel.string = "Quắc";
        } else if (result === 21 && array.length === 2 && !isSplit) {
            resultLabel.string = "BJ";
        } else {
            resultLabel.string = result.toString();
        }
    }
}
