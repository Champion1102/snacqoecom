"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckoutLayout } from "@/components/CheckoutLayout";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { SavedAddressPicker } from "@/components/checkout/SavedAddressPicker";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { EmailVerificationModal } from "@/components/checkout/EmailVerificationModal";
import { getCart, type CartItemResponse } from "@/api/cart";
import {
  createOrder,
  createPaymentOrder,
  verifyPayment,
  cancelOrder,
} from "@/api/orders";
import {
  listAddresses,
  createAddress,
  type AddressResponse,
} from "@/api/addresses";
import { validateCoupon } from "@/api/coupons";
import { getCampuses, type CampusResponse } from "@/api/campuses";
import { getSettings } from "@/api/settings";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { loadRazorpayScript } from "@/utils/razorpay";
import { getStandardShippingPaise } from "@/lib/shipping";
import type { ShippingFormData } from "@/types/checkout";
import type { CheckoutOrderItem } from "@/types/checkout";

function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

function mapToCheckoutItem(item: CartItemResponse): CheckoutOrderItem {
  const v = item.variant;
  const product = v?.product;
  const pricePaise = v?.price ?? 0;
  return {
    id: item.id,
    name: product?.name ?? "",
    variant: v?.name ?? "",
    imageUrl: product?.images?.[0]?.url ?? "",
    quantity: item.quantity,
    price: formatPrice(pricePaise),
    pricePaise,
  };
}

function useNeedsEmailVerification() {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  return {
    isVerifiedFor: (email: string) => Boolean(email && verifiedEmail === email),
    setVerified: (email: string) => setVerifiedEmail(email),
  };
}

