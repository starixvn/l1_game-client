const { ccclass, property } = cc._decorator;
import * as configs from './../../Configs';
import * as authManager from './../../common/auth/AuthManager';
import ChanLe from '../../games/chan-le/view-models/ChanLe';
import { ChanLeConfigs } from '../../games/chan-le/view-models/ChanLeConfigs';
import ChanLeTurboConfigs from '../../games/chan-le-turbo/view-models/ChanLeTurboConfigs';

@ccclass
export default class MiniPanel extends cc.Component {
  @property(cc.BitmapFont)
  fontCong: cc.BitmapFont = null;

  @property(cc.BitmapFont)
  fontTru: cc.BitmapFont = null;

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
  chanLePrefab: cc.Prefab = null;

  @property(cc.Prefab)
  turboTaiXiuPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  chanLeTurboPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  guidePrefab: cc.Prefab = null;

  @property(cc.Prefab)
  noticePrefab: cc.Prefab = null;

  private isLightOn: boolean;

  private taiXiu: any;
  private bauCua: any;
  private taiXiuTurbo: any;
  private chanLe: ChanLe;
  private chanLeTurbo: ChanLe;
  private guide: any;

  onLoad() {
    if (void 0 === cc.RedT.util.fontCong) {
      cc.RedT.util.fontCong = this.fontCong;
      cc.RedT.util.fontTru = this.fontTru;
    }
  }


  onData(data: any) {
    if (data.baucua) {
      if (this.bauCua && this.bauCua.node) {
        this.bauCua.onData(data.baucua);
      }

      if (void 0 !== data.baucua.odds) {
        this.guide && this.guide.node && this.guide.onData(data);
      }
    }
  }

  onDataTaiXiu(taiXiuData: any) {
    if (taiXiuData && this.taiXiu && this.taiXiu.node && this.taiXiu.TX_Main) {
      this.taiXiu.TX_Main.onData(taiXiuData);
    }
  }

  onDataTaiXiuTurbo(data: any) {
    if (data && this.taiXiuTurbo && this.taiXiuTurbo.node && this.taiXiuTurbo.TX_Main) {
      this.taiXiuTurbo.TX_Main.onData(data);
    }
  }

  onDataChanLe(chanLeData: any) {
    if (chanLeData && this.chanLe && this.chanLe.node) {
      this.chanLe.onData(chanLeData);
    }
  }

  onDataChanLeTurbo(chanLeTurboData: any) {
    if (chanLeTurboData && this.chanLeTurbo && this.chanLeTurbo.node) {
      this.chanLeTurbo.onData(chanLeTurboData);
    }
  }

  onDataError(apiErrorData: any) {
    var error = apiErrorData.apiError;
    this.showErrorNotice(error);

    if (error.gameTypeId == configs.gameIds.TaiXiu && this.taiXiu && this.taiXiu.TX_Main) {
      this.taiXiu.TX_Main.onData(apiErrorData);
    }

    if (error.gameTypeId == configs.gameIds.TaiXiuTurbo && this.taiXiuTurbo && this.taiXiuTurbo.TX_Main) {
      this.taiXiuTurbo.TX_Main.onData(apiErrorData);
    }

    if (error.gameTypeId == configs.gameIds.BauCua && this.bauCua) {
      this.bauCua.onData(apiErrorData);
    }

    if (error.gameTypeId == configs.gameIds.ChanLe && this.chanLe) {
      this.chanLe.onData(apiErrorData);
    }

    if (error.gameTypeId == configs.gameIds.ChanLeTurbo && this.chanLeTurbo) {
      this.chanLeTurbo.onData(apiErrorData);
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

  onSignIn() {
    this.bauCua && this.bauCua.node && this.bauCua.onSignIn();
    this.taiXiu && this.taiXiu.node && this.taiXiu.onSignIn();
    this.taiXiuTurbo && this.taiXiuTurbo.node && this.taiXiuTurbo.onSignIn();
    this.chanLe && this.chanLe.node && this.chanLe.onSignIn();
    this.chanLeTurbo && this.chanLeTurbo.node && this.chanLeTurbo.onSignIn();
  }

  onForceReload() {
    window.location.reload(true);
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
    id = parseInt(id);
    switch (id) {
      case configs.gameIds.TaiXiu:
        this.openTaiXiu();
        break;
      case configs.gameIds.BauCua:
        this.openBauCua();
        break;
      case configs.gameIds.TaiXiuTurbo:
        this.openTaiXiuTurbo();
        break;
      case configs.gameIds.ChanLeTurbo:
        this.openChanLeTurbo();
        break;
      default:
        break;
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

  openTaiXiuTurbo() {
    if (cc.RedT.IS_LOGIN) {
      if (!this.taiXiuTurbo || !this.taiXiuTurbo.node) {
        var node = cc.instantiate(this.turboTaiXiuPrefab);
        this.taiXiuTurbo = node.getComponent("TurboTX");
        this.taiXiuTurbo.init(this);
        this.miniGames.addChild(this.taiXiuTurbo.node);
        this.taiXiuTurbo.openGame();
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

  openChanLe() {
    if (cc.RedT.IS_LOGIN) {
      if (!this.chanLe || !this.chanLe.node) {
        var chanLePrefab = cc.instantiate(this.chanLePrefab);
        this.chanLe = chanLePrefab.getComponent("ChanLe") as ChanLe;
        this.chanLe.init(this, "chanle", new ChanLeConfigs(), "Chẵn Lẻ");
        this.miniGames.addChild(this.chanLe.node);
        this.chanLe.openGame();
      }
    }
    else {
      cc.RedT.inGame.dialog.showSignIn();
    }
  }

  openChanLeTurbo() {
    if (cc.RedT.IS_LOGIN) {
      if (!this.chanLeTurbo || !this.chanLeTurbo.node) {
        var chanLePrefab = cc.instantiate(this.chanLeTurboPrefab);
        this.chanLeTurbo = chanLePrefab.getComponent("ChanLe") as ChanLe;
        this.chanLeTurbo.init(this, "clturbo", new ChanLeTurboConfigs(), "Chẵn lẻ siêu tốc", true);
        this.miniGames.addChild(this.chanLeTurbo.node);
        this.chanLeTurbo.openGame();
      }
    }
    else {
      cc.RedT.inGame.dialog.showSignIn();
    }
  }

  openMiniPoker() {
  }

  openGuide(gameName: string) {
    if (!this.guide) {
      var dialog = cc.instantiate(this.guidePrefab);
      this.dialog.addChild(dialog);
      this.guide = dialog.getComponent("GameGuide");
    }
    this.guide.node.active = true;
    this.guide.select(gameName);
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
