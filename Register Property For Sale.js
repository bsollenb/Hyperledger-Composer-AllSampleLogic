/**
 * Process a property that is held for sale
 * @param {net.biz.digitalPropertyNetwork.RegisterPropertyForSale} propertyForSale the property to be sold
 * @transaction
 */
async function onRegisterPropertyForSale(propertyForSale) {   // eslint-disable-line no-unused-vars
    console.log('### onRegisterPropertyForSale ' + propertyForSale.toString());
    propertyForSale.title.forSale = true;

    const registry = await getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle');
    await registry.update(propertyForSale.title);
}