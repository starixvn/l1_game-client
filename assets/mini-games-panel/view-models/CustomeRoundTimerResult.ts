import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomeRoundTimerResult extends cc.Component {
    show(settlement) {
        this.node.children.forEach((choice) => {
            choice.active = settlement[choice.name] ? true : false;
            const skeleton = choice.getComponent(sp.Skeleton);
            if (settlement[choice.name] && skeleton) {
                skeleton.setAnimation(0, "show", false);
                GameUtils.delayTime(skeleton.findAnimation("show").duration);
                skeleton.setAnimation(0, "idle", true);
            }
        });
    }
}
