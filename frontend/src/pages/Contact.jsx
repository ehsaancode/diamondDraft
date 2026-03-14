import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally handle submission
    alert("Thank you for your request! Our design team will contact you shortly.");
    setFormData({ name: '', email: '', service: '', message: '' });
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-20">
      
      {/* Header Section */}
      <section className="pt-20 pb-12 px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Get in Touch</p>
          <h1 className="text-5xl md:text-7xl font-serif text-black mb-8 leading-tight">
            Start Your <br/>Design Journey
          </h1>
          <p className="max-w-xl mx-auto text-gray-500 leading-relaxed text-sm md:text-base">
            Whether you need a custom alteration to an existing model, or want to architect an entirely new piece from a sketch, our digital artisans are ready to bring your vision into the matrix.
          </p>
        </motion.div>
      </section>

      {/* Content Grid */}
      <section className="px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column - Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl font-serif text-black mb-10">Studio Information</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="text-gray-900" size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-1">Email Us</h4>
                  <p className="text-gray-500 text-sm mb-1">For CAD requests & general inquiries:</p>
                  <a href="mailto:cad@gweldesigns.com" className="text-black font-medium hover:underline">cad@gweldesigns.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="text-gray-900" size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-1">Headquarters</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    123 Innovation Drive<br/>
                    Digital Arts District<br/>
                    New York, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="text-gray-900" size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-black mb-1">Operating Hours</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Monday – Friday: 9:00 AM - 6:00 PM (EST)<br/>
                    Saturday & Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 p-8 bg-black text-white">
              <h3 className="font-serif text-2xl mb-4">Dedicated Support</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Our support team includes experienced bench jewelers who understand the technical requirements of casting and stone setting. We guarantee a production-ready file every time.
              </p>
              <div className="flex items-center gap-2 text-white font-medium text-sm">
                <Phone size={16} /> <span>1-800-GWEL-CAD</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm"
          >
            <h2 className="text-2xl font-serif text-black mb-8">Send a Request</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Jane Doe"
                  className="border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@example.com"
                  className="border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="service" className="text-xs font-bold uppercase tracking-widest text-gray-500">Service Required</label>
                <select 
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a service type</option>
                  <option value="custom_cad">Custom CAD Design</option>
                  <option value="alteration">Alteration of Base Model</option>
                  <option value="rendering">Photorealistic Rendering</option>
                  <option value="printing_support">3D Printing Support</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-500">Project Details</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Describe your design vision, material requirements, or specific constraints..."
                  rows="4"
                  className="border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent resize-none"
                />
              </div>

              <button 
                type="submit"
                className="mt-4 w-full bg-black text-white p-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 group"
              >
                Submit Request <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            
            <p className="text-[10px] text-gray-400 mt-6 text-center uppercase tracking-widest">
              We typically reply within 24 hours.
            </p>

          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
