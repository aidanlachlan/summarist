"use client";

import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineMenu } from "react-icons/hi";

interface SearchBarProps {
  onMenuClick: () => void;
}

export default function SearchBar({ onMenuClick }: SearchBarProps) {
  return (
    <div className=" bg-white border-b border-[#e1e7ea] h-20 z-1">
      <div className="relative flex items-center justify-end px-8 max-w-267.5 mx-auto h-full">
        <div className="flex items-center gap-6 max-w-85 w-full">
          <div className="flex items-center w-full">
            <div className="relative flex items-end gap-2 w-full">
              <input
                type="text"
                placeholder="Search for books"
                className="h-10 w-full px-4 outline-none bg-[#f1f6f4] text-[#042330] border-2 border-[#e1e7ea] rounded-lg"
              />
              <div className="flex items-center absolute h-full right-2 justify-end border-l-2 border-[#e1e7ea] pl-2">
                <AiOutlineSearch className="w-6 h-6 text-[#03314b]" />
              </div>
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