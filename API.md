The API supports authentication, user search, direct conversations, group conversations, message history, and real-time messaging.

---

## Base URLs

### REST API

```text
https://frontend-task-chatapp.onrender.com/api
```

---

# Authentication

Uses JWT-based authentication.

There is no separate registration endpoint. `POST /auth/login` handles both login and registration:

- A new phone number creates a new account.
- An existing phone number logs the user in.
- A JWT is returned after a successful login.

For protected REST endpoints, send the token as:

```http
Authorization: Bearer <token>
```

---

# Auth

## POST /auth/login

Log in or register a user.

### Request

```http
POST /api/auth/login
Content-Type: application/json
```

### Body

```json
{
  "phone": "+15551234567",
  "name": "Ada Lovelace"
}
```

### Fields

| Field   | Type   | Required | Description       |
| ------- | ------ | -------- | ----------------- |
| `phone` | string | Yes      | User phone number |
| `name`  | string | Yes      | User name         |

### Response

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "_id": "6a882468e5d6aac97521e25e",
    "name": "Ada Lovelace",
    "phone": "+15551234567",
    "createdAt": "2026-08-21T10:11:52.529Z"
  }
}
```

The `token` should be kept by the client and used for authenticated requests.

---

## GET /auth/me

Return the currently authenticated user.

This endpoint can also be used to restore the user's session after a page refresh.

### Request

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Response

```json
{
  "_id": "6a882468e5d6aac97521e25e",
  "name": "Ada Lovelace",
  "phone": "+15551234567",
  "createdAt": "2026-08-21T10:11:52.529Z"
}
```

---

# Users

## GET /users/search

Search for other users by name or phone number.

### Request

```http
GET /api/users/search?q=Ada
Authorization: Bearer <token>
```

### Query Parameters

| Parameter | Type   | Required | Description                             |
| --------- | ------ | -------- | --------------------------------------- |
| `q`       | string | Yes      | User name or phone number to search for |

### Response

The endpoint returns an array of matching users.

```json
[
  {
    "_id": "6a882468e5d6aac97521e25e",
    "name": "Ada Lovelace",
    "phone": "+15551234567"
  },
  {
    "_id": "6a8827c4e5d6aac97521e3ec",
    "name": "Ada Probe",
    "phone": "+15550001001"
  }
]
```

---

# Conversations

## GET /conversations

Return all conversations that the current user is part of.

Both direct and group conversations are included.

### Request

```http
GET /api/conversations
Authorization: Bearer <token>
```

### Response

```json
{
  "data": [
    {
      "_id": "6a8840a6e5d6aac97522105c",
      "type": "group",
      "lastMessage": {},
      "updatedAt": "2026-08-21T12:12:22.297Z",
      "name": "Project Team",
      "createdBy": "6a882468e5d6aac97521e25e",
      "admins": ["6a882468e5d6aac97521e25e"],
      "participants": [
        {
          "_id": "6a882468e5d6aac97521e25e",
          "name": "Ada Lovelace",
          "phone": "+15551234567"
        }
      ]
    },
    {
      "_id": "6a883644e5d6aac97521f629",
      "type": "direct",
      "lastMessage": {
        "text": "Hello!",
        "sender": "6a882468e5d6aac97521e25e",
        "createdAt": "2026-08-21T12:12:04.076Z"
      },
      "updatedAt": "2026-08-21T12:12:04.311Z",
      "participant": {
        "_id": "6a88239ee5d6aac97521e234",
        "name": "Alice Smith",
        "phone": "+8801700000002"
      }
    }
  ]
}
```

### Direct conversation

A direct conversation contains:

```text
_id
type
lastMessage
updatedAt
participant
```

The `participant` object contains:

```text
_id
name
phone
```

### Group conversation

A group conversation contains:

```text
_id
type
lastMessage
updatedAt
name
createdBy
admins
participants
```

Each participant contains:

```text
_id
name
phone
```

A `lastMessage` object can contain:

```text
text
sender
createdAt
```

---

## POST /conversations

Start or open a one-to-one conversation with another user.

### Request

```http
POST /api/conversations
Authorization: Bearer <token>
Content-Type: application/json
```

### Body

```json
{
  "userId": "665f0c2a9b1e4a0012ab34cd"
}
```

### Fields

| Field    | Type   | Required | Description                                 |
| -------- | ------ | -------- | ------------------------------------------- |
| `userId` | string | Yes      | ID of the user to start a conversation with |

The user ID can be obtained from `/users/search`.

---

## GET /conversations/{id}/messages

Get the message history of a conversation.

The endpoint supports pagination so that older messages can be loaded when needed.

### Request

```http
GET /api/conversations/{id}/messages
Authorization: Bearer <token>
```

### Path Parameters

| Parameter | Type   | Required | Description     |
| --------- | ------ | -------- | --------------- |
| `id`      | string | Yes      | Conversation ID |

### Query Parameters

| Parameter | Type    | Required | Description                                           |
| --------- | ------- | -------- | ----------------------------------------------------- |
| `limit`   | integer | No       | Maximum number of messages to return                  |
| `before`  | string  | No       | Cursor for loading messages before a specific message |

### Example

```text
GET /api/conversations/{id}/messages?limit=50
```

To load older messages:

```text
GET /api/conversations/{id}/messages?limit=50&before={messageId}
```

---

# Groups

Groups support multiple participants and admin management.

The creator of a group becomes an admin. A group requires at least three members in total.

## POST /conversations/group

Create a new group conversation.

### Request

```http
POST /api/conversations/group
Authorization: Bearer <token>
Content-Type: application/json
```

### Body

```json
{
  "name": "Project Team",
  "participantIds": ["USER_ID_1", "USER_ID_2"]
}
```

### Fields

| Field            | Type     | Required | Description                                        |
| ---------------- | -------- | -------- | -------------------------------------------------- |
| `name`           | string   | Yes      | Group name                                         |
| `participantIds` | string[] | Yes      | IDs of the members to add besides the current user |

The current user is automatically included in the group.

Since a group needs at least three members, at least two additional participants are required when creating a group.

---

## POST /conversations/{id}/participants

Add one or more members to a group.

Only group admins can add members.

### Request

```http
POST /api/conversations/{id}/participants
Authorization: Bearer <token>
Content-Type: application/json
```

### Body

```json
{
  "userIds": ["USER_ID_1", "USER_ID_2"]
}
```

### Fields

| Field     | Type     | Required | Description                  |
| --------- | -------- | -------- | ---------------------------- |
| `id`      | string   | Yes      | Group conversation ID        |
| `userIds` | string[] | Yes      | User IDs to add to the group |

---

## DELETE /conversations/{id}/participants/{userId}

Remove a member from a group or leave a group.

Only admins can remove other members.

A member can leave the group by using their own user ID.

### Request

```http
DELETE /api/conversations/{id}/participants/{userId}
Authorization: Bearer <token>
```

### Path Parameters

| Parameter | Type   | Required | Description                                                   |
| --------- | ------ | -------- | ------------------------------------------------------------- |
| `id`      | string | Yes      | Group conversation ID                                         |
| `userId`  | string | Yes      | Member to remove, or the current user's ID to leave the group |

---

## POST /conversations/{id}/admins

Promote an existing group member to admin.

Only admins can perform this action.

### Request

```http
POST /api/conversations/{id}/admins
Authorization: Bearer <token>
Content-Type: application/json
```

### Body

```json
{
  "userId": "USER_ID"
}
```

---

## PATCH /conversations/{id}

Rename a group.

Only group admins can rename a group.

### Request

```http
PATCH /api/conversations/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

