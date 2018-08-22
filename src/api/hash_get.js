class HashGetHandler {
  constructor() {}

  async handle(event, context, cb) {
    if (!event.headers) {
      cb({ code: 403, message: "no headers" });
      return;
    }
  }
}
module.exports = HashGetHandler;
