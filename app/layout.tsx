import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "700"],
});

const siteUrl = "https://evrentalth.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EV Charge Map Thailand | ค้นหาจุดชาร์จรถไฟฟ้าทั่วไทย",
    template: "%s | EV Charge Map Thailand",
  },
  description:
    "ค้นหาสถานีชาร์จรถไฟฟ้า (EV Charging Station) ทั่วประเทศไทย ดูแผนที่ สถานะ ราคา และประเภทหัวชาร์จได้ทันที — Find EV charging stations across Thailand with real-time availability, pricing, and connector types.",
  keywords: [
    // ภาษาไทย
    "จุดชาร์จรถไฟฟ้า",
    "สถานีชาร์จ EV",
    "ชาร์จรถยนต์ไฟฟ้า",
    "EV Charging Thailand",
    "หัวชาร์จ Type 2",
    "Fast Charge ไทย",
    "EA Anywhere",
    "EVOLT",
    "PEA Volta",
    "ปั๊มชาร์จไฟฟ้า",
    "แผนที่จุดชาร์จ",
    "ค้นหาจุดชาร์จ",
    // ภาษาอังกฤษ
    "EV charging station Thailand",
    "electric vehicle charger map",
    "find EV charger Thailand",
    "DC fast charger Thailand",
    "EV station Bangkok",
    "Thailand EV infrastructure",
  ],
  authors: [{ name: "EV Charge Map Thailand" }],
  creator: "EV Charge Map Thailand",
  publisher: "EV Charge Map Thailand",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "/",
    languages: {
      "th-TH": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "EV Charge Map Thailand",
    title: "EV Charge Map Thailand | ค้นหาจุดชาร์จรถไฟฟ้าทั่วไทย",
    description:
      "ค้นหาสถานีชาร์จรถไฟฟ้าทั่วประเทศไทย ดูแผนที่ สถานะ และประเภทหัวชาร์จได้ทันที",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EV Charge Map Thailand - ค้นหาจุดชาร์จรถไฟฟ้า",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EV Charge Map Thailand | ค้นหาจุดชาร์จรถไฟฟ้าทั่วไทย",
    description:
      "ค้นหาสถานีชาร์จรถไฟฟ้าทั่วประเทศไทย ดูแผนที่ สถานะ และประเภทหัวชาร์จได้ทันที",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="canonical" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebApplication",
                  name: "EV Charge Map Thailand",
                  alternateName: "แผนที่จุดชาร์จรถไฟฟ้าไทย",
                  url: siteUrl,
                  description: "ค้นหาสถานีชาร์จรถไฟฟ้า (EV Charging Station) ทั่วประเทศไทย — Find EV charging stations across Thailand",
                  applicationCategory: "TravelApplication",
                  operatingSystem: "Any",
                  inLanguage: ["th", "en"],
                  offers: { "@type": "Offer", price: "0", priceCurrency: "THB" },
                },
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "EV Charge Map Thailand",
                  url: siteUrl,
                  logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` },
                  description: "แพลตฟอร์มข้อมูล EV ครบวงจรสำหรับคนไทย แผนที่จุดชาร์จ วางแผนเส้นทาง เปรียบเทียบรถ คำนวณความคุ้ม",
                  foundingDate: "2024",
                  areaServed: { "@type": "Country", name: "Thailand" },
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    email: "hello@evrentalth.com",
                    availableLanguage: ["Thai", "English"],
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  name: "EV Charge Map Thailand",
                  url: siteUrl,
                  publisher: { "@id": `${siteUrl}/#organization` },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/map?province={search_term_string}` },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${kanit.className} antialiased`}>{children}</body>
    </html>
  );
}
