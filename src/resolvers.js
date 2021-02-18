const bcrypt = require('bcryptjs');

const resolvers =  {
    Query: {
        listing: (_,__,context) => {
            return context.prisma.todo.findMany()
        },
        me: (_,__, context ) => {
            if(!context.session.userId){
                return null;
            }
            return context.prisma.user.findUnique({ where: { id: context.session.userId }})
        }
    },
    Mutation: {
        addTodo: async(_, { content }, context ) => {
            if(!context.session.userId){
                return null;
            }
            const newTodo = await context.prisma.todo.create({
                data: {
                    content,
                    user: { connect: { id: context.session.userId } },
                }
            })
            console.log(newTodo)
            return newTodo
        },
        register: async(_, { username, email, password }, context ) => {
            const hashedPassword = await bcrypt.hash(password, 10) 
            const newUser = await context.prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword
                }
            })
            return newUser
        },
        login: async(_, { email, password }, context ) => {
            const user = await context.prisma.user.findUnique({ where: { email }})
            if(!user){
                return null
            }

            const valid = await bcrypt.compare(password, user.password)
            if(!valid){
                return null
            }

            context.session.userId = user.id;
            return user
        }
    },
    Todo: {
        user: (parent, _, context) => {
            console.log(parent.id)
            return context.prisma.todo.findUnique({ where: { id: parent.id } }).user()
     }
    }
}

module.exports = {
    resolvers
}