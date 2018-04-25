/* global getAssetRegistry getParticipantRegistry getFactory */

/**
 *
 * @param {com.biz.AnimalMovementDeparture} movementDeparture - model instance
 * @transaction
 */
async function onAnimalMovementDeparture(movementDeparture) {  // eslint-disable-line no-unused-vars
    console.log('onAnimalMovementDeparture');
    if (movementDeparture.animal.movementStatus !== 'IN_FIELD') {
        throw new Error('Animal is already IN_TRANSIT');
    }

     // set the movement status of the animal
    movementDeparture.animal.movementStatus = 'IN_TRANSIT';

     // save the animal
    const ar = await getAssetRegistry('com.biz.Animal');
    await ar.update(movementDeparture.animal);

    // add the animal to the incoming animals of the
    // destination business
    if (movementDeparture.to.incomingAnimals) {
        movementDeparture.to.incomingAnimals.push(movementDeparture.animal);
    } else {
        movementDeparture.to.incomingAnimals = [movementDeparture.animal];
    }

    // save the business
    const br = await getAssetRegistry('com.biz.Business');
    await br.update(movementDeparture.to);
}
