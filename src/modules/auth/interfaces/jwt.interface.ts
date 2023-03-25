export interface JwtPayloadI {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenI {
  access_token: string;
}
