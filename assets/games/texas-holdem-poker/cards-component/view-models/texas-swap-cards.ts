import TexasShowUpCards from "./texas-show-up-cards";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasSwapCards extends cc.Component {
    @property({ type: cc.Component })
    cards3DTmp: TexasShowUpCards = null;

    @property(cc.Node)
    dealerCard: cc.Node = null;

    @property(cc.Node)
    playCard: cc.Node = null;

    @property(cc.Node)
    dealerTmp: cc.Node = null;

    @property(cc.Node)
    playerTmp: cc.Node = null;

    @property(cc.Node)
    desLeftControl1: cc.Node = null;

    @property(cc.Node)
    desLeftControl2: cc.Node = null;

    @property(cc.Node)
    desRightControl1: cc.Node = null;

    @property(cc.Node)
    desRightControl2: cc.Node = null;

    private readonly timeShowUp = 0.3;
    private readonly timeSwap = 1;
    tweenCard3DTmp: cc.Tween;
    tweenCard2DTmp: cc.Tween;
    tweenCardOrigin: cc.Tween;

    dealerTmpClone: any;
    playerTmpClone: any;
    dealerTmpScaleClone: any;

    protected onLoad(): void {
        this.node.active = true;

        const dealerTmpScaleX = this.dealerTmp.scaleX;
        const dealerTmpScaleY = this.dealerTmp.scaleY;
        this.dealerTmpClone = { x: this.dealerTmp.x, y: this.dealerTmp.y };
        this.playerTmpClone = { x: this.playerTmp.x, y: this.playerTmp.y };
        this.dealerTmpScaleClone = { x: dealerTmpScaleX, y: dealerTmpScaleY };
    }

    protected activeCardsOrigin(status: boolean) {
        this.dealerCard.active = status;
        this.playCard.active = status;
    }

    async swapCards() {
        await this.switchCard3DTmp(this.timeShowUp);
        await this.moveBezierCard2DTmp(this.timeSwap);
        await this.switchCardOrigin(this.timeShowUp);

        return this;
    }

    resetAllTween() {
        this.node.stopAllActions();
        this.tweenCard3DTmp && this.tweenCard3DTmp.stop();
        this.tweenCard2DTmp && this.tweenCard2DTmp.stop();
        this.tweenCardOrigin && this.tweenCardOrigin.stop();

        this.dealerTmp.stopAllActions();
        this.playerTmp.stopAllActions();
    }

    reset() {
        this.resetAllTween();
        this.dealerTmp.setPosition(this.dealerTmpClone.x, this.dealerTmpClone.y);
        this.dealerTmp.setScale(this.dealerTmpScaleClone.x, this.dealerTmpScaleClone.y);
        this.playerTmp.setPosition(this.playerTmpClone.x, this.playerTmpClone.y);
        this.playerTmp.scale = 1;

        this.changeStatusCard3DTmp(false);
        this.changeStatusCard2D(false);
    }

    changeStatusCard3DTmp(state: boolean) {
        this.cards3DTmp.node.active = state;
    }

    changeStatusCard2D(status: boolean) {
        this.dealerTmp.active = status;
        this.playerTmp.active = status;
    }

    switchCard3DTmp(delayTime: number) {
        return new Promise<void>((resolve) => {
            this.tweenCard3DTmp = cc
                .tween(this)
                .call(() => {
                    this.activeCardsOrigin(false);
                    this.changeStatusCard3DTmp(true);
                    this.cards3DTmp.getComponent(TexasShowUpCards).moveYAndRotationCard(30, 50, 40, "sineIn");
                })
                .delay(delayTime)
                .call(() => {
                    this.changeStatusCard3DTmp(false);
                    resolve();
                })
                .start();
        });
    }

    moveBezierCard2DTmp(duration: number) {
        const dealerTmpScaleX = this.dealerTmp.scaleX;
        const dealerTmpScaleY = this.dealerTmp.scaleY;
        const dealerTmpClone = { x: this.dealerTmp.x, y: this.dealerTmp.y };
        const playerTmpClone = { x: this.playerTmp.x, y: this.playerTmp.y };
        const dealerTmpScaleClone = { x: dealerTmpScaleX, y: dealerTmpScaleY };

        const bezierLeft = [
            cc.v2(this.desLeftControl1.x, this.desLeftControl1.y),
            cc.v2(this.desLeftControl2.x, this.desLeftControl2.y),
            cc.v2(this.playerTmp.x, this.playerTmp.y)
        ];

        const bezierRight = [
            cc.v2(this.desRightControl2.x, this.desRightControl2.y),
            cc.v2(this.desRightControl1.x, this.desRightControl1.y),
            cc.v2(this.dealerTmp.x, this.dealerTmp.y)
        ];
        this.changeStatusCard2D(true);

        return new Promise<void>((resolve) => {
            this.tweenCard2DTmp = cc
                .tween(this)
                .call(() => {
                    this.dealerTmp.runAction(cc.spawn(cc.bezierTo(duration, bezierLeft), cc.scaleTo(duration * 0.8, 1, 1)));
                    this.playerTmp.runAction(
                        cc.spawn(cc.bezierTo(duration, bezierRight), cc.scaleTo(duration * 0.8, dealerTmpScaleX, dealerTmpScaleY))
                    );
                })
                .delay(duration)
                .call(() => {
                    this.resetCard2DTmp({
                        dealerClone: dealerTmpClone,
                        playerClone: playerTmpClone,
                        dealerScaleClone: dealerTmpScaleClone
                    });
                    resolve();
                })
                .start();
        });
    }

    switchCardOrigin(delayTime: number) {
        this.changeStatusCard2D(false);
        this.changeStatusCard3DTmp(true);

        return new Promise<void>((resolve) => {
            this.tweenCardOrigin = cc
                .tween(this)
                .call(() => {
                    this.cards3DTmp.getComponent(TexasShowUpCards).moveYAndRotationCard(0, 0, 0, "sineOut");
                })
                .delay(delayTime)
                .call(() => {
                    this.activeCardsOrigin(true);
                    this.changeStatusCard3DTmp(false);
                })
                .call(() => {
                    resolve();
                })
                .start();
        });
    }

    resetCard2DTmp({ dealerClone, playerClone, dealerScaleClone }) {
        this.dealerTmp.setPosition(dealerClone.x, dealerClone.y);
        this.dealerTmp.setScale(dealerScaleClone.x, dealerScaleClone.y);
        this.playerTmp.setPosition(playerClone.x, playerClone.y);
        this.playerTmp.scale = 1;
    }
}
