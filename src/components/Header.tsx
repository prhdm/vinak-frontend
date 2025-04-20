"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSpotify, FaYoutube, FaInstagram, FaTelegram } from 'react-icons/fa';
import { SiSoundcloud, SiApplemusic } from 'react-icons/si';

const Header: React.FC = () => {
  return (
    <header className="z-50 bg-[#4B0000] py-6">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a 
            href="https://t.me/VinakOfficial1" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-300"
            title="Telegram"
          >
            <FaTelegram className="text-2xl" />
          </a>
          <a 
            href="https://www.instagram.com/vinakofficial" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-300"
            title="Instagram"
          >
            <FaInstagram className="text-2xl" />
          </a>
          <a 
            href="https://www.youtube.com/channel/UCmlJROQjTSiaa32jCRhcjVw" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-300"
            title="YouTube"
          >
            <FaYoutube className="text-2xl" />
          </a>
          <a 
            href="https://soundcloud.com/elvinako" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-300"
            title="SoundCloud"
          >
            <SiSoundcloud className="text-2xl" />
          </a>
          <a 
            href="https://open.spotify.com/artist/1sKlyO3CCEvjeTN6Uck39S" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-300"
            title="Spotify"
          >
            <FaSpotify className="text-2xl" />
          </a>
          <a 
            href="https://music.apple.com/us/artist/vinak/1047024582" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors duration-300"
            title="Apple Music"
          >
            <SiApplemusic className="text-2xl" />
          </a>
        </div>

        <div className="flex items-center">
          <Image
            src="/belaad.png"
            alt="Belaad Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>
      </div>
    </header>
  );
};

export default Header; 