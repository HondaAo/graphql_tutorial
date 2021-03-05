function newTodoSubscribe(_, __, context) {
    return context.pubsub.asyncIterator("newTodo")
  }
  
  const newTodo = {
    subscribe: newTodoSubscribe,
    resolve: payload => {
      return payload
    },
  }
  
module.exports = {
    newTodo,
}