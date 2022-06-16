import * as _ from "lodash";
import GameUtils from "../../../../common/GameUtils";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import { CardChain, CardModel } from "../../BlockchainBaccaratType";
import { Blockchain } from "../../event-models/BlockchainBaccaratCardListModel";
import BlockchainBaccarat from "../BlockchainBaccarat";
import BlockchainCard from "./BlockchainCard";
import BlockchainCardVerification from "./BlockchainCardVerification";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainCardList extends cc.Component {
    @property({ type: cc.Prefab })
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    cardVerificationPrefab: cc.Prefab = null;

    cards: cc.Node[] = [];

    @property(cc.ScrollView)
    statsScrollView: cc.ScrollView = null;

    protected nextMark: cc.Node = null;
    protected cutCard: number;
    protected burnedCard: number;
    protected currentCardIndex: number;
    protected cardVerificationComponent: BlockchainCardVerification = null;
    protected root: BlockchainBaccarat;
    protected cardHeight = 120;
    protected numberOfCardsPerRow = 12;
    protected rowDefault = 3;

    init(root: BlockchainBaccarat) {
        this.root = root;
    }

    onLoad() {
        const commonDialog = this.getComponent(CommonDialog);
        commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
    }

    showDialog() {
        const commonDialog = this.getComponent(CommonDialog);
        if (commonDialog) {
            commonDialog.showDialog();
        }
    }

    public setData(cardList: Blockchain) {
        if (!cardList) {
            return;
        }
        const { chain, cutCardIndex, currentIndex } = cardList;
        this.cutCard = cutCardIndex;
        this.currentCardIndex = currentIndex;

        this.cards.forEach((card) => {
            card.removeFromParent();
            card.destroy();
        });
        this.content.removeAllChildren(true);

        this.cards = [];

        chain.forEach((card, index) => {
            const cardNode = this.createCard(card, index);
            this.content.addChild(cardNode);
            this.cards.push(cardNode);
        });

        this.showLatestCard(currentIndex);
    }

    protected showLatestCard(currentIndex: number) {
        const rowDisplayCard = Math.round(currentIndex / this.numberOfCardsPerRow);
        const countRow = rowDisplayCard <= this.rowDefault ? 0 : rowDisplayCard;
        const ratioVertical = (countRow * this.cardHeight) / (this.content.height - this.statsScrollView.node.height);
        const ratioCardDisplay = Math.round((1 - ratioVertical) * 100) / 100;
        this.statsScrollView.scrollToPercentVertical(ratioCardDisplay);
    }

    public updateData(cardList: Blockchain) {
        if (!this.cards) {
            return;
        }

        const { chain, currentIndex } = cardList;
        chain.forEach((card, index) => {
            if (index >= this.currentCardIndex && index < currentIndex) {
                this.flipCard(this.cards[index]?.getComponent(BlockchainCard), card, index);
            }
        });

        this.currentCardIndex = currentIndex;
    }

    protected flipCard(cardComp: BlockchainCard, cardChain: CardChain, index: number) {
        const { card } = cardChain;
        if (!!cardComp) {
            cardComp.setCardOldStyle({
                rank: card?.rank,
                suit: card?.suit
            });

            cardComp.openCardVerification = () => {
                this.initCardVerification(cardChain, index + 1);
            };
            cardComp?.setFaceUp(true);
            cardComp?.animation.play();
        }
    }

    public createCard(cardChain: CardChain, index, isFaceUp = true): cc.Node {
        const { card } = cardChain;
        const node = GameUtils.createNodeFromPrefab(this.cardPrefab);
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
            this.initCardVerification(cardChain, index + 1);
        };

        cardComponent.setIndexNumber(index);
        return node;
    }

    public initCardVerification(card: CardChain, index: number) {
        const cardVerificationPrefab = this.node.getChildByName(this.cardVerificationPrefab.name);
        if (cardVerificationPrefab) {
            cardVerificationPrefab.removeFromParent(true);
            cardVerificationPrefab.destroy();
        }
        const ticketDetailPrefab = cc.instantiate(this.cardVerificationPrefab);
        this.cardVerificationComponent = ticketDetailPrefab.getComponent(BlockchainCardVerification);
        this.cardVerificationComponent.init();
        this.cardVerificationComponent.renderData(card, index);
        this.root.currentMiniPanel.addDialog(ticketDetailPrefab);
    }
}
