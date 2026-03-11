"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProfile } from "@/api/users";
import { listAddresses, toSavedAddress } from "@/api/addresses";
import { getOrders, formatPrice } from "@/api/orders";
import type { SavedAddress } from "@/types/account";

function formatOrderDate(iso: string): string {
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

function formatOrderStatus(status: string): string {
  const s = (status || "").toUpperCase();
  if (s === "DELIVERED") return "Delivered";
  if (s === "CANCELLED") return "Cancelled";
  if (s === "OUT_FOR_DELIVERY") return "Out for delivery";
  if (s === "SHIPPED") return "Shipped";
  if (s === "PENDING") return "Pending";
  if (s === "PROCESSING") return "Processing";
  return "Processing";
}

export default function AccountOverviewPage() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [defaultAddress, setDefaultAddress] = useState<SavedAddress | null>(null);
  const [recentOrders, setRecentOrders] = useState<
    { id: string; orderNumber: string; date: string; total: string; status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProfile(), listAddresses(), getOrders()])
      .then(([{ user }, { addresses }, { orders }]) => {
        const name =
          [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
          user.email.split("@")[0] ||
          "Snacker";
        setUserName(name);
        setUserEmail(user.email);
        const list = addresses.map(toSavedAddress);
        const defaultAddr = list.find((a) => a.isDefault) ?? list[0] ?? null;
        setDefaultAddress(defaultAddr);
        setRecentOrders(
          orders.slice(0, 3).map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            date: formatOrderDate(o.createdAt),
            total: formatPrice(o.total),
            status: formatOrderStatus(o.status),
          }))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h1
          className="text-4xl md:text-5xl text-text-chocolate brand-font"
          style={{ textShadow: "2px 2px 0px #E0F7FA" }}
        >
          Welcome back, <span className="text-primary">{userName}!</span>
        </h1>
        <span className="hidden md:inline-block hand-font text-lg -rotate-6 text-text-chocolate/70">
          Ready to snack?
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1 md:col-span-2 bg-white border-4 border-text-chocolate shadow-[8px_8px_0px_0px_#E0F7FA] p-6 relative overflow-hidden group hover:shadow-[4px_4px_0px_0px_#E0F7FA] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300">
          <div className="flex items-center justify-between mb-6 border-b-2 border-dashed border-text-chocolate/20 pb-4">
            <h2 className="text-2xl font-bold product-font uppercase tracking-wide">
              Recent Orders
            </h2>
            <Link
              href="/account/orders"
              className="text-sm font-bold underline decoration-2 decoration-accent-mango hover:text-accent-mango transition-colors"
            >
              View All
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-5xl text-text-chocolate/40 mb-4 block">
                shopping_bag
              </span>
              <p className="font-bold text-lg text-text-chocolate/80 mb-4">No orders yet</p>
              <p className="text-sm text-text-chocolate/60 mb-6">
                Your recent orders will show up here.
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 bg-primary text-white font-bold border-2 border-text-chocolate uppercase text-sm hover:opacity-90 transition-opacity"
              >
                Shop snacks
              </Link>
            </div>
          ) : (
            <>
              <div className="md:hidden -mx-6 px-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                <div className="flex gap-3 pb-2">
                  {recentOrders.map((order, i) => (
                    <Link
                      key={order.id}
                      href={`/order-confirmed?orderId=${order.id}`}
                      className={`flex-shrink-0 w-[160px] snap-center rounded-sm border-2 border-text-chocolate bg-background-light p-3 flex flex-col gap-2 transition-all active:scale-[0.98] ${
                        i === 0 ? "ring-2 ring-primary" : "opacity-90"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 border-2 border-text-chocolate flex items-center justify-center shrink-0 ${
                          i === 0 ? "bg-secondary" : "bg-background-light"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-xl ${
                            i === 0 ? "text-primary" : "text-text-chocolate/50"
                          }`}
                        >
                          {order.status === "Delivered" ? "check_circle" : "local_shipping"}
                        </span>
                      </div>
                      <p className="font-bold text-sm truncate">#{order.orderNumber}</p>
                      <p className="text-[11px] text-text-chocolate/70 leading-tight">{order.date}</p>
                      <span
                        className={`inline-block w-fit px-2 py-0.5 border border-text-chocolate text-[10px] font-bold uppercase rounded-full ${
                          order.status === "Delivered"
                            ? "bg-secondary"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="font-bold text-sm">{order.total}</p>
                      <span
                        className={`mt-auto text-center py-1.5 text-[10px] font-bold border-2 border-text-chocolate uppercase ${
                          i === 0 ? "bg-text-chocolate text-white" : "bg-white text-text-chocolate"
                        }`}
                      >
                        {i === 0 ? "Reorder" : "View"}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden md:block">
                {recentOrders.map((order, i) => (
                  <Link
                    key={order.id}
                    href={`/order-confirmed?orderId=${order.id}`}
                    className={`flex flex-col sm:flex-row items-center gap-4 p-4 bg-background-light border-2 border-text-chocolate mb-4 transition-all duration-200 block ${
                      i === 0
                        ? "hover:rotate-1"
                        : "opacity-60 hover:opacity-100 hover:rotate-1"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 border-2 border-text-chocolate flex items-center justify-center shrink-0 ${
                        i === 0 ? "bg-secondary" : "bg-background-light"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-3xl ${
                          i === 0 ? "text-primary" : "text-text-chocolate/50"
                        }`}
                      >
                        {order.status === "Delivered" ? "check_circle" : "local_shipping"}
                      </span>
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="font-bold text-lg">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-text-chocolate/70">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 border border-text-chocolate text-xs font-bold uppercase rounded-full mb-1 ${
                          order.status === "Delivered"
                            ? "bg-secondary"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="font-bold text-lg">{order.total}</p>
                    </div>
                    <span
                      className={`px-4 py-2 text-sm font-bold border-2 border-text-chocolate uppercase ${
                        i === 0 ? "bg-text-chocolate text-white" : "bg-white text-text-chocolate"
                      }`}
                    >
                      {i === 0 ? "Reorder" : "View"}
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-white border-4 border-text-chocolate shadow-[8px_8px_0px_0px_#FF6B6B] p-6 relative hover:shadow-[4px_4px_0px_0px_#FF6B6B] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300">
          <div className="absolute -top-3 -right-3 rotate-12 bg-accent-mango text-text-chocolate text-xs font-bold px-3 py-1 border-2 border-text-chocolate shadow-sm z-10">
            DEFAULT
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl text-primary">home_pin</span>
            <h2 className="text-2xl font-bold product-font uppercase tracking-wide">
              Where to ship
            </h2>
          </div>
          {defaultAddress ? (
            <>
              <div className="bg-secondary/30 border-2 border-text-chocolate p-4 mb-4 rotate-1">
                <p className="font-bold text-lg mb-1">{defaultAddress.recipientName}</p>
                <p className="text-text-chocolate/80 leading-relaxed">
                  {defaultAddress.line1}
                  {defaultAddress.line2 && <br />}
                  {defaultAddress.line2}
                  <br />
                  {defaultAddress.city}, {defaultAddress.state} {defaultAddress.zip}
                  <br />
                  {defaultAddress.country}
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <Link
                  href="/account/addresses"
                  className="flex-1 py-2 bg-white border-2 border-text-chocolate font-bold uppercase text-sm hover:bg-text-chocolate hover:text-white transition-colors text-center"
                >
                  Edit
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex-1 py-2 bg-white border-2 border-text-chocolate font-bold uppercase text-sm hover:bg-primary hover:text-white transition-colors text-center"
                >
                  Add New
                </Link>
              </div>
            </>
          ) : (
            <div className="mb-4">
              <p className="text-text-chocolate/70 font-bold mb-4">No saved address yet.</p>
              <Link
                href="/account/addresses"
                className="inline-block py-2 px-4 bg-primary text-white font-bold border-2 border-text-chocolate uppercase text-sm hover:opacity-90"
              >
                Add address
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white border-4 border-text-chocolate shadow-[8px_8px_0px_0px_#FF9F1C] p-6 relative hover:shadow-[4px_4px_0px_0px_#FF9F1C] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300">
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 tape-strip z-20"
            aria-hidden
          />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent-strawberry rounded-full flex items-center justify-center border-2 border-text-chocolate rotate-12 shadow-md z-20 animate-pulse">
            <div className="text-center transform -rotate-12 text-white">
              <span className="block text-xs font-bold">NEXT ORDER</span>
              <span className="block brand-font text-xl leading-none">10%</span>
              <span className="block brand-font text-xl leading-none">OFF</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl text-accent-mango">
              manage_accounts
            </span>
            <h2 className="text-2xl font-bold product-font uppercase tracking-wide">
              The Deets
            </h2>
          </div>
          <div className="space-y-4">
            <div className="group">
              <label className="block text-xs font-bold uppercase text-text-chocolate/60 mb-1">
                Email Address
              </label>
              <div className="flex items-center justify-between border-b-2 border-text-chocolate/10 pb-1 group-hover:border-primary transition-colors">
                <span className="font-bold text-lg">{userEmail}</span>
                <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 text-primary cursor-pointer">
                  edit
                </span>
              </div>
            </div>
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="w-5 h-5 border-2 border-text-chocolate bg-accent-mango flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <span className="text-sm font-bold">Subscribed to Newsletter</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
