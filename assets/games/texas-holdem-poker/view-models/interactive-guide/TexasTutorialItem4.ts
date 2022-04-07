import TutorialItem from "../../../../common/tutorial/TutorialItem";
import HoldemPokerCard from "../../../holdem-poker/components/cards/view-models/HoldemPokerCard";
import TexasSwapCards from "../../cards-component/view-models/texas-swap-cards";
import { CardAnimation } from "./../../texas-type";
import TexasTurorialMain from "./TexasTutorialMain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasTutorialItem4 extends TutorialItem {
    @property(cc.Node)
    swapNode: cc.Node = null;

    @property(cc.Node)
    infoNode: cc.Node = null;

    @property(cc.Node)
    playerResult: cc.Node = null;

    @property(cc.Node)
    cardPlayer1: cc.Node = null;

    @property(cc.Node)
    cardPlayer2: cc.Node = null;

    componentSwap: TexasSwapCards;
    actionSwapCard: cc.Tween;
    dealerTmpClone: any;
    playerTmpClone: any;
    dealerTmpScaleClone: any;
    cardPlayer1Clone: any;
    cardPlayer2Clone: any;

    mainBtnSwapNode: cc.Node;
    mainBtnHoldNode: cc.Node;
    mainBtnCallNode: cc.Node;
    mainBtnFoldNode: cc.Node;
    timeout: any;

    onHidden() {
        this.resetActions();
        this.timeout && clearTimeout(this.timeout);
    }

    resetActions() {
        this.node.stopAllActions();
        this.cardPlayer1.stopAllActions();
        this.cardPlayer2.stopAllActions();
        this.resetSwapCardComponent();

        this.infoNode.stopAllActions();
        this.infoNode.opacity = 0;

        this.mainBtnSwapNode.stopAllActions();
        this.mainBtnHoldNode.stopAllActions();
        this.mainBtnCallNode.stopAllActions();
        this.mainBtnFoldNode.stopAllActions();
        this.showSwapAndHoldButton(true);
        this.handleFaceDownCard();
    }

    resetSwapCardComponent() {
        this.componentSwap.dealerTmp.setPosition(this.dealerTmpClone.x, this.dealerTmpClone.y);
        this.componentSwap.dealerTmp.setScale(this.dealerTmpScaleClone.x, this.dealerTmpScaleClone.y);
        this.componentSwap.playerTmp.setPosition(this.playerTmpClone.x, this.playerTmpClone.y);
        this.componentSwap.playerTmp.scale = 1;
        this.componentSwap.resetAllTween();
        this.componentSwap.node.active = false;
        this.componentSwap.node.stopAllActions();
    }

    async show() {
        super.show();

        this.cloneNode();
        this.handleFaceDownCard();
        this.hideCardMainNode();
        this.infoNode.opacity = 0;
        this.showSwapAndHoldButton(true);

        const durationOpenCard = 0.6;
        const delayDuration = 1000;

        this.sleep(delayDuration).then(async () => {
            this.opacityButtonSwapHold();
            await this.componentSwap.swapCards();
            this.handleOpenCard(durationOpenCard);

            this.handleShowTextInfo(durationOpenCard, () => {
                this.showSwapAndHoldButton(false);
                this.opacityButtonCallCancel();
                cc.tween(this.infoNode).to(0.2, { opacity: 255 }).start();
            });
        });
    }

    sleep(time: number) {
        return new Promise((resolve) => (this.timeout = setTimeout(resolve, time)));
    }

    cloneNode() {
        const parent = this.getParentNode();
        const tutorialMain = parent.getComponent(TexasTurorialMain);
        this.mainBtnCallNode = tutorialMain.callButton;
        this.mainBtnFoldNode = tutorialMain.foldButton;
        this.mainBtnHoldNode = tutorialMain.holdButton;
        this.mainBtnSwapNode = tutorialMain.swapButton;
        this.componentSwap = this.swapNode.getComponent(TexasSwapCards);
        this.componentSwap.node.active = true;
        const dealerTmpScaleX = this.componentSwap.dealerTmp.scaleX;
        const dealerTmpScaleY = this.componentSwap.dealerTmp.scaleY;
        this.dealerTmpClone = { x: this.componentSwap.dealerTmp.x, y: this.componentSwap.dealerTmp.y };
        this.playerTmpClone = { x: this.componentSwap.playerTmp.x, y: this.componentSwap.playerTmp.y };
        this.dealerTmpScaleClone = { x: dealerTmpScaleX, y: dealerTmpScaleY };
    }

    showSwapAndHoldButton(showSwapHold: boolean) {
        this.mainBtnSwapNode.opacity = showSwapHold ? 255 : 0;
        this.mainBtnSwapNode.active = showSwapHold;
        this.mainBtnHoldNode.opacity = showSwapHold ? 255 : 0;
        this.mainBtnHoldNode.active = showSwapHold;
        this.mainBtnCallNode.opacity = !showSwapHold ? 255 : 0;
        this.mainBtnCallNode.active = !showSwapHold;
        this.mainBtnFoldNode.opacity = !showSwapHold ? 255 : 0;
        this.mainBtnFoldNode.active = !showSwapHold;
        this.playerResult.active = !showSwapHold;
    }

    opacityButtonSwapHold() {
        this.actionSwapCard = cc
            .tween(this.node)
            .delay(0.1)
            .call(() => {
                cc.tween(this.mainBtnSwapNode).to(0.1, { opacity: 0 }).start();
                cc.tween(this.mainBtnHoldNode).to(0.1, { opacity: 0 }).start();
            })
            .start();
    }

    opacityButtonCallCancel() {
        cc.tween(this.node)
            .delay(0.1)
            .call(() => {
                cc.tween(this.mainBtnCallNode).to(0.1, { opacity: 255 }).start();
                cc.tween(this.mainBtnFoldNode).to(0.1, { opacity: 255 }).start();
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
        const parent = this.getParentNode();
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
        cc.tween(this.node)
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
