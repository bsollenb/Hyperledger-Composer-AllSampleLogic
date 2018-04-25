/**
 * A Member revokes access to their Degree assets
 * @param {org.degree.ucsd.RevokeDegreeAccess} transaction - revoke transaction
 * @transaction
 */
function revokeDegreeAccess(transaction) {
    var me = getCurrentParticipant();

    if (me == null) {
        throw new Error("A participant/certificate mapping does not exist");
    }

    var requestorId = transaction.memberId;
    if (requestorId == null) {
        throw new Error("Invalid request. \"memberId\" should be defined");
    }

    var myId = me.getIdentifier();
    console.log("Member " + myId + " grants \"Degree\" access to " + requestorId);

    return query("getDegreeByMemberId", { memberId: myId })
        .then(function (records) {
            if (records.length > 0) {
                var serializer = getSerializer();
                var degree = serializer.toJSON(records[0]);

                if (Array.isArray(degree.authorized)) {
                    var index = degree.authorized.indexOf(requestorId);

                    if (index >= 0) {
                        degree.authorized.splice(index, 1);

                        return getAssetRegistry("org.degree.ucsd.Degree")
                            .then(function (registry) { registry.update(serializer.fromJSON(degree)) })
                            .then(function () {
                                var event = getFactory().newEvent('org.degree.ucsd', 'DegreeEvent');
                                event.degreeTransaction = transaction;
                                emit(event);
                            });
                    }
                }
            }
        })
        .catch(function (ex) { console.error(ex); throw ex; });
}