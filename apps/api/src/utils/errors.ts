export class ErrorWithStatus extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message);
    this.name = "UnexpectedInput";
    this.status = status;
  }
}

export class CredentialsError extends ErrorWithStatus {
  constructor(message?: string) {
    super(401, message);
  }
}

export class BadRequestError extends ErrorWithStatus {
  constructor(message?: string) {
    super(400, message);
  }
}
