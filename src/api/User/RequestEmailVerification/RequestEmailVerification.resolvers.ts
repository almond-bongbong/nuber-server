import Verification from '../../../entities/Verification';
import { RequestEmailVerificationResponse, User } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';
import { sendVerificationEmail } from '../../../utils/sendEmail';

const resolvers:Resolvers = {
  Mutation: {
    RequestEmailVerification: authResolver(async (_, __, context):Promise<RequestEmailVerificationResponse> => {
      const user:User = context.req.user;
      if (user.email && !user.verifiedEmail) {
        try {
          const findVerification = await Verification.findOne({ target: 'EMAIL', payload: user.email });
          if (findVerification) {
            await Verification.remove(findVerification);
          }
          const newVerification = await Verification.create({
            payload: user.email,
            target: 'EMAIL',
          }).save();
          await sendVerificationEmail(user.email, user.fullName, newVerification.key);
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
      }
      return {
        ok: false,
        error: 'Your user has no email to verify'
      }
    }),
  },
};

export default resolvers;
