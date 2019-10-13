## 🛑 express-require-headers 🛑 
This small middleware requires certain headers to be present on a request.
If the headers are not present - the request will immediately fail with a certain (default or defined) status and message.

A common usecase for this would be server-to-server integration, when
one server requires certain predefined TOKEN headers to be present on every request from another server.

## Usage
The middleware is created by calling the `requireHeaders` function, with
the required headers as the first argument.
Other optional arguments are: 
`statusCode` - for the status code that will be returned when a required header is not present

`responseMessage` - the message that will be sent with every missing header.

An error response would look like this:
```json
{
  "errors": 
    {
      "Token": "Value 456 incorrect"
    }
}
```

## Usage
```js
        const app = express();
        app.use(requireHeaders({Token: "123"}));
```

That's it! If the request will not contain a header `Token` with the value `123` - the request will fail.
