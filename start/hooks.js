const { hooks } = require("@adonisjs/ignitor");

hooks.after.providersBooted(() => {
  const Exception = use("Exception");

  Exception.handle("InvalidJwtToken", async (_, { response }) => {
    return response.unauthorized({
      success: false,
      message: "JWT Not Provided or has expired",
    });
  });

  Exception.handle("HttpException", async (error, { response }) => {
    if (error.code === "E_ROUTE_NOT_FOUND") {
      return response.notFound({
        success: false,
        message: "Requested Route not found",
      });
    }
    return response.send({
      success: false,
      message: error.message,
    });
  });
});
