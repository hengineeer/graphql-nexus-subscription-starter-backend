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

const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id", { description: "Unique identifier for the resource" });
    t.resolveType(() => null);
  }
});

const Post = objectType({
  name: "Post",
  definition(t) {
    t.implements(Node);
    t.id("id");
    t.string("author");
    t.string("content");
  }
});

const StatusEnum = enumType({
  name: "StatusEnum",
  members: ["ACTIVE", "DISABLED"]
});

const Query = queryType({
  definition(t) {
    t.field("post", {
      type: Post,
      args: {
        author: stringArg(),
        content: stringArg()
      },
      resolve: async (_, args, ctx) => {
        return (await ctx.prisma.posts({
          first: 1
        }))[0];
      }
    });
  }
});

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

export const schema = makeSchema({
  types: [Post, Node, Query, StatusEnum, CreatePost],
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
