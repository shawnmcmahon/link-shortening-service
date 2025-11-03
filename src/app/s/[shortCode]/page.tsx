"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getLinkByShortCode, trackClick } from "../../../lib/firebase/firebaseUtils";

export default function RedirectPage() {
  const params = useParams();
  const shortCode = params.shortCode as string;
  const [status, setStatus] = useState<"loading" | "not-found" | "error">("loading");

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const link = await getLinkByShortCode(shortCode);

        if (!link) {
          setStatus("not-found");
          return;
        }

        // Track click before redirecting to ensure it completes
        try {
          await trackClick(link.id, shortCode);
        } catch (error) {
          console.error("Error tracking click:", error);
          // Continue with redirect even if tracking fails
        }

        // Redirect after click tracking completes
        window.location.href = link.originalUrl;
      } catch (error) {
        console.error("Error in redirect:", error);
        setStatus("error");
      }
    };

    if (shortCode) {
      handleRedirect();
    }
  }, [shortCode]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
          <p className="text-gray-600">The shortened link you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
        <p className="text-gray-600">An error occurred while processing your request.</p>
      </div>
    </div>
  );
}
