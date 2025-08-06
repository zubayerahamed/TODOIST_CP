export class AuthHelper {
  private static readonly STORAGE_KEY = 'currentUser';

  static setAuthData(accessToken: string, refreshToken: string): void {
    const data = {
      accessToken,
      refreshToken,
    };
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  static getAccessToken(): string | null {
    const user = this.getAuthData();
    return user?.accessToken || null;
  }

  static getRefreshToken(): string | null {
    const user = this.getAuthData();
    return user?.refreshToken || null;
  }

  static clearAuthData(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  static getAuthData(): { accessToken: string; refreshToken: string } | null {
    const raw = sessionStorage.getItem(this.STORAGE_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
