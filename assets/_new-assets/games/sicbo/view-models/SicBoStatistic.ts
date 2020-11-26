import SicBo from './SicBo';
import SicBoStatisticColumn from './SicBoStatisticColumn';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoStatistic extends cc.Component {
  @property(cc.Node)
  background: cc.Node = null;

  @property(cc.Node)
  header: cc.Node = null;

  @property(cc.Node)
  body: cc.Node = null;

  @property(cc.Node)
  nodeTaiXiu: cc.Node = null;

  @property(cc.Label)
  totalBig: cc.Label = null;

  @property(cc.Label)
  totalSmall: cc.Label = null;

  @property(cc.Label)
  totalAnyTriple: cc.Label = null;

  @property(cc.Node)
  KetQuaDot: cc.Node = null;

  @property(cc.Node)
  DiemSoCel: cc.Node = null;

  @property(cc.Node)
  node1: cc.Node = null;

  @property(cc.Node)
  node2: cc.Node = null;

  @property(cc.Graphics)
  dice1_line: cc.Graphics = null;

  @property(cc.Graphics)
  dice2_line: cc.Graphics = null;

  @property(cc.Graphics)
  dice3_line: cc.Graphics = null;

  @property(cc.Graphics)
  totalGraphics: cc.Graphics = null;

  @property(cc.Node)
  dice1_dot: cc.Node = null;

  @property(cc.Node)
  dice2_dot: cc.Node = null;

  @property(cc.Node)
  dice3_dot: cc.Node = null;

  @property(cc.Node)
  totalDots: cc.Node = null;

  @property(cc.Node)
  line_dotT: cc.Node = null;

  @property(cc.Node)
  line_dot1: cc.Node = null;

  @property(cc.Node)
  line_dot2: cc.Node = null;

  @property(cc.Node)
  line_dot3: cc.Node = null;

  @property(cc.SpriteFrame)
  logCircle: cc.SpriteFrame = null;

  @property(cc.Node)
  columnGraphScrollView: cc.ScrollView = null;

  @property(cc.Node)
  columnGraphContent: cc.Node = null;

  @property(cc.Prefab)
  statisticColumnPrefab: cc.Prefab = null;

  private ttOffset: cc.Vec2 = null;
  private dataLogs = [];
  private reversedDataLogs = [];
  private bigColor: cc.Color = cc.color(219, 21, 21);
  private smallColor: cc.Color = cc.color(37, 128, 241);
  private anyTripleColor: cc.Color = cc.color(242, 159, 0);

  init(sicbo: SicBo) {
    this.dataLogs = sicbo.currentDataLogs;
    this.reversedDataLogs = this.dataLogs.slice().reverse();

    this.renderDotLineGraph();
    this.renderColumnGraph();
    this.renderLineGraphs();
    this.updateStatisticLabels();
  }

  renderDotLineGraph() {
    let currentDataLogIndex = 0;
    for (const layout of this.KetQuaDot.children) {
      for (const dot of layout.children) {
        const data = this.dataLogs[currentDataLogIndex];
        const dotSprite = dot.getComponent(cc.Sprite);
        if (data) {
          const { settlementResult, result } = data;
          dot.active = true;
          dotSprite.spriteFrame = this.logCircle;
          dotSprite.node.color = settlementResult.anyTriple ? this.anyTripleColor : settlementResult.big ? this.bigColor : this.smallColor;

          dot.children[0].getComponent(cc.Label).string = result.dice1 + result.dice2 + result.dice3;
        } else {
          dot.active = false;
        }
        currentDataLogIndex++;
      }
    }
  }

  renderColumnGraph() {
    this.columnGraphContent.removeAllChildren();

    let currentIndex = 0;
    const columnNodes = [];
    while (currentIndex < this.dataLogs.length) {
      const columnLogs = [];
      currentIndex = this.getColumnLogs(columnLogs, currentIndex);

      const column = cc.instantiate(this.statisticColumnPrefab);
      const columnComponent = column.getComponent(SicBoStatisticColumn);
      columnLogs.forEach((log, index) => {
        const { result, settlementResult } = log;
        const dot = columnComponent.dots[index];
        dot.node.children[0].getComponent(cc.Label).string = result.dice1 + result.dice2 + result.dice3;
        dot.spriteFrame = this.logCircle;
        dot.node.color = settlementResult.anyTriple ? this.anyTripleColor : settlementResult.big ? this.bigColor : this.smallColor;
      });
      columnNodes.unshift(column);
    }

    for (const columnNode of columnNodes) {
      this.columnGraphContent.addChild(columnNode);
    }
  }

  getColumnLogs(arr: any[], startIndex: number) {
    const firstLog = this.reversedDataLogs[startIndex];
    arr.push(firstLog);
    startIndex++;

    for (startIndex; startIndex < this.reversedDataLogs.length && arr.length < 5; startIndex++) {
      const log = this.reversedDataLogs[startIndex];
      if (
        log.settlementResult.anyTriple ||
        arr.some((x) => x.settlementResult.big === log.settlementResult.big || x.settlementResult.small === log.settlementResult.small) ||
        (firstLog.settlementResult.anyTriple && arr.length === 1)
      ) {
        arr.push(log);
      } else {
        break;
      }
    }

    return startIndex;
  }

  updateStatisticLabels() {
    this.totalBig.string = `${(this.dataLogs.filter((data) => data.settlementResult.big).length * 100) / this.dataLogs.length}%`;
    this.totalSmall.string = `${(this.dataLogs.filter((data) => data.settlementResult.small).length * 100) / this.dataLogs.length}%`;
    this.totalAnyTriple.string = `${
      (this.dataLogs.filter((data) => data.settlementResult.anyTriple).length * 100) / this.dataLogs.length
    }%`;
  }
  onEnable() {
    this.background.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
    // this.background.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
    // this.background.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
    // this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
    // this.background.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
  }
  onDisable() {
    this.background.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
    // this.background.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
    // this.background.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
    // this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
    // this.background.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
  }
  eventStart(e) {
    this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
  }
  eventMove(e) {
    this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
  }
  eventEnd() {
    cc.RedT.setting.taixiu.tk_position = this.node.position;
  }

  onChangerClick() {
    this.node1.active = !this.node1.active;
    this.node2.active = !this.node2.active;
  }

  draw(line: cc.Graphics, dots: cc.Node, data) {
    line.clear();

    for (let i = 0; i < data.length; i++) {
      const dot = dots.children[i];
      const point = data[i];
      dot.children[0].getComponent(cc.Label).string = point.dice;
      dot.position = cc.v2(dot.position.x, point.y);
      0 === i ? line.moveTo(point.x, point.y) : line.lineTo(point.x, point.y);
    }
    line.stroke();
  }
  drawTotal(totalGraphic: cc.Graphics, data: any[]) {
    totalGraphic.clear();
    for (let i = 0; i < data.length; i++) {
      var temp = data[i],
        line = this.totalDots.children[i];
      0 === i ? totalGraphic.moveTo(temp.x, temp.y) : totalGraphic.lineTo(temp.x, temp.y);
      const text = line.children[0].getComponent(cc.Label);
      text.string = temp.tong;
      text.node.color = temp.tong > 10 ? cc.Color.WHITE : cc.Color.BLACK;

      line.position = cc.v2(line.position.x, temp.y);
      line.color = temp.tong > 10 ? cc.Color.BLACK : cc.Color.WHITE;
    }
    totalGraphic.stroke();
  }

  lineAc(index: number, isActive: boolean) {
    this.dice1_dot.children[index].active = isActive;
    this.dice2_dot.children[index].active = isActive;
    this.dice3_dot.children[index].active = isActive;
    this.totalDots.children[index].active = isActive;
  }
  
  showLineTotal() {
    cc.RedT.audio.playClick();
    this.totalDots.active = !this.totalDots.active;
    this.totalGraphics.node.active = !this.totalGraphics.node.active;
    this.line_dotT.active = !this.line_dotT.active;
  }
  showLineDice1() {
    cc.RedT.audio.playClick();
    this.dice1_dot.active = !this.dice1_dot.active;
    this.dice1_line.node.active = !this.dice1_line.node.active;
    this.line_dot1.active = !this.line_dot1.active;
  }
  showLineDice2() {
    cc.RedT.audio.playClick();
    this.dice2_dot.active = !this.dice2_dot.active;
    this.dice2_line.node.active = !this.dice2_line.node.active;
    this.line_dot2.active = !this.line_dot2.active;
  }
  showLineDice3() {
    cc.RedT.audio.playClick();
    this.dice3_dot.active = !this.dice3_dot.active;
    this.dice3_line.node.active = !this.dice3_line.node.active;
    this.line_dot3.active = !this.line_dot3.active;
  }

  renderLineGraphs() {
    var line_dice1 = [];
    var line_dice2 = [];
    var line_dice3 = [];
    var line_total = [];

    const latestDataLogs = this.dataLogs.slice(0, 19).reverse();
    // Line paint
    for (let i = 0; i < latestDataLogs.length; i++) {
      var data = latestDataLogs[i];
      const { result } = data;
      if (data) {
        this.lineAc(i, true);
        var dice1 = result.dice1;
        var dice2 = result.dice2;
        var dice3 = result.dice3;
        var tong = dice1 + dice2 + dice3;

        line_dice1[i] = {
          x: i * 28,
          y: dice1 * 28 - 28,
          dice: dice1,
        };
        line_dice2[i] = {
          x: i * 28,
          y: dice2 * 28 - 28,
          dice: dice2,
        };
        line_dice3[i] = {
          x: i * 28,
          y: dice3 * 28 - 28,
          dice: dice3,
        };
        line_total[i] = {
          x: i * 27.7,
          y: tong * 9.233 - 27.7,
          tong: tong,
        };
      } else {
        this.lineAc(i, false);
      }
    }
    this.draw(this.dice1_line, this.dice1_dot, line_dice1);
    this.draw(this.dice2_line, this.dice2_dot, line_dice2);
    this.draw(this.dice3_line, this.dice3_dot, line_dice3);
    this.drawTotal(this.totalGraphics, line_total);
  }
}
