import React from "react";

const OA_FAQS = [
  { q: "Naan full beginner. Enakku set aaguma?", a: "Yes. Basics la start panrom. Step by step explain pannuvom, so dance background venam." },
  { q: "Language enna?", a: "Tamil + English mix la easy ah explain pannuvom." },
  { q: "Course price confirm ah INR 499 dhaana?", a: "Yes. Current founders batch entry INR 499." },
  { q: "Ithu live online class aa?", a: "Illa. Ithu recorded 639-step practical course. Neenga ungalaoda time-ku practice pannalaam." },
  { q: "Payment safe ah?", a: "Razorpay secure gateway use panrom. Payment process protected." },
  { q: "Payment apram enna nadakkum?", a: "Payment success apram dashboard page open aagum. Anga Google Drive access moolama 639 steps use pannuveenga." },
  { q: "Doubt vandha yar kitte kekkanum?", a: "WhatsApp support irukum. Practice doubts clear panna help pannuvom." },
  { q: "Refund iruka?", a: "Access delivery nadakave illa na refund support pannuvom. Digital access delivered apram refund illa." },
  { q: "Custom choreography venumna?", a: "Adhu separate service. WhatsApp-la direct quote kudupom." }
];

export default function FaqSection() {
  return (
    <section className="section section-compact" id="faq">
      <div className="container-max">
        <h2 className="text-center section-head mx-auto anim-init" data-anim="fadeup">Common doubts - quick answers</h2>
        <div className="d-grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {OA_FAQS.map((faq, index) => (
            <div key={index} className="card-3d p-4 anim-init" data-anim="fadeup">
              <h4 className="h6 fw-bold text-white mb-2">{faq.q}</h4>
              <p className="subtle small mb-0">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
