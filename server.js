import express from 'express';
import expressGraphQL from 'express-graphql';
import schema from './schema';

const app = express();

// creating the entry point
app.use(
  '/graphql',
  expressGraphQL({
    schema: schema,
    graphiql: true
  })
);

app.listen(4000, () => {
  console.log('Server running on port 4000..');
});
