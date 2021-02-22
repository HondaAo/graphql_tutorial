const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express');
const { ApolloServer } = require('apollo-server-express')
const session = require('express-session')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
        }
    }
 })
  
const app = express();

app.use(
    session({
        name: "todo",
        secret: "todo",
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 60 * 24 * 7 * 365, 
        }
    })
)
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
