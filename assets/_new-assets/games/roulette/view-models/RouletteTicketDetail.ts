import * as _ from "lodash";
import RouletteTicketDetailIGroup from "./RouletteTicketDetailIGroup";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteTicketDetail extends cc.Component {

    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Label)
    resultLabel: cc.Label = null;

    @property(cc.Node)
    content: cc.Node

    @property(cc.Prefab)
    groupPrefab: cc.Prefab

    roundID: number = 2000;
    result: number = 20;
    betLogDetails = null;

    betLogs = {
        "phien": 55,
        "time": "2020-08-04T03:20:15.726Z",
        "result": 29,
        "betLogDetails": [
            {
                "time": "2020-08-04T03:20:17.341Z",
                "street": {
                    "1-2-3": 5,
                    "13-14-15": 15
                },
                "corner": {
                    "2-3-5-6": 5
                },
                "fourNumbers": {
                    "0-1-2-3": 50
                },
                "line": { "7-8-9-10-11-12": 15 },
                "column": {
                    "first": 16,
                    "third": 75
                },
                "dozen": {
                    "first": 5
                },
                "redBlack": {
                    "red": 60,
                    "black": 100
                },
                "oddEven": {
                    "odd": 5,
                    "even": 15
                },
                "bigSmall": {
                    "big": 22,
                    "small": 70
                }
            },
            {
                "time": "2020-08-04T03:20:15.718Z",
                "street": {
                    "1-2-3": 5,
                    "13-14-15": 15
                },
                "corner": {
                    "2-3-5-6": 5
                },
                "fourNumbers": {
                    "0-1-2-3": 50
                },
                "line": {
                    "7-8-9-10-11-12": 15
                },
                "column": {
                    "first": 16,
                    "third": 75
                },
                "dozen": {
                    "first": 5
                },
                "redBlack": {
                    "red": 60,
                    "black": 100
                },
                "oddEven": {
                    "odd": 5,
                    "even": 15
                },
                "bigSmall": {
                    "big": 22,
                    "small": 70
                }
            }
        ]
    }

    onLoad() {
        this.roundLabel.string = this.betLogs.phien.toString();
        this.resultLabel.string = this.betLogs.result.toString();
        this.betLogDetails = this.betLogs.betLogDetails;
        this.content.children.forEach(child => child.destroy());

        this.getLogsDetail();
    }

    getLogsDetail() {
        this.betLogDetails.forEach((log, index) => {
            let group = cc.instantiate(this.groupPrefab);
            let groupComponent = group.getComponent(RouletteTicketDetailIGroup);
            let time = this.getTimeFromString(this.betLogDetails[index].time);
            groupComponent.timeLabel.string = time.toString();
            this.content.addChild(group);
            groupComponent.createBetLogItem();
        })
    }

    getTimeFromString(time: string) {
        const timeString = _.split(time, 'T')[1];
        return _.split(timeString, '.')[0];
    }
}
