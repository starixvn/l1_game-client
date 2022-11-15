const fse = require("fs-extra");
const decodeUuid = require("./decode-uuid");
function duplicateUuidCheck() {
    const assetsDirPath = "../build/web-mobile/assets";
    const versions = fse.readJsonSync(`${assetsDirPath}/versions.json`);
    ["main", "resources", "internal"].forEach((key) => delete versions[key]);

    const bundleList = Object.keys(versions).map((key) => key);
    const uuidInfo = {};

    const realEntries = {};
    bundleList.forEach((bundleId) => {
        const config = fse.readJsonSync(`${assetsDirPath}/${bundleId}/config.${versions[bundleId]}.json`);
        const { paths } = config;
        for (let id in paths) {
            let entry = paths[id];
            realEntries[config.uuids[id]] = entry;
        }

        const redirect = config.redirect;
        const uuids = [];
        const redirectUuids = [];
        uuidInfo[bundleId] = uuids;

        for (var i = 0, l = redirect.length; i < l; i += 2) {
            const index = redirect[i];
            redirectUuids.push(config.uuids[index]);
        }

        config.uuids.forEach((id) => {
            if (!redirectUuids.includes(id)) {
                uuids.push(id);
            }
        });
    });

    const duplicatedUuidList = [];
    bundleList.forEach((bundleId) => {
        const uuids = uuidInfo[bundleId];
        uuids.forEach((uuid) => {
            bundleList.forEach((othersBundleId) => {
                if (othersBundleId !== bundleId) {
                    if (!duplicatedUuidList.includes(uuid) && uuidInfo[othersBundleId].includes(uuid)) {
                        duplicatedUuidList.push(uuid);
                    }
                }
            });
        });
    });

    if (duplicatedUuidList.length > 0) {
        console.log("Duplicated UUID list: ");
        duplicatedUuidList.forEach((id) => {
            const decompressedUuid = decodeUuid(id);
            console.log(`${decompressedUuid}  --- ${id} --- ${realEntries[id]}`);
        });
        process.exit(1);
    }
}

duplicateUuidCheck();
