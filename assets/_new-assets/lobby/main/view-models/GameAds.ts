import * as _ from 'lodash';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameAds extends cc.Component {

    @property(cc.Sprite)
    banner: cc.Sprite = null;

    @property({ type: cc.SpriteFrame })
    images: cc.SpriteFrame[] = [];

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
        this.images.forEach((image, index) => {
            if (index != this.currentIndex) {
                temp.push(index);
            }
        });

        const random = _.random(0, temp.length - 1, false);
        this.currentIndex = temp[random];
        this.banner.spriteFrame = this.images[this.currentIndex];
    }
}
