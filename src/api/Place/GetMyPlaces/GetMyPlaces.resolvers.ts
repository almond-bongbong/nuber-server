import { IsNull } from 'typeorm';
import Place from '../../../entities/Place';
import User from '../../../entities/User';
import { GetMyPlacesResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Query: {
    GetMyPlaces: authResolver(async (_, __, context):Promise<GetMyPlacesResponse> => {
      const user:User = context.req.user;

      try {
        const places:Place[] = await Place.find({ userId: user.id, deletedAt: IsNull() });

        return {
          ok: true,
          error: null,
          places,
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          places: null,
        };
      }
    }),
  },
};

export default resolvers;
