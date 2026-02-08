import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types/book";
import { BsFillPlayFill } from "react-icons/bs";

interface SelectedForYouProps {
  book: Book;
  duration?: number;
}

export default function SelectedForYou({ book, duration }: SelectedForYouProps) {
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Link
      href={`/book/${book.id}`}
      className="flex justify-between w-[calc((100%/3)*2)] bg-[#fbefd6] rounded p-6 mb-6 gap-6"
    >
      {/* Subtitle - 40% width */}
      <div className="text-[#032b41] w-[40%]">{book.subTitle}</div>

      {/* Vertical line */}
      <div className="w-px bg-[#bac8ce]" />

      {/* Content - 60% width */}
      <div className="flex gap-4 w-[60%]">
        {/* Book image */}
        <figure className="h-35 w-35 min-w-35">
          <Image
            src={book.imageLink}
            alt={book.title}
            width={140}
            height={140}
            className="w-full h-full"
            unoptimized
          />
        </figure>

        {/* Book text */}
        <div className="w-full">
          <div className="font-semibold text-[#032b41] mb-2">{book.title}</div>
          <div className="text-sm text-[#394547] mb-4">{book.author}</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 min-w-10 bg-black rounded-full p-1 pl-1.5">
              <BsFillPlayFill className="w-full h-full text-white" />
            </div>
            <div className="text-sm font-medium text-[#032b41]">
              {formatDuration(duration)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
