import { useState } from 'react';

// Point this at your backend. In production, set VITE_API_URL in a .env file.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const initialState = { 
  name: '', 
  email: '', 
  countryCode: '+91', 
  phone: '', 
  subject: '', 
  message: '' 
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ state: 'idle', error: '' }); // idle | loading | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', error: '' });

    // Only include country code if the user actually typed a phone number
    const formattedPhone = form.phone.trim() 
      ? `${form.countryCode} ${form.phone.trim()}` 
      : '';

    const payload = {
      name: form.name,
      email: form.email,
      phone: formattedPhone,
      subject: form.subject,
      message: form.message,
    };

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus({ state: 'success', error: '' });
      setForm(initialState);
      setTimeout(() => setStatus({ state: 'idle', error: '' }), 5000);
    } catch (err) {
      setStatus({ state: 'error', error: err.message });
    }
  };

  // Dual-theme classes for input fields, textareas, and select elements
  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-sm shadow-sm transition-all';
  
  const labelClass =
    'text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400';

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="w-full max-w-4xl">
        <form id="contact-form" onSubmit={handleSubmit} className="p-8 sm:p-12 rounded-3xl shadow-2xl space-y-6 transition-all duration-300 border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl">
          
          <div className="text-center space-y-2 mb-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Get in Touch</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Have a project in mind or want to chat? Send me a message!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Your Name</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className={inputClass} />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Your Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone Number with Country Code Dropdown */}
            <div className="space-y-2">
              <label className={labelClass}>
                Phone Number <span className="text-slate-500 dark:text-slate-500 font-normal lowercase">(optional)</span>
              </label>
              <div className="flex items-center gap-2">
                <select 
                  name="countryCode" 
                  value={form.countryCode} 
                  onChange={handleChange} 
                  className="w-[115px] shrink-0 px-2 py-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-sm cursor-pointer shadow-sm"
                >
                  <option value="+91">+91 IN</option>
                  <option value="+1">+1 US/CA</option>
                  <option value="+44">+44 UK</option>
                  <option value="+61">+61 AU</option>
                  <option value="+971">+971 AE</option>
                  <option value="+49">+49 DE</option>
                  <option value="+33">+33 FR</option>
                  <option value="+81">+81 JP</option>
                  <option value="+65">+65 SG</option>
                  <option value="+93">+93 AF</option>
                  <option value="+355">+355 AL</option>
                  <option value="+54">+54 AR</option>
                  <option value="+55">+55 BR</option>
                  <option value="+86">+86 CN</option>
                  <option value="+39">+39 IT</option>
                  <option value="+92">+92 PK</option>
                </select>
                <input 
                  type="tel" 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  placeholder="9876543210" 
                  className={inputClass} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} required placeholder="Project Collaboration" className={inputClass} />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows="4" required placeholder="Hello Bala..." className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={status.state === 'loading'}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-indigo-500/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100 cursor-pointer"
          >
            <i className={`fas ${status.state === 'loading' ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
            <span>{status.state === 'loading' ? 'Sending...' : 'Send Message'}</span>
          </button>

          {status.state === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm text-center font-medium animate-fade-in">
              <i className="fas fa-check-circle mr-2"></i> Message sent successfully! I will get back to you soon.
            </div>
          )}
          {status.state === 'error' && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center font-medium animate-fade-in">
              <i className="fas fa-exclamation-circle mr-2"></i> {status.error}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}