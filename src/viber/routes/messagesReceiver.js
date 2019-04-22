const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const LocationMessage = require('viber-bot').Message.Location;
const ContactMessage = require('viber-bot').Message.Contact;
const PictureMessage = require('viber-bot').Message.Picture;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const bot = require('../bot');
const keyboard = require('../menu');
const {
  PLATFORM_TYPE_VIBER,
  DEFAULT_VALUES,
  REGISTRATION_MESSAGES: { ENTER },
  UPDATE_LOCATION_MESSAGES: { ENTER: ENTER_LOCATION },
  CREATE_REQUEST_MESSAGES: {
    DESCRIPTION,
    CHOICE_TYPE,
    LOCATION,
    MANY_LETTERS,
    ENTER: MODERATION_START,
  },
  FIND_REQUESTS_MESSAGES: { NEW_LOCATION_RADIUS, ERROR_RADIUS, ERROR_DAYS, DAYS, NO_REQUESTS },
} = require('../../config');
const {
  registerUser,
  setUserName,
  getNewPhotoId,
  getUserStep,
  setUserStep,
  createRequest,
  getRequestsInArea,
  getFileLink,
} = require('../../services');
const { sendOwnMessage } = require('../utils');
const usersRequestBase = require('../usersRequestBase');
const badRequest = require('../badRequest');
const log = require('../../logger')(__filename);

bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
  try {
    if (message instanceof LocationMessage) {
      switch (
        await getUserStep({
          platformId: response.userProfile.id,
          platformType: PLATFORM_TYPE_VIBER,
        })
      ) {
        case 0: {
          try {
            await registerUser({
              platformId: response.userProfile.id,
              platformType: PLATFORM_TYPE_VIBER,
              longitude: message.longitude,
              latitude: message.latitude,
            });
            await setUserStep({
              platformId: response.userProfile.id,
              platformType: PLATFORM_TYPE_VIBER,
              value: 1,
            });
            bot.sendMessage(response.userProfile, new TextMessage(ENTER, keyboard.mainMenu));
            break;
          } catch (error) {
            log.error({ err: error }, 'registrate location viber');
            badRequest(response.userProfile);
            return;
          }
        }
        case 3: {
          try {
            await registerUser({
              platformId: response.userProfile.id,
              platformType: PLATFORM_TYPE_VIBER,
              longitude: message.longitude,
              latitude: message.latitude,
            });
            await setUserStep({
              platformId: response.userProfile.id,
              platformType: PLATFORM_TYPE_VIBER,
              value: 1,
            });
            bot.sendMessage(
              response.userProfile,
              new TextMessage(ENTER_LOCATION, keyboard.mainMenu),
            );
            break;
          } catch (error) {
            log.error({ err: error }, 'update location viber');
            badRequest(response.userProfile);
            return;
          }
        }
        case 8: {
          try {
            usersRequestBase.get(response.userProfile.id).latitude = message.latitude;
            usersRequestBase.get(response.userProfile.id).longitude = message.longitude;
            await setUserStep({
              platformId: response.userProfile.id,
              platformType: PLATFORM_TYPE_VIBER,
              value: 9,
            });
            bot.sendMessage(
              response.userProfile,
              new TextMessage(DESCRIPTION, keyboard.backMainMenu),
            );
            break;
          } catch (error) {
            log.error({ err: error }, 'create request location viber');
            badRequest(response.userProfile);
            return;
          }
        }
        case 12: {
          try {
            usersRequestBase.get(response.userProfile.id).latitude = message.latitude;
            usersRequestBase.get(response.userProfile.id).longitude = message.longitude;
            await setUserStep({
              platformId: response.userProfile.id,
              platformType: PLATFORM_TYPE_VIBER,
              value: 13,
            });
            bot.sendMessage(
              response.userProfile,
              new TextMessage(NEW_LOCATION_RADIUS, keyboard.backMainMenu),
            );
            break;
          } catch (error) {
            log.error({ err: error }, 'find requests location viber');
            badRequest(response.userProfile);
            return;
          }
        }
        default:
          break;
      }
    }
    if (message instanceof ContactMessage) {
      try {
        if (
          (await getUserStep({
            platformId: response.userProfile.id,
            platformType: PLATFORM_TYPE_VIBER,
          })) !== 5 &&
          message.contactName !== undefined
        ) {
          badRequest(response.userProfile);
          return;
        }
        await setUserName({
          platformId: response.userProfile.id,
          platformType: PLATFORM_TYPE_VIBER,
          userName: message.contactPhoneNumber,
        });
        await setUserStep({
          platformId: response.userProfile.id,
          platformType: PLATFORM_TYPE_VIBER,
          value: 6,
        });
        usersRequestBase.get(response.userProfile.id).userName = message.contactPhoneNumber;
        bot.sendMessage(
          response.userProfile,
          new TextMessage(CHOICE_TYPE, keyboard.searchFoundMenu),
        );
      } catch (error) {
        log.error({ err: error }, 'phone share viber');
        badRequest(response.userProfile);
        return;
      }
    }
    if (message instanceof PictureMessage) {
      try {
        if (
          (await getUserStep({
            platformId: response.userProfile.id,
            platformType: PLATFORM_TYPE_VIBER,
          })) !== 7
        ) {
          badRequest(response.userProfile);
          return;
        }
        const id = await getNewPhotoId(message.url);
        await setUserStep({
          platformId: response.userProfile.id,
          platformType: PLATFORM_TYPE_VIBER,
          value: 8,
        });
        usersRequestBase.get(response.userProfile.id).photo = id;
        bot.sendMessage(response.userProfile, new TextMessage(LOCATION, keyboard.backMainMenu));
      } catch (error) {
        log.error({ err: error }, 'pictureMessage viber');
        badRequest(response.userProfile);
        return;
      }
    }
    if (message instanceof TextMessage) {
      switch (
        await getUserStep({
          platformId: response.userProfile.id,
          platformType: PLATFORM_TYPE_VIBER,
        })
      ) {
        case 9: {
          try {
            if (message.text.length > 1000) {
              bot.sendMessage(
                response.userProfile,
                new TextMessage(MANY_LETTERS, keyboard.backMainMenu),
              );
              return;
            }
            await setUserStep({
              platformId: response.userProfile.id,
              platformType: PLATFORM_TYPE_VIBER,
              value: 1,
            });
            const userRequest = usersRequestBase.get(response.userProfile.id);
            userRequest.message = message.text;
            userRequest.platformType = PLATFORM_TYPE_VIBER;
            userRequest.platformId = response.userProfile.id;
            await createRequest(userRequest);
            bot.sendMessage(
              response.userProfile,
              new TextMessage(MODERATION_START, keyboard.mainMenu),
            );
            break;
          } catch (error) {
            log.error({ err: error }, 'create request message viber');
            badRequest(response.userProfile);
            return;
          }
        }
        case 13: {
          const radius = Number.parseInt(message.text, 10);
          if (
            radius < DEFAULT_VALUES.RADIUS_MIN ||
            radius > DEFAULT_VALUES.RADIUS_MAX ||
            !/^\d+$/.test(message.text)
          ) {
            bot.sendMessage(
              response.userProfile,
              new TextMessage(ERROR_RADIUS, keyboard.backMainMenu),
            );
            return;
          }
          usersRequestBase.get(response.userProfile.id).radius = radius;
          try {
            await setUserStep({
              platformId: response.userProfile.id,
              platformType: PLATFORM_TYPE_VIBER,
              value: 14,
            });
            bot.sendMessage(response.userProfile, new TextMessage(DAYS, keyboard.backMainMenu));
            break;
          } catch (error) {
            log.error({ err: error }, 'find requests radius viber');
            badRequest(response.userProfile);
            return;
          }
        }
        case 14: {
          try {
            const days = Number.parseInt(message.text, 10);
            if (
              days < DEFAULT_VALUES.DAYS_MIN ||
              days > DEFAULT_VALUES.DAYS_MAX ||
              !/^\d+$/.test(message.text)
            ) {
              bot.sendMessage(
                response.userProfile,
                new TextMessage(ERROR_DAYS, keyboard.backMainMenu),
              );
              return;
            }
            const requestParams = usersRequestBase.get(response.userProfile.id);
            const requests = await getRequestsInArea({
              latitude: requestParams.latitude,
              longitude: requestParams.longitude,
              radius: requestParams.radius,
              days,
            });
            if (requests.length === 0) {
              bot.sendMessage(
                response.userProfile,
                new TextMessage(NO_REQUESTS, keyboard.mainMenu),
              );
              await setUserStep({
                platformId: response.userProfile.id,
                platformType: PLATFORM_TYPE_VIBER,
                value: 1,
              });
              return;
            }
            requests.forEach(async (req, i) => {
              const photoURL = await getFileLink(req.photo);
              setTimeout(
                () =>
                  sendOwnMessage({
                    chatId: response.userProfile.id,
                    photo: photoURL,
                    request: req,
                  }),
                1000 * i,
              );
            });
            setTimeout(
              () => bot.sendMessage(response.userProfile, new KeyboardMessage(keyboard.mainMenu)),
              requests.length * 1000 + 1000,
            );
            await setUserStep({
              platformId: response.userProfile.id,
              platformType: PLATFORM_TYPE_VIBER,
              value: 1,
            });
            break;
          } catch (error) {
            log.error({ err: error }, 'find requests days viber');
            badRequest(response.userProfile);
            return;
          }
        }
        default: {
          break;
        }
      }
    }
  } catch (error) {
    log.error({ err: error }, 'find requests module viber');
    badRequest(response.userProfile);
  }
});
