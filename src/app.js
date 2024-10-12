// creating a server

const express = require('express');

const app = express();

/* app.use(function (req, res) {
  // or can use arrow function ((req,res) => {})
  res.send('Hello Everyone!....');                   // hardcoded, whatever req it might be we rae sending hello for all request.
}); */

/* app.use("/", (req, res) => {
    res.send("Hello Everyone! from homepage");
})

app.use("/test", (req, res) => {
    res.send("Hello Everyone! from test url");
})

app.use("/test/xyz", (req, res) => {
  res.send("Hello Everyone! from test xyz url");
}) */

app.get('/test/xyz', (req, res) => {
  res.send('Hello Everyone! from get method test xyz url');
});

app.get('/test', (req, res) => {
  res.send('Hello Everyone! from get method test url');
});

app.get('/hello', (req, res) => {
  console.log(req.query);
  res.send('Hello Everyone! from get method hello url and query parameter');
});

app.get('/hello/:userId/:name/:password', (req, res) => {
  console.log(req.params);
  console.log(req.query);
  res.send(
    'Hello Everyone! from get method hello url and params and query parameters'
  );
});

app.get('/hello/:userId/:name/:password', (req, res) => {
  console.log(req.params);
  res.send('Hello Everyone! from get method hello url and params');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log('Hello');
});
