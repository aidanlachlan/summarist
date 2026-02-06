import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types/book";
import { BiTime } from "react-icons/bi";
import { AiOutlineStar } from "react-icons/ai";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/book/${book.id}`}
      className="relative scroll-snap-align-start pt-8 px-3 pb-3 rounded max-w-[200px] w-full flex-shrink-0"
    >
      {book.subscriptionRequired && (
        <div className="absolute top-0 right-0 bg-[#032b41] w-fit h-[18px] px-2 text-white text-[10px] flex items-center rounded-full">
          Premium
        </div>
      )}

      <figure className="w-[172px] h-[172px] mb-2">
        <Image
          src={book.imageLink}
          alt={book.title}
          width={172}
          height={172}
          className="w-full h-full"
          unoptimized
        />
      </figure>

      <div className="text-base font-bold text-[#032b41] mb-2">
        {book.title}
      </div>

      <div className="text-sm text-[#6b757b] font-light mb-2">
        {book.author}
      </div>

      <div className="text-sm text-[#394547] mb-2">{book.subTitle}</div>

      <div className="flex gap-2">
        <div className="flex items-center gap-1 text-sm font-light text-[#6b757b]">
          <div className="flex w-4 h-4">
            <BiTime className="w-full h-full" />
          </div>
          <div>--:--</div>
        </div>
        <div className="flex items-center gap-1 text-sm font-light text-[#6b757b]">
          <div className="flex w-4 h-4">
            <AiOutlineStar className="w-full h-full" />
          </div>
          <div>{book.averageRating}</div>
        </div>
      </div>
    </Link>
  );
}
