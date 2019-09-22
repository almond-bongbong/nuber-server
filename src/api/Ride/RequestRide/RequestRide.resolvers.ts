import Ride from '../../../entities/Ride';
import User from '../../../entities/User';
import { RequestRideMutationArgs, RequestRideResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';
import toJSON from '../../../utils/toJSON';

const resolvers:Resolvers = {
  Mutation: {
    RequestRide: authResolver(async (_, args:RequestRideMutationArgs, { req, pubSub }):Promise<RequestRideResponse> => {
      const user:User = req.user;

      if (!user.isRiding && !user.isDriving) {
        try {
          const ride = await Ride.create({ ...args, passenger: user }).save();
          pubSub.publish('rideRequest', { NearByRideSubscription: toJSON(ride) });
          user.isRiding = true;
          await user.save();
          return {
            ok: true,
            error: null,
            ride,
          };
        } catch (e) {
          return {
            ok: false,
            error: e.message,
            ride: null,
          };
        }
      }
      return {
        ok: false,
        error: 'You can\'t request two rides',
        ride: null,
      }
    }),
  },
};

export default resolvers;
