"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/hooks/useAuth";
import { Link } from "../lib/firebase/firebaseUtils";
import { getUserLinksRealtime } from "../lib/firebase/firebaseUtils";
import LinkForm from "../components/LinkForm";
import LinkItem from "../components/LinkItem";

function SignOutButton() {
  const { signOut } = useAuth();
  return (
    <button
      onClick={signOut}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Sign Out
    </button>
  );
}

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      setLoading(true);
      const unsubscribe = getUserLinksRealtime(user.uid, (updatedLinks) => {
        setLinks(updatedLinks);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, authLoading, router]);

  const handleLinkCreated = () => {
    // Links will update automatically via realtime listener
  };

  const handleLinkDeleted = () => {
    // Links will update automatically via realtime listener
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Links</h1>
            <p className="mt-1 text-sm text-gray-600">Create and manage your shortened links</p>
          </div>
          <SignOutButton />
        </div>

        <div className="mb-8">
          <LinkForm userId={user.uid} onLinkCreated={handleLinkCreated} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Links</h2>
          {links.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No links yet. Create your first shortened link above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <LinkItem key={link.id} link={link} onDeleted={handleLinkDeleted} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}