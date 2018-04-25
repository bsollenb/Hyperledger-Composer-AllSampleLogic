/**
 * Scrap a vehicle
 * @param {org.vda.ScrapVehicle} scrapVehicle - the ScrapVehicle transaction
 * @transaction
 */
async function scrapVehicle(scrapVehicle) { // eslint-disable-line no-unused-vars
    console.log('scrapVehicle');

    const NS_D = 'org.vda';

    const assetRegistry = await getAssetRegistry(NS_D + '.Vehicle');
    const vehicle = await assetRegistry.get(scrapVehicle.vehicle.getIdentifier());
    vehicle.vehicleStatus = 'SCRAPPED';
    await assetRegistry.update(vehicle);
}

/**
 * Scrap a vehicle
 * @param {org.vda.ScrapAllVehiclesByColour} scrapAllVehicles - the ScrapAllVehicles transaction
 * @transaction
 */
async function scrapAllVehiclesByColour(scrapAllVehicles) { // eslint-disable-line no-unused-vars
    console.log('scrapAllVehiclesByColour');

    const NS_D = 'org.vda';
    const assetRegistry = await getAssetRegistry(NS_D + '.Vehicle');
    const vehicles = await query('selectAllCarsByColour', {'colour': scrapAllVehicles.colour});
    if (vehicles.length >= 1) {
        const factory = getFactory();
        const vehiclesToScrap = vehicles.filter(function (vehicle) {
            return vehicle.vehicleStatus !== 'SCRAPPED';
        });
        for (let x = 0; x < vehiclesToScrap.length; x++) {
            vehiclesToScrap[x].vehicleStatus = 'SCRAPPED';
            const scrapVehicleEvent = factory.newEvent(NS_D, 'ScrapVehicleEvent');
            scrapVehicleEvent.vehicle = vehiclesToScrap[x];
            emit(scrapVehicleEvent);
        }
        await assetRegistry.updateAll(vehiclesToScrap);
    }
}