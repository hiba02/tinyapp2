# nodemon install and setup

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

5.6.20
Mistake: I forgot to add app.use(cookieParser());
