'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { siteInfo } from '@/lib/content';

type FieldName = 'name' | 'email' | 'subject' | 'message';

const MESSAGE_MIN = 20;

const VALIDATORS: Record<FieldName, (v: string) => boolean> = {
  name: (v) => v.trim().length > 1,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  subject: (v) => v.trim().length > 2,
  message: (v) => v.trim().length >= MESSAGE_MIN,
};

const ERROR_MESSAGES: Record<FieldName, string> = {
  name: 'Please enter your name.',
  email: 'Please enter a valid email — that’s where the reply goes.',
  subject: 'Please add a short subject.',
  message: `Please write at least ${MESSAGE_MIN} characters so I know what this is about.`,
};

const FIELDS = Object.keys(VALIDATORS) as FieldName[];

type Status = 'idle' | 'sending' | 'success' | 'error';
type Errors = Partial<Record<FieldName, boolean>>;

export function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const successRef = useRef<HTMLDivElement>(null);

  /** The form is replaced wholesale on success, so focus would otherwise drop
   *  back to the top of the document with nothing announced. */
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  function update(name: FieldName, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
    // Clear the error the moment the value becomes valid. The previous
    // version cleared on blur instead, which wiped the message while the
    // field was still wrong.
    if (errors[name] && VALIDATORS[name](value)) {
      setErrors((e) => ({ ...e, [name]: false }));
    }
  }

  function revalidate(name: FieldName) {
    // Only re-check a field the visitor has already been told about, so a
    // half-typed email doesn't turn red the first time they tab past it.
    if (!errors[name]) return;
    setErrors((e) => ({ ...e, [name]: !VALIDATORS[name](values[name]) }));
  }

  /** Shared wiring for every control: id, value, change/blur, and the ARIA
   *  that ties an input to its error text. */
  function bind(name: FieldName, describedBy?: string) {
    const ids = [errors[name] ? `cf-${name}-error` : null, describedBy].filter(Boolean).join(' ');
    return {
      id: `cf-${name}`,
      name,
      value: values[name],
      required: true,
      'aria-invalid': errors[name] ? (true as const) : undefined,
      'aria-describedby': ids || undefined,
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(name, e.target.value),
      onBlur: () => revalidate(name),
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: Errors = {};
    FIELDS.forEach((name) => {
      nextErrors[name] = !VALIDATORS[name](values[name]);
    });
    setErrors(nextErrors);

    // Send focus to the first problem rather than leaving the visitor to hunt.
    const firstInvalid = FIELDS.find((f) => nextErrors[f]);
    if (firstInvalid) {
      document.getElementById(`cf-${firstInvalid}`)?.focus();
      return;
    }

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
      <div className="form-success" role="status" tabIndex={-1} ref={successRef}>
        <h3>Message sent</h3>
        <p>
          Thanks for reaching out{values.name.trim() ? `, ${values.name.trim().split(/\s+/)[0]}` : ''} — I&apos;ll
          reply to <strong>{values.email.trim()}</strong> within 24–48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
      <div className="form-group">
        <label className="form-label" htmlFor="cf-name">Your name</label>
        <input
          className={`form-input${errors.name ? ' error' : ''}`}
          type="text" placeholder="Juan dela Cruz" autoComplete="name"
          {...bind('name')}
        />
        {errors.name && <span className="form-error" id="cf-name-error" role="alert">{ERROR_MESSAGES.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="cf-email">Your email</label>
        <input
          className={`form-input${errors.email ? ' error' : ''}`}
          type="email" placeholder="juan@example.com" autoComplete="email" inputMode="email"
          {...bind('email')}
        />
        {errors.email && <span className="form-error" id="cf-email-error" role="alert">{ERROR_MESSAGES.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="cf-subject">Subject</label>
        <input
          className={`form-input${errors.subject ? ' error' : ''}`}
          type="text" placeholder="Internship / Collaboration / etc." autoComplete="off"
          {...bind('subject')}
        />
        {errors.subject && <span className="form-error" id="cf-subject-error" role="alert">{ERROR_MESSAGES.subject}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="cf-message">Message</label>
        <textarea
          className={`form-textarea${errors.message ? ' error' : ''}`}
          placeholder="Tell me about the role, the project, or what you're building…" rows={5}
          {...bind('message', 'cf-message-hint')}
        />
        <span className="form-hint" id="cf-message-hint">
          A couple of sentences is plenty — {MESSAGE_MIN} characters minimum.
        </span>
        {errors.message && <span className="form-error" id="cf-message-error" role="alert">{ERROR_MESSAGES.message}</span>}
      </div>

      {status === 'error' && (
        <p className="form-error form-error--block" role="alert">
          That didn&apos;t send. Try again, or email{' '}
          <a href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a> directly.
        </p>
      )}

      <button
        type="submit"
        className={`submit-btn${status === 'sending' ? ' loading' : ''}`}
        disabled={status === 'sending'}
      >
        {status === 'sending' && <span className="spinner" aria-hidden="true" />}
        <span className="btn-text">{status === 'sending' ? 'Sending…' : 'Send message'}</span>
        {status !== 'sending' && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}
