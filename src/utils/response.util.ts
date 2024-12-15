export const createResponse = (
  status: number,
  message: string,
  payload: any = null,
) => {
  return {
    Status: status,
    Message: message,
    Payload: payload,
  };
};
