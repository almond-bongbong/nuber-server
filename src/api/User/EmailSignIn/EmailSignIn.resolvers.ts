import User from '../../../entities/User';
import { EmailSignInMutationArgs, EmailSignInResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import createJWT from '../../../utils/createJWT';

const resolvers:Resolvers = {
  Mutation: {
    EmailSignIn: async (_, args:EmailSignInMutationArgs):Promise<EmailSignInResponse> => {
      const { email, password } = args;

      try {
        const user = await User.findOne({ email, platform: 'EMAIL' });
        if (!user) {
          return {
            ok: false,
            error: 'No User found with that email',
            token: null,
          }
        }
        const checkedPassword = await user.comparePassword(password);
        if (checkedPassword) {
          const token = createJWT(user.id);
          return {
            ok: true,
            error: null,
            token,
          }
        } else {
          return {
            ok: false,
            error: 'Wrong email or password',
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