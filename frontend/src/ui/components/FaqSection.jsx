
import React from "react";

const OA_FAQS = [
    { q: "How unlock works?", a: "Instant auto-unlock. After ₹499 payment, you are redirected to your dashboard with all 639 steps active." },
    { q: "What is 639 bundle?", a: "A complete dance curriculum: 196 Easy, 219 Medium, and 226 Hard steps. Studio-grade quality." },
    { q: "Payment security?", a: "100% Secure via Razorpay. We use 256-bit encryption. No card data is stored on our servers." },
    { q: "Who created curriculum?", a: "Designed by Aswin. Verified for rhythmic accuracy, progressive difficulty, and muscle memory." },
    { q: "Support availability?", a: "Lifetime WhatsApp support included. We usually reply within minutes for any technical or dance query." },
    { q: "Access control after login?", a: "Yes. Your purchase is linked to your email/phone. Login anytime from any device to access." },
    { q: "Refund/Cancellation?", a: "Due to the digital nature (instant unlock), sales are final. We focus on premium quality & support." },
    { q: "Hosting speed/performance?", a: "Hosted on high-speed premium servers with CDN. Videos load instantly with no buffer." }
];

export default function FaqSection() {
    return (
        <section className="section" id="faq">
            <div className="container-max">
                <h2 className="text-center section-head mx-auto anim-init" data-anim="fadeup">FAQ</h2>
                <div className="d-grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                    {OA_FAQS.map((f, i) => (
                        <div key={i} className="card-3d p-4 anim-init" data-anim="fadeup">
                            <h4 className="h6 fw-bold text-white mb-2">{f.q}</h4>
                            <p className="subtle small mb-0">{f.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
