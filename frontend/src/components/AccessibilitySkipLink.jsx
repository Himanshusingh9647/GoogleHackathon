import React from 'react';

/**
 * AccessibilitySkipLink provides a keyboard-accessible shortcut
 * for screen readers and keyboard users to bypass standard headers
 * and jump straight to the main planning panel.
 */
export default function AccessibilitySkipLink({ targetId = 'main-content' }) {
  const handleClick = (e) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus();
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-transform"
    >
      Skip to Main Content
    </a>
  );
}
