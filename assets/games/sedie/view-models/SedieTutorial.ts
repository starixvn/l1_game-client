import AudioManager from "../../../common/audio/AudioManager";
const { ccclass } = cc._decorator;

@ccclass
export default class SedieTutorial extends cc.Component {
    storageKey;

    dontShowAgainCallback = (value: boolean) => {
        // toggleCallback
    };

    protected playClick() {
        AudioManager.getInstance().playClick();
    }

    getLocalStorageData() {
        const storage = cc.sys.localStorage.getItem(this.storageKey);
        return storage
            ? JSON.parse(storage)
            : {
                  enabled: true
              };
    }

    setLocalStorageData(data: any) {
        cc.sys.localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
}
