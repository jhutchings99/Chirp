# Chirp a Music Social media app
## Resource:
**Music Post**

Attributes:
- Description (string)
- Music (link)
- Likes ()
-Tags ()

User Attributes:
- Profile Picture (image)
- Username / rap name (string)
- Email (string)
- Password (string)

## Schema
Users
    id
    first name
    last name
    email
    username
    password
    *pofile picture

Post
    id
    message
    embeded link
    comments
    likes

comment
    id
    message

## REST ENDPOINTS

Name                           | Method | Path
-------------------------------|--------|------------------
Get all Posts                  | GET    | /chirp
Get all Comments on a post     | GET    | /chirp/comment/*\<id\>*
Get a Post                     | GET    | /chirp/*\<id\>*
Create a Post                  | POST   | /chirp
Create a Comment               | POST   | /comments
Delete Post                    | DELETE | /chirp/*\<id\>*
Delete comment                 | DELETE | /comment/*\<id\>*
Create a session (Login Auth)  | POST   | /sessions
Delete a session (Logout)      | DELETE | /sessions
Create a user                  | POST   | /users
Create a user                  | GET    | /users/*\<id\>*
Change users Password          | PUT    | /users/*\<id\>*

## Encryption type
 - bcrypt

