"use client";
import { MessageCircle } from 'lucide-react';

export default function FloatingLine() {
  return (
    <a 
      href="https://line.me/ti/p/@341pmycy"
      target="_blank"
      className="fixed bottom-6 right-6 z-[99] bg-[#06C755] p-4 rounded-full shadow-[0_10px_30px_rgba(6,199,85,0.5)] transition-transform hover:scale-110 flex items-center justify-center group"
    >
      <MessageCircle size={32} color="white" fill="white" />
      <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        สอบถามทาง LINE
      </span>
    </a>
  );
}