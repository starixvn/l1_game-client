const moment = require("moment");

export function numberWithCommas(number, toFixed = 2) {
    if (number) {
        var result = parseFloat(number).toFixed(toFixed).toString().split(".");
        result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return +result[1] !== 0 ? result.join(".") : result[0];
    }

    return "0";
}

export function getOnlyNumberInString(t) {
    var e = t.match(/\d+/g);
    return e ? e.join("") : "";
}

export function numberPad(number, length) {
    let str = `${number}`;
    while (str.length < length) {
        str = `0${str}`;
    }
    return str;
}

export function numberTo(obj, start, end, duration, currency = false) {
    clearInterval(obj.timer);
    var range = end - (parseInt(obj.string.replace(",", "")) || 0);
    var minTimer = 50;
    var stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    var startTime = new Date().getTime();
    var endTime = startTime + duration;

    obj.timer = setInterval(function () {
        if (!!obj.node) {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);
            var value = (end - remaining * range) >> 0;
            obj.string = currency ? numberWithCommas(value) : value;
            if (value === end) {
                clearInterval(obj.timer);
            }
        } else {
            clearInterval(obj.timer);
        }
    }, stepTime);
}

export function getStringDateByTime(t) {
    return moment(new Date(t)).format("HH:mm DD/MM/YYYY");
}

export function formatDateTime(t) {
    return moment(new Date(t)).format("HH:mm:ss DD/MM/YYYY");
}

export function getStringHourByTime(t) {
    return moment(new Date(t)).format("HH:mm:ss");
}

export function shortenName(name) {
    name = name.toLowerCase();
    var prefix = name.slice(0, 1);
    var suffix = name.slice(-3);
    return `${prefix}***${suffix}`;
}

export function getLowercaseObjectKeys(data) {
    return Object.keys(data).reduce((keys, key) => {
        keys[key.toLowerCase()] = key;
        return keys;
    }, {});
}

export function getNameCard(index) {
    const list = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    return list[index];
}

export function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

module.exports = {
    getNameCard: getNameCard,
    shortenName: shortenName,
    numberWithCommas: numberWithCommas,
    getOnlyNumberInString: getOnlyNumberInString,
    numberPad: numberPad,
    numberTo: numberTo,
    getStringDateByTime: getStringDateByTime,
    getStringHourByTime: getStringHourByTime,
    formatDateTime: formatDateTime,
    getLowercaseObjectKeys: getLowercaseObjectKeys,
    zeroPad: zeroPad
};
