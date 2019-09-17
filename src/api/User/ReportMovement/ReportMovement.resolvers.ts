import User from '../../../entities/User';
import { ReportMovementMutationArgs, ReportMovementResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Mutation: {
    ReportMovement: authResolver(async (_, args:ReportMovementMutationArgs, context):Promise<ReportMovementResponse> => {
      const user:User = context.req.user;
      const { orientation, lat, lng } = args;

      try {
        if (orientation != null) { user.lastOrientation = orientation; }
        if (lat != null) { user.lastLat = lat; }
        if (lng != null) { user.lastLng = lng; }
        await user.save();
        return {
          ok: true,
          error: null,
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