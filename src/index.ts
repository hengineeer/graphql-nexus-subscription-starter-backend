import { GraphQLServer } from 'graphql-yoga'
import { schema } from './schema';
import { getContext } from './context';

const server = new GraphQLServer({
  schema: schema,
  context: getContext,
})
server.start(() => console.log('Server is running on http://localhost:4000'))
