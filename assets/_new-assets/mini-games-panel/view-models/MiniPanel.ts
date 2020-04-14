const { ccclass, property } = cc._decorator;
import * as configs from './../../Configs';
import * as authManager from './../../common/auth/AuthManager';

@ccclass
export default class MiniPanel extends cc.Component {
  @property(cc.Node)
  miniGames: cc.Node = null;

  @property(cc.Node)
  dialog: cc.Node = null;

  @property(cc.Node)
  lightBackground: cc.Node = null;

  @property(cc.Sprite)
  lightSprite: cc.Sprite = null;

  @property(cc.SpriteFrame)
  lightOnSpriteFrame: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  lightOffSpriteFrame: cc.SpriteFrame = null;

  @property(cc.Node)
  effectNode: cc.Node = null;

  @property(cc.Prefab)
  taiXiuPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  bauCuaPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  noticePrefab: cc.Prefab = null;

  private isLightOn: boolean;

  private taiXiu: any;
  private bauCua: any;

  onLoad() {
  }

  onData(data: any) {
    if (data.baucua && this.bauCua && this.bauCua.node) {
      this.bauCua.onData(data.baucua);
    }
  }

  onDataTaiXiu(taiXiuData: any) {
    if (taiXiuData && this.taiXiu && this.taiXiu.node && this.taiXiu.TX_Main) {
      this.taiXiu.TX_Main.onData(taiXiuData);
    }
  }

  onDataError(apiErrorData: any) {
    var error = apiErrorData.apiError;
    this.showErrorNotice(error);

    if (error.gameTypeId == configs.gameIds.TaiXiu && this.taiXiu && this.taiXiu.TX_Main) {
      this.taiXiu.TX_Main.onData(apiErrorData);
    }

    if (error.gameTypeId == configs.gameIds.BauCua && this.bauCua) {
      this.bauCua.onData(apiErrorData);
    }
  }

  onDataKickedOut(data: any) {
    authManager.removeSession();
    if (data.umInfo) {
      cc.RedT.forceKickedOut();
      window.umInfo = data.umInfo;
      cc.director.loadScene("um");
    }
    else {
      if (data.isDisabledAccount) {
        setTimeout(() => {
          if (authManager) {
            this.forceKickedOut();
          }
        }, 10000);
      }
      else {
        this.forceKickedOut();
      }
      this.showNotice({ text: data.message }, this.forceKickedOut, this.forceKickedOut);
    }
  }

  forceKickedOut() {
    cc.RedT.forceKickedOut();
    authManager.signOut();
  }

  changeLight() {
    this.isLightOn = !this.isLightOn;

    if (this.isLightOn) {
      this.lightBackground.active = false;
      this.lightSprite.spriteFrame = this.lightOffSpriteFrame;
    } else {
      this.lightBackground.active = true;
      this.lightSprite.spriteFrame = this.lightOnSpriteFrame;
    }
  }

  playClick() {
    cc.RedT.audio.playClick();
  }

  playUnClick() {
    cc.RedT.audio.playUnClick();
  }

  openGame(id) {
    if (id == configs.gameIds.TaiXiu) {
      this.openTaiXiu();
    }
    else if (id == configs.gameIds.BauCua) {
      this.openBauCua();
    }
  }
  openTaiXiu() {
    if (cc.RedT.IS_LOGIN) {
      if (!this.taiXiu || !this.taiXiu.node) {
        var taiXiuPrefab = cc.instantiate(this.taiXiuPrefab);
        this.taiXiu = taiXiuPrefab.getComponent("TX");
        this.taiXiu.init(this);
        this.miniGames.addChild(this.taiXiu.node);
        this.taiXiu.openGame();
      }
    }
    else {
      cc.RedT.inGame.dialog.showSignIn();
    }
  }

  openBauCua() {
    if (cc.RedT.IS_LOGIN) {
      if (!this.bauCua || !this.bauCua.node) {
        var bauCuaPrefab = cc.instantiate(this.bauCuaPrefab);
        this.bauCua = bauCuaPrefab.getComponent("BauCuaMini");
        this.bauCua.init(this);
        this.miniGames.addChild(this.bauCua.node);
        this.bauCua.openGame();
      }
    } else {
      cc.RedT.inGame.dialog.showSignIn();
    }
  }

  openMiniPoker() {
  }

  showErrorNotice(error) {
    var noticePrefab = cc.instantiate(this.noticePrefab);
    var notice = noticePrefab.getComponent("Notice");
    var message = '';

    if (error.gameTypeId) {
      message += `Game ${configs.gameNames[error.gameTypeId]} (#${error.gameRoundId})\r\n`;
    }

    message += `${error.message}.`;

    if (error.isPlaceBetFailed) {
      message += " Đặt cược thất bại!"
    }

    notice.init({ text: message });
    this.node.addChild(noticePrefab);
  }

  showNotice(noticeData: any, handleClickButton = null, handleClose = null) {
    var noticePrefab = cc.instantiate(this.noticePrefab);
    var notice = noticePrefab.getComponent("Notice");

    noticeData.button = { text: 'Ok' };
    notice.init(noticeData);

    if (handleClickButton) {
      notice.handleClickButton = handleClickButton;
    }

    if (handleClose) {
      notice.handleClose = handleClose;
    }

    this.node.addChild(noticePrefab)
  }
}
