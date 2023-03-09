import { BundleManager } from "bundle-management";

import { systemType } from "../../configs/Configs";
import BaseGameSongs from "../_base/BaseGameSongs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameSongs extends BaseGameSongs {
    @property
    isSameBackgroundMusic = false;

    loadAudioClip(song: string): Promise<cc.AudioClip> {
        const customSystemType = this.isSameBackgroundMusic ? `` : `/${systemType}`;

        return BundleManager.getInstance().loadAsset<cc.AudioClip>({
            bundleId: this.gameId.toString(),
            path: `/audio/background-music${customSystemType}/${song}`,
            type: cc.AudioClip
        });
    }
}
