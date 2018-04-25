/**
 * Publish a new bond
 * @param {org.acme.bond.PublishBond} publishBond - the publishBond transaction
 * @transaction
 */
async function publish(publishBond) {  // eslint-disable-line no-unused-vars

    const registry = await getAssetRegistry('org.acme.bond.BondAsset');
    const factory = getFactory();

    // Create the bond asset.
    const bondAsset = factory.newResource('org.acme.bond', 'BondAsset', publishBond.ISINCode);
    bondAsset.bond = publishBond.bond;

    // Add the bond asset to the registry.
    await registry.add(bondAsset);
}