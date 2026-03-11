"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OrderConfirmedLayout } from "@/components/OrderConfirmedLayout";
import { getOrderById, formatPrice, type OrderResponse } from "@/api/orders";

type StatusConfig = {
  heading: string;
  subheading: string;
  badge: string;
  badgeBg: string;
  icon: string;
  iconClass: string;
  statusText: string;
  showDelivery: boolean;
};

function getStatusConfig(status: string): StatusConfig {
  const s = (status || "").toUpperCase();
  if (s === "PROCESSING")
    return {
      heading: "ORDER\nPLACED!",
      subheading: "You have excellent taste. We'll notify you when it ships!",
      badge: "🎉",
      badgeBg: "bg-white",
      icon: "package_2",
      iconClass: "text-accent-mango animate-pulse",
      statusText: "Preparing your snacks…",
      showDelivery: false,
    };
  if (s === "SHIPPED")
    return {
      heading: "SHIPPED!",
      subheading:
        "Your order is in transit. We'll update you when our delivery partner is out for delivery.",
      badge: "📦",
      badgeBg: "bg-sky-50",
      icon: "inventory_2",
      iconClass: "text-sky-600",
      statusText: "In transit",
      showDelivery: true,
    };
  if (s === "OUT_FOR_DELIVERY")
    return {
      heading: "OUT FOR\nDELIVERY!",
      subheading:
        "Our delivery partner is out delivering your order. Get your munching mode on!",
      badge: "🚚",
      badgeBg: "bg-sky-100",
      icon: "local_shipping",
      iconClass: "text-sky-500 animate-bounce",
      statusText: "Out for delivery",
      showDelivery: false,
    };
  if (s === "DELIVERED")
    return {
      heading: "DELIVERED!",
      subheading: "Your snacks have arrived. Time to snack hard!",
      badge: "✅",
      badgeBg: "bg-green-50",
      icon: "done_all",
      iconClass: "text-green-600",
      statusText: "Delivered",
      showDelivery: false,
    };
  if (s === "CANCELLED")
    return {
      heading: "ORDER\nCANCELLED",
      subheading:
        "This order has been cancelled. Your cart is safe — shop again anytime.",
      badge: "❌",
      badgeBg: "bg-red-50",
      icon: "cancel",
      iconClass: "text-red-500",
      statusText: "Cancelled",
      showDelivery: false,
    };
  return {
    heading: "ORDER\nPLACED!",
    subheading: "You have excellent taste. We'll notify you when it ships!",
    badge: "🎉",
    badgeBg: "bg-white",
    icon: "package_2",
    iconClass: "text-accent-mango animate-pulse",
    statusText: "Preparing your snacks…",
    showDelivery: false,
  };
}

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");
  const email = searchParams.get("email");

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    getOrderById(
      orderId,
      email && orderNumber ? { email, orderNumber } : undefined
    )
      .then(({ order: o }) => setOrder(o))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId, email, orderNumber]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-grow pt-32 pb-20 text-center px-6">
        <h1 className="text-3xl font-bold text-text-chocolate mb-4">
          Order not found
        </h1>
        <Link href="/shop" className="text-primary font-bold underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  const items = order.items ?? [];
  const cfg = getStatusConfig(order.status);
  const isCancelled = order.status.toUpperCase() === "CANCELLED";
  const isPaid = order.razorpayPaymentStatus === "captured";
  const shippingAddress = {
    name: order.shippingName,
    line1: order.shippingLine1,
    line2: order.shippingLine2 ?? undefined,
    city: order.shippingCity,
    state: order.shippingState,
    zip: order.shippingPincode,
  };

  return (
    <div className="flex-grow pt-32 pb-20 relative overflow-hidden flex flex-col items-center justify-center">
      <div
        className="absolute top-40 left-10 w-32 h-32 bg-secondary rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-float"
        aria-hidden
      />
      <div
        className="absolute top-20 right-20 w-48 h-48 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float"
        style={{ animationDelay: "2s" }}
        aria-hidden
      />
      <div
        className="absolute bottom-20 left-1/4 w-40 h-40 bg-accent-mango/20 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-float"
        style={{ animationDelay: "4s" }}
        aria-hidden
      />
      <span
        className="absolute top-32 left-[10%] lg:left-[20%] z-0 rotate-12 animate-float material-symbols-outlined text-6xl text-accent-mango drop-shadow-[4px_4px_0px_rgba(45,27,14,1)]"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        star
      </span>
      <span
        className="absolute top-40 right-[10%] lg:right-[20%] z-0 -rotate-12 animate-float material-symbols-outlined text-5xl text-accent-strawberry drop-shadow-[4px_4px_0px_rgba(45,27,14,1)]"
        style={{
          fontVariationSettings: "'FILL' 1",
          animationDelay: "1.5s",
        }}
        aria-hidden
      >
        favorite
      </span>
      <span
        className="absolute bottom-1/3 right-[5%] z-0 rotate-45 animate-float material-symbols-outlined text-6xl text-secondary drop-shadow-[4px_4px_0px_rgba(45,27,14,1)] text-text-chocolate"
        style={{ fontVariationSettings: "'FILL' 1", animationDelay: "3s" }}
        aria-hidden
      >
        cookie
      </span>

      <div className="max-w-4xl w-full px-6 relative z-10 text-center">
        <div className="mb-10 relative inline-block">
          <h1
            className="product-font text-6xl md:text-8xl lg:text-9xl text-text-chocolate leading-none mb-2 whitespace-pre-line"
            style={{ textShadow: "6px 6px 0px #FF9F1C" }}
          >
            {cfg.heading}
          </h1>
          <div
            className={`absolute -top-6 -right-8 md:-right-16 rotate-12 ${cfg.badgeBg} px-4 py-2 border-4 border-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E] transform hover:scale-110 transition-transform cursor-pointer`}
          >
            <span className="text-2xl md:text-3xl">{cfg.badge}</span>
          </div>
          {!isCancelled && (
            <div className="absolute -bottom-4 -left-6 -rotate-6 bg-accent-strawberry text-white px-4 py-1 border-4 border-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E]">
              <span className="btn-text text-sm md:text-base">YUM!</span>
            </div>
          )}
        </div>
        <p className="text-xl md:text-2xl font-bold text-text-chocolate mb-8 max-w-2xl mx-auto leading-tight">
          {cfg.subheading}
        </p>

        <div className="bg-white border-4 border-text-chocolate shadow-[12px_12px_0px_0px_#2D1B0E] p-6 md:p-10 text-left relative transform rotate-1 max-w-2xl mx-auto">
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 tape-strip z-20 rotate-2"
            aria-hidden
          />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-text-chocolate/20 pb-6 mb-6 gap-4">
            <div>
              <span className="block text-sm text-text-chocolate/60 font-bold uppercase tracking-wider mb-1">
                Order Number
              </span>
              <span className="hand-font text-3xl text-primary">
                {order.orderNumber}
              </span>
            </div>
            {cfg.showDelivery && (
              <div className="bg-secondary px-4 py-2 border-2 border-text-chocolate -rotate-2 shadow-[2px_2px_0px_0px_#2D1B0E]">
                <span className="btn-text text-text-chocolate text-sm">
                  Est. Delivery: 3–5 Days
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="brand-font text-xl text-text-chocolate mb-4">
                The Goods
              </h3>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 border-2 border-text-chocolate rounded flex items-center justify-center shrink-0 bg-primary/20">
                      <span className="material-symbols-outlined text-primary">
                        shopping_bag
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-text-chocolate leading-tight">
                        {item.productName} (x{item.quantity})
                      </p>
                      <p className="text-xs text-text-chocolate/60 font-bold">
                        {item.variantName}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t-2 border-dashed border-text-chocolate/20 flex justify-between items-center">
                <span className="font-bold text-text-chocolate">Total</span>
                <span className="brand-font text-xl text-text-chocolate">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 border-l-2 border-text-chocolate/20 hidden md:block -left-4"
                aria-hidden
              />
              <h3 className="brand-font text-xl text-text-chocolate mb-4">
                Shipping To
              </h3>
              {order.deliveryType === "CAMPUS" && order.campus && (
                <p className="text-sm font-bold text-primary mb-2">
                  Campus delivery: {order.campus.name}
                </p>
              )}
              <address className="not-italic text-text-chocolate font-medium leading-relaxed">
                <strong>{shippingAddress.name}</strong>
                <br />
                {shippingAddress.line1}
                {shippingAddress.line2 && (
                  <>
                    <br />
                    {shippingAddress.line2}
                  </>
                )}
                <br />
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.zip}
                <br />
                India
              </address>
              <div className="mt-6 p-3 bg-background-light border-2 border-text-chocolate rounded transform rotate-1">
                <p className="text-xs font-bold text-text-chocolate/70 uppercase mb-1">
                  Status
                </p>
                {isPaid && (
                  <div className="flex items-center gap-2 font-bold text-green-600 mb-2">
                    <span className="material-symbols-outlined text-lg">
                      check_circle
                    </span>
                    <span>Payment received</span>
                  </div>
                )}
                <div
                  className={`flex items-center gap-2 font-bold ${
                    isCancelled ? "text-red-600" : "text-accent-mango"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg ${cfg.iconClass}`}
                  >
                    {cfg.icon}
                  </span>
                  <span>{cfg.statusText}</span>
                </div>
              </div>
              {isPaid && order.razorpayPaymentId && (
                <div className="mt-4 p-3 bg-white border-2 border-text-chocolate/30 rounded">
                  <p className="text-xs font-bold text-text-chocolate/70 uppercase mb-1">
                    Transaction ID
                  </p>
                  <p className="font-mono text-sm font-bold text-text-chocolate break-all">
                    {order.razorpayPaymentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 bg-accent-mango text-text-chocolate text-xl border-4 border-text-chocolate shadow-[6px_6px_0px_0px_#2D1B0E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2D1B0E] hover:-rotate-1 transition-all transform btn-text text-center"
          >
            CONTINUE SHOPPING
          </Link>
          <Link
            href="/account/orders"
            className="w-full sm:w-auto px-8 py-4 bg-white text-text-chocolate text-xl border-4 border-text-chocolate shadow-[6px_6px_0px_0px_#E0F7FA] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#E0F7FA] hover:rotate-1 transition-all transform btn-text flex items-center justify-center gap-2"
          >
            VIEW ORDERS
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </Link>
        </div>

        {!isCancelled && (
          <div className="mt-16 relative inline-block transform -rotate-2">
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 tape-strip"
              aria-hidden
            />
            <div className="bg-white p-4 border-2 border-text-chocolate shadow-sm max-w-sm mx-auto">
              <p className="hand-font text-lg text-text-chocolate text-center">
                &quot;Check your email for the receipt bestie!&quot; 💌
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <OrderConfirmedLayout>
      <Suspense
        fallback={
          <div className="flex justify-center py-32">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">
              progress_activity
            </span>
          </div>
        }
      >
        <OrderConfirmedContent />
      </Suspense>
    </OrderConfirmedLayout>
  );
}
