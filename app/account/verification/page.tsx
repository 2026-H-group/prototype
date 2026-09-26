"use client";

import { useState } from "react";
import type { IdentityDocumentUpload, IdentityStatus, UserProfile } from "../../../types/user";

const mockAuthUser = {
  id: "mock-user-001",
  email: "user@example.com",
  email_confirmed_at: null,
};

const mockProfile: UserProfile = {
  id: mockAuthUser.id,
  is_email_verified: mockAuthUser.email_confirmed_at !== null,
  identity_status: "not_submitted",
  identity_document_path: null,
  updated_at: new Date(0).toISOString(),
};

const identityStatusContent: Record<IdentityStatus, { label: string; description: string }> = {
  not_submitted: { label: "未提出", description: "運転免許証、マイナンバーカードなどの画像を提出してください。" },
  pending: { label: "審査中", description: "身分証明書を受け付けました。審査結果をお待ちください。" },
  verified: { label: "確認済み", description: "本人確認が完了しました。ご利用ありがとうございます。" },
};

async function resendVerificationEmail(email: string): Promise<void> {
  void email;
  await new Promise((resolve) => window.setTimeout(resolve, 350));
}

async function submitIdentityDocument(userId: string, file: File): Promise<IdentityDocumentUpload> {
  void file;
  await new Promise((resolve) => window.setTimeout(resolve, 550));
  return { bucket: "identity-docs", path: `${userId}/mock-identity-document` };
}

export default function VerificationPage() {
  const [emailVerified, setEmailVerified] = useState(mockProfile.is_email_verified);
  const [identityStatus, setIdentityStatus] = useState<IdentityStatus>(mockProfile.identity_status);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleResend(): Promise<void> {
    await resendVerificationEmail(mockAuthUser.email);
    setMessage("確認メールを送信しました。受信トレイをご確認ください。");
  }

  async function handleSubmit(): Promise<void> {
    if (!selectedFile) {
      setMessage("提出する画像を選択してください。");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitIdentityDocument(mockAuthUser.id, selectedFile);
      setIdentityStatus("pending");
      setMessage("送信が完了しました。審査結果をお待ちください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <a href="/account/profile" aria-label="会員情報ページへ戻る">← 戻る</a>
      <p>ACCOUNT SECURITY</p>
      <h1>本人確認・アカウント認証</h1>
      <p>安全なお取引のため、メールアドレスの認証状況および本人確認状況をご確認いただけます。</p>

      <section aria-labelledby="email-auth-heading" aria-live="polite">
        <h2 id="email-auth-heading">メールアドレス認証（Supabase Auth）</h2>
        <p>{mockAuthUser.email}</p>
        <p>{emailVerified ? "認証済み（Verified）" : "未認証（Unverified）"}</p>
        {!emailVerified && <button onClick={() => void handleResend()} type="button">確認メールを再送する</button>}
      </section>

      <section aria-labelledby="identity-heading" aria-live="polite">
        <h2 id="identity-heading">本人確認（身分証提出）</h2>
        <p>{identityStatusContent[identityStatus].label}</p>
        <p>{identityStatusContent[identityStatus].description}</p>
        {identityStatus === "not_submitted" && (
          <>
            <label htmlFor="identity-document">身分証明書の画像（JPEG・PNG・WebP、10MBまで）</label>
            <input
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              id="identity-document"
              onChange={(event) => setSelectedFile(event.currentTarget.files?.[0] ?? null)}
              type="file"
            />
            <button disabled={!selectedFile || isSubmitting} onClick={() => void handleSubmit()} type="button">
              {isSubmitting ? "送信しています…" : "身分証明書を送信する"}
            </button>
          </>
        )}
        {identityStatus === "pending" && <p>送信が完了しました。審査結果をお待ちください。</p>}
      </section>

      <p role="status" aria-live="polite">{message}</p>
      <p>プロトタイプではSupabase Auth・Storageへの通信や画像の保存は行いません。</p>

      <details>
        <summary>プロトタイプ確認用：状態を切り替える</summary>
        <label htmlFor="mock-email-status">メール認証状態</label>
        <select id="mock-email-status" onChange={(event) => setEmailVerified(event.currentTarget.value === "verified")} value={emailVerified ? "verified" : "unverified"}>
          <option value="unverified">未認証</option>
          <option value="verified">認証済み</option>
        </select>
        <label htmlFor="mock-identity-status">本人確認状態</label>
        <select id="mock-identity-status" onChange={(event) => setIdentityStatus(event.currentTarget.value as IdentityStatus)} value={identityStatus}>
          <option value="not_submitted">未提出</option>
          <option value="pending">審査中</option>
          <option value="verified">確認済み</option>
        </select>
      </details>
    </main>
  );
}