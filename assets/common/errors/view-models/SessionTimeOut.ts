import MusicPlayer from "../../audio/MusicPlayer";

const { ccclass } = cc._decorator;

@ccclass
export default class SessionTimeOut extends cc.Component {
    onLoad() {
        MusicPlayer.getInstance().stopBgAudio();
    }
}