### Body

```json
{
  "name": "Renamed Team"
}
```

### Fields

| Field  | Type   | Required | Description           |
| ------ | ------ | -------- | --------------------- |
| `id`   | string | Yes      | Group conversation ID |
| `name` | string | Yes      | New group name        |

---

# Messages

## POST /messages

Send a message to a direct or group conversation.

### Request

```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json
```

### Body

```json
{
  "conversationId": "CONVERSATION_ID",
  "text": "Hello!"
}
```

### Fields

| Field            | Type   | Required | Description            |
| ---------------- | ------ | -------- | ---------------------- |
| `conversationId` | string | Yes      | Target conversation ID |
| `text`           | string | Yes      | Message text           |

The client should prevent empty messages from being sent.

---

# WebSocket

Uses Socket.io for real-time messaging.

Connect to the server root, not the `/api` REST base URL.

### Connection

```js
const socket = io("https://frontend-task-chatapp.onrender.com", {
  auth: {
    token,
  },
});
```

The JWT used for REST authentication is passed through the Socket.io handshake.

---

## Client → Server

### `message:send`

Send a message through the WebSocket.

```json
{
  "conversationId": "CONVERSATION_ID",
  "text": "Hello!"
}
```

An optional Socket.io acknowledgement callback can also be provided.

Example:

```js
socket.emit(
  "message:send",
  {
    conversationId,
    text,
  },
  (response) => {
    // Optional acknowledgement
  },
);
```

---

## Server → Client

### `message:new`

Emitted when a new message arrives.

This event is used by the client to update the conversation in real time without requiring a page refresh.

---

### `conversation:updated`

Emitted when a group conversation changes.

This event can be triggered when a group is created, renamed, or when its members or admins are changed.

---

# Request Models

## LoginRequest

```json
{
  "phone": "+15551234567",
  "name": "Ada Lovelace"
}
```

## StartConversationRequest

```json
{
  "userId": "665f0c2a9b1e4a0012ab34cd"
}
```

## SendMessageRequest

```json
{
  "conversationId": "CONVERSATION_ID",
  "text": "Hello!"
}
```

## CreateGroupRequest

```json
{
  "name": "Project Team",
  "participantIds": ["USER_ID_1", "USER_ID_2"]
}
```

## AddParticipantsRequest

```json
{
  "userIds": ["USER_ID_1", "USER_ID_2"]
}
```

## PromoteRequest

```json
{
  "userId": "USER_ID"
}
```

## RenameGroupRequest

```json
{
  "name": "Renamed Team"
}
```

---

# Endpoint Summary

| Method | Endpoint                                    | Purpose                             |
| ------ | ------------------------------------------- | ----------------------------------- |
| POST   | `/auth/login`                               | Login or register a user            |
| GET    | `/auth/me`                                  | Get the current user                |
| GET    | `/users/search`                             | Search users                        |
| GET    | `/conversations`                            | List conversations                  |
| POST   | `/conversations`                            | Start or open a direct conversation |
| GET    | `/conversations/{id}/messages`              | Get message history                 |
| POST   | `/conversations/group`                      | Create a group                      |
| POST   | `/conversations/{id}/participants`          | Add group members                   |
| DELETE | `/conversations/{id}/participants/{userId}` | Remove or leave a group             |
| POST   | `/conversations/{id}/admins`                | Promote a member to admin           |
| PATCH  | `/conversations/{id}`                       | Rename a group                      |
| POST   | `/messages`                                 | Send a message                      |
