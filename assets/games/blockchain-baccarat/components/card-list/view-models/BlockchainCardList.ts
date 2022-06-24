
import GameUtils from "../../../../../common/GameUtils";
import CommonDialog from "../../../../../common/_base/view-models/CommonDialog";
import { Chain } from "../../../BlockchainBaccaratType";
import { Blockchain } from "../../../event-models/BlockchainBaccaratCardListModel";
import BlockchainBaccarat from "../../../view-models/BlockchainBaccarat";
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
    blockchain: Blockchain;
    flippingAnimations: cc.Animation[] = [];
    resultCards: BlockchainCard[] = [];
    cardListDialog: CommonDialog;
    cardSelected: number;

    updateBlockchain(blockchain: Blockchain) {
        this.blockchain = blockchain;
    }

    init(root: BlockchainBaccarat) {
        this.root = root;
        this.cardListDialog = this.getComponent(CommonDialog);
        this.cardListDialog.addOnWillHide(() => {
            this.removeCards();
            this.root.cardVerification.setBlankState();
        });
    }

    protected removeCards() {
        this.content.removeAllChildren();
        this.node.stopAllActions();
    }

    showDialog() {
        this.cardListDialog = this.getComponent(CommonDialog);
        if (this.cardListDialog) {
            this.cardListDialog.showDialog();
        }
    }

    public setData() {
        if (!this.blockchain) {
            return;
        }

        const { chain, cutCardIndex, currentIndex } = this.blockchain;
        this.cutCard = cutCardIndex;
        this.currentCardIndex = currentIndex;

        this.cards.forEach((card) => {
            card.removeFromParent();
            card.destroy();
        });

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

    public renderCardsSettlement(cardList: Blockchain) {
        if (!this.cards) {
            return;
        }
        this.blockchain = cardList;
        const { chain, currentIndex } = cardList;
        const repeatFlipCard = currentIndex - this.currentCardIndex;
        this.flippingAnimations = [];
        this.resultCards = [];
        chain.forEach((card, index) => {
            if (index >= this.currentCardIndex && index < currentIndex) {
                this.updateBlockchainCard(this.cards[index]?.getComponent(BlockchainCard), card, index);
            }
        });
        this.playOpenCardAnimation(repeatFlipCard);
        this.currentCardIndex = currentIndex;
    }

    playOpenCardAnimation(repeatFlipCard: number) {
        let count = 0;
        cc.tween(this.node)
            .repeat(
                repeatFlipCard,
                cc
                    .tween()
                    .call(() => {
                        this.flippingAnimations[count]?.play();
                        this.resultCards[count]?.setFaceUp(true);
                        count++;
                    })
                    .delay(0.6)
            )
            .start();
    }

    protected updateBlockchainCard(cardComp: BlockchainCard, cardChain: Chain, index: number) {
        const { card } = cardChain;
        if (!!cardComp) {
            cardComp.setCardOldStyle({
                rank: card?.rank,
                suit: card?.suit
            });

            cardComp.openCardVerification = () => {
                this.initCardVerification(cardChain, index);
            };

            this.flippingAnimations.push(cardComp?.animation);
            this.resultCards.push(cardComp);
        }
    }

    public createCard(cardChain: Chain, index: number): cc.Node {
        const { card } = cardChain;
        const node = GameUtils.createNodeFromPrefab(this.cardPrefab);
        const cardComponent = node.getComponent(BlockchainCard);
        cardComponent.setCardOldStyle({
            rank: card?.rank,
            suit: card?.suit
        });

        !!card ? cardComponent.setFaceUp(true) : cardComponent.setFaceUp(false);

        if (this.cutCard === index) {
            cardComponent.setKeyCard();
        } else {
            cardComponent.openCardVerification = () => {
                this.initCardVerification(cardChain, index);
            };

            cardComponent.setIndexNumber(index);
        }

        return node;
    }

    public initCardVerification(chain: Chain, index: number) {
        const cardVerification = this.root.node.getChildByName(this.cardVerificationPrefab.name);
        if (cardVerification) {
            cardVerification.removeFromParent(true);
            cardVerification.destroy();
        }

        this.root.cardVerification.renderDataCardVerification(chain, index);
        this.root.cardVerification.showDialog();
    }

    public highLightCurrentCardSelected(index: number) {
        this.cards[index].getComponent(BlockchainCard).highLightCard();
        this.cards[this.cardSelected]?.getComponent(BlockchainCard).resetHighLightCard();
        this.cardSelected = index;
    }
}
