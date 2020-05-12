const { ccclass, property } = cc._decorator;

@ccclass
export default class GameAudios extends cc.Component {

    @property(cc.AudioSource)
    newGameRound: cc.AudioSource = null;

    playNewGameRoundAudio() {
        cc.RedT.isSoundGame() && this.newGameRound.play();
    }

}
