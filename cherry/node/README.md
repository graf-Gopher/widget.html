# Node server

Simple Node.js server for the cherry widget. It stores clicked cherry IDs per user in a local JSON file and can also send email.

## Files

- `server.js` - HTTP server
- `.env.example` - example SMTP environment variables
- `users.json` - created automatically, stores users and clicked item IDs
- `mail.log` - request log file created automatically

## Setup

1. Install Node.js.
2. Open the `node` folder:

```bash
cd /mnt/T7/projects/box_catering/widget.html/cherry/node
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on `.env.example`.

Example:

```env
PORT=3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-login
SMTP_PASS=your-smtp-password
MAIL_FROM=no-reply@example.com
MAIL_TO=manager@example.com
MAIL_CC=
HOROSHOP_LOGIN=
HOROSHOP_PASSWORD=
HOROSHOP_AUTH_URL=https://marylash.pro/api/auth/
HOROSHOP_USERS_EXPORT_URL=https://marylash.pro/api/users/export/
```

5. Start the server:

```bash
npm start
```

The server will run on `http://localhost:8080` by default.

## Cherry endpoints

`GET /user-clicks?userId=user-123`

Response:

```json
{
    "success": true,
    "user": {
        "userId": "user-123",
        "email": "user@example.com",
        "clickedItems": [
            {
                "itemId": 1,
                "page": "https://example.com/page-1",
                "clickedAt": "2026-03-28T12:00:00.000Z"
            }
        ],
        "updatedAt": "2026-03-28T12:00:00.000Z"
    }
}
```

`POST /click-item`

Request body:

```json
{
    "userId": "user-123",
    "itemId": 12,
    "page": "https://example.com/catalog/item"
}
```

This updates `users.json`. If the item was already saved for that user, it is not duplicated.

`GET /user-clicks` also creates `users.json` automatically if it does not exist yet. If the requested `userId` is not found, the server adds a new empty user record and returns it.

`GET /all-users`

Response:

```json
{
    "success": true,
    "users": {
        "user-123": {
            "userId": "user-123",
            "email": "user@example.com",
            "clickedItems": [
                {
                    "itemId": 12,
                    "page": "https://example.com/catalog/item",
                    "clickedAt": "2026-03-28T12:00:00.000Z"
                }
            ],
            "updatedAt": "2026-03-28T12:00:00.000Z"
        }
    }
}
```

Saved click format in `users.json`:

```json
{
    "user-123": {
        "userId": "user-123",
        "email": "user@example.com",
        "clickedItems": [
            {
                "itemId": 12,
                "page": "https://example.com/catalog/item",
                "clickedAt": "2026-03-28T12:00:00.000Z"
            }
        ],
        "updatedAt": "2026-03-28T12:00:00.000Z"
    }
}
```

## Mail endpoint

`POST /send-email`

Request body:

```json
{
    "userId": "user-123",
    "subject": "Hello",
    "text": "Test message"
}
```

The server sends this email to `MAIL_TO` from `.env` and adds `MAIL_CC` as a copy only when it is not empty. Before sending, it refreshes the Horoshop user export, finds the user email by `userId`, stores it in `users.json`, and appends that email to the sent message.

You can also send `html` instead of `text`, or send both.

Success response:

```json
{
    "success": true,
    "messageId": "<message-id>"
}
```

Error response:

```json
{
    "success": false,
    "error": "Error message"
}
```

## Frontend config

`cherry.js` reads the current user from:

- `window.CHERRY_USER_ID`
- optional `window.CHERRY_API_BASE`

Example:

```html
<script>
    window.CHERRY_API_BASE = "http://localhost:3000";
    window.CHERRY_USER_ID = "user-123";
</script>
<script src="./cherry.js"></script>
```
