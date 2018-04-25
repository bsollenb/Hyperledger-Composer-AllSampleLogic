/**
 *
 * @param {com.biz.AnimalMovementArrival} movementArrival - model instance
 * @transaction
 */
async function onAnimalMovementArrival(movementArrival) {  // eslint-disable-line no-unused-vars
    console.log('onAnimalMovementArrival');

    if (movementArrival.animal.movementStatus !== 'IN_TRANSIT') {
        throw new Error('Animal is not IN_TRANSIT');
    }

     // set the movement status of the animal
    movementArrival.animal.movementStatus = 'IN_FIELD';

     // set the new owner of the animal
     // to the owner of the 'to' business
    movementArrival.animal.owner = movementArrival.to.owner;

     // set the new location of the animal
    movementArrival.animal.location = movementArrival.arrivalField;

     // save the animal
    const ar = await getAssetRegistry('com.biz.Animal');
    await ar.update(movementArrival.animal);

    // remove the animal from the incoming animals
    // of the 'to' business
    if (!movementArrival.to.incomingAnimals) {
        throw new Error('Incoming business should have incomingAnimals on AnimalMovementArrival.');
    }

    movementArrival.to.incomingAnimals = movementArrival.to.incomingAnimals
      .filter(function(animal) {
          return animal.animalId !== movementArrival.animal.animalId;
      });

    // save the business
    const br = await getAssetRegistry('com.biz.Business');
    await br.update(movementArrival.to);
}
