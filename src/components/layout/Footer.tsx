import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card-bg border-t border-primary-green/10 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-orbitron text-xl font-bold text-gradient mb-4">
              Empyreal Energy
            </h3>
            <p className="text-text-muted text-sm mb-4">
              Professional solar energy solutions for Nigerian businesses. Reliable power, predictable costs, unlimited potential.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-orbitron text-primary-green font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-text-muted hover:text-primary-green transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-text-muted hover:text-primary-green transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-muted hover:text-primary-green transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-muted hover:text-primary-green transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="font-orbitron text-primary-green font-semibold mb-4">
              Products
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=panel" className="text-text-muted hover:text-primary-green transition-colors text-sm">
                  Solar Panels
                </Link>
              </li>
              <li>
                <Link href="/products?category=battery" className="text-text-muted hover:text-primary-green transition-colors text-sm">
                  Batteries
                </Link>
              </li>
              <li>
                <Link href="/products?category=inverter" className="text-text-muted hover:text-primary-green transition-colors text-sm">
                  Inverters
                </Link>
              </li>
              <li>
                <Link href="/products?category=controller" className="text-text-muted hover:text-primary-green transition-colors text-sm">
                  Controllers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-orbitron text-primary-green font-semibold mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-text-muted text-sm">
                <MapPin className="w-4 h-4 text-primary-green mt-0.5 flex-shrink-0" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-2 text-text-muted text-sm">
                <Phone className="w-4 h-4 text-primary-green flex-shrink-0" />
                <a href="tel:+2348021482053" className="hover:text-primary-green transition-colors">
                  +234 802 148 2053
                </a>
              </li>
              <li className="flex items-center gap-2 text-text-muted text-sm">
                <Mail className="w-4 h-4 text-primary-green flex-shrink-0" />
                <a href="mailto:info@empyrealworks.com" className="hover:text-primary-green transition-colors">
                  info@empyrealworks.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-green/10 mt-8 pt-8 text-center">
          <p className="text-text-muted text-sm">
            &copy; {currentYear} Empyreal Energy Solutions. Managed by{' '}
            <a 
              href="https://www.linkedin.com/in/adeleke-olasope-0a097b19b/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-green hover:underline"
            >
              Engr. Adeleke Olasope
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
