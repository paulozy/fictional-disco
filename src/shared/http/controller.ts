import 'express';
import { Request } from 'express';

export type HttpRequest = Request;

export interface HttpResponse<T = any> {
  statusCode: number;
  body: T;
}

export abstract class Controller {
  abstract handle(request: HttpRequest): Promise<HttpResponse>;

  protected ok<T>(body: T): HttpResponse<T> {
    return {
      statusCode: 200,
      body,
    };
  }

  protected created<T>(body: T): HttpResponse<T> {
    return {
      statusCode: 201,
      body,
    };
  }

  protected noContent(): HttpResponse<void> {
    return {
      statusCode: 204,
      body: undefined,
    };
  }

  protected badRequest(message: string): HttpResponse<{ error: string }> {
    return {
      statusCode: 400,
      body: { error: message },
    };
  }

  protected unauthorized(message: string = 'Unauthorized'): HttpResponse<{ error: string }> {
    return {
      statusCode: 401,
      body: { error: message },
    };
  }

  protected notFound(message: string = 'Not found'): HttpResponse<{ error: string }> {
    return {
      statusCode: 404,
      body: { error: message },
    };
  }

  protected internalServerError(message: string): HttpResponse<{ error: string }> {
    return {
      statusCode: 500,
      body: { error: message },
    };
  }
}
