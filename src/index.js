import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
// Scaler-type in graphQL -  String, Boolean, Int, Float, ID

// Type-definations (schema)

let users = [
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

let posts = [
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
    author: "2",
  },
  {
    id: "123569",
    title: "Weekend",
    body: "Save your tears",
    published: false,
    author: "1",
  },
];

let comments = [
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

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput): Comment!
        deleteComment(id:ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int!
    }
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }
    input CreateCommentInput {
        author: ID!
        text: String!
        post: ID!
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

  Mutation: {
    // create user
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);
      return user;
    },

    // delete user
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("User Does not exist.");
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = posts.author === args.id;
        if (match) {
          comments = comments.filter((comment) => {
            return comment.post !== post.id;
          });
        }
        return !match;
      });
      comments = comments.filter((comment) => comment.author !== args.id);
      return deletedUsers[0];
    },
    // create post
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);

      if (!userExists) {
        throw new Error("User not Found");
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(post);

      return post;
    },

    // delete post
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error("Post not found.");
      }

      const deletedPosts = posts.splice(postIndex, 1);
      comments = comments.filter((comment) => comment.post !== args.id);
      return deletedPosts[0];
    },

    // create comment
    createComment(parent, args, ctx, info) {
      const userExist = users.some((user) => user.id === args.data.author);
      const postExist = posts.some(
        (post) => post.id === args.data.post && post.published
      );

      if (!userExist || !postExist) {
        throw new Error("Either user or post does not exist");
      }
      const comment = {
        id: uuidv4(),
        ...args.data,
      };
      comments.push(comment);
      return comment;
    },
    // delete comment
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error("Comment not found");
      }
      const deletedComment = comments.splice(commentIndex, 1);

      return deletedComment[0];
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
