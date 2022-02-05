#### tweety-backend
# RESTful API for tweety

## Database
Hosted on MongoDB.

## Authentication
Authentication is implemented with Passport JWT.  
Passwords are encrypted with bcrypt. Upon login or signup a JWT token is issue using RS256 algorythm and send to the client via HTTPOnly Cookie.

## External APIs
Imgur API is used to store images.

## Environmental variables needed to set up
MONGODB_URI=database link  
ORIGIN_URL=frontend domain for CORS origin  
IMGUR_ACCESS_TOKEN=token needeed to access the imgur API for image upload  
PRIVATE_KEY=key used to encrypt and sign a jwt token  
PUBLIC_KEY=key used to decrypt a JWT token  
PORT=port used for express server  

## General info
Served created with express.  
Requests handle multipart/form-data using formidable  
Only requests for user private information need authentication  
API temporally hosted on http://tweety-backend.herokuapp.com/

## RESPONSES


    200 : OK
    201 : Created
    400 : Bad request
    404 : Not found
    500 : Server error

## Auth related requests

`POST /auth/signup/`

Creates a new user, sets the JWT cookie and return the new user

---
    
`POST /auth/login/`

Sets the JWT cookie and return the new user

---

`POST /auth/logout/`

Erases the JWT token cookie on the client

---

`GET /auth/checkifloggedin/`

Returns false or the logged user

---

## User related requests

`GET /user/:link`

Returns the user if the link exists

---
  

`GET /user/:link/posts`

Returns an array of the user posts if the link exists

---
  
`GET /user/:link/replies`

Returns an array of posts with the user replies if the link exists

---

`GET /user/:link/followers`

Returns an array with the user's followers if the link exists

---

`GET /user/:link/follows`

Returns an array with the user's follows if the link exists

---

`GET /user/:search/search`

Returns an array of users who's link match the search criteria

---

`PUT /user/:link/follow`


##### Needs authentication  
Follows or unfollows a user

---

`PUT /user/update`


##### Needs authentication
Updates your profile's username, header image, profile picture or and bio and returns your new edited user

---

## Post related requests

`GET /feed/:page`


##### Needs authentication
Returns an array of posts of the users you followed with pagination

---

`GET /post/:id`

Returns the posts if the id exists

---

`GET /post/:id/parentreplies`

Returns an array of posts of the path to your posts  
The id post replied to 1 and 1 replied to 2. Returns [2, 1]

---

`POST /post/`


##### Needs authentication
Create a new post or reply created by your user

---

`PUT /:id/like`

##### Needs authentication
Likes a post and returns an array with all the current likes

---

`DELETE /:id`

##### Needs authentication
Given you are the author of the post it deletes it if it has no replies, otherwise it adds a deleted flag and changes it's content to deleted. If you delete a deleted post reply with no other replies it also deletes the post you replied to. Returns the deleted post
