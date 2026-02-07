import 'dotenv/config';

export const cfg = {
  TWELVE_KEY      : process.env.TWELVE_KEY,
  TWELVE_WS_URL   : process.env.TWELVE_WS_URL,
  TWELVE_REST_URL : process.env.TWELVE_REST_URL,
  SYMBOLS         : process.env.SYMBOLS.split(','),
  VOLUME_MIN      : Number(process.env.VOLUME_MIN),
  PRICE_MIN       : Number(process.env.PRICE_MIN),
  PE_MAX          : Number(process.env.PE_MAX),
  POLL_INTERVAL   : Number(process.env.POLL_INTERVAL),
};
