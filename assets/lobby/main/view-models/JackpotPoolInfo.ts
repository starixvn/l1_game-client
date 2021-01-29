import JackpotPoolInfoBase from "./JackpotPoolInfoBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotPoolInfo extends JackpotPoolInfoBase {
  @property
  loopRequest = true;

  private time = 0;

  onLoad() {
    cc.RedT.addDataObserver(`jackpot_pools${this.uuid}`, (data: any) => this.onReceivedData(data));
    this.requestData();
  }

  onDestroy() {
    cc.RedT.removeDataObserver(`jackpot_pools${this.uuid}`);
  }

  update(dt: number) {
    if (!this.loopRequest) {
      return;
    }
    this.time += dt;
    if (this.time > 5) {
      this.time = 0;
      this.requestData();
    }
  }

  requestData() {
    cc.RedT.send({
      jackpot: {
        getPools: true,
      },
    });
  }

  onReceivedData(data: any) {
    if (data.jackpotPools) {
      this.setData(data.jackpotPools);
    }
  }
}
