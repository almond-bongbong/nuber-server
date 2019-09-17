import User from '../../../entities/User';
import { ToggleDrivingModeResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Mutation: {
    ToggleDrivingMode: authResolver(async (_, __, context):Promise<ToggleDrivingModeResponse> => {
      const user:User  = context.req.user;

      try {
        user.isDriving = !user.isDriving;
        await user.save();
        return {
          ok: true,
          error: null,
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
