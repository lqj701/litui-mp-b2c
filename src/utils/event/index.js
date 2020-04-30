class Event {

  constructor() {
    this.events = new Map()
  }

  on(eventName, callback, context) {
    let events = this.events
    const event = eventName

    if (!callback) {
      return
    }

    events.has(event)
      ? events.set(event, [
        ...events.get(event),
        {
          callback,
          context
        }])
      : events.set(event, [{
        callback,
        context
      }])
  }

  off(eventName) {
    this.events.delete(eventName)
  }

  trigger(eventName, ...args) {
    let events = this.events
    const event = events.get(eventName)

    event && event.forEach(i => {
      const context = i.context || null
      i.callback.apply(context, args)
    })
  }

}

export default Event