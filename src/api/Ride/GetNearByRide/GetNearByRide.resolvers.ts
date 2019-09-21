import { Between } from 'typeorm';
import Ride from '../../../entities/Ride';
import User from '../../../entities/User';
import { GetNearByRideResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Query: {
    GetNearByRide: authResolver(async (_, __, { req }):Promise<GetNearByRideResponse> => {
      const user:User = req.user;
      const { lastLat, lastLng } = user;

      if (!user.isDriving) {
        return {
          ok: false,
          error: 'You are not a driver',
          ride: null,
        };
      }

      try {
        const ride = await Ride.findOne({
          status: 'REQUESTING',
          pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
          pickUpLng: Between(lastLng - 0.05, lastLng + 0.05),
        });

        if (ride) {
          return {
            ok: true,
            error: null,
            ride,
          };
        } else {
          return {
            ok: true,
            error: null,
            ride: null,
          }
        }
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
