"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import SearchBar from "@/components/layout/SearchBar";
import BookCard from "@/components/BookCard";
import SelectedForYou from "@/components/SelectedForYou";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";

export default function ForYou() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"),
          fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"),
          fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"),
        ]);

        const selectedData = await selectedRes.json();
        const recommendedData = await recommendedRes.json();
        const suggestedData = await suggestedRes.json();

        setSelectedBook(selectedData[0]);
        setRecommendedBooks(recommendedData);
        setSuggestedBooks(suggestedData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (!user) return null;

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex flex-col ml-50 w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full">
        <SearchBar onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-8 max-w-267.5 mx-auto w-full">

          {/* Selected Book Section */}
          <div className="mb-8">
            <h2 className="text-[22px] font-bold text-[#032b41] mb-4">
              Selected just for you
            </h2>
            {loading ? (
              <div className="h-50 bg-gray-200 animate-pulse rounded-lg max-w-175" />
            ) : (
              selectedBook && <SelectedForYou book={selectedBook} />
            )}
          </div>

          {/* Recommended Books Section */}
          <div className="mb-8">
            <h2 className="text-[22px] font-bold text-[#032b41] mb-2">
              Recommended For You
            </h2>
            <p className="text-[#6b757b] mb-4">We think you&apos;ll like these</p>
            {loading ? (
              <div className="flex gap-4 overflow-x-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-43 shrink-0">
                    <div className="h-43 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 bg-gray-200 animate-pulse mt-2 rounded" />
                    <div className="h-3 bg-gray-200 animate-pulse mt-2 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                {recommendedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>

          {/* Suggested Books Section */}
          <div className="mb-8">
            <h2 className="text-[22px] font-bold text-[#032b41] mb-2">
              Suggested Books
            </h2>
            <p className="text-[#6b757b] mb-4">Browse these books</p>
            {loading ? (
              <div className="flex gap-4 overflow-x-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-43 shrink-0">
                    <div className="h-43 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 bg-gray-200 animate-pulse mt-2 rounded" />
                    <div className="h-3 bg-gray-200 animate-pulse mt-2 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {suggestedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
