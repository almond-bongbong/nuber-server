import User from '../../../entities/User';
import Verification from '../../../entities/Verification';
import { CompletePhoneVerificationMutationArgs, CompletePhoneVerificationResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import createJWT from '../../../utils/createJWT';

const resolvers:Resolvers = {
  Mutation: {
    CompletePhoneVerification: async (_, args:CompletePhoneVerificationMutationArgs):Promise<CompletePhoneVerificationResponse> => {
      const { phoneNumber, key } = args;
      try {
        const verification = await Verification.findOne({ payload: phoneNumber, key });
        if (!verification) {
          return {
            ok: false,
            error: 'Verification token not valid',
            token: null,
          }
        } else {
          verification.verified = true;
          await verification.save();
        }
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          token: null,
        }
      }

      try {
        const user = await User.findOne({ phoneNumber });
        if (user) {
          user.verifiedPhoneNumber = true;
          const newUser = await user.save();
          const token = createJWT(newUser.id);
          return {
            ok: true,
            error: null,
            token,
          };
        } else {
          return {
            ok: true,
            error: null,
            token: null,
          }
        }
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          token: null,
        }
      }
    }
  }
};

export default resolvers;