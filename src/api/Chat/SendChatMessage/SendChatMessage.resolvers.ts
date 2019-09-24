import Chat from '../../../entities/Chat';
import Message from '../../../entities/Message';
import User from '../../../entities/User';
import { SendChatMessageMutationArgs, SendChatMessageResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Mutation: {
    SendChatMessage: authResolver(async (_, args:SendChatMessageMutationArgs, { req, pubSub }):Promise<SendChatMessageResponse> => {
      const user:User = req.user;

      try {
        const chat = await Chat.findOne({ id: args.chatId });

        if (chat) {
          if (chat.passengerId === user.id || chat.driverId === user.id) {
            const message = await Message.create({
              chat,
              user,
              text: args.text,
            }).save();
            pubSub.publish('newChatMessage', { MessageSubscription: message });
            return {
              ok: true,
              error: null,
              message,
            };
          }
          return {
            ok: false,
            error: 'Unauthorized',
            message: null,
          };
        }
        return {
          ok: false,
          error: 'Chat not found',
          message: null,
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          message: null,
        };
      }
    }),
  },
};

export default resolvers;
