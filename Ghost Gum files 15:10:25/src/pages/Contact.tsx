import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission:', formData);
    // Handle form submission
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@ghostgum.com.au',
      description: 'We typically respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Northern Territory, Australia',
      description: 'Station visits by appointment'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+61 (0) 8 XXXX XXXX',
      description: 'Mon-Fri 9am-5pm ACST'
    }
  ];

  const subjects = [
    'General Inquiry',
    'Product Questions',
    'Wholesale Opportunities',
    'Press & Media',
    'Sustainability Questions',
    'Technical Support',
    'Other'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-[#5A6A5E]/10 to-transparent">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-6xl mb-6 text-ink tracking-tight">
            Get in Touch
          </h1>
          <p className="font-sans text-xl text-[#2B2B2B]/80 leading-relaxed max-w-2xl mx-auto">
            Have questions about our products, want to learn about wholesale, or just want to chat 
            about desert skincare? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-serif text-3xl mb-6 text-[#2B2B2B]">
                  Let's Connect
                </h2>
                <p className="font-sans text-[#2B2B2B]/70 leading-relaxed mb-8">
                  Whether you're new to tallow skincare or a longtime desert dweller, 
                  we're here to help you find the right products for your skin story.
                </p>
              </div>

              <div className="space-y-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#C88A4A]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon size={20} className="text-[#C88A4A]" />
                    </div>
                    <div>
                      <h3 className="font-sans font-medium text-[#2B2B2B] mb-1">
                        {item.title}
                      </h3>
                      <p className="font-sans font-medium text-[#C88A4A] mb-1">
                        {item.details}
                      </p>
                      <p className="font-sans text-sm text-[#2B2B2B]/60">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div className="bg-[#F6F3EE] rounded-2xl p-6">
                <h3 className="font-serif text-xl mb-4 text-[#2B2B2B]">
                  Station Hours
                </h3>
                <div className="space-y-2 text-sm font-sans">
                  <div className="flex justify-between">
                    <span className="text-[#2B2B2B]/70">Monday - Friday</span>
                    <span className="text-[#2B2B2B]">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2B2B2B]/70">Saturday</span>
                    <span className="text-[#2B2B2B]">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2B2B2B]/70">Sunday</span>
                    <span className="text-[#2B2B2B]">Closed</span>
                  </div>
                </div>
                <p className="font-sans text-xs text-[#2B2B2B]/60 mt-4">
                  All times ACST (Australian Central Standard Time)
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
                <h2 className="font-serif text-2xl mb-6 text-[#2B2B2B]">
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6 font-sans">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#2B2B2B] mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-[#2B2B2B]/20 focus:outline-none focus:border-[#C88A4A] focus:ring-1 focus:ring-[#C88A4A] transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#2B2B2B] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-2xl border border-[#2B2B2B]/20 focus:outline-none focus:border-[#C88A4A] focus:ring-1 focus:ring-[#C88A4A] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[#2B2B2B] mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-[#2B2B2B]/20 focus:outline-none focus:border-[#C88A4A] focus:ring-1 focus:ring-[#C88A4A] transition-colors"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#2B2B2B] mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-2xl border border-[#2B2B2B]/20 focus:outline-none focus:border-[#C88A4A] focus:ring-1 focus:ring-[#C88A4A] transition-colors resize-vertical"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2B2B2B] text-white py-4 px-8 rounded-2xl font-medium hover:bg-[#2B2B2B]/90 transition-colors flex items-center justify-center group"
                  >
                    Send Message
                    <Send size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;