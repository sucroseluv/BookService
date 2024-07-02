import { StatusCodes, getReasonPhrase } from "http-status-codes";

type ErrorResponse = {
  status: number;
  message: string;
  data?: any;
  _stack?: any;
};

export class Exception extends Error {
  readonly status: number;
  readonly message: string;
  readonly data: any;

  constructor(
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    message = getReasonPhrase(status),
    data: any = null
  ) {
    super();
    this.status = status;
    this.message = message;
    this.data = data;
  }

  json() {
    const error: ErrorResponse = { status: this.status, message: this.message };
    if (this.data) error.data = this.data;
    if (process.env.NODE_ENV === "development") error._stack = this.stack;
    return error;
  }
}
