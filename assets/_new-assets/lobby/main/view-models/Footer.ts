const { ccclass, property } = cc._decorator;

@ccclass
export default class Footer extends cc.Component {
  @property(cc.Sprite)
  public sound: cc.Sprite = null;

  @property(cc.SpriteFrame)
  public soundOn: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  public soundOff: cc.SpriteFrame = null;

  @property(cc.AudioSource)
  public audio: cc.AudioSource = null;

  @property(cc.Sprite)
  public music: cc.Sprite = null;

  @property(cc.SpriteFrame)
  public musicOn: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  public musicOff: cc.SpriteFrame = null;

  public onLoad() {
    this.initSoundAndMusic();
  }

  public onClickBackgroundMusic() {
    //   cc.RedT.audio.playClick();
    cc.RedT.isSoundBackground() ? this.setMusicOff() : this.setMusicOn();
  }

  public onClickSoundGame() {
    // cc.RedT.audio.playClick();
    cc.RedT.isSoundGame() ? this.setSoundGameOff() : this.setSoundGameOn();
  }

  private initSoundAndMusic() {
    if (!cc.RedT.IS_LOGIN) {
      this.setMusicOn();
      this.setSoundGameOn();
    } else {
      cc.RedT.isSoundBackground() ? this.setMusicOn() : this.setMusicOff();
      cc.RedT.isSoundGame() ? this.setSoundGameOn() : this.setSoundGameOff();
    }
  }

  private setSoundGameOn() {
    this.sound.spriteFrame = this.soundOn;
    cc.RedT.setSoundGame(true);
  }

  private setSoundGameOff() {
    this.sound.spriteFrame = this.soundOff;
    cc.RedT.setSoundGame(false);
  }

  private setMusicOff() {
    this.music.spriteFrame = this.musicOff;
    cc.RedT.setSoundBackground(false);
    this.audio.pause();
  }

  private setMusicOn() {
    this.music.spriteFrame = this.musicOn;
    cc.RedT.setSoundBackground(true);
    this.audio.play();
  }
}
