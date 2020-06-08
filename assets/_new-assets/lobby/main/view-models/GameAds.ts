import * as _ from 'lodash';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameAds extends cc.Component {

    @property
    intervalChangeImage = 2;

    private currentIndex = 0;

    onLoad() {
        this.schedule(this.changeImage, this.intervalChangeImage, cc.macro.REPEAT_FOREVER);
    }

    onDestroy() {
        this.unschedule(this.changeImage);
    }

    changeImage() {
        const temp = [];
        this.node.children.forEach((image, index) => {
            if (index != this.currentIndex) {
                temp.push(index);
            }
        });

        if (temp.length == 0) {
            return;
        }

        const random = _.random(0, temp.length - 1, false);
        this.currentIndex = temp[random];
        this.node.children.forEach(node => node.active = false);

        const currentNode = this.node.children[this.currentIndex];
        currentNode.active = true;
        const direction = _.random(0, 1) > 0 ? 1 : -1;
        const distance = this.node.width;
        currentNode.position = cc.v2(direction * distance, currentNode.position.y);
        const move = cc.moveTo(0.6, cc.v2(0, 0));
        move.easing = cc.easeCubicActionInOut();
        currentNode.runAction(move);
    }
}
