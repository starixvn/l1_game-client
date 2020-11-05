import { getStringDateByTime, numberWithCommas } from "../../../common/helpers/Helper";
import * as Pagination from "../../../common/helpers/Pagination/Pagination";
import NewCard from "../../../common/new-card/view-models/NewCard";
import BlackJackHistoryItem from "./BlackJackHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlackJackHistory extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(Pagination)
    pages: Pagination = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    private socket: SocketIOClient.Socket;

    init(socket: SocketIOClient.Socket) {
        this.socket = socket;
    }

    onLoad() {
        this.pages.init(this);
    }

    onEnable() {
        this.get_data();
    }

    onDisable() {
        this.content.children.forEach(child => child.destroy());
        this.node.destroy();
    }

    get_data(page = 1) {
        this.socket.emit('getHistory', { page: page });
    }

    onData(data: any) {
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.children.forEach(child => child.destroy());

        data.betLogs.forEach(log => {
            let historyItemPrefab = cc.instantiate(this.itemPrefab);
            let item = historyItemPrefab.getComponent(BlackJackHistoryItem);
            let isSplit = log.splitFrom || log.actions.includes("split");
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
        })
    }

    initCards(cards: any, cardsNode: cc.Node) {
        cards.forEach(playerCard => {
            let node = cc.instantiate(this.cardPrefab);
            let cardComponent = node.getComponent(NewCard);

            cardComponent.setCard(playerCard);
            cardComponent.faceUp();
            node.scaleX = 0.23;
            node.scaleY = 0.255;
            cardsNode.addChild(node);
        })
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
