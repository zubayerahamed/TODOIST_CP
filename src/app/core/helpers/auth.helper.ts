import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../models/jwtpayloads.model';

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

  static getJwtPayloads(): JwtPayload | null {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return null;
    }
    return jwtDecode<JwtPayload>(accessToken);
  }

  static loadWorkspace(){
    const workspaceName = this.getJwtPayloads()?.workspaceName?? "";
    sessionStorage.setItem("workspaceName", workspaceName);
  }
}
