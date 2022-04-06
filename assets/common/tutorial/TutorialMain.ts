import AudioManager from "../audio/AudioManager";
import TutorialItem from "./TutorialItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TutorialMain extends cc.Component {
    @property({ type: cc.Prefab })
    itemPrefabs: cc.Prefab[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    items: TutorialItem[] = [];

    currentIndex = -1;
    timeConfig: number[] = [];

    toggleCallback = (value: boolean) => {
        // toggleCallback
    };
    endSlideCallBack = () => {
        // endSlideCallBack
    };

    onClickNext() {
        console.log("onClickNext ", Math.floor(Date.now() / 1000));

        this.playClick();
        const index = this.currentIndex + 1;
        if (index < this.items.length) {
            this.showItem(index);
        } else {
            this.hide();
        }
    }

    onClickPrevious() {
        this.playClick();
        const index = this.currentIndex - 1;
        if (index > -1) {
            this.showItem(index);
        }
    }

    onClickSkip() {
        this.playClick();
        this.hide();
    }

    onToggleChanged(toggle: cc.Toggle) {
        this.playClick();

        const checked = toggle.isChecked;
        this.toggleCallback(checked);
    }

    private playClick() {
        AudioManager.getInstance().playClick();
    }

    onLoad() {
        this.initItems();
    }

    show() {
        this.showItem(0);
    }

    hide() {
        const currentItem = this.getItem(this.currentIndex);
        currentItem.hide();
        this.endSlideCallBack && this.endSlideCallBack();
        this.node.destroy();
    }

    protected initItems() {
        this.itemPrefabs.forEach((prfab) => {
            const node = cc.instantiate(prfab);
            this.content.addChild(node);
            const item = node.getComponent(TutorialItem);
            this.items.push(item);

            node.active = false;
        });
    }

    private getItem(index: number): TutorialItem {
        if (index === -1 || index >= this.items.length) {
            return null;
        }
        return this.items[index];
    }

    protected showItem(index: number): void {
        this.unschedule(this.onClickNext.bind(this));
        const currentItem = this.getItem(this.currentIndex);
        if (currentItem) {
            currentItem.hide();
        }
        this.currentIndex = index;
        const nextItem = this.getItem(index);
        nextItem.show();

        if (index > -1 && index < this.items.length) {
            const time = this.timeConfig[index];
            this.scheduleOnce(this.onClickNext.bind(this), time);
        }
    }

    public setTimeConfig(config: number[]) {
        this.timeConfig = config;
    }
}
