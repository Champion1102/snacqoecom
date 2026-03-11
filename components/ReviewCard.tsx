"use client";
import { StarIcon } from '@/components/StarIcon';
import type { Review } from '@/types/productDetail';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const stars = Math.min(5, Math.max(0, Math.round(review.rating)));
  return (
    <div className="snap-center shrink-0 w-[300px] md:w-[350px] bg-white border-[4px] border-text-chocolate p-6 shadow-chunky flex flex-col gap-3 relative hover:-translate-y-1 transition-transform">
      {review.tag && (
        <div className="absolute -top-3 -right-3 bg-accent-strawberry text-white text-xs font-bold px-2 py-1 border-2 border-text-chocolate rotate-3 z-10 shadow-chunky-sm">
          {review.tag}
        </div>
      )}
      <div className="flex text-accent-mango gap-0.5" aria-label={`${review.rating} stars`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} filled={i <= stars} className="w-5 h-5" />
        ))}
      </div>
      {review.imageUrls && review.imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.imageUrls.slice(0, 3).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="w-16 h-16 object-cover border-2 border-text-chocolate"
            />
          ))}
        </div>
      )}
      {review.videoUrl && (
        <video
          src={review.videoUrl}
          controls
          className="w-full max-h-32 border-2 border-text-chocolate object-cover"
        />
      )}
      <h3 className="product-font font-bold text-xl uppercase tracking-wide">{review.title}</h3>
      <p className="font-body text-text-chocolate/80 text-sm leading-relaxed flex-grow">
        {review.body}
      </p>
      <div className="mt-2 border-t-2 border-dashed border-text-chocolate/20 pt-3 flex items-center justify-between">
        <span className="font-bold text-sm">{review.author}</span>
        <span className="bg-secondary text-[10px] font-bold uppercase px-2 py-1 border border-text-chocolate rounded-full flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">verified</span>
          Verified Snacker
        </span>
      </div>
    </div>
  );
}
