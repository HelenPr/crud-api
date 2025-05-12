'npm i' - set up dependencies

'npm run start:dev' - start in dev mode
In console you will see a message:
Server running on port 3000
Running in: development

'npm run start:prod' - start in prod mode
In console you will see a message:
Server running on port 3000
Running in: production

'npm run test' - run tests
Results:
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        8.318 s

To test api manually with Postman run server and set up:

- Test: GET all users:
  Method: GET
  URL: http://localhost:3000/api/users
  Body: none
  Expected: Status code: 200 OK, Response: [] or a list of users

- Test: POST create a new user
  Method: POST
  URL: http://localhost:3000/api/users
  Headers: Content-Type: application/json
  Body: select 'raw' and 'JSON':
    {
      "username": "User",
      "age": 25,
      "hobbies": ["reading", "painting"]
    }
  Expected: Status code: 201 Created, Response: JSON with a new id and user data
  Copy the id from the response for future requests

- Test: GET user by ID
  Method: GET
  URL: http://localhost:3000/api/users/user-id
  Body: none
  Expected: Status code: 200 OK, Response: user object or ERROR status and message

- Test: PUT update user
  Method: PUT
  URL: http://localhost:3000/api/users/user-id
  Headers: Content-Type: application/json
  Body: select 'raw' and 'JSON':
    {
      "username": "Updated User",
      "age": 20,
      "hobbies": ["swimming"]
    }
  Expected: Status code: 200 OK, Response: updated user

- Test: DELETE user
  Method: DELETE
  URL: http://localhost:3000/api/users/user-id
  Body: none
  Expected: Status code: 204 No Content, Response: Empty response

- Test: 404 for Unknown Route
  Method: GET
  URL: http://localhost:3000/api/unknown-route
  Expected: Status code: 404 Not Found, Response: Route not found
