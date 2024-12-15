import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    let payload = null;

    // Check if it's an HttpException (which includes validation, unauthorized, etc.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      // Get the error message or response payload (which might have detailed error info)
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'string') {
        message = errorResponse; // If it's a simple string, use it as the message
      } else if (typeof errorResponse === 'object') {
        message = errorResponse['error'] || message; // Use the standard error message
        if (Array.isArray(errorResponse['message'])) {
          // Join the validation error messages into a single string
          payload = errorResponse['message'].join(', ');
        }
      }
    } else {
      // For non-HttpException cases, log the full exception for debugging
      console.error('Unhandled exception:', exception);
      message = (exception as Error).message || message; // Get message if available
    }

    // Send the final response
    response.status(status).json({
      Status: status,
      Message: message,
      Payload: payload,
    });
  }
}
