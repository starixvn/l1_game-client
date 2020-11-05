import GameUtils from "../../common/GameUtils";
import { games } from "../../SabaConfigs";
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

  @property
  displaySize = 6;

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
      games.VipSedie.id,
      games.XocXoc.id,
      games.MiniSedie.id,
      games.SpecialSeDie.id,
      games.TaiXiuTurbo.id,
      games.TaiXiu.id,
      games.KenoProMax.id,
      games.KenoProViet.id,
      games.Baccarat.id,
      games.Roulette.id,
      games.BauCua.id,
      games.RongHo.id,
      games.ChanLeTurbo.id,
      games.BlackJack.id,
    ];
  }

  async initPrefabs() {
    const nameDict = {};
    nameDict[games.XocXoc.id] = 'XocXoc';
    nameDict[games.TaiXiuTurbo.id] = 'TaiXiuTurbo';
    nameDict[games.VipSedie.id] = 'VipSedie';
    nameDict[games.TaiXiu.id] = 'TaiXiu';
    nameDict[games.MiniSedie.id] = 'MiniSedie';
    nameDict[games.KenoProViet.id] = 'KenoProViet';
    nameDict[games.KenoProMax.id] = 'KenoProMax';
    nameDict[games.Baccarat.id] = 'Baccarat';
    nameDict[games.RongHo.id] = 'RongHo';
    nameDict[games.ChanLeTurbo.id] = 'ChanLeTurbo';
    nameDict[games.BauCua.id] = 'BauCua';
    nameDict[games.Roulette.id] = 'Roulette';
    nameDict[games.ChanLe.id] = 'ChanLe';
    nameDict[games.SpecialSeDie.id] = 'SpecialSeDie';
    nameDict[games.BlackJack.id] = "BlackJack";

    for (let i = 0; i < this.gameIds?.length; i++) {
      const path = `${this.path}/${nameDict[this.gameIds[i]]}`;
      const prefab = await GameUtils.loadResource(path);
      this.itemPrefabs.push(prefab);
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
      clickEventHandler.component = "GameIconLayout";
      clickEventHandler.handler = "itemPressed";
      clickEventHandler.customEventData = gameId.toString();
      const button = item.getComponent(cc.Button);
      button.clickEvents.push(clickEventHandler);
    }
  }

  itemPressed(event, gameId) {
    cc.RedT.audio.playClick();
    const id = +gameId;
    GameUtils.openGame(id, this.miniPanel);
  }
}