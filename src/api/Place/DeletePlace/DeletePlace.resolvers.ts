import { IsNull } from 'typeorm';
import Place from '../../../entities/Place';
import User from '../../../entities/User';
import { DeletePlaceMutationArgs, DeletePlaceResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Mutation: {
    DeletePlace: authResolver(async (_, args:DeletePlaceMutationArgs, context):Promise<DeletePlaceResponse> => {
      const user:User = context.req.user;

      try {
        const place = await Place.findOne({ id: args.placeId, deletedAt: IsNull() })

        if (place) {
          if (place.userId === user.id) {
            console.log(new Date().toISOString());
            place.deletedAt = new Date().toISOString();
            await place.save();

            return {
              ok: true,
              error: null,
            };
          }

          return {
            ok: false,
            error: 'Forbidden',
          };
        }

        return {
          ok: false,
          error: 'Place not found',
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
        };
      }
    }),
  },
};

export default resolvers;
