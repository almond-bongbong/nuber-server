import Place from '../../../entities/Place';
import User from '../../../entities/User';
import { AddPlaceMutationArgs, AddPlaceResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Mutation: {
    AddPlace: authResolver(async (_, args:AddPlaceMutationArgs, context):Promise<AddPlaceResponse> => {
      const user:User = context.req.user;

      try {
        await Place.create({ ...args, user }).save();
        return {
          ok: true,
          error: null,
        }
      } catch (e) {
        return {
          ok: false,
          error: e.message,
        }
      }
    }),
  },
};

export default resolvers;
