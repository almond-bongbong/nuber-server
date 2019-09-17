import { Between } from 'typeorm';
import User from '../../../entities/User';
import { GetNearbyDriversResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Query: {
    GetNearbyDrivers: authResolver(async (_, __, context):Promise<GetNearbyDriversResponse> => {
      const user:User = context.req.user;
      const { lastLat, lastLng } = user;

      try {
        const drivers = await User.find({
          isDriving: true,
          isTaken: false,
          lastLat: Between(lastLat - 0.05, lastLat + 0.05),
          lastLng: Between(lastLng - 0.05, lastLng + 0.05),
        });
        return {
          ok: true,
          error: null,
          drivers,
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          drivers: null,
        };
      }
    }),
  },
};

export default resolvers;
