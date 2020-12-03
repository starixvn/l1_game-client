import * as _ from 'lodash';

import { getStringDateByTime, numberWithCommas } from '../../../common/helpers/Helper';
import * as Pagination from '../../../common/helpers/Pagination/Pagination.js';
import VipBaccarat from './VipBaccarat.js';
import BaccaratHistoryItem from '../../baccarat/view-models/BaccaratHistoryItem';

const { ccclass, property } = cc._decorator;
@ccclass
export default class BaccaratHistory extends cc.Component {
  @property(Pagination)
  pages: Pagination = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property([cc.SpriteFrame])
  cardTypes: Array<cc.SpriteFrame> = [];

  @property(cc.Prefab)
  prefabItem: cc.Prefab = null;

  private root: VipBaccarat;

  init(root: VipBaccarat) {
    this.root = root;
  }

  private dataObserverKey = 'BaccaratHistory';

  onLoad() {
    this.pages.init(this);
  }

  onEnable() {
    cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
    this.get_data();
  }

  onDisable() {
    cc.RedT.removeDataObserver(this.dataObserverKey);
    this.content.children.forEach((child) => child.destroy());
    this.node.destroy();
  }

  receivedData(data) {
    if (data.baccarat && data.baccarat.history) {
      this.onData(data.baccarat.history);
    }
  }

  get_data(page = 1) {
    cc.RedT.send({ g: { baccarat: { log: { page: page } } } });
  }

  public onData(data: any) {
    this.pages.onSet(data.page, data.pageSize, data.total);
    this.content.children.forEach((child) => child.destroy());

    for (let i = 0; i < data.betLogs.length; i++) {
      const historyItemData = data.betLogs[i];

      if (historyItemData) {
        let historyItemPrefab = cc.instantiate(this.prefabItem);
        let item = historyItemPrefab.getComponent(BaccaratHistoryItem);
        item.node.active = true;
        this.content.addChild(historyItemPrefab);

        if (historyItemData.bet) {
          item.time.string = getStringDateByTime(historyItemData.bet.time);
          item.round.string = historyItemData.bet.phien;
          item.win.string = numberWithCommas(historyItemData.bet.betwin);
          item.win.node.color = historyItemData.bet.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

          const playerCards = _.values(historyItemData.round.player);
          const bankerCards = _.values(historyItemData.round.banker);
          item.playerCards.init(null, false);
          item.bankerCards.init(null, false);
          item.playerCards.showCardsWithoutAnimation(playerCards);
          item.bankerCards.showCardsWithoutAnimation(bankerCards);

          const result = historyItemData.round.result;
          const resultKeys = _.keys(result);

          _.forEach(resultKeys, (key) => {
            const bet = historyItemData.bet[key];
            const currentItem = item[key];
            const isWin = result[key];

            if (currentItem) {
              currentItem.node.color = isWin ? cc.Color.YELLOW : cc.Color.WHITE;
              currentItem.string = numberWithCommas(bet);
            }
          });
        }
      }
    }
  }
}
