"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

// Custom password input component that shows last character
function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  required,
  minLength,
  className,
  isVisible,
  onToggleVisibility,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}) {
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  // Update display value based on actual password
  useEffect(() => {
    if (value.length === 0) {
      setDisplayValue("");
      return;
    }

    if (isVisible) {
      // Show actual password when visible
      setDisplayValue(value);
    } else {
      // Show all previous characters as * and last character as-is
      const masked = "*".repeat(Math.max(0, value.length - 1));
      const lastChar = value.length > 0 ? value[value.length - 1] : "";
      const newDisplay = masked + lastChar;
      setDisplayValue(newDisplay);
    }
  }, [value, isVisible]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow special keys to work normally
    const specialKeys = ["Tab", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (specialKeys.includes(e.key)) {
      return; // Let browser handle these
    }

    // Handle backspace and delete
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const newValue = e.key === "Backspace" 
        ? value.slice(0, -1)
        : value; // Delete key doesn't remove from end typically
      
      onChange({
        ...e,
        target: { ...e.currentTarget, value: newValue },
      } as React.ChangeEvent<HTMLInputElement>);
      return;
    }

    // Handle character input
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const newValue = value + e.key;
      onChange({
        ...e,
        target: { ...e.currentTarget, value: newValue },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle paste and other input methods
    if (isComposingRef.current) return;
    
    const newDisplayValue = e.target.value;
    const currentDisplayLength = displayValue.length;
    const newDisplayLength = newDisplayValue.length;

    if (newDisplayLength < currentDisplayLength) {
      // Deletion handled by keydown, but fallback here
      const newValue = value.slice(0, newDisplayLength);
      onChange({
        ...e,
        target: { ...e.target, value: newValue },
      } as React.ChangeEvent<HTMLInputElement>);
    } else if (newDisplayLength > currentDisplayLength) {
      // Paste or composition - extract the new characters
      // When pasting, the display will have mixed * and actual chars
      // We need to extract what was actually pasted
      const pastedPart = newDisplayValue.slice(currentDisplayLength);
      // Remove asterisks and get actual characters
      const actualChars = pastedPart.replace(/\*/g, "");
      const newValue = value + actualChars;
      onChange({
        ...e,
        target: { ...e.target, value: newValue },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    // Handle IME input (like Chinese/Japanese)
    const newValue = value + e.data;
    onChange({
      ...e,
      target: { ...e.currentTarget, value: newValue },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Maintain cursor position at the end
  useEffect(() => {
    if (inputRef.current && displayValue.length > 0) {
      const length = displayValue.length;
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(length, length);
        }
      }, 0);
    }
  }, [displayValue]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={displayValue}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        required={required}
        minLength={minLength}
        className={className}
        placeholder={placeholder}
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors"
        aria-label={isVisible ? "Hide password" : "Show password"}
      >
        {isVisible ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

export default function EmailPasswordAuth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUpWithEmail, signInWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate passwords match on sign up
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            placeholder="••••••••"
            isVisible={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
          />
        </div>
        {isSignUp && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              placeholder="••••••••"
              isVisible={showConfirmPassword}
              onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
        )}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleToggleMode}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
