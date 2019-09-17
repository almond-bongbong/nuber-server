import Place from '../../../entities/Place';
import User from '../../../entities/User';
import { EditPlaceMutationArgs, EditPlaceResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Mutation: {
    EditPlace: authResolver(async (_, args:EditPlaceMutationArgs, context):Promise<EditPlaceResponse> => {
      const user:User = context.req.user;
      const { placeId, name, isFav } = args;

      try {
        const place = await Place.findOne({ id: placeId });

        if (place) {
          if (place.userId !== user.id) {
            return {
              ok: false,
              error: 'Forbidden',
            };
          }
          if (name != null) { place.name = name; }
          if (isFav != null) { place.isFav = isFav; }
          await place.save();
          return {
            ok: true,
            error: null,
          };
        } else {
          return {
            ok: false,
            error: 'Place not found',
          };
        }
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
