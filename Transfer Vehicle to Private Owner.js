/**
 * Transfer a vehicle to another private owner
 * @param {org.vda.PrivateVehicleTransfer} privateVehicleTransfer - the PrivateVehicleTransfer transaction
 * @transaction
 */
async function privateVehicleTransfer(privateVehicleTransfer) { // eslint-disable-line no-unused-vars
    console.log('privateVehicleTransfer');

    const NS = 'org.acme.vehicle.lifecycle';
    const NS_D = 'org.vda';
    const factory = getFactory();

    const seller = privateVehicleTransfer.seller;
    const buyer = privateVehicleTransfer.buyer;
    const vehicle = privateVehicleTransfer.vehicle;

    //change vehicle owner
    vehicle.owner = buyer;

    //PrivateVehicleTransaction for log
    const vehicleTransferLogEntry = factory.newConcept(NS_D, 'VehicleTransferLogEntry');
    vehicleTransferLogEntry.vehicle = factory.newRelationship(NS_D, 'Vehicle', vehicle.getIdentifier());
    vehicleTransferLogEntry.seller = factory.newRelationship(NS, 'PrivateOwner', seller.getIdentifier());
    vehicleTransferLogEntry.buyer = factory.newRelationship(NS, 'PrivateOwner', buyer.getIdentifier());
    vehicleTransferLogEntry.timestamp = privateVehicleTransfer.timestamp;
    if (!vehicle.logEntries) {
        vehicle.logEntries = [];
    }

    vehicle.logEntries.push(vehicleTransferLogEntry);

    const assetRegistry = await getAssetRegistry(vehicle.getFullyQualifiedType());
    await assetRegistry.update(vehicle);
}

/**