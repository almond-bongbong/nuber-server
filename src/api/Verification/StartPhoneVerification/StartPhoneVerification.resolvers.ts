import Verification from '../../../entities/Verification';
import { StartPhoneVerificationMutationArgs, StartPhoneVerificationResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import { sendVerificationSMS } from '../../../utils/sendSMS';

const resolvers:Resolvers = {
  Mutation: {
    StartPhoneVerification: async (_, args:StartPhoneVerificationMutationArgs):Promise<StartPhoneVerificationResponse> => {
      const { phoneNumber } = args;
      const convertedPhoneNumber = phoneNumber.replace(/-/g, '');
      try {
        const existingVerification = await Verification.findOne({ payload: convertedPhoneNumber });
        if (existingVerification) {
          await existingVerification.remove();
        }
        const newVerification = await Verification.create({
          payload: convertedPhoneNumber,
          target: 'PHONE',
        }).save();
        await sendVerificationSMS(newVerification.payload, newVerification.key);
        return {
          ok: true,
          error: null
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
        }
      }
    }
  }
};

export default resolvers;