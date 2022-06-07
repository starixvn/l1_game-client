import BlockchainCard from "../card-list/BlockchainCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccaratCards extends cc.Component {
    @property(cc.Prefab)
    cardsPrefab: cc.Prefab = null;

    @property(cc.Node)
    cards: cc.Node[] = [];

    @property(cc.Node)
    cardsTmp: cc.Node[] = [];

    @property(cc.Node)
    cardsBox: cc.Node = null;

    @property(cc.Node)
    cardsDrop: cc.Node = null;

    @property(cc.Node)
    point: cc.Node = null;

    @property
    isBanker = false;

    @property()
    flyX = 0;

    protected playGetCardAudio = () => {
        //playGetCardAudio
    };
    protected readonly flyCardSecond = 1;
    protected readonly openCardSecond = 0.3;
    protected readonly openSecondCardSecond = 1.6;
    protected readonly setPointSecond = 0.2;
    protected isMainPage = false;
    protected SET_POINT = 3;

    onLoad = () => {
        //onLoad
    };

    onFaceDown(node: cc.Node) {
        node.getComponent(BlockchainCard).faceDown();
    }

    resetCards() {
        if (this.point) {
            this.point.parent.active = false;
            this.point.getComponent(cc.Label).string = "0";
        }

        this.cards.forEach((card: cc.Node) => {
            this.resetCard(card);
        });

        // this.showHighlightCards(false);
    }

    resetCard(card: cc.Node) {
        console.log("resetCard");
        card?.getComponent(BlockchainCard)?.faceDown();
        card.opacity = 0;
        card.scale = 0.5;
        card.angle = -135;
    }

    flyCard(card: cc.Node, delay: number, start = this.cardsBox, scale = 1): Promise<void> {
        return new Promise((resolve) => {
            cc.tween(card)
                .delay(delay)
                .call(() => {
                    const convertCardBox: cc.Vec3 = cc.v3(card.parent.convertToNodeSpaceAR(start.convertToWorldSpaceAR(cc.v2(0, 0))));
                    const cardPosition = card.position;
                    card.position = convertCardBox;
                    card.opacity = 255;
                    card.runAction(
                        cc.spawn(
                            cc.rotateTo(this.flyCardSecond, 0).easing(cc.easeInOut(2)),
                            cc.scaleTo(this.flyCardSecond, scale).easing(cc.easeInOut(2)),
                            cc.moveTo(this.flyCardSecond, cc.v2(cardPosition.x, cardPosition.y)).easing(cc.easeInOut(2))
                        )
                    );
                })
                .call(() => resolve())
                .start();
        });
    }
}
