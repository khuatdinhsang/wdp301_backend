export default class ResponseHelper {
  static response = (
    statusCode: number,
    subject: string,
    content: string,
    data: any,
    field?: string,
  ) => {
    return {
      statusCode: statusCode,
      message: field
        ? [content + '.' + field + '.' + subject]
        : [content + '.' + subject],
      data: data,
    };
  };

  static responseDto = (subject: string, content: string, field?: string) => {
    return field
      ? content + '.' + field + '.' + subject
      : content + '.' + subject;
  };
}