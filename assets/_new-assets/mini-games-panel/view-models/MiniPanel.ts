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
    var self = this;
    this.node._onPreDestroy = function () {
      self.onDestroy();
    };

  }

  onDestroy() {
    // clearInterval(this.taiXiu.TX_Main.timeInterval);
    // clearInterval(this.bauCua.timeInterval);
    // this.taiXiu.node.destroy();
    // this.bauCua.node.destroy();

    // this.bauCua = this.taiXiu = null;
  }

  onData(data: any) {
    console.log(this.bauCua)
    if (data.baucua && this.bauCua && this.bauCua.enabled) {
      this.bauCua.onData(data.baucua);
    }
  }

  onDataTaiXiu(taiXiuData: any) {
    if (taiXiuData && this.taiXiu && this.taiXiu.enabled && this.taiXiu.TX_Main) {
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
    cc.RedT.forceKickedOut();
    if (data.kickedOut.umInfo) {
      window.umInfo = data.kickedOut.umInfo;
      cc.director.loadScene("um");
    }
    else {
      if (data.kickedOut.isDisbledAccount) {
        setTimeout(function () {
          if (authManager) {
            authManager.signOut();
          }
        }, 10000);
      }
      else {
        authManager.signOut();
      }
      this.showNotice({
        text: data.kickedOut.message
      });
    }
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
      var taiXiuPrefab = cc.instantiate(this.taiXiuPrefab);
      this.taiXiu = taiXiuPrefab.getComponent("TX");
      this.taiXiu.init(this);
      this.node.addChild(this.taiXiu.node);
      this.taiXiu.openGame();
    }
    else {
      cc.RedT.inGame.dialog.showSignIn();
    }
  }

  openBauCua() {
    if (cc.RedT.IS_LOGIN) {
      var bauCuaPrefab = cc.instantiate(this.bauCuaPrefab);
      this.bauCua = bauCuaPrefab.getComponent("BauCuaMini");
      this.bauCua.init(this);
      this.node.addChild(this.bauCua.node);
      this.bauCua.openGame();
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

  showNotice(noticeData: any) {
    var noticePrefab = cc.instantiate(this.noticePrefab);
    var notice = noticePrefab.getComponent("Notice");

    noticeData.button = { text: 'Ok' };
    notice.init(noticeData);
    this.node.addChild(noticePrefab)
  }
}
