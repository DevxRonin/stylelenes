'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShieldCheck, Truck, RotateCcw, Award, Check, ShoppingBag, ArrowRight, Heart, Share2, Sparkles } from 'lucide-react';
import { fetchProductById, fetchProducts } from '../../../lib/api';
import { useCart } from '../../../lib/cartContext';
import ProductCard from '../../../components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!params.id) return;
      setLoading(true);
      try {
        const item = await fetchProductById(params.id);
        setProduct(item);
        setSelectedImage(item.image);

        // Fetch related products in the same category
        const all = await fetchProducts({ category: item.category });
        const related = all.filter((p) => (p._id || p.id) !== (item._id || item.id)).slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-white/5 rounded-[28px]" />
          <div className="space-y-6">
            <div className="h-6 w-32 bg-white/10 rounded-full" />
            <div className="h-10 w-3/4 bg-white/10 rounded-lg" />
            <div className="h-8 w-40 bg-white/10 rounded-lg" />
            <div className="h-24 w-full bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <h2 className="font-playfair text-2xl font-bold text-white mb-2">Eyewear Silhouette Not Found</h2>
        <p className="text-sm text-white/50 mb-6">The piece you are inspecting may have been archived.</p>
        <Link href="/shop" className="px-6 py-3 cta-gradient text-xs font-semibold">
          Return to Collection
        </Link>
      </div>
    );
  }

  const galleryImages = product.images && product.images.length > 0
    ? [product.image, ...product.images.filter(img => img !== product.image)]
    : [product.image];

  const discountPercent = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-white/50">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">Eyewear</Link>
        <span>/</span>
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-white transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#C9A227] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery Showcase (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-[28px] overflow-hidden bg-[#141414] border border-white/10 shadow-2xl group">
            {product.badge && (
              <span className="absolute top-5 left-5 z-10 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase bg-[#C9A227] text-black shadow-lg">
                {product.badge}
              </span>
            )}
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Thumbnail Gallery Selectors */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img
                      ? 'border-[#C9A227] scale-105 shadow-md'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star size={15} className="fill-amber-400" />
                <span className="font-bold text-white text-sm">{product.rating || 4.8}</span>
                <span className="text-white/40 text-xs">({product.reviewsCount || 42} verified reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-playfair text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-4 py-2 border-y border-white/10">
              <span className="font-sans text-3xl font-bold text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <>
                  <span className="text-base text-white/40 line-through">
                    ₹{product.oldPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600/90 text-white">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Availability */}
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">
                In Stock ({product.stock} units available in our atelier)
              </span>
            </div>

            {/* Product Narrative Description */}
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Highlights Chips */}
            {product.features && (
              <div className="space-y-2 pt-2">
                <p className="text-xs uppercase tracking-wider text-white/50 font-semibold">
                  Key Specifications:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                      <Check size={13} className="text-[#C9A227] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-white/60 font-medium">Quantity:</span>
              <div className="flex items-center border border-white/10 rounded-full bg-white/5 px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-white/70 hover:text-[#C9A227] font-semibold text-sm transition-colors"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 20, quantity + 1))}
                  className="px-3 py-1.5 text-white/70 hover:text-[#C9A227] font-semibold text-sm transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`py-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  addedAnimation
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                    : 'cta-gradient hover:shadow-gold-glow'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check size={16} />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-4 rounded-full font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-[#C9A227] hover:text-black border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Buy Now with Express</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 grid grid-cols-2 gap-3 text-[11px] text-white/60">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#C9A227]" />
                <span>Free delivery across India</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={14} className="text-[#C9A227]" />
                <span>7-Day Home Trial Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} className="text-[#C9A227]" />
                <span>1-Year Atelier Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#C9A227]" />
                <span>100% Genuine Italian Optics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frame Dimensions & Atelier Specifications Table */}
      <section className="p-8 rounded-[28px] bg-[#141414] border border-white/10 shadow-xl space-y-6">
        <h3 className="font-playfair text-xl font-bold text-white flex items-center gap-2">
          <Sparkles size={18} className="text-[#C9A227]" />
          Optical Specifications & Craft
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-white/40 block mb-1">Frame Shape</span>
            <span className="font-semibold text-white text-sm">{product.frameShape || 'Aviator'}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-white/40 block mb-1">Frame Material</span>
            <span className="font-semibold text-white text-sm">{product.frameMaterial || 'Italian Acetate'}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-white/40 block mb-1">Lens Technology</span>
            <span className="font-semibold text-white text-sm">Polarized UV400 Triacetate</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-white/40 block mb-1">Lens Tint</span>
            <span className="font-semibold text-white text-sm">{product.lensColor || 'Smoky Gradient'}</span>
          </div>
        </div>
      </section>

      {/* Related Products Recommendation Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
              Complementary Silhouettes
            </span>
            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mt-1">
              You May Also Admire
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id || rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
