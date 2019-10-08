import Chat from '../../../entities/Chat';
import Ride from '../../../entities/Ride';
import User from '../../../entities/User';
import { UpdateRideStatusMutationArgs, UpdateRideStatusResponse } from '../../../types/graph';
import { Resolvers } from '../../../types/resolvers';
import authResolver from '../../../utils/authResolver';
import toJSON from '../../../utils/toJSON';

const resolvers:Resolvers = {
  Mutation: {
    UpdateRideStatus: authResolver(async (_, args:UpdateRideStatusMutationArgs, { req, pubSub }):Promise<UpdateRideStatusResponse> => {
      const user:User = req.user;

      try {
        if (user.isDriving) {
          let ride:Ride | undefined;

          if (args.status === 'ACCEPTED') {
            ride = await Ride.findOne(
              {id: args.rideId, status: 'REQUESTING'},
              {relations: ['passenger']},
            );
            if (ride) {
              ride.driver = user;
              user.isTaken = true;
              await user.save();
              ride.chat = await Chat.create({
                driver: user,
                passenger: ride.passenger,
              }).save();
            }
          } else {
            ride = await Ride.findOne(
              { id: args.rideId, driver: user },
              { relations: ['passenger', 'driver'] },
            );
          }

          if (ride) {
            ride.status = args.status;
            const savedRide = await ride.save();
            pubSub.publish('rideUpdate', { RideStatusSubscription: {
                ...savedRide,
                passenger: toJSON(savedRide.passenger),
                driver: toJSON(savedRide.driver),
            }, });

            if (args.status === 'FINISHED') {
              const passenger = ride.passenger;
              const driver = ride.driver;
              driver.isTaken = false;
              passenger.isRiding = false;
              await driver.save();
              await passenger.save();
            }

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
