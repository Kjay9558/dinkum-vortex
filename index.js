
// Nexus Mods domain for the game. e.g. nexusmods.com/bloodstainedritualofthenight
const GAME_ID = 'dinkum';

//Steam Application ID, you can get this from https://steamdb.info/apps/
const STEAMAPP_ID = '1062520';

//Import some assets from Vortex we'll need.
const path = require('path');
const { fs, log, util } = require('vortex-api');

function main(context) {
    //This is the main function Vortex will run when detecting the game extension.
    // Inform Vortex that your game extension requires the BepInEx extension.
    context.requireExtension('modtype-bepinex');
}

function findGame() {
    return util.GameStoreHelper.findByAppId([STEAMAPP_ID])
        .then(game => game.gamePath);
}

function prepareForModding(discovery) {
    return fs.ensureDirAsync(path.join(discovery.path, 'BepInEx'));

}

function modsPath(gamePath) {
    return path.join(gamePath, 'BepInEx', 'plugins')
}

function main(context) {
    context.registerGame({
        id: GAME_ID,
        name: 'Dinkum',
        mergeMods: true,
        queryPath: findGame,
        supportedTools: [],
        queryModPath: modsPath,
        logo: 'dinkum.jpg',
        setup: prepareForModding,
        executable: () => 'Dinkum.exe',
        setup: undefined,
        requiredFiles: [
            'Dinkum.exe',
        ],
        environment: {
            SteamAPPId: STEAMAPP_ID,
        },
        details: {
            steamAppId: STEAMAPP_ID,
        },
    });

    context.once(() => {
        // The context.once higher-Order function ensures that we only call items
        //  within this code block ONCE which makes it a perfect block to initialize
        //  functionality; which is why we've added the BepInEx registration function
        //  here - but theoretically you could do this during the game extension's
        //  setup functor too.
        if (context.api.ext.bepinexAddGame !== undefined) {
            context.api.ext.bepinexAddGame({
                gameId: GAME_ID,
                
                // The doorstopper will be deployed as "winhttp.dll" and will ignore the
                //  DOORSTOP_DISABLE environment variable
                doorstopConfig: {
                    doorstopType: 'default',
                    ignoreDisableSwitch: true,
                    }
            })
        }
    });

    // You need to include the testSupportedContent and installContent functions for this not to error.
    // context.registerInstaller('shewillpunishthem-mod', 25, testSupportedContent, installContent);

    return true
}

module.exports = {
    default: main
};