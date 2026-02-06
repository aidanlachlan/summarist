"use client";

import Image from "next/image";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const openModal = useAuthStore((state) => state.openModal);
  
  return (
    <nav className="nav">
      <div className="nav__wrapper">
        <figure className="nav__img--mask">
          <Image
            className="nav__img"
            src="/logo.png"
            alt="logo"
            width={200}
            height={40}
          />
        </figure>
        <ul className="nav__list--wrapper">
          <li className="nav__list nav__list--login" onClick={openModal}>
            Login
          </li>
          <li className="nav__list nav__list--mobile">About</li>
          <li className="nav__list nav__list--mobile">Contact</li>
          <li className="nav__list nav__list--mobile">Help</li>
        </ul>
      </div>
    </nav>
  );
}
