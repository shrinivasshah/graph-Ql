const Query = {
  users(parent, args, { db: { users } }, info) {
    return args.query
      ? users.filter((item) =>
          item.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
        )
      : users;
  },
  posts(parent, args, { db: { posts } }, info) {
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
  comments(parent, args, { db: { comments } }, info) {
    return args.id
      ? comments.filter((comment) => {
          return comment.id === args.id;
        })
      : comments;
  },
};

export default Query;
