import Ride from '../../../entities/Ride';
import User from '../../../entities/User';
import { GetRideQueryArgs, GetRideResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Query: {
    GetRide: authResolver(async (_, args:GetRideQueryArgs, { req }):Promise<GetRideResponse> => {
      const user:User = req.user;

      try {
        const ride = await Ride.findOne({ id: args.rideId }, { relations: ['passenger', 'driver'] });

        if (ride) {
          if (ride.passengerId === user.id || ride.driverId === user.id) {
            return {
              ok: true,
              error: null,
              ride,
            };
          } else {
            return {
              ok: false,
              error: 'Not Authorized',
              ride: null,
            };
          }
        }
        return {
          ok: false,
          error: 'Ride not found',
          ride: null,
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          ride: null,
        };
      }
    }),
  },
};

export default resolvers;
