import { withFilter } from 'graphql-yoga';
import Chat from '../../../entities/Chat';
import User from '../../../entities/User';

const resolvers = {
  Subscription: {
    MessageSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => pubSub.asyncIterator('newChatMessage'),
        async (payload, _, { connectionContext }) => {
          const user:User = connectionContext.currentUser;
          const { MessageSubscription: { chatId } } = payload;

          try {
            const chat:Chat | undefined = await Chat.findOne({ id: chatId });
            if (chat) {
              return chat.passengerId === user.id || chat.driverId === user.id;
            }
          } catch (e) {
            return false;
          }
          return false;
        }
      ),
    },
  },
};

export default resolvers;
