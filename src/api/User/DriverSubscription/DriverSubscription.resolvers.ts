const resolvers = {
  Subscription: {
    DriverSubscription: {
      subscribe: (_, __, { pubSub, connectionContext }) => {
        console.log(connectionContext);
        return pubSub.asyncIterator('driverUpdate');
      }
    }
  },
};

export default resolvers;
