const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomeRoundTimerResult extends cc.Component {
    show(settlement) {
        this.node.children.forEach((choice) => {
            choice.active = settlement[choice.name] ? true : false;
        });
    }
}
