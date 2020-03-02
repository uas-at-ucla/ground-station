export const transmit = (msg: string, data?: any) => ({
  type: "TRANSMIT" as const,
  payload: data !== undefined ? { msg: msg, data: data } : { msg: msg }
});
