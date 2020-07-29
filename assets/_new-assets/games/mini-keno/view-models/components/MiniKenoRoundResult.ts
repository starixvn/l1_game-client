import KenoRoundResult from "../../../keno-pro/view-models/history/KenoRoundResult";
import MiniKenoProViet from "../../../mini-keno-pro-viet/view-models/MiniKenoProViet";
import KenoUtils, { KenoType } from "../KenoUtils";
import MiniKeno from "../MiniKeno";
import MiniKenoTimer from "./MiniKenoTimer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoRoundResult extends KenoRoundResult {
    @property(MiniKenoTimer)
    timer: MiniKenoTimer = null;

    private miniKeno: MiniKeno;
    private showActionTag = 100;
    private hideActionTag = 101;

    init(miniKeno: MiniKeno) {
        this.miniKeno = miniKeno;
        this.timer && this.timer.init(false, 5, -2);
    }

    setTimer(time: string) {
        this.timer.node.parent.active = true;

        this.timer.setTime(time);
    }

    onClickRound() {
        if (this.miniKeno.kenoType == KenoType.ProViet) {
            MiniKenoProViet.openVietlottUrl();
        }
    }

    clear() {
        this.kenoNumbers.forEach((number, index) => {
            if (this.miniKeno.isMiniKeno && index >= 10) {
                return;
            }

            number.showWaiting();
        });

        this.betChoices.forEach(choice => choice.setValue(""))
        this.total.string = "";
    }

    public show() {
        if (!cc.RedT.GAME_IS_SHOWED || !this.miniKeno.node.activeInHierarchy) {
            return;
        }
        if (this.node.active) {
            return;
        }

        this.node.active = true;
        this.node.scale = 0;

        this.node.runAction(cc.scaleTo(.3, 1, 1));
    }

    public showResult(animated: boolean = false, duration: number = 0, onComplete: () => void = () => { }) {
        if (!cc.RedT.GAME_IS_SHOWED || !this.miniKeno.node.activeInHierarchy) {
            onComplete();
            return;
        }

        this.show();
        this.timer && (this.timer.node.parent.active = false);

        if (animated) {
            this.total.string = "0";
            const miniType = this.result.length < 20;
            let index = 0;
            let total = 0;

            const showNumberAction = cc.sequence(
                cc.callFunc(() => {
                    const number = this.result[index];
                    this.kenoNumbers[index].setNumber(number, true);
                    total += number;
                    const settlementResult = KenoUtils.getSettleResult(total, miniType);
                    this.showSettleResult(settlementResult);
                    this.total.string = total.toString();
                    index++;
                }),
                cc.delayTime(duration / this.result.length)
            );


            const action = cc.sequence(
                cc.repeat(showNumberAction, this.result.length),
                cc.callFunc(() => {
                    this.total.node.runAction(cc.sequence(
                        cc.scaleTo(.1, 1.2),
                        cc.scaleTo(.1, 1)
                    ));
                    this.betChoices.forEach(label => {
                        label.node.runAction(cc.sequence(
                            cc.scaleTo(.1, 1.2),
                            cc.scaleTo(.1, 1)
                        ));
                    });
                    this.showSettleResult(this.settlementResult);

                    onComplete();
                }),
            );

            action.setTag(this.showActionTag);
            this.node.runAction(action);
        } else {
            this.node.stopActionByTag(this.showActionTag);
            this.total.node.scale = 1;
            this.betChoices.forEach(label => label.node.scale = 1);

            let total = 0;

            for (let i = 0; i < this.result.length; i++) {
                total += this.result[i];
                this.kenoNumbers[i].setNumber(this.result[i], false);
            }

            this.total.string = total.toString();
            this.showSettleResult(this.settlementResult);
        }
    }

    hide() {
        const hide = cc.sequence(
            cc.delayTime(2.7),
            cc.scaleTo(0.3, 0, 0),
            cc.callFunc(() => {
                this.node.active = false;
            })
        );
        hide.setTag(this.hideActionTag);
        this.node.runAction(hide);
    }
}
