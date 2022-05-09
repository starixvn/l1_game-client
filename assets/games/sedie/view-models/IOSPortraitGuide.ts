import AudioManager from "../../../common/audio/AudioManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class IOSPortraitGuide extends cc.Component {
    toggleCallback = (value: boolean) => {
        // toggleCallback
    };

    onClickSkip() {
        this.playClick();
        this.node.destroy();
    }

    onToggleChanged(toggle: cc.Toggle) {
        this.playClick();

        const checked = toggle.isChecked;
        this.toggleCallback(checked);
    }

    private playClick() {
        AudioManager.getInstance().playClick();
    }
}
