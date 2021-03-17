import { GraphQLServer } from "graphql-yoga";

// Scaler-type in graphQL -  String, Boolean, Int, Float, ID

// Type-definations (schema)

const users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
  },
  {
    id: "2",
    name: "Shri",
    email: "shrinivasshah@gmail.com",
    age: 25,
  },
  {
    id: "3",
    name: "Vandana",
    email: "vandanakunaritiwari@gmail.com",
    age: 26,
  },
];

const posts = [
  {
    id: "123567",
    title: "Hey guys",
    body: "hey guys my name is barry allen and i am fastest man alive",
    published: false,
    author: "2",
  },
  {
    id: "123568",
    title: "Avicii",
    body: "Fading silhoutte",
    published: true,
    author: "3",
  },
  {
    id: "123569",
    title: "Weekend",
    body: "Save your tears",
    published: false,
    author: "1",
  },
];

const comments = [
  {
    id: "12",
    text: "Hey this is nice",
    author: "2",
    post: "123567",
  },
  {
    id: "13",
    text: "Good job bro",
    author: "1",
    post: "123568",
  },
  {
    id: "14",
    text: "Very Good",
    author: "2",
    post: "123567",
  },
  {
    id: "15",
    text: "Amazing yo",
    author: "3",
    post: "123569",
  },
];

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User
        post: Post!
        comments(id: ID): [Comment!]!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

// Resolvers

const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      return args.query
        ? users.filter((item) =>
            item.name
              .toLocaleLowerCase()
              .includes(args.query.toLocaleLowerCase())
          )
        : users;
    },
    posts(parent, args, ctx, info) {
      return args.query
        ? posts.filter((item) => {
            return (
              item.title
                .toLocaleLowerCase()
                .includes(args.query.toLocaleLowerCase()) ||
              item.body
                .toLocaleLowerCase()
                .includes(args.query.toLocaleLowerCase())
            );
          })
        : posts;
    },
    me() {
      return {
        id: "121156",
        name: "Shri",
        email: "shrinivasshah05@gmail.com",
        age: 26,
      };
    },
    post() {
      return {
        id: "123567",
        title: "Hey guys",
        body: "hey guys my name is barry allen and i am fastest man alive",
        published: false,
      };
    },
    comments(parent, args, ctx, info) {
      return args.id
        ? comments.filter((comment) => {
            return comment.id === args.id;
          })
        : comments;
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, agrs, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server has started");
});
