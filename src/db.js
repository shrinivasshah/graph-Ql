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
    email: "vandanakumaritiwari@gmail.com",
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

const db = { users, posts, comments };

export default db;
