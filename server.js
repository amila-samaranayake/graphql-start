const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios')
const app = express();


const UserList = [{
    "id": 1,
    "name": "Estevan Ewence",
    "age": 25,
    "college": "Nolan and Sons"
  }, {
    "id": 2,
    "name": "Jesse Wade",
    "age": 30,
    "college": "Davis, Erdman and Maggio"
  }, {
    "id": 3,
    "name": "Aeriell Middup",
    "age": 27,
    "college": "Russel, Kirlin and Kilback"
  }, {
    "id": 4,
    "name": "Paxon Crady",
    "age": 4,
    "college": "Barrows-Pfeffer"
  }]

const schema = buildSchema(`
    type User {
        name: String
        age: Int
        college: String
    }

    type Todo {
      userId: Int
      id: Int
      title: String 
      completed: Boolean
    }

    type Query {
        hello: String
        getUser (id: Int!): User
        getUsers: [User]
        getTodos: [Todo]
    }

    input UserInput {
      name: String!,
      age: Int!,
      college: String!
    }

    type Mutation {
      createUser (user: UserInput): User
    }
`);

const root = {
    hello: () => { return "Hello World!" },

    getUser: (args) => {
        return UserList.find(user => user.id === args.id);
    },
    
    getUsers: () => {
        return UserList
    },

    createUser: (args) => {
      UserList.push({
        id: UserList.length + 1,
        name: args.user.name,
        age: args.user.age,
        college: args.user.college,
      })
      return args.user;
    },

    getTodos: async () => {
      let rst = await axios.get('https://jsonplaceholder.typicode.com/todos')
      return rst.data
    }
}

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root,
}));
app.listen(8000, () => console.log('Server is running at http://localhost:8000'));