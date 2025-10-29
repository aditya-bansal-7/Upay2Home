"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useLanguage } from "@/lib/language-context";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const session = useSession();

  // ✅ Redirect logged-in users
  useEffect(() => {
    if (session?.data?.user) router.push("/");
  }, [session]);

  // ✅ Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Auto-fill referral code from ?ref= query
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  // ✅ Handle registration
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(
        language === "en"
          ? "Passwords do not match"
          : "पासवर्ड मेल नहीं खाते हैं"
      );
      return;
    }

    if (!agreeTerms) {
      setError(
        language === "en"
          ? "You must agree to the Terms and Conditions"
          : "आपको शर्तों और नियमों से सहमत होना होगा"
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, referralCode }),
      });

      if (res.ok) {
        signIn("credentials", { email, password, redirect: false });
        router.push("/");
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Failed to register");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Google sign-up
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      setError("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upay2Home</h1>
          <p className="text-muted-foreground">
            {language === "en" ? "Create your account" : "अपना खाता बनाएं"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {language === "en" ? "Full Name" : "पूरा नाम"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                language === "en"
                  ? "Enter your full name"
                  : "अपना पूरा नाम दर्ज करें"
              }
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {language === "en" ? "Email" : "ईमेल"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                language === "en" ? "Enter your email" : "अपना ईमेल दर्ज करें"
              }
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {language === "en" ? "Password" : "पासवर्ड"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                language === "en" ? "At least 6 characters" : "कम से कम 6 वर्ण"
              }
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              minLength={6}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {language === "en"
                ? "Confirm Password"
                : "पासवर्ड की पुष्टि करें"}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={
                language === "en"
                  ? "Confirm your password"
                  : "अपने पासवर्ड की पुष्टि करें"
              }
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
          </div>

          {/* Referral Code (optional) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {language === "en" ? "Referral Code (optional)" : "रेफरल कोड (वैकल्पिक)"}
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder={
                language === "en"
                  ? "Enter referral code (if any)"
                  : "रेफरल कोड दर्ज करें (यदि कोई हो)"
              }
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-input"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              {language === "en"
                ? "I agree to the Terms and Conditions"
                : "मैं शर्तों और शर्तों से सहमत हूं"}
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isLoading
              ? language === "en"
                ? "Creating account..."
                : "खाता बना रहे हैं..."
              : language === "en"
              ? "Sign Up"
              : "साइन अप करें"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground">
            {language === "en" ? "or" : "या"}
          </span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 border border-input px-4 py-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>
            {language === "en"
              ? "Sign up with Google"
              : "Google के साथ साइन अप करें"}
          </span>
        </button>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          {language === "en"
            ? "Already have an account? "
            : "पहले से खाता है? "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            {language === "en" ? "Sign in" : "साइन इन करें"}
          </Link>
        </p>
      </div>
    </div>
  );
}
