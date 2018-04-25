/**
 * Update the status of an order
 * @param {org.acme.vehicle.lifecycle.manufacturer.UpdateOrderStatus} updateOrderStatus - the UpdateOrderStatus transaction
 * @transaction
 */
async function updateOrderStatus(updateOrderStatus) { // eslint-disable-line no-unused-vars
    console.log('updateOrderStatus');

    const factory = getFactory();
    const NS_M = 'org.acme.vehicle.lifecycle.manufacturer';
    const NS = 'org.acme.vehicle.lifecycle';
    const NS_D = 'org.vda';

    // save the new status of the order
    updateOrderStatus.order.orderStatus = updateOrderStatus.orderStatus;

    // get vehicle registry
    const registry = await getAssetRegistry(NS_D + '.Vehicle');
    if (updateOrderStatus.orderStatus === 'VIN_ASSIGNED') {
        const vehicle = factory.newResource(NS_D, 'Vehicle', updateOrderStatus.vin);
        vehicle.vehicleDetails = updateOrderStatus.order.vehicleDetails;
        vehicle.vehicleDetails.vin = updateOrderStatus.vin;
        vehicle.vehicleStatus = 'OFF_THE_ROAD';
        return registry.add(vehicle);
    } else if (updateOrderStatus.orderStatus === 'OWNER_ASSIGNED') {
        if (!updateOrderStatus.order.orderer.vehicles) {
            updateOrderStatus.order.orderer.vehicles = [];
        }

        const vehicle = await registry.get(updateOrderStatus.vin);
        vehicle.vehicleStatus = 'ACTIVE';
        vehicle.owner = factory.newRelationship('org.acme.vehicle.lifecycle', 'PrivateOwner', updateOrderStatus.order.orderer.email);
        vehicle.numberPlate = updateOrderStatus.numberPlate || '';
        vehicle.vehicleDetails.numberPlate = updateOrderStatus.numberPlate || '';
        vehicle.vehicleDetails.v5c = updateOrderStatus.v5c || '';
        if (!vehicle.logEntries) {
            vehicle.logEntries = [];
        }
        const logEntry = factory.newConcept(NS_D, 'VehicleTransferLogEntry');
        logEntry.vehicle = factory.newRelationship(NS_D, 'Vehicle', updateOrderStatus.vin);
        logEntry.buyer = factory.newRelationship(NS, 'PrivateOwner', updateOrderStatus.order.orderer.email);
        logEntry.timestamp = updateOrderStatus.timestamp;
        vehicle.logEntries.push(logEntry);
        await registry.update(vehicle);
    }
	// get order registry
    const orderRegistry = await getAssetRegistry(updateOrderStatus.order.getFullyQualifiedType());
    // update order status
    updateOrderStatus.order.vehicleDetails.vin = updateOrderStatus.vin || '';

    if (!updateOrderStatus.order.statusUpdates) {
        updateOrderStatus.order.statusUpdates = [];
    }

    updateOrderStatus.order.statusUpdates.push(updateOrderStatus);

    await orderRegistry.update(updateOrderStatus.order);
    const updateOrderStatusEvent = factory.newEvent(NS_M, 'UpdateOrderStatusEvent');
    updateOrderStatusEvent.orderStatus = updateOrderStatus.order.orderStatus;
    updateOrderStatusEvent.order = updateOrderStatus.order;
    emit(updateOrderStatusEvent);
}
