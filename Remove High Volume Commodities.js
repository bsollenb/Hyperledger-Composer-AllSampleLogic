/**
 * Remove all high volume commodities
 * @param {org.example.trading.RemoveHighQuantityCommodities} remove - the remove to be processed
 * @transaction
 */
async function removeHighQuantityCommodities(remove) { // eslint-disable-line no-unused-vars

    const assetRegistry = await getAssetRegistry('org.example.trading.Commodity');
    const results = await query('selectCommoditiesWithHighQuantity');

    // since all registry requests have to be serialized anyway, there is no benefit to calling Promise.all
    // on an array of promises
    results.forEach(async trade => {
        const removeNotification = getFactory().newEvent('org.example.trading', 'RemoveNotification');
        removeNotification.commodity = trade;
        emit(removeNotification);
        await assetRegistry.remove(trade);
    });
}