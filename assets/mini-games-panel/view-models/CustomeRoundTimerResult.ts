import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomeRoundTimerResult extends cc.Component {
    show(data) {
        if (!data && !data.settlementResult) {
            return;
        }

        const winningChoice = this.showWinningChoice(data.settlementResult);
        this.playAnimation(winningChoice);
    }

    private showWinningChoice(settlementResult): cc.Node {
        let winningChoice: cc.Node;
        this.node.children.forEach((choice) => {
            if (settlementResult[choice.name]) {
                choice.active = true;
                winningChoice = choice;
            } else {
                choice.active = false;
            }
        });

        return winningChoice;
    }

    protected async playAnimation(node: cc.Node) {
        const skeleton = node.getComponent(sp.Skeleton);
        if (!skeleton) {
            return;
        }
        skeleton.setAnimation(0, "show", false);
        await GameUtils.delayTime(skeleton.findAnimation("show").duration);
        skeleton.setAnimation(0, "idle", true);
    }
}
