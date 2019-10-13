"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_yoga_1 = require("graphql-yoga");
var resolvers = {
    Subscription: {
        NearByRideSubscription: {
            subscribe: graphql_yoga_1.withFilter(function (_, __, _a) {
                var pubSub = _a.pubSub;
                return pubSub.asyncIterator('rideRequest');
            }, function (payload, _, _a) {
                var connectionContext = _a.connectionContext;
                var user = connectionContext.currentUser;
                var _b = payload.NearByRideSubscription, pickUpLat = _b.pickUpLat, pickUpLng = _b.pickUpLng;
                var driverLastLat = user.lastLat, driverLastLng = user.lastLng;
                return pickUpLat >= driverLastLat - 0.05 && pickUpLat <= driverLastLat + 0.05
                    && pickUpLng >= driverLastLng - 0.05 && pickUpLng <= driverLastLng + 0.05;
            }),
        },
    },
};
exports.default = resolvers;
//# sourceMappingURL=NearByRideSubscription.resolvers.js.map