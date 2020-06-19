const { ccclass, property } = cc._decorator;
import * as configs from './../../Configs';
import * as authManager from './../../common/auth/AuthManager';
import ChanLe from '../../games/chan-le/view-models/ChanLe';
import { ChanLeConfigs } from '../../games/chan-le/view-models/ChanLeConfigs';
import ChanLeTurboConfigs from '../../games/chan-le-turbo/view-models/ChanLeTurboConfigs';
import RongHo from '../../games/rong-ho/view-models/RongHo';
import { RongHoConfigs } from '../../games/rong-ho/view-models/RongHoConfigs';
import MiniSedie from '../../games/mini-sedie/viewModels/MiniSedie';
import { MiniSedieConfigs } from '../../games/mini-sedie/viewModels/MiniSedieConfigs';
import Loading from '../../common/loading/view-models/Loading';
import Notice, { NoticeData } from '../../common/notice/view-models/Notice';
import KenoProViet from '../../games/mini-keno/view-models/KenoProViet';

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
  guidePrefab: cc.Prefab = null;

  @property(cc.Prefab)
  noticePrefab: cc.Prefab = null;

  @property(cc.Prefab)
  loadingPrefab: cc.Prefab = null;

  private isLightOn: boolean;
  private loading: Loading;
  private taiXiu: any;
  private bauCua: any;
  private taiXiuTurbo: any;
  private chanLe: ChanLe;
  private chanLeTurbo: ChanLe;
  private rongHo: RongHo;
  private guide: any;
  private miniSedie: MiniSedie;
  private kenoProViet: KenoProViet;

  onLoad() {
    if (void 0 === cc.RedT.util.fontCong) {
      cc.RedT.util.fontCong = this.fontCong;
      cc.RedT.util.fontTru = this.fontTru;
    }

    var loadingNode = cc.instantiate(this.loadingPrefab);
    this.loading = loadingNode.getComponent("Loading") as Loading;
    loadingNode.active = false;
    this.node.addChild(loadingNode);
  }

  onDestroy() {
    this.guide && this.guide.destroy();
    this.guide = null;
    this.taiXiu && this.taiXiu.destroy();
    this.taiXiu = null;
    this.taiXiuTurbo && this.taiXiuTurbo.destroy();
    this.taiXiuTurbo = null;
    this.chanLe && this.chanLe.destroy();
    this.chanLe = null;
    this.chanLeTurbo && this.chanLeTurbo.destroy();
    this.chanLeTurbo = null;
    this.bauCua && this.bauCua.destroy();
    this.bauCua = null;
    this.miniSedie && this.miniSedie.destroy();
    this.miniSedie = null;
    this.kenoProViet && this.kenoProViet.destroy();
    this.kenoProViet = null;
  }

  onGeneralData(data: any) {
    if (data.mini) {
      this.onData(data.mini);
    }

    if (data.kickedOut) {
      this.onDataKickedOut(data.kickedOut);
    }

    if (data.apiError) {
      this.onDataError(data);
    }

    if (data.reload) {
      this.onForceReload();
    }
  }

  onData(data: any) {
    if (data.baucua) {
      if (data.baucua.odds && this.guide && this.guide.node) {
        this.guide.onData(data);
      }
    }

    if (data.kickedOut) {
      this.onDataKickedOut(data.kickedOut);
    }

    if (data.apiError) {
      this.onDataError(data);
    }

    if (data.reload) {
      this.onForceReload();
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
      const noticeData = <NoticeData>{ text: data.message }
      this.showNotice(noticeData, this.forceKickedOut, this.forceKickedOut);
    }
  }

  onSignIn() {
    this.bauCua && this.bauCua.node && this.bauCua.onSignIn();
    this.taiXiu && this.taiXiu.node && this.taiXiu.onSignIn();
    this.taiXiuTurbo && this.taiXiuTurbo.node && this.taiXiuTurbo.onSignIn();
    this.chanLe && this.chanLe.node && this.chanLe.onSignIn();
    this.chanLeTurbo && this.chanLeTurbo.node && this.chanLeTurbo.onSignIn();
    this.rongHo && this.rongHo.node && this.rongHo.onSignIn();
    this.miniSedie && this.miniSedie.node && this.miniSedie.onSignIn();
    this.kenoProViet && this.kenoProViet.node && this.kenoProViet.onSignIn();
  }

  onForceReload(showNotice = true) {
    const forceReload = () => {
      window.location.reload(true);
    }

    if (showNotice) {
      const noticeData = <NoticeData>{ text: "Vui lòng tải lại trang để cập nhật phiên bản mới.", isInfo: true }
      this.showNotice(noticeData, forceReload, forceReload);
    }
    else {
      forceReload();
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
      case configs.gameIds.ChanLe:
        this.openChanLe();
        break;
      case configs.gameIds.ChanLeTurbo:
        this.openChanLeTurbo();
        break;
      case configs.gameIds.RongHo:
        this.openRongHo();
        break;
      case configs.gameIds.MiniSedie:
        this.openMiniSedie();
        break;
      case configs.gameIds.KenoProViet:
        this.openKenoProViet();
        break;
      default:
        break;
    }
  }

  openMiniGame(prefabPath: string, componentName: string, isAlreadyOpened: boolean, initFunc: (gameComponent) => void, showGameFunc: () => void) {
    if (cc.RedT.IS_LOGIN) {
      let gameComponent: any;

      if (!isAlreadyOpened) {
        this.loading.node.active = true;
        this.loading.setDefaultPercent();

        cc.loader.loadRes(prefabPath, (completedCount, total, item) => {
          this.loading && this.loading.onProgress(completedCount, total, item);
        }, (err: Error, prefab: any) => {
          if (err || prefab === null || !this.node || !this.node.isValid) {
            this.loading.node.active = false;
            this.onForceReload();
            return;
          }

          let node = cc.instantiate(prefab);
          gameComponent = node.getComponent(componentName);
          initFunc ? initFunc(gameComponent) : gameComponent.init(this);
          this.miniGames && this.miniGames.addChild(gameComponent.node);
          gameComponent.openGame();
          this.loading.node.active = false;
        });
      }
      else {
        showGameFunc();
      }
    }
    else {
      cc.RedT.inGame.dialog.showSignIn();
    }
  }

  openTaiXiu() {
    this.openMiniGame("games/tai-xiu/views/TaiXiu", "TX", this.taiXiu && this.taiXiu.node,
      (gameComponent) => {
        this.taiXiu = gameComponent;
        this.taiXiu.init("taixiu", this);
      },
      () => {
        this.taiXiu.node.active = true;
      });
  }

  openTaiXiuTurbo() {
    this.openMiniGame("games/tai-xiu-turbo/views/TurboTaiXiu", "TurboTX", this.taiXiuTurbo && this.taiXiuTurbo.node,
      (gameComponent) => {
        this.taiXiuTurbo = gameComponent;
        this.taiXiuTurbo.init("taixiu_turbo", this);
      },
      () => {
        this.taiXiuTurbo.node.active = true;
      });
  }

  openKenoProViet() {
    this.openMiniGame("games/keno-pro-viet/views/KenoProViet", "KenoProViet", this.kenoProViet != null && this.kenoProViet.node != null,
      (gameComponent) => {
        this.kenoProViet = gameComponent;
        this.kenoProViet.init(this);
      },
      () => {
        this.kenoProViet.node.active = true;
      });
  }

  openBauCua() {
    this.openMiniGame("games/bau-cua/views/BauCua", "BauCuaMini", this.bauCua && this.bauCua.node,
      (gameComponent) => {
        this.bauCua = gameComponent;
        this.bauCua.init("baucua", this);
      }, () => {
        this.bauCua.node.active = true;
      });
  }

  openRongHo() {
    this.openMiniGame("games/rong-ho/views/RongHo", "RongHo", (this.rongHo != null && this.rongHo.node != null),
      (gameComponent) => {
        this.rongHo = gameComponent;
        this.rongHo.init(this, "dragon_tiger", new RongHoConfigs());
      },
      () => {
        this.rongHo.node.active = true;
      });
  }

  openMiniSedie() {
    this.openMiniGame("games/mini-sedie/views/MiniSedie", "MiniSedie", this.miniSedie != null,
      (gameComponent) => {
        this.miniSedie = gameComponent;
        this.miniSedie.init("miniSedie", new MiniSedieConfigs(), this);
      }, () => {
        this.miniSedie.node.active = true
      });
  }

  openChanLe() {
    this.openMiniGame("games/chan-le/views/ChanLe", "ChanLe", this.chanLe != null,
      (gameComponent) => {
        this.chanLe = gameComponent;
        this.chanLe.init(this, "chanle", new ChanLeConfigs(), "Chẵn Lẻ");
      }, () => {
        this.chanLe.node.active = true;
      });
  }

  openChanLeTurbo() {
    this.openMiniGame("games/chan-le-turbo/views/ChanLeTurbo", "ChanLe", this.chanLeTurbo != null,
      (gameComponent) => {
        this.chanLeTurbo = gameComponent;
        this.chanLeTurbo.init(this, "clturbo", new ChanLeTurboConfigs(), "Chẵn lẻ siêu tốc", true);
      }, () => {
        this.chanLeTurbo.node.active = true;
      });
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

  showNotice(noticeData: NoticeData, handleClickButton = null, handleClose = null) {
    var noticePrefab = cc.instantiate(this.noticePrefab);
    var notice = noticePrefab.getComponent("Notice") as Notice;

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
