const User = {
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
};

export default User;
