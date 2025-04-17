import React from 'react';
import Image from 'next/image';
import { FaInstagram, FaYoutube, FaSpotify, FaSoundcloud } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="mb-4 mt-4 w-full bg-transparent text-white font-iranyekan py-4 px-4 sm:px-8 lg:px-16 xl:px-32">
      <div className="w-full max-w-[1270px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 text-2xl">
          <a
            href="https://instagram.com/vinakofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.youtube.com/channel/UCmlJROQjTSiaa32jCRhcjVw"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            <FaYoutube />
          </a>
          <a
            href="https://open.spotify.com/artist/1sKlyO3CCEvjeTN6Uck39S"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            <FaSpotify />
          </a>
          <a
            href="https://soundcloud.com/elvinako"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition"
          >
            <FaSoundcloud />
          </a>
        </div>

        <div className="flex items-center">
          <Image
            src="/belaad.png"
            alt="Logo"
            width={130}
            height={80}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;