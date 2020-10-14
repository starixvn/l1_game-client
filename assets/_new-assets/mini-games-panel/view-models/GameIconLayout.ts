import GameUtils from "../../common/GameUtils";
import { gameIds } from "../../Configs";
import MiniPanel from "./MiniPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameIconLayout extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  columnPrefab: cc.Prefab = null;

  @property
  path = 'minipanel/games';

  itemPrefabs: cc.Prefab[] = [];
  gameIds: number[] = [];

  private colums: cc.Node[] = [];
  public miniPanel: MiniPanel = null;
  public columnCount = 0;
  public initializedCallback = () => { };

  onLoad() {
    this.initPrefabs().then(() => {
      if (this.node === null) {
        return;
      }
      this.initColumns();
      this.initItems();

      const layout = this.content.getComponent(cc.Layout);
      layout.updateLayout();
      this.initializedCallback();
    });
  }

  constructor() {
    super();
    this.gameIds = [
      gameIds.VipSedie,
      gameIds.XocXoc,
      gameIds.MiniSedie,
      gameIds.SpecialSeDie,
      gameIds.TaiXiuTurbo,
      gameIds.TaiXiu,
      gameIds.KenoProMax,
      gameIds.KenoProViet,
      gameIds.Baccarat,
      gameIds.Roulette,
      gameIds.BauCua,
      gameIds.RongHo,
      gameIds.ChanLeTurbo,
    ];
  }

  async initPrefabs() {
    const nameDict = {};
    nameDict[gameIds.XocXoc] = 'XocXoc';
    nameDict[gameIds.TaiXiuTurbo] = 'TaiXiuTurbo';
    nameDict[gameIds.VipSedie] = 'VipSedie';
    nameDict[gameIds.TaiXiu] = 'TaiXiu';
    nameDict[gameIds.MiniSedie] = 'MiniSedie';
    nameDict[gameIds.KenoProViet] = 'KenoProViet';
    nameDict[gameIds.KenoProMax] = 'KenoProMax';
    nameDict[gameIds.Baccarat] = 'Baccarat';
    nameDict[gameIds.RongHo] = 'RongHo';
    nameDict[gameIds.ChanLeTurbo] = 'ChanLeTurbo';
    nameDict[gameIds.BauCua] = 'BauCua';
    nameDict[gameIds.Roulette] = 'Roulette';
    nameDict[gameIds.ChanLe] = 'ChanLe';
    nameDict[gameIds.SpecialSeDie] = 'SpecialSeDie';

    for (let i = 0; i < this.gameIds?.length; i++) {
      const path = `${this.path}/${nameDict[this.gameIds[i]]}`;
      const prefab = await GameUtils.loadResource(path);
      this.itemPrefabs?.push(prefab);
    }
  }

  initColumns() {
    const count = Math.ceil(this.itemPrefabs.length / 2);
    for (let i = 0; i < count; i++) {
      const column = cc.instantiate(this.columnPrefab);
      this.content.addChild(column);
      this.colums.push(column);
    }
    this.columnCount = this.colums.length;
  }

  initItems() {
    for (let i = 0; i < this.itemPrefabs.length; i++) {
      const columnIndex = Math.floor(i / 2);
      const column = this.colums[columnIndex];
      const item = cc.instantiate(this.itemPrefabs[i]);

      column.addChild(item);
      column.width = item.width;
      const gameId = this.gameIds[i];
      const clickEventHandler = new cc.Component.EventHandler();
      clickEventHandler.target = this.node;
      clickEventHandler.component = 'GameIconLayout';
      clickEventHandler.handler = 'itemPressed';
      clickEventHandler.customEventData = gameId.toString();
      const button = item.getComponent(cc.Button);
      button.clickEvents.push(clickEventHandler);
    }
  }

  itemPressed(event, gameId) {
    if (!cc.RedT.user.name) {
      return;
    }
    const id = +gameId;
    switch (id) {
      case gameIds.XocXoc:
      case gameIds.VipSedie:
        this.openNewGameSocket(event, gameId);
        break;

      case gameIds.KenoProMax:
      case gameIds.Baccarat:
      case gameIds.Roulette:
        this.openGameRoom(event, gameId);
        break;

      case gameIds.SpecialSeDie:
        this.openNewSocketMiniGame(event, gameId);
        break;

      default:
        this.openGameMini(event, gameId);
        break;
    }
  }

  openGameRoom(e, id) {
    cc.RedT.audio.playClick();
    this.miniPanel?.openGameRoom(e, id);
  }

  openGameMini(e, id) {
    cc.RedT.audio.playClick();
    this.miniPanel?.openGame(e, id);
  }

  openNewSocketMiniGame(e, id) {
    cc.RedT.audio.playClick();
    this.miniPanel?.openNewSocketMiniGame(e, id);
  }

  openNewGameSocket(e, gameId) {
    cc.RedT.audio.playClick();
    this.miniPanel?.openNewGameSocket(e, gameId);
  }
}
