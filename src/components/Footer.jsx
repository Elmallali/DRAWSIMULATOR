import { Phone, Globe, Mail, MapPin, Code, Smartphone, Network, TrendingUp } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-black border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-3 gap-12 mb-8">
          {/* Company Branding */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 p-1">
                <img 
                  src="/lgrks.png" 
                  alt="Rakops Solutions Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">RAKOPS SOLUTIONS</h3>
                <p className="text-sm text-gray-400 uppercase tracking-wider">Digital Innovation</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              <span className="text-white font-semibold">YOUR VISION, OUR DIGITAL MISSION.</span>
              <br />
              Transforming ideas into powerful digital solutions with cutting-edge technology and innovative approaches.
            </p>
            
            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Code className="w-4 h-4 text-blue-400" />
                <span>Web & Mobile Dev</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span>Process Automation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Network className="w-4 h-4 text-purple-400" />
                <span>Network Infrastructure</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Smartphone className="w-4 h-4 text-orange-400" />
                <span>Digital Marketing</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-2">
            <h4 className="text-xl font-bold text-white mb-6">Get In Touch</h4>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Phone</p>
                    <a href="tel:+212661913957" className="text-white font-semibold hover:text-blue-400 transition-colors">
                      +212-661-913957
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Globe className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Website</p>
                    <a 
                      href="https://www.rakopssolutions.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white font-semibold hover:text-green-400 transition-colors"
                    >
                      www.rakopssolutions.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Email</p>
                    <a 
                      href="mailto:contact@rakopssolutions.com" 
                      className="text-white font-semibold hover:text-purple-400 transition-colors"
                    >
                      contact@rakopssolutions.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                    <MapPin className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Location</p>
                    <p className="text-white font-semibold">
                      No15 lot communal 20280<br />
                      Casablanca, Morocco
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
              <h5 className="text-lg font-bold text-white mb-2">Ready to Start Your Project?</h5>
              <p className="text-gray-300 mb-4">
                Let's discuss how we can bring your digital vision to life with our expertise in modern web technologies.
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="mailto:contact@rakopssolutions.com?subject=Development Project Inquiry"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Start a Project
                </a>
                <a 
                  href="tel:+212661913957"
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Rakops Solutions. All rights reserved. | Developed with ❤️ in Morocco
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Powered by React & Modern Web Technologies</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
