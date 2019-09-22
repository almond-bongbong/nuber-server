import { withFilter } from 'graphql-yoga';
import User from '../../../entities/User';

const resolvers = {
  Subscription: {
    NearByRideSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => pubSub.asyncIterator('rideRequest'),
        (payload, _, { connectionContext }) => {
          const user:User = connectionContext.currentUser;
          const { NearByRideSubscription: { pickUpLat, pickUpLng } } = payload;
          const { lastLat: driverLastLat, lastLng: driverLastLng } = user;

          return pickUpLat >= driverLastLat - 0.05 && pickUpLat <= driverLastLat + 0.05
              && pickUpLng >= driverLastLng - 0.05 && pickUpLng <= driverLastLng + 0.05;
        }
      ),
    },
  },
};

export default resolvers;