function nameToFirstLast(name: string): { first: string; last: string } {
  const parts = (name || "").trim().split(/\s+/);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function CampusDeliveryForm({
  initialEmail,
  initialFirstName,
  initialLastName,
  initialPhone,
  onSubmit,
  isSubmitting,
  canSubmit,
}: {
  initialEmail: string;
  initialFirstName?: string;
  initialLastName?: string;
  initialPhone?: string;
  onSubmit: (data: ShippingFormData) => void;
  isSubmitting: boolean;
  canSubmit: boolean;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [firstName, setFirstName] = useState(initialFirstName ?? "");
  const [lastName, setLastName] = useState(initialLastName ?? "");
  const [phone, setPhone] = useState(initialPhone ?? "");
  const hasAppliedInitialRef = useRef(false);

  useEffect(() => {
    const hasInitial =
      initialFirstName !== undefined ||
      initialLastName !== undefined ||
      initialPhone !== undefined;
    if (hasInitial && !hasAppliedInitialRef.current) {
      if (initialFirstName !== undefined) setFirstName(initialFirstName);
      if (initialLastName !== undefined) setLastName(initialLastName);
      if (initialPhone !== undefined) setPhone(initialPhone);
      hasAppliedInitialRef.current = true;
    }
    if (!hasInitial) hasAppliedInitialRef.current = false;
  }, [initialFirstName, initialLastName, initialPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: phone.trim(),
      saveInfo: false,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-8 border-4 border-text-chocolate shadow-[8px_8px_0px_0px_#2D1B0E] space-y-4"
    >
      <div>
        <label className="block font-extrabold text-sm uppercase tracking-wide text-text-chocolate mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border-2 border-text-chocolate px-3 py-2 font-bold text-text-chocolate"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-extrabold text-sm uppercase tracking-wide text-text-chocolate mb-1">
            First name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full rounded-md border-2 border-text-chocolate px-3 py-2 font-bold text-text-chocolate"
          />
        </div>
        <div>
          <label className="block font-extrabold text-sm uppercase tracking-wide text-text-chocolate mb-1">
            Last name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-md border-2 border-text-chocolate px-3 py-2 font-bold text-text-chocolate"
          />
        </div>
      </div>
      <div>
        <label className="block font-extrabold text-sm uppercase tracking-wide text-text-chocolate mb-1">
          Phone
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="10-digit mobile"
          className="w-full rounded-md border-2 border-text-chocolate px-3 py-2 font-bold text-text-chocolate"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !canSubmit}
        className="w-full py-3 bg-accent-mango text-text-chocolate font-bold border-2 border-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2D1B0E] transition-all uppercase tracking-wider btn-text disabled:opacity-50"
      >
        {isSubmitting ? "Processing…" : "Proceed to payment"}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { isVerifiedFor, setVerified } = useNeedsEmailVerification();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<ShippingFormData | null>(null);
  const [pendingCampusOptions, setPendingCampusOptions] = useState<{
    isCampus: boolean;
    campusId: string;
  } | null>(null);

  const [items, setItems] = useState<CheckoutOrderItem[]>([]);
  const [subtotalPaise, setSubtotalPaise] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [allowMultipleCoupons, setAllowMultipleCoupons] = useState(false);
  type AppliedCoupon = {
    code: string;
    discountAmount: number;
    freeShipping: boolean;
    message: string;
  };
  const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupon[]>([]);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const { refreshCart } = useCart();

  const [savedAddresses, setSavedAddresses] = useState<AddressResponse[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressMode, setAddressMode] = useState<"picker" | "form">("picker");

  const [deliveryType, setDeliveryType] = useState<"standard" | "campus">("standard");
  const [campuses, setCampuses] = useState<CampusResponse[]>([]);
  const [selectedCampusId, setSelectedCampusId] = useState<string>("");

  useEffect(() => {
    const cartReq = getCart()
      .then(({ cart }) => {
        const list = (cart?.items ?? []) as CartItemResponse[];
        setItems(list.map(mapToCheckoutItem));
        let total = 0;
        for (const item of list) {
          const v = item.variant;
          if (v?.price != null) total += v.price * item.quantity;
        }
        setSubtotalPaise(total);
      })
      .catch(() => setItems([]));

    const addrReq = isLoggedIn
      ? listAddresses()
          .then(({ addresses }) => {
            setSavedAddresses(addresses);
            if (addresses.length > 0) {
              const def = addresses.find((a) => a.isDefault) ?? addresses[0];
              setSelectedAddressId(def.id);
              setAddressMode("picker");
            } else {
              setAddressMode("form");
            }
          })
          .catch(() => setAddressMode("form"))
      : Promise.resolve();

    const settingsReq = getSettings()
      .then((s) => setAllowMultipleCoupons(s.allowMultipleCoupons))
      .catch(() => setAllowMultipleCoupons(false));

    const campusesReq = getCampuses()
      .then(({ campuses: c }) => setCampuses(c))
      .catch(() => setCampuses([]));

    Promise.all([cartReq, addrReq, settingsReq, campusesReq]).finally(() =>
      setLoading(false)
    );
  }, [isLoggedIn]);

  const isCampusDelivery = deliveryType === "campus" && !!selectedCampusId;
  const discountPaise = appliedCoupons.reduce((sum, c) => sum + c.discountAmount, 0);
  const freeShipping = appliedCoupons.some((c) => c.freeShipping);
  const shippingPaise =
    freeShipping || isCampusDelivery ? 0 : getStandardShippingPaise(subtotalPaise);
  const subtotalStr = formatPrice(subtotalPaise);
  const totalPaise = Math.max(0, subtotalPaise - discountPaise + shippingPaise);
  const totalStr = formatPrice(totalPaise);
  const discountStr = discountPaise > 0 ? formatPrice(discountPaise) : undefined;
  const shippingStr =
    freeShipping || isCampusDelivery ? "Free" : formatPrice(shippingPaise);

  const handleApplyCoupon = async (code: string) => {
    setCouponMessage(null);
    const codeUpper = code.trim().toUpperCase();
    if (appliedCoupons.some((c) => c.code.toUpperCase() === codeUpper)) {
      setCouponMessage("This coupon is already applied.");
      return;
    }
    try {
      const res = await validateCoupon(code, subtotalPaise, {
        isCampusOrder: isCampusDelivery,
        campusId: selectedCampusId || undefined,
      });
      if (res.valid) {
        const message =
          res.message ??
          (res.freeShipping
            ? "Free shipping applied."
            : `Discount applied: ${formatPrice(res.discountAmount ?? 0)}`);
        if (allowMultipleCoupons) {
          setAppliedCoupons((prev) => [
            ...prev,
            {
              code: codeUpper,
              discountAmount: res.discountAmount ?? 0,
              freeShipping: res.freeShipping ?? false,
              message,
            },
          ]);
        } else {
          setAppliedCoupons([
            {
              code: codeUpper,
              discountAmount: res.discountAmount ?? 0,
              freeShipping: res.freeShipping ?? false,
              message,
            },
          ]);
        }
        setCouponMessage(message);
      } else {
        setCouponMessage(res.message || "Invalid coupon.");
      }
    } catch {
      setCouponMessage("Could not validate coupon.");
    }
  };

  const handleRemoveCoupon = (code: string) => {
    setAppliedCoupons((prev) =>
      prev.filter((c) => c.code.toUpperCase() !== code.toUpperCase())
    );
    setCouponMessage(null);
  };

  const addressToFormData = (addr: AddressResponse): ShippingFormData => {
    const nameParts = addr.name.trim().split(" ");
    return {
      email: user?.email ?? "",
      firstName: nameParts[0] ?? "",
      lastName: nameParts.slice(1).join(" "),
      address: addr.line1,
      city: addr.city,
      state: addr.state,
      zipCode: addr.pincode,
      phone: addr.phone,
      saveInfo: false,
    };
  };

  const handleUseSavedAddress = () => {
    const addr = savedAddresses.find((a) => a.id === selectedAddressId);
    if (!addr) return;
    proceedToPayment(addressToFormData(addr));
  };

  const handleSubmit = (data: ShippingFormData) => {
    if (isLoggedIn || isVerifiedFor(data.email)) {
      proceedToPayment(data);
      return;
    }
    setPendingFormData(data);
    setShowEmailModal(true);
  };

  const proceedToPayment = async (
    data: ShippingFormData,
    options?: { isCampus: boolean; campusId: string }
  ) => {
    setError(null);
    setSubmitting(true);

    const isCampus = options?.isCampus && options?.campusId;

    if (data.saveInfo && isLoggedIn && !isCampus) {
      try {
        await createAddress({
          label: "Home",
          name: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
          phone: data.phone.trim(),
          line1: data.address.trim(),
          city: data.city.trim(),
          state: data.state.trim(),
          pincode: data.zipCode.trim(),
          isDefault: true,
        });
      } catch {
        // non-fatal
      }
    }

    try {
      const orderPayload = isCampus
        ? {
            email: data.email.trim().toLowerCase(),
            deliveryType: "CAMPUS" as const,
            campusId: options!.campusId,
            shippingName: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
            shippingPhone: data.phone.trim(),
            ...(appliedCoupons.length > 0
              ? { couponCodes: appliedCoupons.map((c) => c.code) }
              : {}),
          }
        : {
            email: data.email.trim().toLowerCase(),
            shippingName: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
            shippingPhone: data.phone.trim(),
            shippingLine1: data.address.trim(),
            shippingLine2: null,
            shippingCity: data.city.trim(),
            shippingState: data.state.trim(),
            shippingPincode: data.zipCode.trim(),
            ...(appliedCoupons.length > 0
              ? { couponCodes: appliedCoupons.map((c) => c.code) }
              : {}),
          };

      const res = await createOrder(orderPayload);
      const orderId = res.order.id;
      const orderNumber = res.order.orderNumber;
      const email = data.email;
      const shippingName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

      let paymentConfig: Awaited<ReturnType<typeof createPaymentOrder>>;
      try {
        paymentConfig = await createPaymentOrder(orderId);
      } catch (e) {
        try {
          await cancelOrder(orderId);
        } catch {
          /* best-effort */
        }
        setSubmitting(false);
        setError(
          e instanceof Error
            ? e.message
            : "Could not start payment. Please try again."
        );
        return;
      }

      await loadRazorpayScript();
      const Razorpay = window.Razorpay!;

      const handleCancel = async (reason: "cancelled" | "failed") => {
        try {
          await cancelOrder(orderId);
          await refreshCart();
        } catch {
          /* best-effort */
        }
        setSubmitting(false);
        if (reason === "cancelled") {
          setError(
            "Payment was cancelled. Your cart has been restored — try again when ready."
          );
        } else {
          setError(
            "Payment failed. Your cart has been restored — try again or use a different payment method."
          );
        }
      };

      const rzp = new Razorpay({
        key: paymentConfig.key,
        amount: paymentConfig.amount,
        currency: paymentConfig.currency,
        order_id: paymentConfig.razorpayOrderId,
        name: "snacQO",
        description: `Order ${orderNumber}`,
        prefill: { name: shippingName, email, contact: data.phone.trim() },
        notes: { orderId, orderNumber },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPayment(orderId, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            await refreshCart();
            router.push(
              `/order-confirmed?orderId=${orderId}&orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
            );
          } catch {
            setError(
              "Payment verification failed. Please contact support with order number: " +
                orderNumber
            );
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            handleCancel("cancelled");
          },
        },
      });
      rzp.on("payment.failed", () => {
        handleCancel("failed");
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to place order.");
      setSubmitting(false);
    }
  };

  const handleEmailVerified = () => {
    if (!pendingFormData) return;
    setVerified(pendingFormData.email);
    setShowEmailModal(false);
    proceedToPayment(pendingFormData, pendingCampusOptions ?? undefined);
    setPendingFormData(null);
    setPendingCampusOptions(null);
  };

  if (loading) {
    return (
      <CheckoutLayout step="shipping">
        <div className="max-w-6xl mx-auto flex justify-center py-32">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout step="shipping">
      {showEmailModal && pendingFormData && (
        <EmailVerificationModal
          email={pendingFormData.email}
          firstName={pendingFormData.firstName}
          lastName={pendingFormData.lastName}
          onVerify={handleEmailVerified}
          onClose={() => {
            setShowEmailModal(false);
            setPendingFormData(null);
            setPendingCampusOptions(null);
          }}
        />
      )}
      <span
        className="absolute top-32 left-10 z-0 hidden lg:block opacity-50 material-symbols-outlined text-6xl text-accent-strawberry rotate-12"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        local_shipping
      </span>
      <span
        className="absolute bottom-20 right-20 z-0 hidden lg:block opacity-50 material-symbols-outlined text-8xl text-accent-mango -rotate-12"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden
      >
        shopping_bag
      </span>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary text-white w-10 h-10 flex items-center justify-center border-2 border-text-chocolate shadow-[3px_3px_0px_0px_#2D1B0E] font-black text-xl rotate-[-3deg]">
              1
            </div>
            <h2 className="text-3xl md:text-4xl text-text-chocolate brand-font uppercase tracking-tight">
              Shipping Deets
            </h2>
          </div>
          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-800 px-4 py-2 font-bold">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 mb-6">
            <span className="font-extrabold text-sm uppercase tracking-wide text-text-chocolate">
              Delivery type
            </span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deliveryType"
                  checked={deliveryType === "standard"}
                  onChange={() => setDeliveryType("standard")}
                  className="w-4 h-4 text-primary border-2 border-text-chocolate"
                />
                <span className="font-bold text-text-chocolate">
                  Deliver to my address
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="deliveryType"
                  checked={deliveryType === "campus"}
                  onChange={() => {
                    setDeliveryType("campus");
                    setSelectedCampusId(campuses[0]?.id ?? "");
                  }}
                  className="w-4 h-4 text-primary border-2 border-text-chocolate"
                />
                <span className="font-bold text-text-chocolate">
                  Campus delivery (free shipping)
                </span>
              </label>
            </div>
          </div>

          {deliveryType === "campus" ? (
            <div className="space-y-6">
              <div>
                <label className="block font-extrabold text-sm uppercase tracking-wide text-text-chocolate mb-2">
                  Select campus
                </label>
                <select
                  value={selectedCampusId}
                  onChange={(e) => setSelectedCampusId(e.target.value)}
                  className="w-full rounded-md border-2 border-text-chocolate px-3 py-2 font-bold text-text-chocolate bg-white"
                >
                  <option value="">Choose a campus</option>
                  {campuses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {selectedCampusId &&
                  (() => {
                    const campus = campuses.find((c) => c.id === selectedCampusId);
                    return campus ? (
                      <p className="mt-2 text-sm text-text-chocolate/80 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                        <strong>Note:</strong> Selecting this option means your delivery
                        location is <strong>{campus.name}</strong> — {campus.line1},{" "}
                        {campus.city}, {campus.state} {campus.pincode}.
                      </p>
                    ) : null;
                  })()}
              </div>
              <CampusDeliveryForm
                initialEmail={user?.email ?? ""}
                initialFirstName={
                  isLoggedIn && savedAddresses.length > 0
                    ? nameToFirstLast(
                        (
                          savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0]
                        ).name
                      ).first
                    : undefined
                }
                initialLastName={
                  isLoggedIn && savedAddresses.length > 0
                    ? nameToFirstLast(
                        (
                          savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0]
                        ).name
                      ).last
                    : undefined
                }
                initialPhone={
                  isLoggedIn && savedAddresses.length > 0
                    ? (savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0]).phone
                    : undefined
                }
                onSubmit={(data) => {
                  if (isLoggedIn || isVerifiedFor(data.email)) {
                    proceedToPayment(data, {
                      isCampus: true,
                      campusId: selectedCampusId,
                    });
                  } else {
                    setPendingFormData(data);
                    setPendingCampusOptions({
                      isCampus: true,
                      campusId: selectedCampusId,
                    });
                    setShowEmailModal(true);
                  }
                }}
                isSubmitting={submitting}
                canSubmit={!!selectedCampusId}
              />
            </div>
          ) : isLoggedIn &&
            savedAddresses.length > 0 &&
            addressMode === "picker" ? (
            <SavedAddressPicker
              addresses={savedAddresses}
              selectedId={selectedAddressId}
              onSelect={setSelectedAddressId}
              onUseSelected={handleUseSavedAddress}
              onAddNew={() => setAddressMode("form")}
              isSubmitting={submitting}
            />
          ) : (
            <>
              {isLoggedIn && savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setAddressMode("picker")}
                  className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-primary hover:underline mb-2"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Use a saved address
                </button>
              )}
              <ShippingForm
                onSubmit={handleSubmit}
                isSubmitting={submitting}
                initialData={isLoggedIn ? { email: user?.email ?? "" } : undefined}
              />
            </>
          )}
        </div>
        <div className="lg:col-span-5 relative">
          <CheckoutOrderSummary
            items={items}
            subtotal={subtotalStr}
            total={totalStr}
            shippingAmount={shippingStr}
            appliedCoupons={appliedCoupons}
            discountAmount={discountStr}
            couponMessage={couponMessage ?? undefined}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
          />
        </div>
      </div>
    </CheckoutLayout>
  );
}
