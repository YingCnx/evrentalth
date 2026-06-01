import Link from "next/link";
import { Clock, ArrowLeft, ChevronRight } from "lucide-react";
import PageLayout from "./PageLayout";

type RelatedArticle = { title: string; slug: string; category: string };

type Props = {
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readMin: number;
  related?: RelatedArticle[];
  children: React.ReactNode;
};

export default function ArticleLayout({ category, categoryColor, title, excerpt, author, date, readMin, related, children }: Props) {
  return (
    <PageLayout>
      <article className="max-w-3xl mx-auto px-5 py-10">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft size={15} />กลับบทความทั้งหมด
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColor}`}>{category}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">{title}</h1>
        <p className="text-lg text-gray-500 leading-relaxed mb-6">{excerpt}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-10 pb-6 border-b border-gray-100">
          <span className="font-medium text-gray-600">{author}</span>
          <span className="flex items-center gap-1"><Clock size={13} />{readMin} นาที</span>
          <span>{date}</span>
        </div>

        <div className="prose prose-gray max-w-none">{children}</div>

        {related && related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="font-black text-gray-900 mb-4">บทความที่เกี่ยวข้อง</p>
            <div className="space-y-3">
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-green-50 hover:border-green-200 border border-transparent transition-all group">
                  <div>
                    <span className="text-xs text-green-600 font-semibold">{r.category}</span>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors">{r.title}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-green-500 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </PageLayout>
  );
}
