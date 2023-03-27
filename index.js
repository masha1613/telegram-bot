const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options.js");

const token = "6089939202:AAEDDql0FHPVRqcnsPtO-h4qrmL0g2DHCFo";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOption);
};

const start = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Начало",
    },
    {
      command: "/info",
      description: "Инфо о пользователе",
    },
    {
      command: "/game",
      description: "Игра",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    console.log(msg);

    if (text === "/start") {
      await bot.sendMessage(chatId, `Привет, чмоня!`);
      return bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp"
      );
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "я тебя не понимаю");
  });
};

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  if (data === "/again") {
    return startGame(chatId);
  }
  if (data === chats[chatId]) {
    return await bot.sendMessage(
      chatId,
      `ПОЗДРАВЛЯЮ, ТЫ УГАДАЛ ЦИФРУ ${chats[chatId]}`,
      againOption
    );
  } else {
    return bot.sendMessage(
      chatId,
      `к сожалению, ты не угадал цифру ${chats[chatId]}`,
      againOption
    );
  }

  bot.sendMessage(chatId, `Ты выбрaл цифру ${data}`);
  console.log(msg);
});

start();
