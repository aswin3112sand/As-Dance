import React from 'react';
import { Mail } from '../icons.jsx';

export default function EmailContact() {
  const email = 'bussinessaswin@gmail.com';

  return (
    <a 
      href={`mailto:${email}`}
      className="email-contact-link"
      title={`Email: ${email}`}
      aria-label={`Send email to ${email}`}
    >
      <Mail size={18} className="email-icon" />
      <span className="email-text">{email}</span>
    </a>
  );
}

export function EmailContactInline() {
  const email = 'bussinessaswin@gmail.com';
  return (
    <span className="email-inline">
      <Mail size={16} className="email-icon-inline" />
      {email}
    </span>
  );
}

export function EmailContactBadge() {
  const email = 'bussinessaswin@gmail.com';
  return (
    <div className="email-badge">
      <Mail size={20} />
      <div>
        <div className="email-label">Contact Us</div>
        <a href={`mailto:${email}`} className="email-value">{email}</a>
      </div>
    </div>
  );
}
