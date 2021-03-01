const { gql } = require('apollo-server-express')

const typeDefs = gql`

 type Query {  
    listing: [Todo!]!
    getTodo(id: Int!): Todo!
    me: User
    user: User
}

type Mutation {
    addTodo(content: String!): Todo
    updateTodo(id: Int!, content: String!): Todo
    deleteTodo(id: Int!): String
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
}

type Todo {
    id: ID!
    content: String!
    createdAt: String!
    updatedAt: String
    isDone: Boolean!
    userId: Int!
    user: User
}

type User {
    id: ID!
    username: String!,
    email: String!
    password: String!
    todos: [Todo!]!
}
`

module.exports = {
    typeDefs
}
