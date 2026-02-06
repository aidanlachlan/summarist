"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import SearchBar from "@/components/layout/SearchBar";
import { useAuthStore } from "@/store/authStore";
import { Book } from "@/types/book";
import { AiOutlineStar, AiOutlineBulb } from "react-icons/ai";
import { BiMicrophone, BiTime } from "react-icons/bi";
import { BsBook, BsBookmark } from "react-icons/bs";

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const user = useAuthStore((state) => state.user);
  const openModal = useAuthStore((state) => state.openModal);
  const subscriptionStatus = useAuthStore((state) => state.subscriptionStatus);
  const subscriptionLoading = useAuthStore(
    (state) => state.subscriptionLoading,
  );

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
        );
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleReadOrListen = () => {
    if (!user) {
      openModal();
      return;
    }

    if (subscriptionLoading) {
      return;
    }

    if (book?.subscriptionRequired && subscriptionStatus === "basic") {
      router.push("/choose-plan");
    } else {
      router.push(`/player/${id}`);
    }
  };

  const handleAddToLibrary = () => {
    if (!user) {
      openModal();
      return;
    }
    // TODO: Add to library functionality
    console.log("Add to library:", book?.id);
  };

  if (loading) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full">
          <SearchBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="p-8 max-w-[1070px] mx-auto w-full">
            <div className="flex gap-8 max-md:flex-col">
              {/* Left column skeleton */}
              <div className="flex-1">
                <div className="h-8 bg-gray-200 animate-pulse rounded mb-4 w-3/4" />
                <div className="h-5 bg-gray-200 animate-pulse rounded mb-4 w-1/2" />
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-4 w-full" />
                <div className="flex gap-4 mb-4">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
                </div>
                <div className="flex gap-4 mb-6">
                  <div className="h-12 bg-gray-200 animate-pulse rounded w-32" />
                  <div className="h-12 bg-gray-200 animate-pulse rounded w-32" />
                </div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-48 mb-8" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-32 mb-4" />
                <div className="flex gap-2 mb-8">
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-24" />
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-24" />
                </div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
              </div>
              {/* Right column skeleton */}
              <div className="w-[300px] max-md:w-full">
                <div className="h-[300px] bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full">
          <SearchBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="p-8 max-w-[1070px] mx-auto w-full">
            <p className="text-[#032b41]">Book not found.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full">
        <SearchBar onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-8 max-w-[1070px] mx-auto w-full">
          <div className="flex gap-8 max-md:flex-col">
            {/* Left column - Book details */}
            <div className="flex-1">
              <h1 className="text-[32px] font-bold text-[#032b41] mb-4">
                {book.title}
                {book.subscriptionRequired && (
                  <span className="text-base font-normal ml-2">(Premium)</span>
                )}
              </h1>

              <p className="text-base font-bold text-[#032b41] mb-4">
                {book.author}
              </p>

              <p className="text-xl font-light text-[#032b41] mb-4">
                {book.subTitle}
              </p>

              <div className="border-y border-[#e1e7ea] py-4 mb-6">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#032b41]">
                  <div className="flex items-center gap-1">
                    <AiOutlineStar className="w-5 h-5" />
                    <span>
                      {book.averageRating} ({book.totalRating} ratings)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BiTime className="w-5 h-5" />
                    <span>--:--</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BiMicrophone className="w-5 h-5" />
                    <span>{book.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AiOutlineBulb className="w-5 h-5" />
                    <span>{book.keyIdeas} Key ideas</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleReadOrListen}
                  className="flex items-center justify-center gap-2 bg-[#032b41] text-white px-6 py-3 rounded cursor-pointer hover:bg-[#0a4a6e] transition-colors"
                >
                  <BsBook className="w-5 h-5" />
                  <span>Read</span>
                </button>
                <button
                  onClick={handleReadOrListen}
                  className="flex items-center justify-center gap-2 bg-[#032b41] text-white px-6 py-3 rounded cursor-pointer hover:bg-[#0a4a6e] transition-colors"
                >
                  <BiMicrophone className="w-5 h-5" />
                  <span>Listen</span>
                </button>
              </div>

              {/* Add to Library */}
              <button
                onClick={handleAddToLibrary}
                className="flex items-center gap-2 text-[#0365f2] mb-8 cursor-pointer hover:text-[#024cbc] transition-colors"
              >
                <BsBookmark className="w-5 h-5" />
                <span>Add title to My Library</span>
              </button>

              {/* Tags */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-[#032b41] mb-4">
                  What&apos;s it about?
                </h2>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#f1f6f4] text-[#032b41] px-4 py-2 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book description */}
              <div className="mb-8">
                <p className="text-[#032b41] leading-relaxed">
                  {book.bookDescription}
                </p>
              </div>

              {/* Author description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-[#032b41] mb-4">
                  About the author
                </h2>
                <p className="text-[#032b41] leading-relaxed">
                  {book.authorDescription}
                </p>
              </div>
            </div>

            {/* Right column - Book image */}
            <div className="w-[300px] max-md:w-full max-md:order-first">
              <figure className="w-full">
                <Image
                  src={book.imageLink}
                  alt={book.title}
                  width={300}
                  height={300}
                  className="w-full"
                  unoptimized
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
