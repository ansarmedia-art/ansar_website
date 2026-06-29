import React, { useState } from 'react';
import Layout from './Layout';

export default function Contact() {
  const schoolEmail = 'hr@ansar.in';
  const developerEmail = 'ansarmedia@ansarschool.in';
  const developerPhone = '9188081324';
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Admission Query',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Structure the text payload
    const payload = `Hello Ansar English School, I have an inquiry:
- Name: ${formData.name}
- Phone: ${formData.phone}
- Email: ${formData.email}
- Category: ${formData.category}

Message:
${formData.message}`;

    // 2. Encode for URL safety
    const encodedPayload = encodeURIComponent(payload);
    
    // 3. Open WhatsApp in a new tab
    const whatsappUrl = `https://wa.me/918129808051?text=${encodedPayload}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Get in Touch</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900">Contact Us</h1>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">We are here to answer any questions you may have. Reach out to us and we'll respond as soon as we can.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
          
          {/* Left Side: Contact Information */}
          <div className="bg-slate-900 text-white p-10 lg:p-14 lg:w-5/12 flex flex-col justify-between relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500 opacity-10"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Campus Address</h4>
                    <p className="mt-1 text-slate-300 leading-relaxed">Ansar English School<br />Perumpilavu, Karikkad P.O<br />Thrissur, Kerala - 680519</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Email Us</h4>
                    <a href={`mailto:${schoolEmail}`} className="mt-1 inline-block text-slate-300 transition-colors hover:text-emerald-300">{schoolEmail}</a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">Call Us</h4>
                    <p className="mt-1 text-slate-300">+91 81298 08051</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="p-10 lg:p-14 lg:w-7/12">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-colors" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Inquiry Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-colors appearance-none">
                    <option value="Admission Query">Admission Query</option>
                    <option value="General Information">General Information</option>
                    <option value="Other Queries">Other Queries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg group">
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
                Submit
              </button>
            </form>
          </div>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-emerald-700 p-8 text-white lg:p-10">
              <p className="text-sm font-black uppercase tracking-widest text-emerald-100">Help Desk</p>
              <h2 className="mt-3 text-2xl font-extrabold">Connect with the developer</h2>
              <p className="mt-3 text-sm leading-relaxed text-emerald-50">For website support, corrections, media updates, or technical help, contact the development desk directly.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:p-8">
              <a href={`mailto:${developerEmail}`} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5 transition-colors hover:border-emerald-200 hover:bg-emerald-50">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </span>
                <span>
                  <span className="block text-sm font-black uppercase tracking-wider text-slate-500">Media Mail</span>
                  <span className="mt-1 block break-all text-base font-extrabold text-slate-900">{developerEmail}</span>
                </span>
              </a>
              <a href={`tel:+91${developerPhone}`} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5 transition-colors hover:border-emerald-200 hover:bg-emerald-50">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </span>
                <span>
                  <span className="block text-sm font-black uppercase tracking-wider text-slate-500">Developer Phone</span>
                  <span className="mt-1 block text-base font-extrabold text-slate-900">+91 91880 81324</span>
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Interactive Satellite Map Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center lg:text-left">Find Us on the Map</h3>
          <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-slate-200">
            <iframe
              title="Ansar English School Satellite Map"
              src="https://maps.google.com/maps?q=Ansar%20English%20School,%20Perumpilavu&t=k&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </Layout>
  );
}
