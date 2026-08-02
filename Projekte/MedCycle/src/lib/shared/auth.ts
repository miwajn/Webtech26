import { Injectable } from '@angular/core';
import { User } from './interfaces/userInterface';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private storageKey = 'eingeloggterUser';

  // Wird nach erfolgreichem Login aufgerufen
  setUser(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  // Liefert den eingeloggten User zurück, oder null wenn niemand eingeloggt ist
  getUser(): User | null {
    const gespeichert = localStorage.getItem(this.storageKey);
    return gespeichert ? JSON.parse(gespeichert) : null;
  }

  // Wird beim Logout aufgerufen
  clearUser(): void {
    localStorage.removeItem(this.storageKey);
  }
}
