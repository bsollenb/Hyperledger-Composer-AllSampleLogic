/**
 * Trade a marble to a new player
 * @param  {org.hyperledger_composer.marbles.TradeMarble} tradeMarble - the trade marble transaction
 * @transaction
 */
async function tradeMarble(tradeMarble) {   // eslint-disable-line no-unused-vars
    tradeMarble.marble.owner = tradeMarble.newOwner;
    const assetRegistry = await getAssetRegistry('org.hyperledger_composer.marbles.Marble');
    await assetRegistry.update(tradeMarble.marble);
}