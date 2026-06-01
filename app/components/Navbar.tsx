"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ตรวจจับการเลื่อนหน้าจอเพื่อเปลี่ยนพื้นหลัง Navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "หน้าแรก", href: "/" },
    { name: "แผนที่ชาร์จ", href: "/map" },
    { name: "เปรียบเทียบรถ", href: "/cars" },
    { name: "บทความ EV", href: "/blog" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-black/80 backdrop-blur-md py-4 border-b border-white/10" : "bg-transparent py-6"
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
        <Image 
            src="/logo.png" 
            alt="EV Rental Thailand Logo" 
            width={150} // ปรับขนาดตามความเหมาะสม
            height={50} 
            priority // ช่วยให้โหลดโลโก้ขึ้นทันที (LCP)
            className="object-contain"
        />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href} className="text-gray-300 hover:text-green-500 transition-colors text-sm font-medium">
              {item.name}
            </Link>
          ))}
          <Link href="/contact" className="bg-green-500 hover:bg-green-600 text-black px-6 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95">
            ติดต่อสอบถาม
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-white/10 py-6 px-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="block text-xl font-medium text-white hover:text-green-500"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link href="/contact" className="block w-full bg-green-500 text-black py-4 rounded-xl font-bold text-center" onClick={() => setIsOpen(false)}>
            ติดต่อสอบถาม
          </Link>
        </div>
      )}
    </nav>
  );
}