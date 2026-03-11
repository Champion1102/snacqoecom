import Link from 'next/link';

export default function ReturnRefundPolicyPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12 text-text-chocolate">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-text-chocolate hover:text-primary transition-colors mb-8"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to home
      </Link>

      <h1 className="font-black text-3xl md:text-4xl uppercase tracking-wide text-text-chocolate border-b-4 border-text-chocolate pb-4 mb-8">
        Return & Refund Policy
      </h1>
      <p className="text-sm font-bold text-text-chocolate/70 mb-10">Last Updated: February 25, 2026</p>

      <div className="space-y-8 font-medium text-text-chocolate/90">

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Overview
          </h2>
          <p>
            This Return & Refund Policy applies to purchases made from Snacqo through https://snacqo.com
            (the &quot;Site&quot;). By placing an order on our Site, you agree to the terms outlined below.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Return Eligibility
          </h2>
          <p>
            Due to the nature of food products, we do not accept returns once a product has been
            delivered. However, you may be eligible for a replacement or refund under the following
            conditions:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>You received the wrong product.</li>
            <li>The product was damaged during transit.</li>
            <li>The product packaging was tampered with before delivery.</li>
            <li>The product has expired at the time of delivery.</li>
          </ul>
          <p className="mt-4">To be eligible, you must:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Notify us within 48 hours of delivery.</li>
            <li>Provide clear photos or video evidence of the issue.</li>
            <li>Ensure the product is unused and in its original packaging.</li>
          </ul>
          <p className="mt-4">
            We reserve the right to reject any return or refund request that does not meet the
            above conditions.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Non-Returnable Items
          </h2>
          <p>The following items are not eligible for return or refund:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Opened or partially consumed food products.</li>
            <li>Products damaged due to misuse or improper storage.</li>
            <li>Requests made after 48 hours of delivery.</li>
            <li>Products purchased during special promotions or clearance sales (unless damaged or incorrect).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Refund Process
          </h2>
          <p>
            Once your request is received and inspected, we will notify you of the approval or
            rejection of your refund.
          </p>
          <p className="mt-3">If approved:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Refunds will be processed to your original payment method.</li>
            <li>Refunds may take 5–10 business days to reflect in your account, depending on your bank or payment provider.</li>
            <li>Refunds for prepaid orders will be processed via Razorpay to the original payment source.</li>
            <li>We do not provide cash refunds.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Replacements
          </h2>
          <p>
            If your product is eligible for replacement, we may:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Ship a replacement product at no additional cost, or</li>
            <li>Issue a full refund, at our discretion.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Cancellations
          </h2>
          <p>
            Orders can only be cancelled before they are dispatched. Once an order has been shipped,
            it cannot be cancelled.
          </p>
          <p className="mt-3">
            To request cancellation, contact us immediately at{' '}
            <a href="mailto:support@snacqo.com" className="text-primary hover:underline">support@snacqo.com</a>
            {' '}or 8809515069.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Shipping Costs
          </h2>
          <p>
            Shipping charges (if any) are non-refundable. In case of damaged or incorrect products,
            we will bear the replacement shipping cost.
          </p>
        </section>

        <section>
          <h2 className="font-black text-xl uppercase tracking-wide text-text-chocolate mt-10 mb-4">
            Contact Us
          </h2>
          <p>
            If you have questions about this Return & Refund Policy, please contact us:
          </p>
          <address className="not-italic mt-4 space-y-1">
            <p className="font-bold">Snacqo</p>
            <p>NH-44 (GT Road), near Bahalgarh Chowk</p>
            <p>Sonipat, Haryana – 131021</p>
            <p>India</p>
            <p>Phone: 8809515069</p>
            <p>
              Email:{' '}
              <a href="mailto:support@snacqo.com" className="text-primary hover:underline">
                support@snacqo.com
              </a>
            </p>
          </address>
        </section>

      </div>
    </article>
  );
}
