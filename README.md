# TinyApp Project2

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of urls page"](https://github.com/hiba02/tinyapp2/blob/master/doc/urls-index.png)
!["Screenshot of urls/new page"](https://github.com/hiba02/tinyapp2/blob/master/doc/url-new.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override
- uuid

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## nodemon install and setup

```
npm install --save-dev nodemon
```

## Run your application with the following command

```
./node_modules/.bin/nodemon -L express_server.js
```

## Creating a Start Script

package.json

```js
"scripts": {
  "start": "./node_modules/.bin/nodemon -L express_server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## start the server by running npm start

```
npm start
```
