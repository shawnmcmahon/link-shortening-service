"use client";

import { useState } from "react";
import { createShortLink } from "../lib/firebase/firebaseUtils";
import { isValidUrl, isValidCustomAlias } from "../lib/utils/linkUtils";

interface LinkFormProps {
  userId: string;
  onLinkCreated?: () => void;
}

export default function LinkForm({ userId, onLinkCreated }: LinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate URL
    if (!isValidUrl(originalUrl)) {
      setError("Please enter a valid URL (must start with http:// or https://)");
      return;
    }

    // Validate custom alias if provided
    if (customAlias && !isValidCustomAlias(customAlias)) {
      setError(
        "Custom alias must be 3-20 characters and contain only letters, numbers, hyphens, and underscores"
      );
      return;
    }

    setLoading(true);
    try {
      await createShortLink(originalUrl, userId, customAlias || undefined);
      setSuccess("Link created successfully!");
      setOriginalUrl("");
      setCustomAlias("");
      if (onLinkCreated) {
        onLinkCreated();
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Create Short Link</h2>
      <div>
        <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Original URL *
        </label>
        <input
          id="originalUrl"
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          placeholder="https://example.com/very-long-url"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        />
      </div>
      <div>
        <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 mb-1">
          Custom Alias (optional)
        </label>
        <input
          id="customAlias"
          type="text"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          placeholder="my-custom-link"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        />
        <p className="mt-1 text-xs text-gray-500">
          3-20 characters, letters, numbers, hyphens, and underscores only
        </p>
      </div>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
          {success}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Creating..." : "Create Short Link"}
      </button>
    </form>
  );
}
