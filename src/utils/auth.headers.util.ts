export class AuthHeaderUtils {
  static extractTokenFromHeader(headerAuthorization?: string) {
    const [type, token] = headerAuthorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
