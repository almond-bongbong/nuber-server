import User from '../../../entities/User';
import { UpdateMyProfileMutationArgs, UpdateMyProfileResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Mutation: {
    UpdateMyProfile: authResolver(async (_, args:UpdateMyProfileMutationArgs, context):Promise<UpdateMyProfileResponse> => {
      const user:User = context.req.user;

      try {
        Object.entries(args).forEach(([k, v]) => {
          if (v != null) { user[k] = v; }
        });
        await user.save();
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
