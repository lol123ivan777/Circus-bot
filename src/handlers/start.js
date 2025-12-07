exports.handleStart = async (bot, msg) => {
const chatId = msg.chat.id;

const bannerUrl =
' https://stihi.ru/pics/2017/06/18/266.jpg'; // <-- поставь свой баннер, лучше JPG/PNG

const caption =
'🎪 Добро пожаловать в цирк Никулина! \n\n' +
'Здесь вы можете узнать расписание представлений, ознакомиться с артистами, ' +
'просмотреть новости и получить полезную информацию.\n\n' +
'Выберите нужный раздел в меню ниже.';

await bot.sendPhoto(chatId, bannerUrl, {
caption,
parse_mode: 'Markdown',
reply_markup: require('../keyboards/mainMenu').mainMenuKeyboard.reply_markup
});
};