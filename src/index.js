const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express')

const typeDefs = gql`
 type Query {  
    listing: [Todo!]!
}

type Mutation {
    addTodo(content: String!): Todo!
}
type Todo {
    id: ID!
    content: String!
    createdAt: String!
    updatedAt: String
    isDone: Boolean!
}
`

const resolvers =  {
    Query: {
        listing: (_,__,context) => {
            return context.prisma.todo.findMany()
        }
    },
    Mutation: {
        addTodo: async(_, { content }, context ) => {
            const newTodo = await context.prisma.todo.create({
                data: {
                    content
                }
            })
            return newTodo
        }
    }  
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        prisma
    }
})
  
const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
