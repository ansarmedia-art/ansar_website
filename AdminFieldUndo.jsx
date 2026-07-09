import React, { useEffect, useState } from 'react';

const MAX_FIELD_UNDO_ITEMS = 30;

function isEditableField(target) {
  const tagName = target?.tagName?.toLowerCase();
  if (!['input', 'textarea', 'select'].includes(tagName)) return false;
  if (target.type === 'password' || target.type === 'file') return false;
  return !target.disabled && !target.readOnly;
}

function readValue(element) {
  if (element.type === 'checkbox' || element.type === 'radio') return element.checked;
  return element.value;
}

function writeValue(element, value) {
  if (element.type === 'checkbox' || element.type === 'radio') {
    element.checked = !!value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return;
  }

  const tagName = element.tagName.toLowerCase();
  const proto = tagName === 'textarea'
    ? window.HTMLTextAreaElement.prototype
    : tagName === 'select'
      ? window.HTMLSelectElement.prototype
      : window.HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
  if (descriptor?.set) descriptor.set.call(element, value ?? '');
  else element.value = value ?? '';

  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

function getFieldLabel(element) {
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy)?.textContent?.trim();
    if (label) return label;
  }
  if (element.id) {
    const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.textContent?.trim();
    if (label) return label;
  }
  const nearbyLabel = element.closest('div')?.querySelector('label')?.textContent?.trim();
  return nearbyLabel || element.name || element.placeholder || 'field';
}

export default function AdminFieldUndo() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const lastValues = new WeakMap();

    const rememberCurrentValue = (event) => {
      if (!isEditableField(event.target)) return;
      lastValues.set(event.target, readValue(event.target));
    };

    const recordChange = (event) => {
      const target = event.target;
      if (!isEditableField(target)) return;

      const previousValue = lastValues.has(target) ? lastValues.get(target) : '';
      const nextValue = readValue(target);
      if (previousValue === nextValue) return;

      const entry = {
        element: target,
        previousValue,
        nextValue,
        label: getFieldLabel(target),
        createdAt: Date.now()
      };

      lastValues.set(target, nextValue);
      setHistory(current => [entry, ...current].slice(0, MAX_FIELD_UNDO_ITEMS));
    };

    document.addEventListener('focusin', rememberCurrentValue, true);
    document.addEventListener('input', recordChange, true);
    document.addEventListener('change', recordChange, true);

    return () => {
      document.removeEventListener('focusin', rememberCurrentValue, true);
      document.removeEventListener('input', recordChange, true);
      document.removeEventListener('change', recordChange, true);
    };
  }, []);

  const latest = history.find(item => item.element?.isConnected);
  if (!latest) return null;

  const undoLatest = () => {
    writeValue(latest.element, latest.previousValue);
    latest.element.focus?.();
    setHistory(current => current.filter(item => item !== latest));
  };

  return (
    <button
      type="button"
      onClick={undoLatest}
      className="fixed bottom-5 left-5 z-[9998] flex max-w-[min(92vw,22rem)] items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-900 shadow-2xl transition-all hover:-translate-y-0.5 hover:border-emerald-200"
      title={`Undo last change in ${latest.label}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14 4 9m0 0 5-5M4 9h11a5 5 0 0 1 0 10h-1" />
        </svg>
      </span>
      <span className="truncate">Undo edit: {latest.label}</span>
    </button>
  );
}
