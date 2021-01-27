const numberWithCommas = (number: number, toFixed = 2) => {
    if (number) {
        var result = number.toFixed(toFixed).toString().split(".");
        result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return +result[1] !== 0 ? result.join(".") : result[0];
    }

    return "0";
};

const getOnlyNumberInString = (t: string) => {
    var e = t.match(/\d+/g);

    return e ? e.join("") : "";
};

const numberPad = (number: number, length: number) => {
    let str = `${number}`;

    while (str.length < length) {
        str = `0${str}`;
    }

    return str;
};

const numberTo = (obj, start, end, duration, currency = false) => {
    clearInterval(obj.timer);
    var range = end - (parseInt(obj.string.replace(/,/g, "")) || 0);
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
};

const zeroPad = (num: number, places: number) => {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
};

export { numberWithCommas, getOnlyNumberInString, numberPad, numberTo, zeroPad };
