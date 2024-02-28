import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = error.message;
    let additionalInfo: any = null;

    if (error instanceof HttpException) {
      status = error.getStatus();
      message = error.getResponse();
    }

    if (error instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Database query failed';
      additionalInfo = error.driverError.detail;
    }

    response.status(status).json({
      statusCode: status,
      isSuccess: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
      additionalInfo,
    });
  }
}
