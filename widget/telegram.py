#pip install aiogram

from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
import asyncio

TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"

bot = Bot(token=TOKEN)
dp = Dispatcher()

@dp.message(CommandStart())
async def start_handler(message: types.Message):
    full_command = message.text

    # Перевіряємо, чи є аргументи
    if " " in full_command:
        utm_data = full_command.split(" ", 1)[1]  # Беремо все після "start"
        utm_data = utm_data.replace("__", "&").replace("_", "=")  # Розкодовуємо

        await message.answer(f"Отримані UTM-мітки: {utm_data}")
    else:
        await message.answer("Привіт! Я бот, але UTM-мітки не передані.")

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())


