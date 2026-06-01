import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://evchargemap.th";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          th: `${baseUrl}/`,
          en: `${baseUrl}/en`,
        },
      },
    },
  ];
}
