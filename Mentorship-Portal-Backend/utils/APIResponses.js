class APIResponse {
  constructor(
    status_code = 200,
    success = "true",
    message = "success",
    result = []
  ) {
    this.status_code = status_code;
    this.success = success;
    this.message = message;
    this.result = result;
  }
}

class ErrResponse {
  constructor(status_code = 400, status = "false", message = "fail") {
    this.status_code = status_code;
    this.success = status;
    this.message = message;
  }
}

module.exports = { APIResponse, ErrResponse };
