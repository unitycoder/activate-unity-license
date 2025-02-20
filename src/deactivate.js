const licensingClient = require('./licensing-client');
const core = require('@actions/core');

async function Deactivate() {
    try {
        const license = core.getState('license');
        if (!license) {
            throw Error(`Failed to get post license state!`);
        }
        core.debug(`post state: ${license}`);
        if (license.startsWith('f')) {
            return;
        }
        core.startGroup(`Unity License Deactivation...`);
        try {
            const activeLicenses = await licensingClient.ShowEntitlements();
            if (license !== undefined &&
                !activeLicenses.includes(license.toLowerCase())) {
                core.warning(`${license} was never activated.`);
            }
            await licensingClient.ReturnLicense(license);
        }
        finally {
            core.endGroup();
        }
        core.info(`Unity ${license} License successfully returned.`);
    } catch (error) {
        core.setFailed(`Failed to deactivate license!\n${error}`);
        process.exit(1);
    }
};

module.exports = { Deactivate }
