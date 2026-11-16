import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, Search, User } from 'lucide-react';
import { FadeUp, ScaleIn } from '../../components/MotionReveal.tsx';
import { ResilientImage } from '../../components/ResilientImage.tsx';
import type { BlogPost } from '../../types/index.ts';
import type { PublicPageProps } from './HomePage.tsx';

export function BlogPage({ data, onNavigate, onOpenBooking }: PublicPageProps) {
  const posts = data.blogPosts || [];
  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered: BlogPost[] = posts.filter((post) => {
    const matchCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="px-3 sm:px-6 py-8 space-y-10 bg-[#fbfbfd]">
      <FadeUp>
        <section className="max-w-6xl mx-auto bg-black text-white rounded-[32px] p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-xs font-medium text-sky-400 mb-2">
                Technical Journal &amp; Field Guides
              </div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
                HVACR Engineering Blog &amp; Advisories
              </h1>
              <p className="text-white/70 mt-3 leading-relaxed">
                Practical engineering guides for homeowners, hospital engineers, and cold-storage operators across Khanewal and Multan.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-white/50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-10 pr-4 py-2.5 text-xs bg-white/10 border border-white/15 text-white placeholder-white/45 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      </FadeUp>

      <section className="max-w-6xl mx-auto space-y-8">
        {filtered.length === 0 ? (
          <div className="bg-[#f5f5f7] rounded-[32px] p-12 text-center">
            <BookOpen className="w-8 h-8 text-[#86868b] mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-[#1d1d1f]">No Matching Articles Found</h2>
            <p className="text-sm text-[#6e6e73] mt-1">
              Try clearing your search filter or selecting another category.
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <ScaleIn>
                <article className="bg-[#f5f5f7] rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 group">
                  <div className="lg:col-span-6 p-3 pb-0 lg:p-4 lg:pr-0">
                    <div className="h-72 lg:h-full min-h-[300px] rounded-[24px] overflow-hidden bg-slate-200">
                      <ResilientImage
                        src={featured.imageUrl}
                        alt={featured.title}
                        fallbackTitle={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-6 p-7 sm:p-9 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#6e6e73]">
                        <span className="font-semibold text-[#0071e3]">{featured.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{featured.publishedAt}</span>
                        <span aria-hidden="true">·</span>
                        <span>{featured.readTime}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mt-3 leading-snug">
                        {featured.title}
                      </h2>
                      <p className="text-[#6e6e73] mt-3 leading-relaxed">{featured.excerpt}</p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-4">
                      <div className="text-xs text-[#6e6e73] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#0071e3]" />
                        <span className="font-medium text-[#1d1d1f]">{featured.author}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate(`/blog/${featured.slug}`)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-[#1d1d1f] rounded-full hover:bg-black transition-colors cursor-pointer"
                      >
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              </ScaleIn>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, idx) => (
                  <ScaleIn key={post.id} delay={idx * 0.05}>
                    <article className="bg-[#f5f5f7] rounded-[28px] overflow-hidden flex flex-col justify-between h-full group">
                      <div>
                        <div className="p-3 pb-0">
                          <div className="h-52 rounded-[22px] overflow-hidden bg-slate-200">
                            <ResilientImage
                              src={post.imageUrl}
                              alt={post.title}
                              fallbackTitle={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#6e6e73]">
                            <span className="font-semibold text-[#0071e3]">{post.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{post.readTime}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-[#1d1d1f] mt-2 leading-snug">{post.title}</h3>
                          <p className="text-sm text-[#6e6e73] mt-2 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                        </div>
                      </div>

                      <div className="px-6 py-4 bg-white/60 border-t border-black/[0.05] flex items-center justify-between text-xs">
                        <span className="text-[#86868b] tabular-nums">{post.publishedAt}</span>
                        <button
                          type="button"
                          onClick={() => onNavigate(`/blog/${post.slug}`)}
                          className="inline-flex items-center gap-1 font-medium text-[#0071e3] hover:underline cursor-pointer"
                        >
                          <span>Read Article</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  </ScaleIn>
                ))}
              </div>
            )}
          </>
        )}

        <FadeUp>
          <div className="p-8 sm:p-10 bg-black text-white rounded-[32px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">Need On-Site HVACR Inspection in Khanewal or Multan?</h2>
              <p className="text-sm text-white/70 mt-1">
                Book our certified team for inverter repair, VRF maintenance, or cold-storage diagnostics.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenBooking()}
              className="px-6 py-3 text-sm font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Book Technician Visit
            </button>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}

export function BlogDetailPage({
  data,
  slug,
  onNavigate,
  onOpenBooking,
}: PublicPageProps & { slug: string }) {
  const posts = data.blogPosts || [];
  const post = posts.find((p) => p.slug === slug) || posts[0];

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold text-[#1d1d1f]">Article Not Found</h1>
        <button
          type="button"
          onClick={() => onNavigate('/blog')}
          className="mt-4 px-5 py-2.5 text-xs font-medium text-white bg-[#0071e3] rounded-full cursor-pointer"
        >
          Back to Engineering Blog
        </button>
      </div>
    );
  }

  const paragraphs = post.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const related = posts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="px-3 sm:px-6 py-8 bg-[#fbfbfd]">
      <FadeUp>
        <div className="max-w-4xl mx-auto bg-[#f5f5f7] rounded-[32px] p-6 sm:p-11">
          <button
            type="button"
            onClick={() => onNavigate('/blog')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0071e3] hover:underline mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Engineering Guides</span>
          </button>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6e6e73]">
            <span className="font-semibold text-[#0071e3]">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedAt}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] mt-3 leading-tight">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-xs text-[#6e6e73]">
            <User className="w-4 h-4 text-[#0071e3]" />
            <span>
              Written by <strong className="text-[#1d1d1f] font-medium">{post.author}</strong>
            </span>
          </div>

          <div className="mt-7 h-72 sm:h-96 rounded-[24px] overflow-hidden bg-slate-200">
            <ResilientImage
              src={post.imageUrl}
              alt={post.title}
              fallbackTitle={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-8 p-5 bg-white rounded-[20px] text-sm text-[#1d1d1f] font-medium leading-relaxed border border-black/[0.04]">
            {post.excerpt}
          </div>

          <div className="mt-8 space-y-5 text-base text-[#424245] leading-relaxed">
            {paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="mt-10 p-7 bg-black text-white rounded-[28px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Need This Service for Your Home or Facility?</h2>
              <p className="text-xs text-white/70 mt-1">
                Call {data.settings.phone} or book an engineer directly in Khanewal &amp; Multan.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenBooking(undefined, `From blog guide: ${post.title}`)}
              className="px-5 py-2.5 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Schedule Service Visit
            </button>
          </div>

          {related.length > 0 && (
            <div className="mt-12 pt-8 border-t border-black/[0.08]">
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-5">More Engineering Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(`/blog/${item.slug}`)}
                    className="text-left p-5 bg-white rounded-[22px] hover:bg-white/80 transition-colors cursor-pointer border border-black/[0.04]"
                  >
                    <div className="text-[11px] font-semibold text-[#0071e3]">{item.category}</div>
                    <div className="text-sm font-semibold text-[#1d1d1f] mt-1 line-clamp-2">{item.title}</div>
                    <div className="text-xs text-[#86868b] mt-2">{item.readTime}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </FadeUp>
    </div>
  );
}
