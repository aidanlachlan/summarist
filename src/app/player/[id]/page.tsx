"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import SearchBar from "@/components/layout/SearchBar";
import { useAuthStore } from "@/store/authStore";
import { Book } from "@/types/book";
import { markBookFinished } from "@/lib/library";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { TbRewindBackward10, TbRewindForward10 } from "react-icons/tb";

export default function PlayerPage() {
  const params = useParams();
  const id = params.id as string;

  const user = useAuthStore((state) => state.user);
  const openModal = useAuthStore((state) => state.openModal);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Audio ref
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Format time from seconds to MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 10,
      );
    }
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        duration,
        audioRef.current.currentTime + 10,
      );
    }
  };

  // Handle progress bar change (dragging)
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  // Fetch book data
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

  // Smooth progress bar update
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isPlaying) {
      intervalId = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  // Auth loading state
  if (user === undefined) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen">
          <SearchBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-16 h-16 border-6 border-[#032b41] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  // Not logged in - show login prompt
  if (user === null) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen">
          <SearchBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <p className="text-[#032b41] text-lg mb-4">
              Please log in to access the player.
            </p>
            <button
              onClick={openModal}
              className="bg-[#2bd97c] text-[#032b41] font-semibold px-8 py-3 rounded cursor-pointer hover:bg-[#20ba68] transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </>
    );
  }

  // Data loading state
  if (loading) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen">
          <SearchBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-16 h-16 border-6 border-[#032b41] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen">
          <SearchBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 p-8">
            <p className="text-[#032b41]">Book not found.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={book.audioLink}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onEnded={async () => {
          setIsPlaying(false);
          if (user) {
            try {
              await markBookFinished(user.uid, id);
            } catch (error) {
              console.error("Error marking book as finished:", error);
            }
          }
        }}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen pb-24">
        <SearchBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Book Summary Content */}
        <div className="flex-1 p-8 max-w-[800px] mx-auto w-full">
          <h1 className="text-2xl font-bold text-[#032b41] mb-6 pb-4 border-b border-[#e1e7ea]">
            {book.title}
          </h1>
          <p className="text-[#032b41] leading-relaxed whitespace-pre-line">
            {book.summary}
          </p>
        </div>

        {/* Audio Player - Fixed to bottom */}
        <div className="fixed bottom-0 left-[200px] right-0 h-20 bg-[#042330] flex items-center px-6 max-md:left-0">
          <div className="flex items-center gap-4 w-full">
            {/* Book info */}
            <div className="flex items-center gap-4">
              <Image
                src={book.imageLink}
                alt={book.title}
                width={48}
                height={48}
                className="rounded"
                unoptimized
              />
              <div>
                <div className="text-white text-sm font-semibold">
                  {book.title}
                </div>
                <div className="text-gray-400 text-xs">{book.author}</div>
              </div>
            </div>

            {/* Player controls */}
            <div className="flex-1 flex items-center justify-center gap-6 text-white">
              {/* Skip backward */}
              <button onClick={skipBackward} className="cursor-pointer">
                <TbRewindBackward10 className="w-6 h-6" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full cursor-pointer"
              >
                {isPlaying ? (
                  <BsFillPauseFill className="w-6 h-6 text-[#042330]" />
                ) : (
                  <BsFillPlayFill className="w-6 h-6 text-[#042330] ml-1" />
                )}
              </button>

              {/* Skip forward */}
              <button onClick={skipForward} className="cursor-pointer">
                <TbRewindForward10 className="w-6 h-6" />
              </button>
            </div>

            {/* Progress section */}
            <div className="flex items-center gap-4 text-white text-sm">
              <span className="w-12 text-right">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className="w-[300px] h-1 rounded-lg appearance-none cursor-pointer outline-none"
                style={{
                  background: `linear-gradient(to right, #2bd97c ${(currentTime / duration) * 100 || 0}%, #6d787d ${(currentTime / duration) * 100 || 0}%)`,
                }}
              />
              <span className="w-12">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
