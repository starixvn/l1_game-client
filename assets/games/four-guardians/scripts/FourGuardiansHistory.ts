import SlotGameHistory from '../../_slotgame_base/SlotGameHistory';
import FourGuardiansTicketDetail from './FourGuardiansTicketDetail';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FourGuardiansHistory extends SlotGameHistory {
  showTicketDetail(data: any) {
    const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
    const ticketDetailComponent = ticketDetailPrefab.getComponent(FourGuardiansTicketDetail);

    this.node.addChild(ticketDetailPrefab);
    ticketDetailComponent.roundId.string = data.freeSpin ? `${data.id.toString()} (Free Spin)` : data.id.toString();
    ticketDetailComponent.initResultBoard(data.result);
    ticketDetailComponent.createBetLogs(data);
  }
}
