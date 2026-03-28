#pip install viber-bot flask

from flask import Flask, request
from viberbot import Api
from viberbot.api.bot_configuration import BotConfiguration
from viberbot.api.messages.text_message import TextMessage
from viberbot.api.viber_requests import ViberMessageRequest, ViberSubscribedRequest

TOKEN = "YOUR_VIBER_BOT_TOKEN"
WEBHOOK_URL = "YOUR_WEBHOOK_URL"

app = Flask(__name__)

viber = Api(BotConfiguration(
    name='MyViberBot',
    avatar='https://your-avatar-url.com',
    auth_token=TOKEN
))

@app.route('/', methods=['POST'])
def incoming():
    viber_request = viber.parse_request(request.get_data().decode('utf-8'))

    if isinstance(viber_request, ViberMessageRequest):
        context = viber_request.message.text  # Отримуємо UTM з context
        viber.send_messages(viber_request.sender.id, [
            TextMessage(text=f"Твої UTM-мітки: {context}" if context else "Немає UTM-міток.")
        ])

    return '', 200

if __name__ == "__main__":
    app.run(port=5000, debug=True)
