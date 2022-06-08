import * as _ from "lodash";
import GameUtils from "../../../../common/GameUtils";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import { CardModel } from "../../BlockchainBaccaratType";
import { Blockchain } from "../../event-models/BlockchainBaccaratCardListModel";
import BlockchainBaccarat from "../BlockchainBaccarat";
import BlockchainCard from "./BlockchainCard";
import BlockchainCardVerification from "./BlockchainCardVerification";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainCardList extends cc.Component {
    @property({ type: cc.Prefab })
    itemsPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    itemNext: cc.Node = null;

    @property({ type: cc.Integer })
    rowMax = 35;

    @property(cc.Size)
    itemSize: cc.Size = new cc.Size(100, 120);

    @property(cc.Size)
    padding: cc.Size = new cc.Size(2, 2);

    @property(cc.Prefab)
    cardVerificationPrefab: cc.Prefab = null;

    items: cc.Node[];
    cards: cc.Node[] = [];

    protected nextMark: cc.Node = null;
    protected cutCard: number;
    protected burnedCard: number;
    protected cardVerificationComponent: BlockchainCardVerification = null;
    protected root: BlockchainBaccarat;

    init(root: BlockchainBaccarat) {
        this.root = root;
    }

    onLoad() {
        const itemsNode = GameUtils.createNodeFromPrefab(this.itemsPrefab);
        this.items = itemsNode.children;
    }

    showDialog() {
        const commonDialog = this.getComponent(CommonDialog);
        if (commonDialog) {
            commonDialog.showDialog();
        }
    }

    public setData(cardList: Blockchain) {
        const { chain, burnedCards, cutCardIndex, currentIndex } = cardList;
        this.cutCard = cutCardIndex;
        this.burnedCard = burnedCards;
        const itemsNode = GameUtils.createNodeFromPrefab(this.itemsPrefab);
        this.items = itemsNode.children;
        this.cards.forEach((card) => {
            card.removeFromParent();
            card.destroy();
        });

        this.cards = [];

        this.nextMark = null;
        chain.forEach((card, index) => {
            const historyDot = this.createCard(card.card, index);
            this.content.addChild(historyDot);
            this.cards.push(historyDot);
            index++;
        });

        this.addNextMark();
    }

    protected createCard(card: CardModel, index, isFaceUp = true): cc.Node {
        const node = cc.instantiate(this.itemsPrefab);
        const cardComponent = node.getComponent(BlockchainCard);
        cardComponent.setCardOldStyle({
            rank: card?.rank,
            suit: card?.suit
        });
        
        !!card ? cardComponent.setFaceUp(isFaceUp) : cardComponent.setFaceUp(!isFaceUp);
        if (this.cutCard === index) {
            cardComponent.setKeyCard();
        }

        cardComponent.openCardVerification = () => {
            this.initCardVerification();
        };

        cardComponent.indexNumber.string = this.convertIndexNumber(index + 1);
        return node;
    }

    private initCardVerification() {
        const ticketDetail = this.node.getChildByName(this.cardVerificationPrefab.name);
        if (ticketDetail) {
            ticketDetail.removeFromParent(true);
            ticketDetail.destroy();
        }
        const ticketDetailPrefab = cc.instantiate(this.cardVerificationPrefab);
        this.cardVerificationComponent = ticketDetailPrefab.getComponent(BlockchainCardVerification);
        this.root.currentMiniPanel.addDialog(ticketDetailPrefab);
    }

    private addNextMark() {
        const card = cc.instantiate(this.itemNext);
        card.active = false;
        this.content.addChild(card);
        this.nextMark = card;
        this.cards.push(card);
    }

    private convertIndexNumber(index: number) {
        switch (true) {
            case index < 10:
                return `00${index}`;
            case index < 100:
                return `0${index}`;
            default:
                return index.toString();
        }
    }
}
