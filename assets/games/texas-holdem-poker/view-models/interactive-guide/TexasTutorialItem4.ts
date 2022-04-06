import { CardAnimation } from "./../../texas-type";
import TutorialItem from "../../../../common/tutorial/TutorialItem";
import TexasSwapCards from "../../cards-component/view-models/texas-swap-cards";
import HoldemPokerCard from "../../../holdem-poker/components/cards/view-models/HoldemPokerCard";
import TexasTurorialMain from "./TexasTutorialMain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasTutorialItem4 extends TutorialItem {
    @property(cc.Node)
    swapNode: cc.Node = null;

    @property(cc.Node)
    btnSwap: cc.Node = null;

    @property(cc.Node)
    btnHold: cc.Node = null;

    @property(cc.Node)
    btnCancel: cc.Node = null;

    @property(cc.Node)
    btnCall: cc.Node = null;

    @property(cc.Node)
    infoNode: cc.Node = null;

    @property(cc.Node)
    playerResult: cc.Node = null;

    @property(cc.Node)
    cardPlayer1: cc.Node = null;

    @property(cc.Node)
    cardPlayer2: cc.Node = null;

    // onDestroy() {
    //     this.handleFaceDownCard();
    // }

    async show() {
        super.show();
        this.handleFaceDownCard();
        this.hideCardMainNode();

        this.infoNode.opacity = 0;
        this.activeButton(true);

        const durationOpenCard = 0.6;
        this.opacityButtonSwapHold();
        const componentSwap = this.swapNode.getComponent(TexasSwapCards);
        await componentSwap.swapCards();
        this.handleOpenCard(durationOpenCard);

        this.handleShowTextInfo(durationOpenCard, () => {
            this.activeButton(false);
            this.opacityButtonCallCancel();
            cc.tween(this.infoNode).to(0.2, { opacity: 255 }).start();
        });
    }

    activeButton(status: boolean) {
        this.btnSwap.opacity = 255;
        this.btnHold.opacity = 255;
        this.btnCancel.opacity = 255;
        this.btnCall.opacity = 255;
        this.btnSwap.active = status;
        this.btnHold.active = status;
        this.btnCancel.active = !status;
        this.btnCall.active = !status;
        this.playerResult.active = !status;
    }

    opacityButtonSwapHold() {
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                cc.tween(this.btnSwap).to(0.1, { opacity: 0 }).start();
                cc.tween(this.btnHold).to(0.1, { opacity: 0 }).start();
            })
            .start();
    }

    opacityButtonCallCancel() {
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                cc.tween(this.btnCall).to(0.1, { opacity: 255 }).start();
                cc.tween(this.btnCancel).to(0.1, { opacity: 255 }).start();
            })
            .start();
    }

    movePositionCard(node: cc.Node, rotationX: number, selectedPosY: number) {
        return cc
            .tween(node)
            .parallel(
                cc.tween(node).by(0.1, { x: 0 }),
                cc.tween(node).to(
                    0.2,
                    {
                        rotationX: rotationX,
                        y: selectedPosY,
                        z: 40,
                        scaleY: 1
                    },
                    { easing: "sineIn" }
                )
            )
            .start();
    }

    hideCardMainNode() {
        const parent = this.node.parent.parent;
        const tutorialMain = parent.getComponent(TexasTurorialMain);
        tutorialMain.playerCards[0].node.active = false;
        tutorialMain.playerCards[1].node.active = false;
        tutorialMain.dealerCards[0].node.active = false;
        tutorialMain.dealerCards[1].node.active = false;
    }

    handleOpenCard(durationOpenCard: number) {
        const playerCards = [
            { rank: "J", suit: 3 },
            { rank: "10", suit: 1 }
        ];
        const componentCardPlayer1 = this.cardPlayer1.getComponent(HoldemPokerCard);
        const componentCardPlayer2 = this.cardPlayer2.getComponent(HoldemPokerCard);

        cc.tween(this.cardPlayer1)
            .call(() => {
                componentCardPlayer1.setCard(playerCards[0]);
                componentCardPlayer1.playAnimation(CardAnimation.DealerOpenCard, durationOpenCard);
            })
            .delay(durationOpenCard)
            .start();

        cc.tween(this.cardPlayer2)
            .call(() => {
                componentCardPlayer2.setCard(playerCards[1]);
                componentCardPlayer2.playAnimation(CardAnimation.DealerOpenCard, durationOpenCard);
            })
            .delay(durationOpenCard)
            .start();
    }

    handleShowTextInfo(durationOpenCard: number, callBack: () => void) {
        cc.tween(this)
            .call(() => {
                this.movePositionCard(this.cardPlayer1, 20, -15);
                this.movePositionCard(this.cardPlayer2, 20, -15);
            })
            .delay(durationOpenCard)
            .call(() => {
                callBack();
            })
            .start();
    }

    handleFaceDownCard() {
        const componentCardPlayer1 = this.cardPlayer1.getComponent(HoldemPokerCard);
        const componentCardPlayer2 = this.cardPlayer2.getComponent(HoldemPokerCard);
        componentCardPlayer1.setFaceUp(false);
        componentCardPlayer2.setFaceUp(false);
    }
}
