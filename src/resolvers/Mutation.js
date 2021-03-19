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

  // update user
  updateUser(parent, args, { db: { users } }, info) {
    const { id, data } = args;
    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new Error("No users found with this id");
    }

    if (typeof data.email === "string") {
      const emailTaken = users.some((user) => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email Taken");
      }

      user.email = data.email;
    }
    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
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

  // update post
  updatePost(parents, args, { db: { posts } }, info) {
    const { id, data } = args;
    const post = posts.find((post) => post.id === id);
    if (!post) {
      throw new Error("No post found with that ID");
    }
    if (typeof data.title === "string") {
      post.title = data.title;
    }
    if (typeof data.body === "string") {
      post.body = data.body;
    }
    if (typeof data.published === "boolean") {
      post.published = data.published;
    }
    return post;
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

  //update comment
  updateComment(parent, args, { db: { comments } }, info) {
    const { id, data } = args;
    const comment = comments.find((comment) => comment.id === id);
    if (!comment) {
      throw new Error("No comment found with the given ID");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    return comment;
  },
};

export default Mutation;
