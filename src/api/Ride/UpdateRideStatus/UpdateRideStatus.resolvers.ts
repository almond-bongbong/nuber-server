import Chat from '../../../entities/Chat';
import Ride from '../../../entities/Ride';
import User from '../../../entities/User';
import { UpdateRideStatusMutationArgs, UpdateRideStatusResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';

const resolvers:Resolvers = {
  Mutation: {
    UpdateRideStatus: authResolver(async (_, args:UpdateRideStatusMutationArgs, { req, pubSub }):Promise<UpdateRideStatusResponse> => {
      const user:User = req.user;

      try {
        if (user.isDriving) {
          let ride:Ride | undefined;

          if (args.status === 'ACCEPTED') {
            ride = await Ride.findOne(
              { id: args.rideId, status: 'REQUESTING' },
              { relations: ['passenger'] },
              );
            if (ride) {
              ride.driver = user;
              user.isTaken = true;
              await user.save();
              await Chat.create({
                driver: user,
                passenger: ride.passenger,
              }).save();
            }
          } else {
            ride = await Ride.findOne({ id: args.rideId, driver: user });
          }

          if (ride) {
            ride.status = args.status;
            const savedRide = await ride.save();
            pubSub.publish('rideUpdate', { RideStatusSubscription: savedRide });
            return {
              ok: true,
              error: null,
            };
          }
          return {
            ok: false,
            error: 'Can\'t update ride',
          };
        } else {
          return {
            ok: false,
            error: 'You are not Driving',
          }
        }

      } catch (e) {
        return {
          ok: false,
          error: e.message,
        };
      }
    }
  )},
};

export default resolvers;
