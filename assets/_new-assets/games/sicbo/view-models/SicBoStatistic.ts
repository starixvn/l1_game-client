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

  @property(cc.Node)
  nodeChanLe: cc.Node = null;

  @property(cc.Label)
  KetQuaLeft: cc.Label = null;

  @property(cc.Label)
  KetQuaRight: cc.Label = null;

  @property(cc.Node)
  KetQuaDot: cc.Node = null;

  @property(cc.Node)
  DiemSoCel: cc.Node = null;

  @property(cc.Label)
  DiemSoLeft: cc.Label = null;

  @property(cc.Label)
  DiemSoRight: cc.Label = null;

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
  tong_line: cc.Graphics = null;

  @property(cc.Node)
  dice1_dot: cc.Node = null;

  @property(cc.Node)
  dice2_dot: cc.Node = null;

  @property(cc.Node)
  dice3_dot: cc.Node = null;

  @property(cc.Node)
  tong_dot: cc.Node = null;

  @property(cc.Node)
  line_dotT: cc.Node = null;

  @property(cc.Node)
  line_dot1: cc.Node = null;

  @property(cc.Node)
  line_dot2: cc.Node = null;

  @property(cc.Node)
  line_dot3: cc.Node = null;

  init(obj) {
    /* this.TXRoot = obj;

		if (void 0 !== cc.RedT.setting.taixiu.tk_position) {
			this.node.position = cc.RedT.setting.taixiu.tk_position;
		}

		if (void 0 !== cc.RedT.setting.taixiu.tk_active) {
			this.node.active = cc.RedT.setting.taixiu.tk_active;
		}

		//KetQuaDot
		this.KetQuaDot = this.KetQuaDot.children.map(function (obj) {
			return obj.getComponent(cc.Sprite);
		});

		//DiemSoCel
		var DiemSoCel = Promise.all(this.DiemSoCel.children.map(function (cel) {
			cel.RedT = Promise.all(cel.children.map(function (obj) {
				obj.text = obj.children[0].getComponent(cc.Label);
				return obj;
			}));
			cel.RedT.then(function (value) {
				cel.RedT = value;
			})
			return cel;
		}))
			.then(result => {
				this.DiemSoCel = result;
			});

		//dice1_dot
		var dice1 = Promise.all(this.dice1_dot.children.map(function (dot) {
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
			.then(result => {
				this.dice1_dots = result;
			});

		//dice2_dot
		var dice2 = Promise.all(this.dice2_dot.children.map(function (dot) {
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
			.then(result => {
				this.dice2_dots = result;
			});

		//dice3_dot
		var dice3 = Promise.all(this.dice3_dot.children.map(function (dot) {
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
			.then(result => {
				this.dice3_dots = result;
			});

		//tong_dot
		var tong_dot = Promise.all(this.tong_dot.children.map(function (dot) {
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
			.then(result => {
				this.tong_dots = result;
			});

		var self = this;
		Promise.all([DiemSoCel, dice1, dice2, dice3, tong_dot])
			.then(() => {
				self.TXRoot.TX_Main.updateTXStats();
			}); */
  }
  onDestroy() {
    //this.TXRoot.TXStats = null;
  }
  onLoad() {
    if (!cc.sys.isMobile) {
      this.node.scale = 0.8;
    }

    //this.ttOffset = null;

    Promise.all(
      this.header.children.map(function (obj) {
        return obj.getComponent('itemContentMenu');
      })
    ).then((result) => {
      //this.header = result;
    });
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
  onChangerGame() {
    this.nodeTaiXiu.active = !this.nodeTaiXiu.active;
  }
  eventStart(e) {
    this.setTop();
    this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
  }
  eventMove(e) {
    this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
  }
  eventEnd() {
    cc.RedT.setting.taixiu.tk_position = this.node.position;
  }
  setTop() {
    this.node.parent.insertChild(this.node);
    this.TXRoot.setTop();
  }
  onSelectHeader(event, name) {
    Promise.all(
      this.header.map(function (header) {
        if (header.node.name == name) {
          header.select();
        } else {
          header.unselect();
        }
      })
    );
    Promise.all(
      this.body.children.map(function (body) {
        if (body.name == name) {
          body.active = true;
        } else {
          body.active = false;
        }
      })
    );
  }
  closeDialog() {
    cc.RedT.audio.playClick();
    this.node.destroy();
  }
  onChangerClick() {
    this.node1.active = !this.node1.active;
    this.node2.active = !this.node2.active;
  }
  draw(line, node, data) {
    line.clear();
    var o = data.length;
    for (var n = 0; n < o; n++) {
      var nodeT = node[n],
        point = data[n];
      nodeT.text.string = point.dice;
      nodeT.position = cc.v2(nodeT.position.x, point.y);
      0 === n ? line.moveTo(point.x, point.y) : line.lineTo(point.x, point.y);
    }
    line.stroke();
  }
  draw_Tong(obj, data) {
    obj.clear();
    for (var n = 0, o = data.length; n < o; n++) {
      var temp = data[n],
        line = this.tong_dots[n];
      0 === n ? obj.moveTo(temp.x, temp.y) : obj.lineTo(temp.x, temp.y);
      line.text.string = temp.tong;
      line.text.node.color = this.TXRoot.TX_Main.taixiu
        ? temp.tong > 10
          ? cc.Color.WHITE
          : cc.Color.BLACK
        : temp.tong % 2
        ? cc.Color.WHITE
        : cc.Color.BLACK;
      line.position = cc.v2(line.position.x, temp.y);
      line.color = this.TXRoot.TX_Main.taixiu
        ? temp.tong > 10
          ? cc.Color.BLACK
          : cc.Color.WHITE
        : temp.tong % 2
        ? cc.Color.BLACK
        : cc.Color.YELLOW;
    }
    obj.stroke();
  }
  lineAc(index, bool) {
    this.dice1_dots[index].active = bool;
    this.dice2_dots[index].active = bool;
    this.dice3_dots[index].active = bool;
    this.tong_dots[index].active = bool;
  }
  showLineTong() {
    cc.RedT.audio.playClick();
    this.tong_dot.active = !this.tong_dot.active;
    this.tong_line.node.active = !this.tong_line.node.active;
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
}
