/**
 * Types d'authentification — SWEET MED
 * Isolés ici pour faciliter la migration vers Netlify + DB.
 * Remplacer les implémentations localStorage des services sans toucher ces types.
 */

// Rôles disponibles dans l'application
export type Role = 'user' | 'admin'

// Compte utilisateur stocké en localStorage (future: table users en DB)
export interface Compte {
  id: string                // crypto.randomUUID()
  email: string             // lowercase, trimmed
  prenom: string
  passwordHash: string      // SHA-256 hex via Web Crypto API
  role: Role
  dateCreation: string      // ISO 8601
}

// Session active persistée en localStorage (future: JWT côté serveur)
export interface Session {
  userId: string
  role: Role
  email: string
  prenom: string
  expiry: string            // ISO 8601 — 30 jours depuis la connexion
}

// Payload formulaire connexion
export interface LoginPayload {
  email: string
  password: string
}

// Payload formulaire inscription
export interface RegisterPayload {
  email: string
  password: string
  prenom: string
}

// Résultat typé — évite les try/catch dans les stores
export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }
