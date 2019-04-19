const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const LocationMessage = require('viber-bot').Message.Location;
const ContactMessage = require('viber-bot').Message.Contact;
const PictureMessage = require('viber-bot').Message.Picture;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const bot = require('../bot');
const keyboard = require('../menu');
const { PLATFORM_TYPE_VIBER, DEFAULT_VALUES } = require('../../config');
const {
  registerUser,
  setUserName,
  getNewPhotoId,
  getUserStep,
  setUserStep,
  createRequest,
  getRequestsInArea,
} = require('../../services');
const { sendPhotoMessageViber } = require('../utils');
const usersRequestBase = require('../usersRequestBase');
const badRequest = require('../badRequest');

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
            bot.sendMessage(
              response.userProfile,
              new TextMessage(
                'Реєстрація пройшла успішно. Вам доступне головне меню.',
                keyboard.mainMenu,
              ),
            );
            break;
          } catch (error) {
            console.log(error);
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
              new TextMessage('Ваша локація змінена', keyboard.mainMenu),
            );
            break;
          } catch (error) {
            console.log(error);
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
              new TextMessage(
                'Локація прийнята, тепер напишіть опис вашого улюбленця 1 повідомленням до 1000 символів',
                keyboard.backMainMenu,
              ),
            );
            break;
          } catch (error) {
            console.log(error);
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
              new TextMessage(
                'Локація прийнята. Введіть радіус для вибірки',
                keyboard.backMainMenu,
              ),
            );
            break;
          } catch (error) {
            console.log(error);
            badRequest(response.userProfile);
            return;
          }
        }
        default:
          console.log('default');
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
          new TextMessage(
            'Ваш улюбленець загубився, чи ви знайшли чийогось?',
            keyboard.searchFoundMenu,
          ),
        );
      } catch (error) {
        console.log(error);
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
        bot.sendMessage(
          response.userProfile,
          new TextMessage(
            'Включіть гпс та відправте координати де загубився/знайшовся улюбленець',
            keyboard.backMainMenu,
          ),
        );
      } catch (error) {
        console.log(error);
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
                new TextMessage(
                  'Ваше повідомлення занадто довге, скоротіть його та відправте знову',
                  keyboard.backMainMenu,
                ),
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
              new TextMessage('Ваша заявка відправлена на модерацію.', keyboard.mainMenu),
            );
            break;
          } catch (error) {
            console.log(error);
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
              new TextMessage(
                'Значення не підходить, необхідно ввести тільки число від 100 до 10000',
                keyboard.backMainMenu,
              ),
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
            bot.sendMessage(
              response.userProfile,
              new TextMessage('Вкажіть кількість днів вибірки від 1 до 30', keyboard.backMainMenu),
            );
            break;
          } catch (error) {
            console.log(error);
            badRequest(response.userProfile);
            return;
          }
        }
        case 14: {
          const days = Number.parseInt(message.text, 10);
          if (
            days < DEFAULT_VALUES.DAYS_MIN ||
            days > DEFAULT_VALUES.DAYS_MAX ||
            !/^\d+$/.test(message.text)
          ) {
            bot.sendMessage(
              response.userProfile,
              new TextMessage(
                'Значення не підходить, необхідно ввести тільки число від 1 до 30',
                keyboard.backMainMenu,
              ),
            );
            return;
          }
          try {
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
                new TextMessage('Заявок не знайдено', keyboard.mainMenu),
              );
              await setUserStep({
                platformId: response.userProfile.id,
                platformType: PLATFORM_TYPE_VIBER,
                value: 1,
              });
              return;
            }
            requests.forEach((req, i) => {
              const photoURL =
                'https://dl-media.viber.com/1/share/2/long/vibes/icon/image/0x0/1433/673465886be1a0cabc915dad06fa14f71b6f80496ca0943dea5b85a4f54a1433.jpg';
              // doPhotoURL(req.photo);
              setTimeout(
                () =>
                  sendPhotoMessageViber({
                    chatId: response.userProfile.id,
                    photo: photoURL,
                    request: req,
                  }),
                1000 * i,
              );
            });
            bot.sendMessage(response.userProfile, new KeyboardMessage(keyboard.mainMenu));
            break;
          } catch (error) {
            console.log(error);
            badRequest(response.userProfile);
            return;
          }
        }
        default: {
          console.log('default');
        }
      }
    }
  } catch (error) {
    console.log(error);
    badRequest(response.userProfile);
  }
});
