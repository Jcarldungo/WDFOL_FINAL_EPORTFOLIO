'use client';

import { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { siteInfo } from '@/lib/content';

type FieldName = 'name' | 'email' | 'subject' | 'message';

const VALIDATORS: Record<FieldName, (v: string) => boolean> = {
  name: (v) => v.trim().length > 1,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  subject: (v) => v.trim().length > 2,
  message: (v) => v.trim().length >= 20,
};

const ERROR_MESSAGES: Record<FieldName, string> = {
  name: 'Please enter your name.',
  email: 'Please enter a valid email.',
  subject: 'Please enter a subject.',
  message: 'Please write a message (min. 20 characters).',
};

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');

  function update(field: FieldName, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function clearError(field: FieldName) {
    setErrors((e) => ({ ...e, [field]: false }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: Partial<Record<FieldName, boolean>> = {};
    (Object.keys(VALIDATORS) as FieldName[]).forEach((field) => {
      nextErrors[field] = !VALIDATORS[field](values[field]);
    });
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setStatus('sending');
    try {
      await emailjs.send(
        siteInfo.emailjs.serviceId,
        siteInfo.emailjs.templateId,
        {
          from_name: values.name,
          from_email: values.email,
          subject: values.subject,
          message: values.message,
        },
        { publicKey: siteInfo.emailjs.publicKey }
      );
      setStatus('success');
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out! I&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
      <div className="form-group">
        <label className="form-label" htmlFor="cf-name">Your Name</label>
        <input
          className={`form-input${errors.name ? ' error' : ''}`}
          type="text" id="cf-name" name="from_name" placeholder="Juan dela Cruz" autoComplete="name"
          aria-required="true" aria-invalid={errors.name || undefined}
          value={values.name} onChange={(e) => update('name', e.target.value)} onBlur={() => clearError('name')}
        />
        {errors.name && <span className="form-error visible" role="alert">{ERROR_MESSAGES.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="cf-email">Your Email</label>
        <input
          className={`form-input${errors.email ? ' error' : ''}`}
          type="email" id="cf-email" name="from_email" placeholder="juan@example.com" autoComplete="email"
          aria-required="true" aria-invalid={errors.email || undefined}
          value={values.email} onChange={(e) => update('email', e.target.value)} onBlur={() => clearError('email')}
        />
        {errors.email && <span className="form-error visible" role="alert">{ERROR_MESSAGES.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="cf-subject">Subject</label>
        <input
          className={`form-input${errors.subject ? ' error' : ''}`}
          type="text" id="cf-subject" name="subject" placeholder="Internship / Collaboration / etc." autoComplete="off"
          aria-required="true" aria-invalid={errors.subject || undefined}
          value={values.subject} onChange={(e) => update('subject', e.target.value)} onBlur={() => clearError('subject')}
        />
        {errors.subject && <span className="form-error visible" role="alert">{ERROR_MESSAGES.subject}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="cf-message">Message</label>
        <textarea
          className={`form-textarea${errors.message ? ' error' : ''}`}
          id="cf-message" name="message" placeholder="Tell me about the opportunity..." rows={5}
          aria-required="true" aria-invalid={errors.message || undefined}
          value={values.message} onChange={(e) => update('message', e.target.value)} onBlur={() => clearError('message')}
        />
        {errors.message && <span className="form-error visible" role="alert">{ERROR_MESSAGES.message}</span>}
      </div>

      {status === 'error' && (
        <p className="form-error visible" role="alert" style={{ marginBottom: 12 }}>
          Couldn&apos;t send that — try again, or email {siteInfo.email} directly.
        </p>
      )}

      <button type="submit" className={`submit-btn${status === 'sending' ? ' loading' : ''}`} disabled={status === 'sending'} aria-label="Send message">
        {status === 'sending' && <div className="spinner" aria-hidden="true" />}
        <span className="btn-text">{status === 'sending' ? 'Sending…' : 'Send Message →'}</span>
      </button>
    </form>
  );
}
