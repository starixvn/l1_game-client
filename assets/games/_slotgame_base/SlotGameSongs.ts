import { BundleManager } from "bundle-management";

import NameSongManager from "../../common/audio/NameSongManager";
import { systemType } from "../../configs/Configs";
import { SystemType } from "../../ISystem";
import BaseGameSongs from "../_base/BaseGameSongs";

const { ccclass } = cc._decorator;

@ccclass
export default class SlotGameSongs extends BaseGameSongs {
    onLoad() {
        this.listSongs = new NameSongManager({
            [SystemType.SC1]: ["song1", "song2", "song3"],
            [SystemType.SC2]: ["song1", "song2", "song3"]
        });
    }

    loadAudioClip(song: string): Promise<cc.AudioClip> {
        return BundleManager.getInstance().loadAsset<cc.AudioClip>({
            bundleId: this.gameId.toString(),
            path: `/audio/background-music/${systemType}/${song}`,
            type: cc.AudioClip
        });
    }
}
