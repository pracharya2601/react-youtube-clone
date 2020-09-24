const express = require('express');
const bodyParser = require('body-parser');

//import from router
const userRoutes = require('./routes/user_routes');
const messageRoutes = require('./routes/message_routes');

const app = express();
const PORT = 4000;

app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
