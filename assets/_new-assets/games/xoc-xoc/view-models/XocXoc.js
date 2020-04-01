
let helper = require('Helper');
let module_Player = require('XocXoc_Player');
const logger = require('../../../common/logger');

cc.Class({
	extends: cc.Component,

	properties: {
		audioMoBat: cc.AudioSource,
		audioSingleChip: cc.AudioSource,
		audioMultiChip: cc.AudioSource,
		audioXocDia: cc.AudioSource,

		audioMultiChip2: cc.AudioSource,
		audioMultiChip3: cc.AudioSource,
		audioMultiChip4: cc.AudioSource,
		audioMultiChip5: cc.AudioSource,

		box_chan: cc.Node,
		box_le: cc.Node,
		box_red3: cc.Node,
		box_red4: cc.Node,
		box_white3: cc.Node,
		box_white4: cc.Node,

		total_chan: cc.Label,
		total_le: cc.Label,
		total_red3: cc.Label,
		total_red4: cc.Label,
		total_white3: cc.Label,
		total_white4: cc.Label,

		me_chan: cc.Label,
		me_le: cc.Label,
		me_red3: cc.Label,
		me_red4: cc.Label,
		me_white3: cc.Label,
		me_white4: cc.Label,

		me: cc.Node,
		me_name: cc.Label,
		me_balans: cc.Label,

		labelTime: cc.Label,
		timeWait: cc.Label,
		nodeWait: cc.Node,

		box_chip: cc.Node,

		users_bg: cc.Node,
		users_count: cc.Label,

		nodeBat: cc.Node,

		chip_1: cc.SpriteFrame,
		chip_5: cc.SpriteFrame,
		chip_10: cc.SpriteFrame,
		chip_50: cc.SpriteFrame,
		chip_100: cc.SpriteFrame,
		chip_200: cc.SpriteFrame,

		dot_red: cc.SpriteFrame,
		dot_white: cc.SpriteFrame,
		dot_red_large: cc.SpriteFrame,
		dot_white_large: cc.SpriteFrame,

		dot: {
			default: [],
			type: cc.Sprite,
		},

		log_chan: cc.Label,
		log_le: cc.Label,
		log_top: cc.Node,
		logMain: cc.Node,

		redH: cc.Node,
		miniNotice: cc.Node,

		Animation: cc.Animation,

		prefabNotice: cc.Prefab,
		prefabGuide: cc.Prefab,
		prefabHistory: cc.Prefab,
		ProcessingWarning: {
			default: null,
			type: cc.Prefab
		},

		bet: cc.Node,
		nodeRed: cc.Node,
		nodeXu: cc.Node,

		MiniPanel: cc.Prefab,
		loading: cc.Node,
		red: true,

		players: {
			default: [],
			type: module_Player,
		},
		gameRound: cc.Label,
		avatar: cc.Sprite,
		center: cc.Node,
		winnerPrefab: cc.Prefab,
		NoticePrefab: cc.Prefab
	},
	ctor: function () {
		this.logs = [];
		this.nan = false;
		this.cuoc = '1';
		this.actionBatOpen = cc.moveTo(0.5, cc.v2(0, 150));
		this.actionBatClose = cc.sequence(
			cc.callFunc(function () {
				this.resetData();
			}, this),
			cc.moveTo(0.5, cc.v2(0, 0)),
			//cc.delayTime(0.5),
			cc.callFunc(function () {
				cc.RedT.isSoundGame() && this.audioXocDia.play();
				this.Animation.play();
			}, this));
		this.maxDot = { x: 25, y: 25 };

		this.maxBox1_3 = { x: 80, y: 40 };
		this.maxBox1_1 = { x: 180, y: 70 };

		this.clients = {
			'red': {
				'chan': 0,
				'le': 0,
				'red3': 0,
				'red4': 0,
				'white3': 0,
				'white4': 0,
			}
		};

		this.users = {
			'red': {
				'chan': 0,
				'le': 0,
				'red3': 0,
				'red4': 0,
				'white3': 0,
				'white4': 0,
			}
		};

		this.otherPlayers = {};
		this.Positions = {
			1: { id: 1, data: null },
			2: { id: 2, data: null },
			3: { id: 3, data: null },
			4: { id: 4, data: null },
			5: { id: 5, data: null },
			6: { id: 6, data: null },
			7: { id: 7, data: null },
			8: { id: 8, data: null },
		};
		this.numberOfSlots = 8;
		this.winners = {};
		this.status = {};
		this.isWaitingBetResult = false;
	},
	onDestroy() {
		cc.game.off(cc.game.EVENT_HIDE, this.backGame, this);
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
	},
	onLoad() {
		cc.RedT.inGame = this;
		var MiniPanel = cc.instantiate(this.MiniPanel);
		cc.RedT.MiniPanel = MiniPanel.getComponent('MiniPanel');
		this.redH.insertChild(MiniPanel);

		this.logMain = this.logMain.children.map(function (obj) {
			return obj.children[0].getComponent(cc.Sprite);
		});

		this.logMain.reverse();

		this.log_top = this.log_top.children.map(function (obj) {
			let data = { 'cell': obj };
			let cell = obj.children.map(function (obj) {
				return { c: obj.children[0].getComponent(cc.Sprite), t: obj.children[1].getComponent(cc.Label) };
			});
			cell.reverse();
			data.data = cell;
			return data;
		});

		this.log_top.reverse();

		this.me_name.string = cc.RedT.user.name;
		this.me_balans.string = helper.numberWithCommas(cc.RedT.user.red);
		let self = this;
		cc.loader.loadRes("profile-picture", cc.SpriteAtlas, function (err, atlas) {
			let avatarId = cc.RedT.user.avatarId;
			let frame = atlas.getSpriteFrame(avatarId == 0 ? 1 : avatarId);
			self.avatar.spriteFrame = frame;
		});
		cc.game.on(cc.game.EVENT_HIDE, self.backGame, self);
		if (!cc.sys.isMobile || cc.sys.platform === cc.sys.IPAD) {
			this.center.scale = 0.8;
		}
		cc.RedT.send({ scene: "xocxoc", g: { xocxoc: { ingame: true } } });
	},
	onData: function (data) {
		if (void 0 !== data.user) {
			this.userData(data.user);
			cc.RedT.userData(data.user);
		}
		if (void 0 !== data.xocxoc) {
			this.xocxoc(data.xocxoc);
		}
		if (void 0 !== data.mini) {
			cc.RedT.MiniPanel.onData(data.mini);
		}
		if (void 0 !== data.TopHu) {
			cc.RedT.MiniPanel.TopHu.onData(data.TopHu);
		}
		if (void 0 !== data.taixiu) {
			cc.RedT.MiniPanel.onDataTaiXiu(data.taixiu);
		}
		if (data.apiError) {
			cc.RedT.MiniPanel.onDataError(data);
		}
	},
	backGame: function () {
		clearInterval(this.timeInterval);
		cc.RedT.send({ g: { xocxoc: { outgame: true } } });
		if (this.loading) {
			this.loading.active = true;
		}
		void 0 !== this.timeOut && clearTimeout(this.timeOut);
		cc.director.loadScene('MainGame');
	},
	signOut: function () {
		clearInterval(this.timeInterval);
		cc.director.loadScene('MainGame', function () {
			cc.RedT.inGame.signOut();
		});
	},
	userData: function (data) {
		this.me_balans.string = helper.numberWithCommas(data.red);
	},

	xocxocOutgame: function (data) {
		if (!!data.playerId) {
			let positions = Object.values(this.Positions);
			let position = positions.find(function (t) { return t.data != null && t.data.id == data.playerId; });

			if (position) {
				this.Positions[position.id].data = null;
				this.players[position.id - 1].setInfo(null);
				let keys = Object.keys(this.otherPlayers);
				if (keys.length > 0) {
					let newPlayer = this.otherPlayers[keys[0]];
					this.addPlayer(newPlayer);
					delete this.otherPlayers[newPlayer.id];
				}
			} else {
				delete this.otherPlayers[data.playerId];
			}

			this.countClient()
		}
	},

	xocxoc: function (data) {
		if (!!data.ingame) {
			this.xocxocIngame(data.ingame);
		}
		if (!!data.outgame) {
			this.xocxocOutgame(data.outgame);
		}
		if (!!data.finish) {
			this.xocxocFinish(data.finish);
		}
		if (!!data.history) {
			this.history && this.history.onData(data.history);
		}
		if (!!data.top) {
			//top win
		}
		if (!!data.status) {
			//this.status(data.status);
			this.status = data.status;
		}
		if (!!data.chip) {
			this.clientsChip(data.chip);
		}
		if (!!data.mechip) {
			this.isWaitingBetResult = false;
			if (this.processingWarningPopup) {
				this.processingWarningPopup.close();
				this.processingWarningPopup = null;
			}
			this.meChip(data.mechip);
		}
		if (!!data.client) {
			this.updateClient(data.client);
		}
		if (!!data.me) {
			this.updateMe(data.me);
		}
		if (void 0 !== data.notice) {
			this.isWaitingBetResult = false;
			if (this.processingWarningPopup) {
				this.processingWarningPopup.close();
				this.processingWarningPopup = null;
			}
			this.addNotice(data.notice);
		}
		if (void 0 !== data.um) {
			this.showUMMessage();
		}
	},
	showUMMessage: function () {
		clearInterval(this.timeInterval);
		var noticePrefab = cc.instantiate(this.NoticePrefab);
		var notice = noticePrefab.getComponent("Notice");
		notice.init({ text: "Hệ thống đang bảo trì. Vui lòng quay lại sau...!!!", button: { text: "Ok" } });
		this.node.addChild(noticePrefab)
	},
	xocxocIngame: function (data) {
		if (!!data.chip) {
			//this.ingameChip(data.chip);
		}
		if (!!data.time) {
			this.time_remain = data.time;
			this.playTime();
		}
		if (!!data.data) {
			this.updateData(data.data);
		}
		if (!!data.logs) {
			this.logs = data.logs;
			this.setLogs();
			this.setGameRound();

			if (this.time_remain > 33 && data.logs.length) {
				this.nodeBat.position = cc.v2(0, 150);
				let dots = data.logs[0].dots;
				this.setDot([dots[0], dots[1], dots[2], dots[3]]);
				this.showKQ();
			}
		}
		if (!!data.me) {
			this.updateMe(data.me);
		}
		if (!!data.chats) {
		}
		if (!!data.player) {
			this.addPlayer(data.player);
		}
		if (!!data.players) {
			this.addPlayers(data.players);
		}

		this.countClient()
	},

	addPlayers: function (data) {
		let players = Object.values(data);

		let length = players.length < this.numberOfSlots ? players.length : this.numberOfSlots;
		for (let i = 0; i < length; i++) {
			let player = players[i];
			this.players[i].setInfo(player);
			this.Positions[i + 1].data = player;
			delete data[player.id];
		}

		if (players.length > this.numberOfSlots) {
			this.otherPlayers = data;
		}
	},

	addPlayer: function (player) {
		var playerSlot = this.getPlayerSlot(player.id);
		if (!playerSlot) {
			let emptySlots = this.getEmptySlots();

			if (emptySlots.length > 0) {
				var selectedPos = emptySlots[0];
				this.Positions[selectedPos.id].data = player;
				this.players[selectedPos.id - 1].setInfo(player);
			} else {
				this.otherPlayers[player.id] = player;
			}
		}
	},

	getEmptySlots: function () {
		let slots = Object.values(this.Positions);
		let emptySlots = slots.filter(function (t) { return t.data == null });

		return emptySlots;
	},

	ingameChip: function (data) {
		for (let [key, value] of Object.entries(data)) {
			let max = this.maxBox1_3;
			switch (data.box) {
				case 'chan':
					max = this.maxBox1_1;
					break;

				case 'le':
					max = this.maxBox1_1;
					break;
			}
			for (let [keyT, valueT] of Object.entries(value)) {
				if (valueT > 0) {
					while (valueT) {
						let x = (Math.random() * (max.x + 1)) >> 0;
						let y = (Math.random() * (max.y + 1)) >> 0;

						let newN = new cc.Node;
						newN = newN.addComponent(cc.Sprite);
						newN.spriteFrame = this['chip_' + keyT];
						newN.node.position = cc.v2(x, y);
						newN.node.scale = 0.3;
						this['box_' + key].children[1].addChild(newN.node);
						valueT--;
					}
				}
			}
		}
	},
	xocxocFinish: function (data) {
		this.winners = data.winClients;
		let dice = { dots: data.dots, round: data.round };
		this.logs.unshift(dice);
		this.logs.length > 48 && this.logs.pop();
		this.setDot(dice.dots);
		this.labelTime.node.active = false;
		this.time_remain = 44;
		this.playTime();

		if (!this.nan) {
			this.FinishTT();
		}
	},
	FinishTT: function () {
		if (cc.RedT.isSoundGame()) {
			this.audioMoBat.play();
		}

		this.nodeBat.runAction(
			cc.sequence(
				this.actionBatOpen,
				cc.callFunc(this.showKQ, this),
				cc.delayTime(1),
				cc.callFunc(this.showKQ2, this),
			)
		);
		this.setLogs();
		this.setGameRound();
	},
	showKQ: function () {
		let data = Object.values(this.logs[0].dots);
		let numb = 0;
		data.forEach(function (dot) {
			if (dot) {
				numb++;
			}
		});

		if (!(numb % 2)) {
			this.box_chan.children[0].active = true;
		} else {
			this.box_le.children[0].active = true;
		}

		switch (numb) {
			case 0:
				this.box_white4.children[0].active = true;
				break;

			case 1:
				this.box_white3.children[0].active = true;
				break;

			case 3:
				this.box_red3.children[0].active = true;
				break;

			case 4:
				this.box_red4.children[0].active = true;
				break;
		}
	},
	showKQ2: function () {
		let audioLost = 0;
		let audioWin = 0;
		let node1 = null;
		let node2 = null;
		let data = Object.values(this.logs[0].dots);
		let numb = 0;
		data.forEach(function (dot) {
			if (dot) {
				numb++;
			}
		});

		let position = this.box_chip.parent.convertToWorldSpaceAR(this.box_chip.position);
		let centerMid = null;

		if (!(numb % 2)) {
			node1 = this.box_chan.children[4];
			audioLost += this.box_le.children[4].children.length;
			centerMid = this.box_le.children[4].convertToNodeSpaceAR(position);
			Promise.all(this.box_le.children[4].children.map(function (chip) {
				chip.runAction(cc.moveTo(0.4, centerMid));
			})).catch(error => {
				logger.logError(error);
			});
		} else {
			node1 = this.box_le.children[4];
			audioLost += this.box_chan.children[4].children.length;
			centerMid = this.box_chan.children[4].convertToNodeSpaceAR(position);
			Promise.all(this.box_chan.children[4].children.map(function (chip) {
				chip.runAction(cc.moveTo(0.4, centerMid));
			})).catch(error => {
				logger.logError(error);
			});
		}

		let red3 = this.box_red3.children[4].convertToNodeSpaceAR(position);
		let red4 = this.box_red4.children[4].convertToNodeSpaceAR(position);
		let white3 = this.box_white3.children[4].convertToNodeSpaceAR(position);
		let white4 = this.box_white4.children[4].convertToNodeSpaceAR(position);

		switch (numb) {
			case 0:
				node2 = this.box_white4.children[4];
				audioLost += this.box_red3.children[4].children.length + this.box_red4.children[4].children.length + this.box_white3.children[4].children.length;
				Promise.all(this.box_red3.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, red3));
				})).catch(error => {
					logger.logError(error);
				});
				Promise.all(this.box_red4.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, red4));
				})).catch(error => {
					logger.logError(error);
				});
				Promise.all(this.box_white3.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, white3));
				})).catch(error => {
					logger.logError(error);
				});
				break;

			case 1:
				node2 = this.box_white3.children[4];
				audioLost += this.box_red3.children[4].children.length + this.box_red4.children[4].children.length + this.box_white4.children[4].children.length;
				Promise.all(this.box_red3.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, red3));
				})).catch(error => {
					logger.logError(error);
				});
				Promise.all(this.box_red4.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, red4));
				})).catch(error => {
					logger.logError(error);
				});
				Promise.all(this.box_white4.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, white4));
				})).catch(error => {
					logger.logError(error);
				});
				break;

			case 2:
				audioLost += this.box_red3.children[4].children.length + this.box_red4.children[4].children.length + this.box_white3.children[4].children.length + this.box_white4.children[4].children.length;
				Promise.all(this.box_red3.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, red3));
				})).catch(error => {
					logger.logError(error);
				});
				Promise.all(this.box_red4.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, red4));
				})).catch(error => {
					logger.logError(error);
				});
				Promise.all(this.box_white3.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, white3));
				})).catch(error => {
					logger.logError(error);
				});
				Promise.all(this.box_white4.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, white4));
				})).catch(error => {
					logger.logError(error);
				});
				break;

			case 3:
				node2 = this.box_red3.children[4];
				audioLost += this.box_white3.children[4].children.length + this.box_red4.children[4].children.length + this.box_white4.children[4].children.length;
				Promise.all(this.box_white3.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, white3));
				})).catch(error => {
					logger.logError(error);
				});
				Promise.all(this.box_red4.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, red4));
				})).catch(error => {
					logger.logError(error);
				});
				Promise.all(this.box_white4.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, white4));
				})).catch(error => {
					logger.logError(error);
				});
				break;

			case 4:
				node2 = this.box_red4.children[4];
				audioLost += this.box_white3.children[4].children.length + this.box_red3.children[4].children.length + this.box_white4.children[4].children.length;
				Promise.all(this.box_white3.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, white3));
				})).catch(error => {
					logger.logError(error);
				});;
				Promise.all(this.box_red3.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, red3));
				})).catch(error => {
					logger.logError(error);
				});;
				Promise.all(this.box_white4.children[4].children.map(function (chip) {
					chip.runAction(cc.moveTo(0.4, white4));
				})).catch(error => {
					logger.logError(error);
				});;
				break;
		}

		if (cc.RedT.isSoundGame()) {
			!!audioLost && this.audioMultiChip.play();
		}

		setTimeout(function () {
			let self = this;
			audioWin += node1.children.length;
			let node1red = node1.convertToNodeSpaceAR(position);
			node1.children.forEach(function (chip) {
				let copy = cc.instantiate(chip);
				copy.position = node1red;

				let x = (Math.random() * (self.maxBox1_1.x + 1)) >> 0;
				let y = (Math.random() * (self.maxBox1_1.y + 1)) >> 0;

				node1.addChild(copy);
				copy.runAction(cc.moveTo(0.4, cc.v2(x, y)));
			});

			if (node2) {
				audioWin += node2.children.length;
				let node2red = node2.convertToNodeSpaceAR(position);
				node2.children.forEach(function (chip) {
					let copy = cc.instantiate(chip);
					copy.position = node2red;

					let x = (Math.random() * (self.maxBox1_3.x + 1)) >> 0;
					let y = (Math.random() * (self.maxBox1_3.y + 1)) >> 0;

					node2.addChild(copy);
					copy.runAction(cc.moveTo(0.4, cc.v2(x, y)));
				});
			}
			if (!!audioWin && cc.RedT.isSoundGame()) {
				Promise.all([1, 2, 3, 4, 5].map(function (audio) {
					if (audio !== 1) {
						self['audioMultiChip' + audio].play();
					} else {
						self.audioMultiChip.play();
					}
				})).catch(error => {
					logger.logError(error);
				});;
			}
			setTimeout(function () {
				let mainIndex = 0;
				let subIndex = 0;
				let status = self.status;
				if (status) {
					if (status.win) {
						let userPositon = self.me_name.node.parent.convertToWorldSpaceAR(self.me_name.node.position);
						if (status.boxs.main) {
							let random = Math.floor(Math.random() * 3) + 1;
							let position = node1.convertToNodeSpaceAR(userPositon);
							for (let i = 0; i < random; i++) {
								let child = node1.children[mainIndex + i];
								child && child.runAction(cc.spawn(cc.fadeTo(1, 0), cc.moveTo(0.4, position)));
							}
							mainIndex += random;
						}

						if (node2 && status.boxs.sub) {
							let random = Math.floor(Math.random() * 3) + 1;
							let position = node2.convertToNodeSpaceAR(userPositon);
							for (let i = 0; i < random; i++) {
								let child = node2.children[subIndex + i];
								child && child.runAction(cc.spawn(cc.fadeTo(1, 0), cc.moveTo(0.4, position)));
							}
							subIndex += random;
						}

						let winnerPrefab = cc.instantiate(self.winnerPrefab);
						self.me.addChild(winnerPrefab);
						let animation = winnerPrefab.getComponent(cc.Animation);
						winnerPrefab.runAction(
							cc.sequence(
								cc.callFunc(function () { animation.play(); }),
								cc.delayTime(self.time_remain - 33),
								cc.callFunc(function () { this.destroy() }, winnerPrefab)
							)
						);

						cc.RedT.send({ user: { updateCoint: true } });
					}

					if (status.bet && status.win) {
						var temp = self.createWinResultNode(status.bet, status.win);
						temp.node.position = cc.v2(0, 90);
						this.miniNotice.addChild(temp.node);
						temp.node.runAction(
							cc.sequence(
								cc.moveTo(4, cc.v2(0, 200)),
								cc.callFunc(function () { this.node.destroy() }, temp)
							)
						);
					}
					self.status = {};
				}

				let winnerIds = Object.keys(self.winners);
				winnerIds.forEach(function (id) {
					let winnerData = self.winners[id];
					let slot = self.getPlayerSlot(id);
					if (slot) {
						let slotIndex = slot.id - 1;
						let player = self.players[slotIndex];
						let slotPosition = player.node.parent.convertToWorldSpaceAR(player.node.position);

						if (winnerData.boxs.main) {
							let random = Math.floor(Math.random() * 3) + 1;
							let position = node1.convertToNodeSpaceAR(slotPosition);
							for (let i = 0; i < random; i++) {
								let child = node1.children[mainIndex + i];
								child && child.runAction(cc.spawn(cc.fadeTo(1, 0), cc.moveTo(0.4, position)));
							}
							mainIndex += random;
						}

						if (node2 && winnerData.boxs.sub) {
							let random = Math.floor(Math.random() * 3) + 1;
							let position = node2.convertToNodeSpaceAR(slotPosition);
							for (let i = 0; i < random; i++) {
								let child = node2.children[subIndex + i];
								child && child.runAction(cc.spawn(cc.fadeTo(1, 0), cc.moveTo(0.4, position)));
							}
							subIndex += random;
						}

						let resultLabel = self.createWinResultNode(winnerData.bet)
						player.node.addChild(resultLabel.node);
						resultLabel.node.position = cc.v2(0, 0);
						resultLabel.node.runAction(cc.sequence(cc.moveTo(4, cc.v2(0, 20)), cc.callFunc(function () { this.node.destroy() }, resultLabel)));

						slot.data.red = parseFloat(slot.data.red) + winnerData.bet;
						player.setInfo(slot.data);

						let winnerPrefab = cc.instantiate(self.winnerPrefab);
						player.node.addChild(winnerPrefab);
						let animation = winnerPrefab.getComponent(cc.Animation);
						winnerPrefab.runAction(
							cc.sequence(
								cc.callFunc(function () { animation.play(); }),
								cc.delayTime(self.time_remain - 33),
								cc.callFunc(function () { this.destroy() }, winnerPrefab)
							)
						);
					}
					else if (self.otherPlayers[id]) {
						let red = parseFloat(self.otherPlayers[id].red);
						self.otherPlayers[id].red = red ? (red + winnerData.bet) : winnerData.bet;
					}
				});

				let otherUsersPosition = self.users_bg.parent.convertToWorldSpaceAR(this.users_bg.position);
				let position1_1 = node1.convertToNodeSpaceAR(otherUsersPosition);
				for (let i = mainIndex; i < node1.children.length; i++) {
					let child = node1.children[i];
					child && child.runAction(cc.spawn(cc.fadeTo(1, 0), cc.moveTo(0.4, position1_1)));
				}

				if (node2) {
					let position1_3 = node2.convertToNodeSpaceAR(otherUsersPosition);
					for (let i = subIndex; i < node2.children.length; i++) {
						node2.children[i].runAction(cc.spawn(cc.fadeTo(1, 0), cc.moveTo(0.4, position1_3)));
					}
				}
			}.bind(this), 3000);
		}.bind(this), 1500);
	},

	createWinResultNode: function (winResult, isWin = true) {
		var temp = new cc.Node;
		temp.addComponent(cc.Label);
		temp = temp.getComponent(cc.Label);
		temp.string = (isWin ? '+' : '-') + helper.numberWithCommas(winResult);
		temp.font = isWin ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;;
		temp.lineHeight = 130;
		temp.fontSize = 25;

		return temp;
	},

	setDot: function (data) {
		let self = this;
		let Dot_x = (Math.random() * (this.maxDot.x + 1)) >> 0;
		let Dot_y = (Math.random() * (this.maxDot.y + 1)) >> 0;
		let DotCheck = Dot_y - Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y - Dot_y / 1.4;
		}
		this.dot[0].node.position = cc.v2(Dot_x, Dot_y);

		Dot_x = (Math.random() * (this.maxDot.x + 1)) >> 0;
		Dot_y = (Math.random() * (this.maxDot.y + 1)) >> 0;
		DotCheck = Dot_y - Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y - Dot_y / 1.4;
		}
		this.dot[1].node.position = cc.v2(Dot_x, Dot_y);

		Dot_x = (Math.random() * (this.maxDot.x + 1)) >> 0;
		Dot_y = (Math.random() * (this.maxDot.y + 1)) >> 0;
		DotCheck = Dot_y - Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y - Dot_y / 1.4;
		}
		this.dot[2].node.position = cc.v2(Dot_x, Dot_y);

		Dot_x = (Math.random() * (this.maxDot.x + 1)) >> 0;
		Dot_y = (Math.random() * (this.maxDot.y + 1)) >> 0;
		DotCheck = Dot_y - Dot_x;
		if (DotCheck > 22) {
			Dot_y = Dot_y - Dot_y / 1.4;
		}
		this.dot[3].node.position = cc.v2(Dot_x, Dot_y);

		this.dot.forEach(function (dot, index) {
			let check = data[index];
			if (check) {
				dot.spriteFrame = self.dot_red_large;
			} else {
				dot.spriteFrame = self.dot_white_large;
			}
		});
	},
	playTime: function () {
		void 0 !== this.timeInterval && clearInterval(this.timeInterval);
		this.timeInterval = setInterval(function () {
			if (this.time_remain > 33) {
				var time = helper.numberPad(this.time_remain - 34, 2);
				this.timeWait.string = time;
				this.labelTime.node.active = false;
				this.nodeWait.active = true;
			} else if (this.time_remain > 31) {
				this.nodeWait.active = false;
				this.time_remain === 33 && this.nodeBat.runAction(this.actionBatClose);
			} else {
				if (this.time_remain > 0) {
					var time = helper.numberPad(this.time_remain - 1, 2);
					this.labelTime.node.active = true;
					this.nodeWait.active = false;
					this.labelTime.string = time;

					if (time <= 5) {
						this.labelTime.node.color = cc.Color.RED;
					} else {
						this.labelTime.node.color = cc.Color.WHITE
					}
				} else clearInterval(this.timeInterval);
			}
			this.time_remain--;
		}.bind(this), 1000);
	},
	countClient: function () {
		this.users_count.string = Object.keys(this.otherPlayers).length;
	},
	updateData: function (data) {
		if (this.red) {
			this.total_chan.string = data.red.chan > 0 ? helper.numberWithCommas(data.red.chan) : '';
			this.total_le.string = data.red.le > 0 ? helper.numberWithCommas(data.red.le) : '';
			this.total_red3.string = data.red.red3 > 0 ? helper.numberWithCommas(data.red.red3) : '';
			this.total_red4.string = data.red.red4 > 0 ? helper.numberWithCommas(data.red.red4) : '';
			this.total_white3.string = data.red.white3 > 0 ? helper.numberWithCommas(data.red.white3) : '';
			this.total_white4.string = data.red.white4 > 0 ? helper.numberWithCommas(data.red.white4) : '';
		}
	},
	resetData: function () {
		this.box_chan.children[4].removeAllChildren();
		this.box_le.children[4].removeAllChildren();
		this.box_white4.children[4].removeAllChildren();
		this.box_white3.children[4].removeAllChildren();
		this.box_red3.children[4].removeAllChildren();
		this.box_red4.children[4].removeAllChildren();

		this.box_chan.children[0].active = false;
		this.box_le.children[0].active = false;
		this.box_white4.children[0].active = false;
		this.box_white3.children[0].active = false;
		this.box_red3.children[0].active = false;
		this.box_red4.children[0].active = false;

		this.total_chan.string = '';
		this.total_le.string = '';
		this.total_red3.string = '';
		this.total_red4.string = '';
		this.total_white3.string = '';
		this.total_white4.string = '';

		this.me_chan.string = '';
		this.me_le.string = '';
		this.me_red3.string = '';
		this.me_red4.string = '';
		this.me_white3.string = '';
		this.me_white4.string = '';

		this.users.red.chan = 0;
		this.users.red.le = 0;
		this.users.red.red3 = 0;
		this.users.red.red4 = 0;
		this.users.red.white3 = 0;
		this.users.red.white4 = 0;

		this.clients.red.chan = 0;
		this.clients.red.le = 0;
		this.clients.red.red3 = 0;
		this.clients.red.red4 = 0;
		this.clients.red.white3 = 0;
		this.clients.red.white4 = 0;
	},
	setLogs: function () {
		let self = this;
		this.logMain.forEach(function (obj, index) {
			let data = self.logs[index].dots;
			if (data) {
				obj.node.active = true;
				data = Object.values(data);
				let gameChan = 0;     // Là chẵn
				data.forEach(function (kqH) {
					if (kqH) {
						gameChan++;
					}
				});
				if (!(gameChan % 2)) {
					obj.spriteFrame = self.dot_white;
				} else {
					obj.spriteFrame = self.dot_red;
				}
			} else {
				obj.node.active = false;
			}
		});

		let tmp_DS = -1;
		let tmp_arrA = [];
		let tmp_arrB = [];
		let c_chan = 0;
		let c_le = 0;

		let newArr = self.logs.slice();
		newArr.reverse();
		newArr.forEach(function (newDS) {
			let data = Object.values(newDS.dots);
			let gameChan = 0;
			data.forEach(function (kqH) {
				if (kqH) {
					gameChan++;
				}
			});

			let type = !(gameChan % 2);
			if (tmp_DS === -1) {
				tmp_DS = type;
			}
			if (type !== tmp_DS || tmp_arrB.length > 3) {
				tmp_DS = type;
				//tmp_arrB.reverse();
				tmp_arrA.push(tmp_arrB);
				tmp_arrB = [];
			}
			if (type === tmp_DS) {
				tmp_arrB.push(gameChan)
			}
		});

		//tmp_arrB.reverse();
		tmp_arrA.push(tmp_arrB);
		tmp_arrA.reverse();
		tmp_arrA = tmp_arrA.slice(0, 12);

		this.log_top.forEach(function (obj, index) {
			let data = tmp_arrA[index];
			if (data) {
				obj.cell.active = true;

				obj.data.forEach(function (cell, j) {
					let jD = data[j];
					if (void 0 !== jD) {
						cell.c.node.parent.active = true;
						if (!(jD % 2)) {
							cell.c.spriteFrame = self.dot_white;
							cell.t.node.color = cc.Color.BLACK;
						} else {
							cell.c.spriteFrame = self.dot_red;
							cell.t.node.color = cc.Color.WHITE;
						}
						cell.t.string = jD === 0 ? 4 : jD;

						if (!(jD % 2)) {
							c_chan++;
						} else {
							c_le++;
						}
					} else {
						cell.c.node.parent.active = false;
					}
				});
			} else {
				obj.cell.active = false;
			}
		});

		this.log_chan.string = c_chan;
		this.log_le.string = c_le;
	},
	changerBet: function (event, bet) {
		let target = event.target;
		this.cuoc = target.name;
		this.bet.children.forEach(function (obj) {
			if (obj == target) {
				obj.children[1].active = true;
				obj.zIndex = 2;
				cc.tween(obj)
					.to(0.2, {
						scale: 1.15,
						position: cc.v2(obj.position.x, 12)
					})
					.start();
				obj.pauseSystemEvents();
			} else {
				obj.children[1].active = false;
				obj.zIndex = 1;
				cc.tween(obj)
					.to(0.2, {
						scale: 1,
						position: cc.v2(obj.position.x, 0)
					})
					.start();
				obj.resumeSystemEvents();
			}
		})
	},
	changerCoint: function () {
		this.red = !this.red;
		this.nodeRed.active = !this.nodeRed.active;
		this.nodeXu.active = !this.nodeXu.active;
		this.updateMeCoint();
	},
	onCuoc: function (event, box) {
		if (this.isWaitingBetResult) {
			if (!this.processingWarningPopup) {
				var processingWarning = cc.instantiate(this.ProcessingWarning);
				this.processingWarningPopup = processingWarning.getComponent("ProcessingWarning");
				this.miniNotice.addChild(processingWarning);
			}
		} else {
			this.isWaitingBetResult = true;
			cc.RedT.send({ g: { xocxoc: { cuoc: { red: this.red, cuoc: this.cuoc, box: box } } } });
		}

	},
	addNotice: function (text) {
		var notice = cc.instantiate(this.prefabNotice)
		var noticeComponent = notice.getComponent('mini_warning')
		noticeComponent.text.string = text;
		this.miniNotice.addChild(notice);
	},
	createChipNode: function (position, bet) {
		let newN = new cc.Node;
		newN = newN.addComponent(cc.Sprite);
		newN.spriteFrame = this['chip_' + bet];
		newN.node.position = position;
		return newN;
	},
	clientsChip: function (data) {
		let nodeBox = null;
		let max = this.maxBox1_3;

		switch (data.box) {
			case 'chan':
				nodeBox = this.box_chan;
				max = this.maxBox1_1;
				break;

			case 'le':
				nodeBox = this.box_le;
				max = this.maxBox1_1;
				break;

			case 'red3':
				nodeBox = this.box_red3;
				break;

			case 'red4':
				nodeBox = this.box_red4;
				break;

			case 'white3':
				nodeBox = this.box_white3;
				break;

			case 'white4':
				nodeBox = this.box_white4;
				break;
		}

		let playerSlot = this.getPlayerSlot(data.playerId);
		let position = null;
		if (playerSlot) {
			playerSlot.data.red = data.red;
			let slotIndex = playerSlot.id - 1;
			position = this.players[slotIndex].node.convertToWorldSpaceAR(this.players[slotIndex].node.children[0].position);
			this.players[slotIndex].setInfo(playerSlot.data);
		} else {
			position = this.users_bg.parent.convertToWorldSpaceAR(this.users_bg.position);

			if (this.otherPlayers[data.playerId]) {
				this.otherPlayers[data.playerId].red = data.red;
			}
		}

		position = nodeBox.children[4].convertToNodeSpaceAR(position);

		let newN = this.createChipNode(position, data.cuoc);

		let x = (Math.random() * (max.x + 1)) >> 0;
		let y = (Math.random() * (max.y + 1)) >> 0;

		nodeBox.children[4].addChild(newN.node);

		let copy = cc.instantiate(this.audioSingleChip.node);
		newN.node.addChild(copy);
		copy = copy.getComponent(cc.AudioSource);

		newN.node.runAction(
			cc.sequence(
				cc.moveTo(0.4, cc.v2(x, y)).easing(cc.easeOut(3)),
				cc.callFunc(function () { cc.RedT.isSoundGame() && this.play() }, copy)
			));
	},
	meChip: function (data) {
		let nodeBet = null;
		let nodeBox = null;
		let max = this.maxBox1_3;

		this.bet.children.forEach(function (bet) {
			if (bet.name == data.cuoc) {
				nodeBet = bet;
			}
		});

		switch (data.box) {
			case 'chan':
				nodeBox = this.box_chan;
				max = this.maxBox1_1;
				break;

			case 'le':
				nodeBox = this.box_le;
				max = this.maxBox1_1;
				break;

			case 'red3':
				nodeBox = this.box_red3;
				break;

			case 'red4':
				nodeBox = this.box_red4;
				break;

			case 'white3':
				nodeBox = this.box_white3;
				break;

			case 'white4':
				nodeBox = this.box_white4;
				break;
		}

		let position = nodeBet.parent.convertToWorldSpaceAR(nodeBet.position);
		position = nodeBox.children[4].convertToNodeSpaceAR(position);

		let newN = this.createChipNode(position, data.cuoc);

		let x = (Math.random() * (max.x + 1)) >> 0;
		let y = (Math.random() * (max.y + 1)) >> 0;

		// this.audioSingleChip.node
		nodeBox.children[4].addChild(newN.node);

		let copy = cc.instantiate(this.audioSingleChip.node);
		newN.node.addChild(copy);
		copy = copy.getComponent(cc.AudioSource);
		newN.node.runAction(
			cc.sequence(
				cc.moveTo(0.3, cc.v2(x, y)).easing(cc.easeOut(3)),
				cc.callFunc(function () { cc.RedT.isSoundGame() && this.play() }, copy),
				cc.sequence(
					cc.moveTo(0.1, cc.v2(x, y + 6)),
					cc.moveTo(0.1, cc.v2(x, y))
				)
			));

		var temp = this.createWinResultNode(data.cuoc, false);
		temp.node.position = cc.v2(0, 90);
		this.miniNotice.addChild(temp.node);
		temp.node.runAction(
			cc.sequence(
				cc.moveTo(4, cc.v2(0, 200)),
				cc.callFunc(function () { this.node.destroy() }, temp)
			)
		);
	},
	updateMe: function (data) {
		if (data.red) {
			this.updateMeRed(data.red);
		}
	},
	updateMeRed: function (data) {
		if (data.chan > 0) {
			this.users.red.chan = data.chan;
			this.red && (this.me_chan.string = helper.numberWithCommas(data.chan));
		}
		if (data.le > 0) {
			this.users.red.le = data.le;
			this.red && (this.me_le.string = helper.numberWithCommas(data.le));
		}
		if (data.red3 > 0) {
			this.users.red.red3 = data.red3;
			this.red && (this.me_red3.string = helper.numberWithCommas(data.red3));
		}
		if (data.red4 > 0) {
			this.users.red.red4 = data.red4;
			this.red && (this.me_red4.string = helper.numberWithCommas(data.red4));
		}
		if (data.white3 > 0) {
			this.users.red.white3 = data.white3;
			this.red && (this.me_white3.string = helper.numberWithCommas(data.white3));
		}
		if (data.white4 > 0) {
			this.users.red.white4 = data.white4;
			this.red && (this.me_white4.string = helper.numberWithCommas(data.white4));
		}
	},

	updateClient: function (data) {
		if (data.red) {
			this.updateClientRed(data.red);
		}
	},

	updateClientRed: function (data) {
		if (data.chan > 0) {
			this.clients.red.chan = data.chan;
			this.red && (this.total_chan.string = helper.numberWithCommas(data.chan));
		}
		if (data.le > 0) {
			this.clients.red.le = data.le;
			this.red && (this.total_le.string = helper.numberWithCommas(data.le));
		}
		if (data.red3 > 0) {
			this.clients.red.red3 = data.red3;
			this.red && (this.total_red3.string = helper.numberWithCommas(data.red3));
		}
		if (data.red4 > 0) {
			this.clients.red.red4 = data.red4;
			this.red && (this.total_red4.string = helper.numberWithCommas(data.red4));
		}
		if (data.white3 > 0) {
			this.clients.red.white3 = data.white3;
			this.red && (this.total_white3.string = helper.numberWithCommas(data.white3));
		}
		if (data.white4 > 0) {
			this.clients.red.white4 = data.white4;
			this.red && (this.total_white4.string = helper.numberWithCommas(data.white4));
		}
	},

	updateMeCoint: function () {
		this.me_chan.string = this.users.red.chan > 0 ? helper.numberWithCommas(this.users.red.chan) : '';
		this.me_le.string = this.users.red.le > 0 ? helper.numberWithCommas(this.users.red.le) : '';
		this.me_red3.string = this.users.red.red3 > 0 ? helper.numberWithCommas(this.users.red.red3) : '';
		this.me_red4.string = this.users.red.red4 > 0 ? helper.numberWithCommas(this.users.red.red4) : '';
		this.me_white3.string = this.users.red.white3 > 0 ? helper.numberWithCommas(this.users.red.white3) : '';
		this.me_white4.string = this.users.red.white4 > 0 ? helper.numberWithCommas(this.users.red.white4) : '';

		this.total_chan.string = this.clients.red.chan > 0 ? helper.numberWithCommas(this.clients.red.chan) : '';
		this.total_le.string = this.clients.red.le > 0 ? helper.numberWithCommas(this.clients.red.le) : '';
		this.total_red3.string = this.clients.red.red3 > 0 ? helper.numberWithCommas(this.clients.red.red3) : '';
		this.total_red4.string = this.clients.red.red4 > 0 ? helper.numberWithCommas(this.clients.red.red4) : '';
		this.total_white3.string = this.clients.red.white3 > 0 ? helper.numberWithCommas(this.clients.red.white3) : '';
		this.total_white4.string = this.clients.red.white4 > 0 ? helper.numberWithCommas(this.clients.red.white4) : '';
	},
	status: function (data) {
		setTimeout(function () {
			var temp = new cc.Node;
			temp.addComponent(cc.Label);
			temp = temp.getComponent(cc.Label);
			temp.string = (data.win ? '+' : '-') + helper.numberWithCommas(data.bet);
			temp.font = data.win ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;
			temp.lineHeight = 130;
			temp.fontSize = 25;
			temp.node.position = cc.v2(0, 90);
			this.miniNotice.addChild(temp.node);
			temp.node.runAction(cc.sequence(cc.moveTo(4, cc.v2(0, 200)), cc.callFunc(function () { this.node.destroy() }, temp)));
			data.win && cc.RedT.send({ user: { updateCoint: true } });
			if (void 0 !== data.thuong && data.thuong > 0) {
				var thuong = new cc.Node;
				thuong.addComponent(cc.Label);
				thuong = thuong.getComponent(cc.Label);
				thuong.string = '+' + helper.numberWithCommas(data.thuong);
				thuong.font = cc.RedT.util.fontEffect;
				thuong.lineHeight = 90;
				thuong.fontSize = 14;
				this.miniNotice.addChild(thuong.node);
				thuong.node.runAction(cc.sequence(cc.moveTo(4, cc.v2(0, 100)), cc.callFunc(function () { this.node.destroy() }, thuong)))
			}
		}.bind(this), 4e3)
	},

	getPlayerSlot: function (playerId) {
		let slots = Object.values(this.Positions);
		return slots.find(function (t) { return t.data && t.data.id == playerId; });
	},

	openGuide: function () {
		let dialog = cc.instantiate(this.prefabGuide);
		this.center.addChild(dialog);
	},

	openHistory: function () {
		let dialog = cc.instantiate(this.prefabHistory);
		this.center.addChild(dialog);
		this.history = dialog.getComponent("XocXoc_history");
		this.history.init(this);
	},

	setGameRound: function () {
		let round = this.logs[0].round + 1
		this.gameRound.string = "#" + round;
	},
});
