import _ = require("lodash");

export enum RoundType {
    BEFORESPIN = 0,
    SPINNING = 1,
    SETTLED = 2
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameTopMessage extends cc.Component {
    onLoad() {
        this.showTopMessage();
    }

    updateTopMessage() {
        this.node.children.forEach((child) => {
            child.active = false;
        });
        const items = [1, 2, 3];
        const item = items[_.random(items.length - 1)];
        this.node.children[item - 1].active = true;
    }

    showTopMessage() {
        this.node.active = true;
        this.schedule(this.updateTopMessage, 5, cc.macro.REPEAT_FOREVER, 0);
    }

    hideTopMessage() {
        this.node.active = false;
        this.unschedule(this.updateTopMessage);
    }
}
