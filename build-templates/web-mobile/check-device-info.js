function isNotchDevice() {
    const notchDeviceList = {
        "iPhone 13": "390x844",
        "iPhone 13 mini": "375x812",
        "iPhone 13 Pro Max": "428x926",
        "iPhone 13 Pro": "390x844",
        "iPhone 12": "390x844",
        "iPhone 12 mini": "375x812",
        "iPhone 12 Pro Max": "428x926",
        "iPhone 12 Pro": "390x844",
        "iPhone 11 Pro Max": "414x896",
        "iPhone 11 Pro": "375x812",
        "iPhone 11": "414x896",
        "iPhone XR": "414x896",
        "iPhone XS Max": "414x896",
        "iPhone XS": "375x812",
        "iPhone X": "375x812"
    };

    return Object.values(notchDeviceList).includes(`${screen.width}x${screen.height}`);
}
