"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOrders, getOrderReview, submitOrderReview } from "@/api/orders";
import { StarIcon } from "@/components/StarIcon";
import type { AccountOrder, OrderStatus } from "@/types/account";
import type { OrderReviewResponse } from "@/api/orders";

type FilterStatus = "all" | OrderStatus;

function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

function formatPlacedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function mapStatus(backendStatus: string): OrderStatus {
  const s = (backendStatus || "").toUpperCase();
  if (s === "DELIVERED") return "delivered";
  if (s === "CANCELLED") return "cancelled";
  if (s === "OUT_FOR_DELIVERY") return "out_for_delivery";
  if (s === "SHIPPED") return "shipped";
  if (s === "PENDING") return "pending";
  if (s === "PROCESSING") return "processing";
  return "processing";
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-accent-mango text-text-chocolate",
  shipped: "bg-sky-100 text-sky-800",
  out_for_delivery: "bg-sky-200 text-sky-900",
  delivered: "bg-secondary text-text-chocolate",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const fetchOrders = () => {
    return getOrders()
      .then(({ orders: list }) => {
        setOrders(
          list.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            status: mapStatus(o.status),
            placedAt: formatPlacedAt(o.createdAt),
            total: formatPrice(o.total),
            itemThumbnails: (o.items ?? []).map((item) => ({
              imageUrl: item.variant?.product?.images?.[0]?.url,
              icon: "cookie",
              quantity: item.quantity,
            })),
            hasReview: !!o.review?.id,
          }))
        );
      })
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false));
  }, []);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [reviewOrderNumber, setReviewOrderNumber] = useState<string>("");
  const [reviewMode, setReviewMode] = useState<"write" | "view">("write");

  const onReviewSubmitted = () => {
    setReviewOrderId(null);
    fetchOrders();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 relative z-10">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-6xl text-text-chocolate brand-font mb-1 md:mb-2 relative inline-block">
            Order History
            <svg
              className="absolute -bottom-2 right-0 w-full h-4 text-accent-mango z-[-1]"
              fill="none"
              viewBox="0 0 200 9"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M2.00025 6.99997C2.00025 6.99997 32.653 1.00018 97.466 1.00018C162.279 1.00018 198.001 7.49997 198.001 7.49997"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>
          </h1>
          <p className="text-sm md:text-lg font-medium text-text-chocolate/80 mt-1 md:mt-2 hand-font rotate-1 ml-2 md:ml-4">
            Past snacks &amp; good times ✌️
          </p>
        </div>
        <span
          className="hidden md:block absolute top-0 right-10 -rotate-12 animate-bounce duration-[3000ms] material-symbols-outlined text-6xl text-accent-strawberry z-0"
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden
        >
          local_shipping
        </span>
      </div>

      <div className="flex gap-2 md:flex-wrap md:gap-4 mb-6 md:mb-10 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 relative z-10">
        {(
          [
            "all",
            "pending",
            "processing",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled",
          ] as const
        ).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 md:px-6 md:py-2 border-2 border-text-chocolate font-bold uppercase tracking-wider text-xs md:text-sm product-font transition-all rounded-full ${
              filter === f
                ? "bg-text-chocolate text-white shadow-[4px_4px_0px_0px_#2D1B0E]"
                : "bg-white text-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E] hover:translate-y-1 hover:shadow-none hover:bg-accent-mango hover:text-text-chocolate"
            }`}
          >
            {f === "all" ? "All" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-8 relative z-10">
          {filteredOrders.length === 0 ? (
            <p className="product-font text-xl text-text-chocolate/80">
              No orders yet. Time to fill that stash!
            </p>
          ) : (
            filteredOrders.map((order, i) => (
              <OrderCard
                key={order.id}
                order={order}
                index={i}
                onViewOrder={() =>
                  router.push(`/order-confirmed?orderId=${order.id}`)
                }
                onLeaveReview={() => {
                  setReviewMode("write");
                  setReviewOrderId(order.id);
                  setReviewOrderNumber(order.orderNumber);
                }}
                onViewReview={() => {
                  setReviewMode("view");
                  setReviewOrderId(order.id);
                  setReviewOrderNumber(order.orderNumber);
                }}
              />
            ))
          )}
        </div>
      )}

      <span
        className="absolute bottom-20 left-10 z-0 hidden lg:block animate-spin material-symbols-outlined text-7xl text-accent-mango/20"
        style={{ animationDuration: "8000ms" }}
        aria-hidden
      >
        star
      </span>

      {reviewOrderId && (
        <OrderReviewModal
          orderId={reviewOrderId}
          orderNumber={reviewOrderNumber}
          mode={reviewMode}
          onClose={() => setReviewOrderId(null)}
          onSubmitted={onReviewSubmitted}
        />
      )}
    </>
  );
}

function OrderReviewModal({
  orderId,
  orderNumber,
  mode,
  onClose,
  onSubmitted,
}: {
  orderId: string;
  orderNumber: string;
  mode: "write" | "view";
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewReview, setViewReview] = useState<OrderReviewResponse | null>(null);
  const [viewLoading, setViewLoading] = useState(mode === "view");

  useEffect(() => {
    if (mode === "view" && orderId) {
      setViewLoading(true);
      getOrderReview(orderId)
        .then(({ review }) => setViewReview(review))
        .catch(() => setError("Failed to load review."))
        .finally(() => setViewLoading(false));
    }
  }, [mode, orderId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const images = files.filter((f) => f.type.startsWith("image/")).slice(0, 5);
    setImageFiles(images);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setVideoFile(file && file.type.startsWith("video/") ? file : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await submitOrderReview(orderId, {
        rating: rating >= 1 && rating <= 5 ? rating : undefined,
        text: text || undefined,
        images: imageFiles.length ? imageFiles : undefined,
        video: videoFile ?? undefined,
      });
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white border-4 border-text-chocolate shadow-[8px_8px_0px_0px_#E0F7FA] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 flex justify-between items-center border-b-2 border-text-chocolate/20">
          <h2 className="text-xl font-bold product-font uppercase">
            {mode === "view" ? "Your Review" : "Leave a Review"} — Order #{orderNumber}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 border-2 border-text-chocolate hover:bg-secondary transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">
          {mode === "view" ? (
            viewLoading ? (
              <div className="flex justify-center py-8">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">
                  progress_activity
                </span>
              </div>
            ) : viewReview ? (
              <div className="space-y-4">
                {(viewReview.reviewerFirstName || viewReview.reviewerLastName) && (
                  <p className="font-bold text-text-chocolate">
                    {[viewReview.reviewerFirstName, viewReview.reviewerLastName]
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                )}
                {viewReview.rating != null &&
                  viewReview.rating >= 1 &&
                  viewReview.rating <= 5 && (
                    <div
                      className="flex gap-0.5 items-center"
                      aria-label={`${viewReview.rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          filled={star <= viewReview.rating!}
                          className={`w-6 h-6 ${
                            star <= viewReview.rating!
                              ? "text-accent-mango"
                              : "text-text-chocolate/30"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                {viewReview.text && (
                  <p className="text-text-chocolate font-medium whitespace-pre-wrap">
                    {viewReview.text}
                  </p>
                )}
                {viewReview.imageUrls?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {viewReview.imageUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt=""
                        className="w-24 h-24 object-cover border-2 border-text-chocolate"
                      />
                    ))}
                  </div>
                )}
                {viewReview.videoUrl && (
                  <video
                    src={viewReview.videoUrl}
                    controls
                    className="w-full max-h-48 border-2 border-text-chocolate"
                  />
                )}
              </div>
            ) : (
              <p className="text-text-chocolate/80">{error || "No review found."}</p>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-accent-strawberry font-bold text-sm" role="alert">
                  {error}
                </p>
              )}
              <div>
                <label className="block text-xs font-bold uppercase text-text-chocolate/70 mb-2">
                  Rating
                </label>
                <div className="flex gap-1" role="group" aria-label="Rate 1 to 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= rating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                          filled
                            ? "text-accent-mango"
                            : "text-text-chocolate/30 hover:text-text-chocolate/50"
                        }`}
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        aria-pressed={rating === star}
                      >
                        <StarIcon filled={filled} className="w-8 h-8 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label
                  htmlFor="review-text"
                  className="block text-xs font-bold uppercase text-text-chocolate/70 mb-1"
                >
                  Your review (optional)
                </label>
                <textarea
                  id="review-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="input-snacqo w-full resize-y"
                  placeholder="How was your order?"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-text-chocolate/70 mb-1">
                  Add photos (up to 5)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full text-sm text-text-chocolate file:mr-4 file:py-2 file:px-4 file:border-2 file:border-text-chocolate file:bg-secondary file:font-bold file:cursor-pointer"
                />
                {imageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imageFiles.map((f, i) => (
                      <span
                        key={i}
                        className="text-xs bg-secondary px-2 py-1 border border-text-chocolate"
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-text-chocolate/70 mb-1">
                  Add video (optional)
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoChange}
                  className="block w-full text-sm text-text-chocolate file:mr-4 file:py-2 file:px-4 file:border-2 file:border-text-chocolate file:bg-secondary file:font-bold file:cursor-pointer"
                />
                {videoFile && (
                  <p className="text-xs mt-1 text-text-chocolate/80">{videoFile.name}</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border-2 border-text-chocolate font-bold uppercase text-sm text-text-chocolate hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    (rating < 1 &&
                      !text.trim() &&
                      imageFiles.length === 0 &&
                      !videoFile)
                  }
                  className="flex-1 py-2.5 bg-primary text-white font-bold border-2 border-text-chocolate uppercase text-sm disabled:opacity-50"
                >
                  {loading ? "Submitting…" : "Submit Review"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  index,
  onViewOrder,
  onLeaveReview,
  onViewReview,
}: {
  order: AccountOrder;
  index: number;
  onViewOrder: () => void;
  onLeaveReview?: () => void;
  onViewReview?: () => void;
}) {
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";

  return (
    <div className="group relative">
      <div
        className={`absolute inset-0 translate-x-2 translate-y-2 rounded-none border-none hidden md:block ${
          isCancelled ? "bg-red-50" : "bg-text-chocolate/10"
        }`}
        aria-hidden
      />
      <div className="relative bg-white border-2 md:border-4 border-text-chocolate shadow-[3px_3px_0px_0px_#2D1B0E] md:shadow-[4px_4px_0px_0px_#2D1B0E] p-4 md:p-8 hover:-translate-y-0.5 md:hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#2D1B0E] md:hover:shadow-[8px_8px_0px_0px_#2D1B0E] transition-all duration-300">
        {index === 0 && (
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 tape-strip rotate-[2deg] z-10 hidden md:block"
            aria-hidden
          />
        )}
        <div className="flex flex-col md:hidden gap-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold product-font text-text-chocolate truncate">
              #{order.orderNumber}
            </h3>
            <span
              className={`text-[10px] font-black px-2 py-0.5 border border-text-chocolate uppercase flex-shrink-0 ${STATUS_STYLE[order.status]}`}
            >
              {STATUS_LABEL[order.status]}
            </span>
          </div>
          {order.itemThumbnails.length > 0 && (
            <div className="flex gap-2 overflow-x-auto overflow-y-visible scrollbar-hide -mx-1 px-1 pt-1">
              {order.itemThumbnails.map((item, j) => (
                <div
                  key={j}
                  className="relative flex-shrink-0 w-12 h-12 bg-secondary border-2 border-text-chocolate"
                >
                  <div className="absolute inset-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        alt=""
                        src={item.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white">
                        <span className="material-symbols-outlined text-xl text-primary">
                          cookie
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="absolute -top-1 -right-1 z-20 bg-primary text-white text-[9px] font-bold min-w-[14px] h-3.5 flex items-center justify-center rounded-full border-2 border-white shadow-[1px_1px_0_0_#2D1B0E]">
                    {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <p className="text-text-chocolate/70 font-medium truncate">{order.placedAt}</p>
            <p className="text-base brand-font text-primary font-bold flex-shrink-0">
              {order.total}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onViewOrder}
              className="w-full py-2.5 bg-secondary text-text-chocolate product-font font-bold border-2 border-text-chocolate text-xs uppercase tracking-wide flex items-center justify-center gap-1.5"
            >
              View Order
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
            {isDelivered && (onLeaveReview || onViewReview) && (
              <button
                type="button"
                onClick={order.hasReview ? onViewReview : onLeaveReview}
                className="w-full py-2 border-2 border-text-chocolate text-text-chocolate product-font font-bold text-xs uppercase flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">rate_review</span>
                {order.hasReview ? "View review" : "Leave review"}
              </button>
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-dashed border-text-chocolate/20 pb-6 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold product-font text-text-chocolate">
                  Order #{order.orderNumber}
                </h3>
                <span
                  className={`text-xs font-black px-3 py-1 border-2 border-text-chocolate uppercase -rotate-2 shadow-[2px_2px_0px_0px_#2D1B0E] ${STATUS_STYLE[order.status]}`}
                >
                  {STATUS_LABEL[order.status]}
                </span>
              </div>
              <p className="text-text-chocolate/70 font-medium">
                Placed on {order.placedAt}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-text-chocolate uppercase tracking-wide mb-1">
                Total
              </p>
              <p className="text-2xl brand-font text-primary">{order.total}</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1 w-full overflow-x-auto overflow-y-visible no-scrollbar">
              <div className="flex gap-4 pb-2 pt-1">
                {order.itemThumbnails.length > 0 ? (
                  order.itemThumbnails.map((item, j) => (
                    <div
                      key={j}
                      className="relative flex-shrink-0 w-20 h-20 bg-secondary border-2 border-text-chocolate"
                    >
                      <div className="absolute inset-0 overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            alt=""
                            src={item.imageUrl}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white">
                            <span
                              className="material-symbols-outlined text-4xl text-primary"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              cookie
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 z-20 bg-primary text-white text-xs font-bold min-w-[1.25rem] h-5 flex items-center justify-center rounded-full border-2 border-white shadow-[2px_2px_0_0_#2D1B0E]">
                        {item.quantity}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-text-chocolate/60 text-sm font-medium">
                    {order.orderNumber} — view details below
                  </span>
                )}
              </div>
            </div>
            <div className="w-full lg:w-auto flex-shrink-0 flex flex-col gap-3">
              <button
                type="button"
                onClick={onViewOrder}
                className="w-full lg:w-auto px-8 py-3 bg-secondary text-text-chocolate product-font font-bold border-2 border-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E] hover:bg-primary hover:text-white hover:shadow-[2px_2px_0px_0px_#2D1B0E] hover:translate-y-0.5 transition-all uppercase tracking-wide text-sm flex items-center justify-center gap-2 group/btn"
              >
                View Order
                <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              {isDelivered && (onLeaveReview || onViewReview) && (
                <button
                  type="button"
                  onClick={order.hasReview ? onViewReview : onLeaveReview}
                  className="w-full lg:w-auto px-6 py-2 border-2 border-text-chocolate text-text-chocolate product-font font-bold text-sm uppercase flex items-center justify-center gap-2 hover:bg-accent-mango hover:text-text-chocolate transition-colors"
                >
                  <span className="material-symbols-outlined">rate_review</span>
                  {order.hasReview ? "View review" : "Leave review"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
