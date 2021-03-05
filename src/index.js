const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express');
const { ApolloServer, PubSub } = require('apollo-server-express')
const session = require('express-session')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')
const http = require('http')
const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubsub
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

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 4000 }, () => {
    console.log(`server ready at http://localhost:${4000}${server.graphqlPath}`)
    console.log(`Subscriptions ready at ws://localhost:${4000}${server.subscriptionsPath}`)
})
