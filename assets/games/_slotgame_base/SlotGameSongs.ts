import { BundleManager } from "bundle-management";
import { systemType } from "../../configs/Configs";
import BaseGameSongs from "../_base/BaseGameSongs";

const { ccclass } = cc._decorator;

@ccclass
export default class SlotGameSongs extends BaseGameSongs {
    loadAudioClip(song: string): Promise<cc.AudioClip> {
        return BundleManager.getInstance().loadAsset<cc.AudioClip>({
            bundleId: this.gameId.toString(),
            path: `/audio/background-music/${systemType}/${song}`,
            type: cc.AudioClip
        });
    }
}
