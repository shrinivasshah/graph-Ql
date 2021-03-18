const Mutation = {
  // create user
  createUser(parent, args, { db: { users } }, info) {
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
  deleteUser(parent, args, { db: { users, posts, comments } }, info) {
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
  createPost(parent, args, { db: { users, posts } }, info) {
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
  deletePost(parent, args, { db: { posts, comments } }, info) {
    const postIndex = posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post not found.");
    }

    const deletedPosts = posts.splice(postIndex, 1);
    comments = comments.filter((comment) => comment.post !== args.id);
    return deletedPosts[0];
  },

  // create comment
  createComment(parent, args, { db: { users, posts, comments } }, info) {
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
  deleteComment(parent, args, { db: { comments } }, info) {
    const commentIndex = comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    const deletedComment = comments.splice(commentIndex, 1);

    return deletedComment[0];
  },
};

export default Mutation;
