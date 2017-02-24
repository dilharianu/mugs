# Mount on API

Add to the project:

```
npm i --save mugs
```

Then mount the application:

```javascript
const express = require('express');
const mugs = require('mugs');

const configuration = {
	appName: 'My application'
};

const app = express();
app.use(mugs(configuration));
```

# Unit tests

```
npm test
```

# Configuration

- `appName`: the application name, shown in e-mail.
- `appUrl`: the root URL to the application, used to prefix the links sent in e-mails.
- `db`: mongo URI for the user database.
- `smtp`: smtps string for sending e-mails.
- `senderEmail`: e-mail to use as From in system e-mails.
- `secret`: secret used to issue and verify JWT tokens.
- `logoLink`: URL to logo displayed in template.
- `redirectConfirmUrl`: URL used for confirmation redirection. Will receive `success` query param, and `message` on failure.
- `port`: port to start the process on.

# User model

```javascript
{
	"id": MongoId,
	"email": String,
	"firstname": String,
	"lastname": String,
	"fullname": String,
	"password": String,
	"created": Date,
	"updated": Date,
	"confirmationToken": MongoId,
	"confirmed": Date,
	"resetPasswordToken": MongoId,
	"roles": [{ role: String, scope: String }],
	"data": {},
}
```

# Command line

You can sign a test user token with:

```bash
npm run sign -- [--secret <secret>] [--clean] [...roles]
```

Roles are space-separated roles on the `role@scope` form. `secret` is optional, and will default to `ssh`. The expiry period will be set to 7 days on creation. `clean` can be set to suppress adding default user roles.

# Endpoints

## User registration

Perform a new user registration. Will add the default roles to the user, and result in an unconfirmed user.

```
POST /register
```

### Params

| Parameter type | Name | Type | Details |
|---|---|---|---|
| Body | `email` | `string` (required) | The e-mail / username. |
| Body | `password` | `string` (required) | Password for authentication. |
| Body | `firstname` | `string` | Firstname of user. Do not combine with `fullname`. |
| Body | `lastname` | `string` | Lastname of user. Do not combine with `fullname`. |
| Body | `fullname` | `string` | Firstname and lastname. Do not combine with the former. |
| Body | `data` | `object` | Extra user data. |

### Response codes

| Code | Result |
|---|---|
| 200 | Successful registration |
| 400 | Bad request (wrong format of request payload) |
| 422 | Validation failure (missing required fields, etc. - details in `error`)

## Confirm registration

Given a valid `token`, will confirm the user.

```HTTP
GET /register/:token
```
### Params

| Parameter type | Name | Type |
|---|---|---|
| URL | `token` | `string` (required) |

### Response codes

- `200`: Confirmation successful
- `400`: Invalid token

### Success response

The request will succeed with a redirection to the `redirectConfirmUrl`, appending a query string `?success=true`.

### Failure response

The request will fail with a redirection to the `redirectConfirmUrl`, appending a query string `?success=false&message=[reason]`.

## `POST` /

Perform an administrative user creation. Can only be performed by an `admin@users`. Will add the default roles to the user, and result in a confirmed user. A role array can be added, but the user posting will need to be `admin` of each of the scopes in the array.

### Body

```javascript
{
	"email": { type: String, required: true },
	"password": { type: String, required: true },
	"firstname": String,
	"lastname": String,
	"data": {},
	"roles": [{
		role: { type: String, required: true },
		scope: { type: String, required: true },
	}],
}
```