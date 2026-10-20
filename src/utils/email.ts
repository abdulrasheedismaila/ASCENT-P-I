export const COMPANY_EMAIL = 'info.ascentproperties@gmail.com';

/**
 * Handles launching the user's email client directly,
 * engineered specifically to bypass iframe restrictions in preview
 * environments and reliably open default mail client or Gmail webmail.
 */
export const launchEmailClient = (e?: React.MouseEvent, subject?: string, body?: string) => {
  if (e) {
    // Prevent default anchor navigation if triggered programmatically
    // but allow the href fallback if supported
  }

  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';

  const mailtoUrl = `mailto:${COMPANY_EMAIL}${query}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${COMPANY_EMAIL}${subject ? `&su=${encodeURIComponent(subject)}` : ''}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

  // 1. Try standard window.location navigation for mailto
  let mailtoTriggered = false;
  try {
    window.location.href = mailtoUrl;
    mailtoTriggered = true;
  } catch (err) {
    console.warn('Direct location.href mailto failed:', err);
  }

  // 2. Also create an invisible link with target="_blank" as reliable trigger
  try {
    const a = document.createElement('a');
    a.href = mailtoUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.warn('Hidden anchor mailto failed:', err);
  }

  // 3. Fallback: Copy email to clipboard so user never gets stuck, and optionally open webmail
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(COMPANY_EMAIL).catch(() => {});
  }
};
