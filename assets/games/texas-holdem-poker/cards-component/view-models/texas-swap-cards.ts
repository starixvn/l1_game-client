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

    private readonly timeShowUp = 0.1;
    private readonly timeSwap = 0.6;

    protected onLoad(): void {
        this.node.active = true;
    }

    protected activeNodeCards(status: boolean) {
        this.dealerCard.active = status;
        this.playCard.active = status;
    }

    async swapCards() {
        await this.moveTopRotationCard3D(this.timeShowUp);
        await this.moveBezierCard(this.timeSwap);
        await this.hideCard2D(this.timeShowUp);
    }

    changeStatusCard3D(state: boolean) {
        this.cards3DTmp.node.active = state;
    }

    changeStatusCard2D(status: boolean) {
        this.dealerTmp.active = status;
        this.playerTmp.active = status;
    }

    changeStatusCardRoot(state: boolean) {
        this.activeNodeCards(state);
    }

    moveTopRotationCard3D(delayTime: number) {
        return new Promise((resolve) => {
            cc.tween(this)
                .call(() => {
                    this.changeStatusCardRoot(false);
                    this.changeStatusCard3D(true);
                })
                .call(() => {
                    this.cards3DTmp.getComponent(TexasShowUpCards).moveYAndRotationCard(30, 50, 40);
                })
                .delay(delayTime)
                .call(() => {
                    resolve(1);
                })
                .start();
        });
    }

    moveBezierCard(delayTime: number) {
        const dealerClone = this.dealerTmp;
        const playerClone = this.playerTmp;
        const bezierLeft = [
            cc.v2(this.desLeftControl1.x, this.desLeftControl1.y),
            cc.v2(this.desLeftControl2.x, this.desLeftControl2.y),
            cc.v2(playerClone.x, playerClone.y)
        ];

        const bezierRight = [
            cc.v2(this.desRightControl2.x, this.desRightControl2.y),
            cc.v2(this.desRightControl1.x, this.desRightControl1.y),
            cc.v2(dealerClone.x, dealerClone.y)
        ];

        return new Promise((resolve) => {
            cc.tween(this)
                .call(() => {
                    this.changeStatusCard3D(false);
                    this.changeStatusCard2D(true);
                    this.dealerTmp.runAction(
                        cc.sequence(cc.scaleTo(0.1, 0.75, 0.75), cc.spawn(cc.bezierTo(delayTime / 2, bezierLeft), cc.scaleTo(0.1, 1, 1)))
                    );
                    this.playerTmp.runAction(
                        cc.sequence(cc.scaleTo(0.1, 1, 1), cc.spawn(cc.bezierTo(delayTime / 2, bezierRight), cc.scaleTo(0.75, 0.75)))
                    );
                })
                .delay(delayTime)
                .call(() => {
                    resolve(1);
                })
                .start();
        });
    }

    hideCard2D(delayTime: number) {
        return new Promise((resolve) => {
            cc.tween(this)
                .call(() => {
                    this.changeStatusCard2D(false);
                    this.changeStatusCard3D(true);
                    this.cards3DTmp.getComponent(TexasShowUpCards).moveYAndRotationCard(0, 0, 0);
                })
                .delay(delayTime)
                .call(() => {
                    this.changeStatusCard3D(false);
                    this.changeStatusCardRoot(true);
                })

                .call(() => {
                    resolve(1);
                })
                .start();
        });
    }
}
