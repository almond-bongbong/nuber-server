import User from '../../../entities/User';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Mutation: {
    UpdateMyProfile: authResolver(async (_, __, context) => {
      const user:User = context.req.user;

    }),
  },
};

export default resolvers;
