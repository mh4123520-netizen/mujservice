import { useState } from 'react';
import { Check, Package, Search, ShieldCheck } from 'lucide-react';
import { FadeUp, ScaleIn } from '../../components/MotionReveal.tsx';
import { ResilientImage } from '../../components/ResilientImage.tsx';
import type { ProductItem } from '../../types/index.ts';
import type { PublicPageProps } from './HomePage.tsx';

export function ProductsPage({ data, onOpenBooking }: PublicPageProps) {
  const products = data.products || [];
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered: ProductItem[] = products.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.capacityOrSpec.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  return (
    <div className="px-3 sm:px-6 py-8 space-y-10 bg-[#fbfbfd]">
      <FadeUp>
        <section className="max-w-6xl mx-auto bg-black text-white rounded-[32px] p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-xs font-medium text-[#2997ff] mb-2">
                HVACR Hardware, Spares &amp; Commercial Units
              </div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
                Pro-Grade HVACR Products.
              </h1>
              <p className="text-white/70 mt-3 text-sm sm:text-base leading-relaxed">
                Factory-sealed DC inverter units, commercial VRF cassettes, Bitzer cold-room condensers, 22-gauge ACR copper kits, and smart controls supplied across Multan &amp; Khanewal.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-white/50 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search model, BTU, or brand..."
                className="pl-10 pr-4 py-2.5 text-xs bg-white/10 border border-white/15 text-white placeholder-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
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
                    ? 'bg-[#0071e3] text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      </FadeUp>

      <section className="max-w-6xl mx-auto">
        {filtered.length === 0 ? (
          <div className="bg-[#f5f5f7] rounded-[32px] p-12 text-center">
            <Package className="w-8 h-8 text-[#6e6e73] mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-[#1d1d1f]">No Matching Products</h2>
            <p className="text-sm text-[#6e6e73] mt-1">
              Try resetting your search query or choosing another hardware category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, idx) => (
              <ScaleIn key={product.id} delay={idx * 0.05}>
                <article className="bg-[#f5f5f7] rounded-[28px] overflow-hidden flex flex-col justify-between h-full group hover:shadow-xl transition-all duration-300">
                  <div>
                    <div className="p-3 pb-0">
                      <div className="h-56 rounded-[20px] overflow-hidden bg-slate-200">
                        <ResilientImage
                          src={product.imageUrl}
                          alt={product.name}
                          fallbackTitle={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6e6e73]">
                        <span className="font-medium text-[#0071e3]">{product.category}</span>
                        <span className="font-medium text-emerald-700">{product.stockStatus}</span>
                      </div>

                      <h2 className="text-lg font-semibold text-[#1d1d1f] mt-2">{product.name}</h2>
                      <div className="text-xs text-[#6e6e73] mt-1">
                        {product.brand} · <span className="text-[#1d1d1f] font-medium">{product.capacityOrSpec}</span>
                      </div>

                      <p className="text-sm text-[#6e6e73] mt-3 leading-relaxed">{product.summary}</p>

                      <ul className="mt-4 space-y-1.5 text-xs text-[#424245]">
                        {product.specs.map((spec) => (
                          <li key={spec} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#0071e3] shrink-0 mt-0.5" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-white/75 border-t border-black/[0.06] flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-[#6e6e73]">Supply Rate</div>
                      <div className="text-sm font-semibold text-[#1d1d1f] tabular-nums">
                        {product.pricePkr}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenBooking(
                          'AC Installation',
                          `Product Supply & Installation Inquiry: ${product.name} (${product.capacityOrSpec} · ${product.pricePkr})`
                        )
                      }
                      className="px-4 py-2 text-xs font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Order &amp; Install
                    </button>
                  </div>
                </article>
              </ScaleIn>
            ))}
          </div>
        )}
      </section>

      <FadeUp>
        <section className="max-w-6xl mx-auto bg-[#f5f5f7] rounded-[32px] p-7 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#0071e3] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-[#1d1d1f]">Need Custom Sizing or Bulk Commercial Hardware?</h2>
              <p className="text-xs text-[#6e6e73] mt-1">
                Our engineers perform on-site heat load surveys across Khanewal &amp; Multan before recommending chiller, VRF, or split tonnage.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenBooking(undefined, 'Request custom HVACR hardware quotation & site survey')}
            className="px-6 py-2.5 text-xs font-medium text-white bg-[#1d1d1f] rounded-full hover:bg-black cursor-pointer whitespace-nowrap shrink-0"
          >
            Request Site Survey
          </button>
        </section>
      </FadeUp>
    </div>
  );
}
