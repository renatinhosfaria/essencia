export class BaseResponseDto<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  timestamp: string;

  constructor(partial: Partial<BaseResponseDto<T>>) {
    this.success = partial.success ?? true;
    this.data = partial.data;
    this.message = partial.message;
    this.errors = partial.errors;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message?: string): BaseResponseDto<T> {
    return new BaseResponseDto({ success: true, data, message });
  }

  static error<T>(message: string, errors?: string[]): BaseResponseDto<T> {
    return new BaseResponseDto({ success: false, message, errors });
  }
}
