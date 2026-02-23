import React, { memo } from "react";
import { Mail, PhoneCall, ShieldCheck, WhatsApp } from "../icons.jsx";

function Footer() {
  return (
    <footer id="contacts" className="border-t border-blue-500/20 bg-[#0B1220] py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <section>
            <h3 className="text-xl font-bold text-white">AS DANCE</h3>
            <p className="mt-3 text-gray-300 leading-relaxed">
              Structured 639-step practical dance course with one-time payment and lifetime access.
            </p>
            <p className="mt-2 text-gray-400 text-sm">Music used is for demonstration &amp; practice purposes.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white">Contact</h3>
            <ul className="mt-3 space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-[#3B82F6]">
                  <WhatsApp size={16} />
                </span>
                +91 88256 02356
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-[#3B82F6]">
                  <Mail size={16} />
                </span>
                businessaswin@gmail.com
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-[#3B82F6]">
                  <PhoneCall size={16} />
                </span>
                Replies within 24 hours
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white">Policy</h3>
            <ul className="mt-3 space-y-2 text-gray-300">
              <li>Dashboard access unlocks after successful payment.</li>
              <li>Instruction support is available for paid users only.</li>
              <li>Refund applies only if access is not delivered.</li>
              <li>After delivery, digital sale is final.</li>
            </ul>
          </section>
        </div>

        <div className="mt-10 border-t border-blue-500/20 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} AS DANCE</p>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 px-3 py-1.5 text-sm text-gray-300">
            <ShieldCheck size={14} className="text-[#3B82F6]" />
            Secure payment and guided access
          </span>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
