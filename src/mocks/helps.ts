import { createHmac } from 'crypto';
import Buffer from 'buffer';

export const toHaversine = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
};

export const HMACSHA256 = async (body: string) => {
  const secret = 'secret_key';
  const enc = new TextEncoder();
  const algorithm = { name: 'HMAC', hash: 'SHA-256' };

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    algorithm,
    false,
    ['sign', 'verify']
  );

  const signature = await crypto.subtle.sign(
    algorithm.name,
    key,
    enc.encode(body)
  );

  const hashArray = Array.from(new Uint8Array(signature));

  const digest = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return digest;
};

export const createJWTToken = async (
  id: string,
  email: string,
  nickname: string
) => {
  const base64 = (stringified: string) => {
    const base64Encoded = Buffer.Buffer.from(stringified).toString('base64');
    // 문자열화 된 JSON 을 Base64 로 인코딩
    const paddingRemoved = base64Encoded.replaceAll('=', '');
    // Base 64 의 Padding(= or ==) 을 제거

    return paddingRemoved;
  };

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const date = Math.floor(Date.now() / 1000);

  const payload = {
    sub: email,
    iss: nickname,
    jti: id,
    iat: date,
    exp: date + 1000000000
  };

  const encodedHeader = base64(JSON.stringify(header));

  const encodedPayload = base64(JSON.stringify(payload));

  const signature = await HMACSHA256(`${encodedHeader}.${encodedPayload}`);

  const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;

  return jwt;
};

const validateDate = (date: string) => {
  const dDate = new Date(date);
  return dDate instanceof Date && !isNaN(Number(dDate));
};

export const getDateTerm = (date1: string, date2: string) => {
  if (!validateDate(date1) || !validateDate(date2)) return 0;

  const dateTime1 = Number(new Date(date1));
  const dateTime2 = Number(new Date(date2));

  const timeDiff = Math.abs(dateTime1 - dateTime2);
  const dateDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return dateDiff;
};
