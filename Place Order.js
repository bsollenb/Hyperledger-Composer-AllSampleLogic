/**
 * Place an order for a vehicle
 * @param {org.acme.vehicle.lifecycle.manufacturer.PlaceOrder} placeOrder - the PlaceOrder transaction
 * @transaction
 */
async function placeOrder(placeOrder) { // eslint-disable-line no-unused-vars
    console.log('placeOrder');

    const factory = getFactory();
    const NS_M = 'org.acme.vehicle.lifecycle.manufacturer';
    const NS = 'org.acme.vehicle.lifecycle';

    const order = factory.newResource(NS_M, 'Order', placeOrder.orderId);
    order.vehicleDetails = placeOrder.vehicleDetails;
    order.orderStatus = 'PLACED';
    order.manufacturer = placeOrder.manufacturer;
    order.orderer = factory.newRelationship(NS, 'PrivateOwner', placeOrder.orderer.getIdentifier());

    // save the order
    const registry = await getAssetRegistry(order.getFullyQualifiedType());
    await registry.add(order);
    const placeOrderEvent = factory.newEvent(NS_M, 'PlaceOrderEvent');
    placeOrderEvent.orderId = order.orderId;
    placeOrderEvent.vehicleDetails = order.vehicleDetails;
    emit(placeOrderEvent);
}
