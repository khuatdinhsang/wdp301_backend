/* eslint-disable prettier/prettier */
export type JwtPayload = {
    id: string,
    fullName: string
}
export type Tokens = {
    accessToken: string,
    refreshToken: string
}
export type JwtDecode = {
    id: number;
    fullName: string;
    iat: number;
    exp: number;
};