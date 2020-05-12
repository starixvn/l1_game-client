const { ccclass, property } = cc._decorator;

@ccclass
export default class GameAudios extends cc.Component {

    @property(cc.AudioSource)
    startGame: cc.AudioSource = null;

    @property(cc.AudioSource)
    endGame: cc.AudioSource = null;

    playStartGameAudio() {
        cc.RedT.isSoundGame() && this.startGame.play();
    }

    playEndGameAudio() {
        cc.RedT.isSoundGame() && this.endGame.play();
    }
}
