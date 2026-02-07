"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineMenu } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { BiTime } from "react-icons/bi";
import { Book } from "@/types/book";
import { getAudioDurations } from "@/lib/audioDuration";

interface SearchBarProps {
  onMenuClick: () => void;
}

export default function SearchBar({ onMenuClick }: SearchBarProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format duration from seconds to "MM:SS"
  const formatDuration = (seconds: number): string => {
    if (!seconds) return "—:—";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setLoading(true);
      setShowDropdown(true);

      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(searchTerm)}`,
        );
        const data: Book[] = await res.json();
        setResults(data);
        setLoading(false);

        // Fetch durations in background
        if (data.length > 0) {
          const durationsMap = await getAudioDurations(data);
          setDurations(durationsMap);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleResultClick = (bookId: string) => {
    clearSearch();
    router.push(`/book/${bookId}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setDurations({});
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  return (
    <div className="bg-white border-b border-[#e1e7ea] h-20 z-10 relative">
      <div className="relative flex items-center justify-end px-8 max-w-267.5 mx-auto h-full">
        <div className="flex items-center gap-6 max-w-85 w-full">
          <div className="flex items-center w-full">
            <div className="relative flex items-end gap-2 w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for books"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full px-4 pr-16 outline-none bg-[#f1f6f4] text-[#042330] border-2 border-[#e1e7ea] rounded-lg"
              />
              <div className="flex items-center absolute h-full right-2 justify-end border-l-2 border-[#e1e7ea] pl-2">
                {showDropdown ? (
                  <IoCloseOutline
                    className="w-6 h-6 text-[#03314b] cursor-pointer"
                    onClick={clearSearch}
                  />
                ) : (
                  <AiOutlineSearch className="w-6 h-6 text-[#03314b]" />
                )}
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 w-[400px] mt-1 bg-white border border-[#e1e7ea] rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {loading ? (
                    // Loading skeletons
                    <div className="p-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 border-b border-[#f1f6f4] last:border-b-0"
                        >
                          <div className="w-16 h-16 bg-gray-200 animate-pulse rounded" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2 mb-2" />
                            <div className="h-3 bg-gray-200 animate-pulse rounded w-1/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : results.length > 0 ? (
                    // Results
                    <div className="p-2">
                      {results.map((book) => (
                        <div
                          key={book.id}
                          onClick={() => handleResultClick(book.id)}
                          className="flex items-center gap-4 p-4 hover:bg-[#f1f6f4] cursor-pointer rounded border-b border-[#f1f6f4] last:border-b-0"
                        >
                          <Image
                            src={book.imageLink}
                            alt={book.title}
                            width={64}
                            height={64}
                            className="rounded object-cover"
                            unoptimized
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[#032b41] font-semibold text-sm truncate">
                              {book.title}
                            </h4>
                            <p className="text-[#6b757b] text-xs truncate">
                              {book.author}
                            </p>
                            <div className="flex items-center gap-1 text-[#6b757b] text-xs mt-1">
                              <BiTime className="w-3 h-3" />
                              <span>{formatDuration(durations[book.id])}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // No results
                    <div className="p-6 text-center text-[#6b757b]">
                      No books found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            className="hidden max-md:flex items-center justify-center cursor-pointer"
            onClick={onMenuClick}
          >
            <HiOutlineMenu className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
