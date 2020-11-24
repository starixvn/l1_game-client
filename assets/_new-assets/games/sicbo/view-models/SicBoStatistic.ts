import SicBo from './SicBo';

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
  totalBig: cc.Label = null;

  @property(cc.Label)
  totalSmall: cc.Label = null;

  @property(cc.Label)
  totalAnyTriple: cc.Label = null;

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

  @property(cc.SpriteFrame)
  logCircle: cc.SpriteFrame = null;

  private ttOffset: cc.Vec2 = null;
  private dataLogs = [];
  private bigColor: cc.Color = cc.color(219, 21, 21, 1);
  private smallColor: cc.Color = cc.color(37, 128, 241, 1);
  private anyTripleColor: cc.Color = cc.color(242, 159, 0, 1);

  init(sicbo: SicBo) {
    this.dataLogs = sicbo.currentDataLogs;

    const dotSprites = this.KetQuaDot.children.map(function (obj) {
      return obj.getComponent(cc.Sprite);
    });

    let currentDataLogIndex = 0;
    for(const layout of this.KetQuaDot.children) {
      for(const dot of layout.children) {
        const data = this.dataLogs[currentDataLogIndex];
        const dotSprite= dot.getComponent(cc.Sprite);
        if (data) {
          const { settlementResult, result } = data;
          dotSprite.node.active = true;
          dotSprite.spriteFrame = this.logCircle;
          dotSprite.node.color = settlementResult.anyTriple
            ? this.anyTripleColor
            : settlementResult.big
            ? this.bigColor
            : this.smallColor;

            dot.children[0].getComponent(cc.Label).string = result.dice1 + result.dice2 + result.dice3;
        } else {
          dotSprite.node.active = false;
        }
        currentDataLogIndex++;
      }
    }
    dotSprites.forEach((dotSprite, index) => {
      const data = this.dataLogs[index];
      if (data) {
        const { settlementResult } = data;
        dotSprite.node.active = true;
        dotSprite.spriteFrame = this.logCircle;
        dotSprite.node.color = settlementResult.anyTriple
          ? this.anyTripleColor
          : settlementResult.big
          ? this.bigColor
          : this.smallColor
      } else {
        dotSprite.node.active = false;
      }
    });

    this.totalBig.string = this.dataLogs.filter(data => data.settlementResult.big).length.toString();
    this.totalSmall.string = this.dataLogs.filter(data => data.settlementResult.small).length.toString();
    this.totalAnyTriple.string = this.dataLogs.filter(data => data.settlementResult.anyTriple).length.toString();
  }
  /*  init(obj) {
    this.TXRoot = obj;

		if (void 0 !== cc.RedT.setting.taixiu.tk_position) {
			this.node.position = cc.RedT.setting.taixiu.tk_position;
		}

		if (void 0 !== cc.RedT.setting.taixiu.tk_active) {
			this.node.active = cc.RedT.setting.taixiu.tk_active;
		}

		//KetQuaDot
		this.KetQuaDots = this.KetQuaDot.children.map(function (obj) {
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
			});
  }
  onDestroy() {
    //this.TXRoot.TXStats = null;
  }
  onLoad() {
    if (!cc.sys.isMobile) {
      this.node.scale = 0.8;
    }

    Promise.all(
      this.header.children.map(function (obj) {
        return obj.getComponent('itemContentMenu');
      })
    ).then((result) => {
      this.header = result;
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
    //this.node.parent.insertChild(this.node);
    //this.TXRoot.setTop();
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

  updateStatistic() {
    var self = this;
    var line_dice1 = [];
    var line_dice2 = [];
    var line_dice3 = [];
    var line_tong = [];

    var tmp_DS = -1;
    var tmp_arrA = [];
    var tmp_arrB = [];
    var c_tai = 0;
    var c_xiu = 0;

    var sliced = cc.RedT.setting.taixiu.logs.slice(0, 19);
    sliced.reverse();
    // Line paint
    var Paint = new Promise(function (resolve, reject) {
      for (var i = 0; i < sliced.length; i++) {
        var data = sliced[i];
        if (void 0 !== data) {
          this.lineAc(i, true);
          var dice1 = sliced[i].dice[0];
          var dice2 = sliced[i].dice[1];
          var dice3 = sliced[i].dice[2];
          var tong = dice1 + dice2 + dice3;

          line_dice1[i] = {
            x: i * 28,
            y: dice1 * 28 - 28,
            dice: dice1
          };
          line_dice2[i] = {
            x: i * 28,
            y: dice2 * 28 - 28,
            dice: dice2
          };
          line_dice3[i] = {
            x: i * 28,
            y: dice3 * 28 - 28,
            dice: dice3
          };
          line_tong[i] = {
            x: i * 27.7,
            y: tong * 9.233 - 27.7,
            tong: tong
          };
        } else {
          this.lineAc(i, false);
        }
      }
      this.draw(
        this.dice1_line,
        this.dice1_dots,
        line_dice1
      );
      this.draw(
        this.dice2_line,
        this.dice2_dots,
        line_dice2
      );
      this.draw(
        this.dice3_line,
        this.dice3_dots,
        line_dice3
      );
      this.draw_Tong(
        this.tong_line,
        line_tong
      );
    });

    // Ket Qua
    var ketqua = this.KetQuaDots.map(function (dot, index) {
      var data = cc.RedT.setting.taixiu.logs[index];
      if (void 0 !== data) {
        dot.node.active = true;
        var point = data.dice[0] + data.dice[1] + data.dice[2];
        dot.spriteFrame = 
          point < 11 ?
            this.dot_white :
            this.dot_black;

        return self.taixiu ? (point > 10 ? 1 : 0) : point % 2 ? 0 : 1;
      } else {
        dot.node.active = false;
        return -1;
      }
    });

    // Diem So
    var newArr = cc.RedT.setting.taixiu.logs.slice();
    newArr.reverse();
    for (var newDS of newArr) {
      var point = newDS.dice[0] + newDS.dice[1] + newDS.dice[2];
      var type = self.taixiu ? (point > 10 ? 1 : 0) : point % 2 ? 0 : 1;
      if (tmp_DS === -1) {
        tmp_DS = type;
      }
      if (type != tmp_DS || tmp_arrB.length > 4) {
        tmp_DS = type;
        tmp_arrA.push(tmp_arrB);
        tmp_arrB = [];
      }
      if (type == tmp_DS) {
        tmp_arrB.push(point);
      }
    }
    tmp_arrA.push(tmp_arrB);

    var newData = tmp_arrA;
    newData.reverse();
    newData = newData.slice(0, 20);
    newData.reverse();
    this.KetQuaLeft.string = ketqua.filter(
      i => i == 1
    ).length;
    this.KetQuaRight.string = ketqua.filter(
      i => i == 0
    ).length;

    this.DiemSoCel.forEach(function (obj, i) {
      var data = newData[i];
      if (void 0 !== data) {
        obj.active = true;
        return Promise.all(
          obj.RedT.map(function (current, index) {
            var data_Cel = data[index];
            if (void 0 !== data_Cel) {
              var type = self.taixiu ?
                data_Cel > 10 ?
                  true :
                  false :
                data_Cel % 2 ?
                  false :
                  true;
              c_tai = type ? c_tai + 1 : c_tai;
              c_xiu = !type ? c_xiu + 1 : c_xiu;
              current.active = true;
              current.color = self.taixiu ?
                type ?
                  cc.Color.BLACK :
                  cc.Color.WHITE :
                type ?
                  cc.Color.YELLOW :
                  cc.Color.BLACK;
              current.text.string = data_Cel;
              current.text.node.color = self.taixiu ?
                type ?
                  cc.Color.WHITE :
                  cc.Color.BLACK :
                type ?
                  cc.Color.BLACK :
                  cc.Color.WHITE;
            } else {
              current.active = false;
            }
            return void 0;
          })
        );
      } else {
        obj.active = false;
      }
      return void 0;
    })

    this.DiemSoLeft.string = c_tai;
    this.DiemSoRight.string = c_xiu;
  } */
}
