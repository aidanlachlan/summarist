"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import SearchBar from "@/components/layout/SearchBar";
import { useAuthStore } from "@/store/authStore";
import { getSavedBooks, getFinishedBooks } from "@/lib/library";
import { Book } from "@/types/book";
import BookCard from "@/components/BookCard";

export default function LibraryPage() {
  const user = useAuthStore((state) => state.user);
  const openModal = useAuthStore((state) => state.openModal);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLibrary() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get saved and finished book IDs
        const [savedIds, finishedIds] = await Promise.all([
          getSavedBooks(user.uid),
          getFinishedBooks(user.uid),
        ]);

        // Fetch book details for each ID
        const fetchBookDetails = async (ids: string[]): Promise<Book[]> => {
          if (ids.length === 0) return [];

          const books = await Promise.all(
            ids.map(async (id) => {
              const res = await fetch(
                `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
              );
              return res.json();
            })
          );
          return books;
        };

        const [savedBooksData, finishedBooksData] = await Promise.all([
          fetchBookDetails(savedIds),
          fetchBookDetails(finishedIds),
        ]);

        setSavedBooks(savedBooksData);
        setFinishedBooks(finishedBooksData);
      } catch (error) {
        console.error("Error fetching library:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLibrary();
  }, [user]);

  // Auth loading
  if (user === undefined) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen">
          <SearchBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#032b41] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen">
          <SearchBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="w-full px-10">
            <div className="max-w-[1070px] w-full mx-auto py-10 px-6">
              <h1 className="text-3xl font-bold text-[#032b41] mb-4 pb-4 border-b border-[#e1e7ea]">
                My Library
              </h1>
              <div className="flex flex-col items-center justify-center py-12">
                <figure className="max-w-[400px] mb-6">
                  <Image
                    src="/login.png"
                    alt="Login"
                    width={400}
                    height={300}
                    className="w-full"
                  />
                </figure>
                <p className="text-[#032b41] text-lg font-bold mb-6">
                  Log in to your account to see your library.
                </p>
                <button
                  onClick={openModal}
                  className="bg-[#2bd97c] text-[#032b41] font-semibold px-12 py-3 rounded cursor-pointer hover:bg-[#20ba68] transition-colors min-w-[180px]"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Loading
  if (loading) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen">
          <SearchBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="w-full px-10">
            <div className="max-w-[1070px] w-full mx-auto py-10 px-6">
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-4" />
              <div className="h-px bg-gray-200 mb-8" />
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-6" />
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-[200px]">
                    <div className="h-[172px] bg-gray-200 animate-pulse rounded mb-2" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen">
        <SearchBar onMenuClick={() => setSidebarOpen(true)} />
        <div className="w-full px-10">
          <div className="max-w-[1070px] w-full mx-auto py-10 px-6">
            {/* Saved Books */}
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-[#032b41] mb-2">
                Saved Books
              </h1>
              <p className="text-[#6b757b] mb-6">
                {savedBooks.length} {savedBooks.length === 1 ? "item" : "items"}
              </p>

              {savedBooks.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {savedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <p className="text-[#6b757b]">No saved books yet.</p>
              )}
            </div>

            {/* Finished Books */}
            <div>
              <h2 className="text-3xl font-bold text-[#032b41] mb-2">
                Finished
              </h2>
              <p className="text-[#6b757b] mb-6">
                {finishedBooks.length} {finishedBooks.length === 1 ? "item" : "items"}
              </p>

              {finishedBooks.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {finishedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <p className="text-[#6b757b]">No finished books yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}