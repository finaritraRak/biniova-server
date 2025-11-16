// api/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const contactRouter = require('./contact');
const blogPostsRouter = require('./blog/posts');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true }));
app.use(bodyParser.json({ limit: '1mb' }));

// mount routes under /api when running locally
app.use('/api/contact', contactRouter);
app.use('/api/blog/posts', blogPostsRouter);

// root
app.get('/', (req, res) => res.send('Server API running'));

// If running as server (dev)
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on ${port}`));
}

// export for serverless / Vercel
module.exports = app;
