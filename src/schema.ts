import {
  objectType,
  interfaceType,
  queryType,
  stringArg,
  makeSchema,
  enumType,
  subscriptionField,
  mutationField
} from "nexus";
const path = require("path");

const Post = objectType({
  name: "Post",
  definition(t) {
    t.id("id");
    t.string("author");
    t.string("content");
  }
});

const Query = queryType({
  definition(t) {
    //Returns the first post
    t.field("post", {
      type: Post,
      resolve: async (_, args, ctx) => {
        return (await ctx.prisma.posts({
          first: 1
        }))[0];
      }
    });
    //Returns all posts
    t.field("posts", {
      type: Post,
      list: [false],
      args: {
        author: stringArg(),
        content: stringArg()
      },
      resolve: async (_, args, ctx) => {
        let result = await ctx.prisma.posts();
        return result;
      }
    });
  }
});

//Create post mutation
const CreatePost = mutationField("createPost", {
  type: Post,
  args: {
    author: stringArg({ required: true }),
    content: stringArg({ required: true })
  },
  resolve: async (root, args, context, info) => {
    try {
      const result = await context.prisma.createPost({
        author: args.author,
        content: args.content
      });
      return result;
    } catch (e) {
      console.log(e);
    }
  }
});

//Adds GraphQL Nexus types to the schema
export const schema = makeSchema({
  types: [Post, Query, CreatePost],
  typegenAutoConfig: {
    sources: [
      { source: path.join(__dirname, "./context.ts"), alias: "context" }
    ],
    contextType: "context.Context"
  },
  outputs: {
    schema: path.join(__dirname, "./generated-schema.graphql"),
    typegen: path.join(__dirname, "./generated-types.d.ts")
  }
});
