import ContactForm from './ContactForm.jsx';
import FloatingChatWidget from './FloatingChatWidget.jsx';

export default function App() {
  return (
    <div className="relative text-slate-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </main>

      {/* Floating WhatsApp chat widget */}
      <FloatingChatWidget />
    </div>
  );
}