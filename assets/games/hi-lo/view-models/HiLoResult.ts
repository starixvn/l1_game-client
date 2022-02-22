import { CardModel } from "../../../common/new-card/view-models/NewCard";
import HiLoCard from "../components/view-models/HiLoCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoResult extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    cardReel: cc.Node = null;

    private readonly cardList: HiLoCard[] = [];
    private readonly cardWidth = 118;
    private readonly cardHeight = 150;
    private readonly cardScaleX = 1.23;
    private readonly cardScaleY = 1.5;
    private readonly cardScaleZ = 1.23;
    private readonly randomCardValues: CardModel[] = [
        { rank: "J", suit: 3 },
        { rank: "4", suit: 1 },
        { rank: "10", suit: 0 },
        { rank: "6", suit: 2 },
        { rank: "9", suit: 1 },
        { rank: "2", suit: 3 },
        { rank: "3", suit: 1 },
        { rank: "8", suit: 2 },
        { rank: "K", suit: 0 },
        { rank: "5", suit: 2 },
        { rank: "9", suit: 3 },
        { rank: "A", suit: 2 },
        { rank: "7", suit: 1 },
        { rank: "5", suit: 1 },
        { rank: "3", suit: 2 },
        { rank: "A", suit: 1 }
    ];
    private topCard: HiLoCard;
    private bottomCard: HiLoCard;

    onLoad() {
        this.createReel();
    }

    createReel() {
        this.cardReel && this.cardReel.destroyAllChildren();
        for (const card of this.randomCardValues) {
            const cardNode = this.createCard();
            this.cardReel.addChild(cardNode);
            const cardComp = cardNode.getComponent(HiLoCard);
            cardComp.faceDown();
            this.setCard(cardComp, card);
            this.cardList.push(cardComp);
        }
        this.cardReel.getComponent(cc.Layout).updateLayout();
        this.topCard = this.cardList[this.cardList.length - 1];
        this.bottomCard = this.cardList[0];
    }

    createCard(): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        node.width = this.cardWidth;
        node.height = this.cardHeight;
        node.scaleX = this.cardScaleX;
        node.scaleY = this.cardScaleY;
        node.scaleZ = this.cardScaleZ;
        return node;
    }

    updateResult(result: CardModel[]) {
        if (result.length === 0) {
            return;
        }
        this.setCard(this.topCard, result[result.length - 1]);
    }

    setCard(cardComponent: HiLoCard, data: CardModel) {
        cardComponent.setCard(data);
        cardComponent.faceUp();
    }

    faceDownCards() {
        this.cardList.forEach((card) => {
            card.faceDown();
        });
    }

    spin(spinDuration: number, animated: boolean) {
        this.cardList.forEach((card) => {
            if (card !== this.bottomCard) {
                card.faceUp();
            }
        });

        const offset = this.cardReel.height - this.cardHeight * this.cardScaleY;
        if (animated) {
            this.cardReel.position = cc.v3(0, 0, 0);
            this.cardReel.stopAllActions();
            cc.tween(this.cardReel)
                .to(spinDuration, { position: cc.v3(0, -offset, 0) }, { easing: "sineInOut" })
                .call(() => {
                    this.syncBottomCard();
                })
                .start();
        } else {
            this.cardReel.position = cc.v3(0, -offset, 0);
            this.syncBottomCard();
        }
    }

    syncBottomCard() {
        this.setCard(this.bottomCard, this.topCard.card);
        this.bottomCard.faceUp();
    }
}
