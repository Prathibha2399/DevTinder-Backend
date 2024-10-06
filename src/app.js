// creating a server

const express = require('express');

const app = express();

/* app.use(function (req, res) {
  // or can use arrow function ((req,res) => {})
  res.send('Hello Everyone!....');                   // hardcoded, whatever req it might be we rae sending hello for all request.
}); */

app.use("/test", (req, res) => {
    res.send("Hello Everyone! from test url");
})

app.use("/", (req, res) => {
    res.send("Hello Everyone! from homepage");
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  console.log('Hello');
});
