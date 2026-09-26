export type IdentityStatus = "not_submitted" | "pending" | "verified";

export interface SupabaseAuthUser {
  id: string;
  email: string;
  email_confirmed_at: string | null;
}

export interface UserProfile {
  id: string;
  is_email_verified: boolean;
  identity_status: IdentityStatus;
  identity_document_path: string | null;
  updated_at: string;
}

export interface IdentityDocumentUpload {
  bucket: "identity-docs";
  path: string;
}

export interface AccountVerificationApi {
  getUser(): Promise<SupabaseAuthUser | null>;
  getProfile(userId: string): Promise<UserProfile | null>;
  resendVerificationEmail(email: string): Promise<void>;
  submitIdentityDocument(userId: string, file: File): Promise<IdentityDocumentUpload>;
}