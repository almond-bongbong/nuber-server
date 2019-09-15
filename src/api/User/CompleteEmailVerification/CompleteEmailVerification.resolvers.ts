import User from '../../../entities/User';
import Verification from '../../../entities/Verification';
import { CompleteEmailVerificationMutationArgs, CompleteEmailVerificationResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Mutation: {
    CompleteEmailVerification: authResolver(async (_, args:CompleteEmailVerificationMutationArgs, context):Promise<CompleteEmailVerificationResponse> => {
      const user:User = context.req.user;
      if (user.email && !user.verifiedEmail) {
        try {
          const verification = await Verification.findOne({ payload: user.email, key: args.key });
          if (verification) {
            user.verifiedEmail = true;
            await user.save();
            return {
              ok: true,
              error: null,
            };
          } else {
            return {
              ok: false,
              error: 'Can\'t verify email'
            }
          }
        } catch (e) {
          return {
            ok: false,
            error: e.message,
          }
        }
      } else {
        return {
          ok: false,
          error: 'No email to verify',
        }
      }
    }),
  },
};

export default resolvers;
