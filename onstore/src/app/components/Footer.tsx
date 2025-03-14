// Footer.tsx
import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-10">
      <div className="container mx-auto px-10 md:px-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-white">
          {/* INFORMATION Section */}
          <div className="footer-column">
            <h4 className="text-lg font-bold mb-4 transition-all duration-300 hover:text-yellow-400">INFORMATION</h4>
            <ul>
              <li className="footer-link hover:text-yellow-400">About Us</li>
              <Link href="/order">
                <li className="footer-link hover:text-yellow-400">Track Your Order</li>
              </Link>
              <li className="footer-link hover:text-yellow-400">Shipping Information</li>
            </ul>
          </div>

          {/* CUSTOMER CARE Section */}
          <div className="footer-column">
            <h4 className="text-lg font-bold mb-4 transition-all duration-300 hover:text-yellow-400">CUSTOMER CARE</h4>
            <ul>
              <li className="footer-link hover:text-yellow-400">Contact Us</li>
              <li className="footer-link hover:text-yellow-400">Privacy Policy</li>
              <li className="footer-link hover:text-yellow-400">Returns & Exchange Policy</li>
              <li className="footer-link hover:text-yellow-400">FAQs</li>
            </ul>
          </div>

          {/* CONTACT US Section */}
          <div className="footer-column">
            <h4 className="text-lg font-bold mb-4 transition-all duration-300 hover:text-yellow-400">CONTACT US</h4>
            <p className="mb-2">Phone: +84 987654321</p>
            <p className="mb-2">Email: dinhdainhan@gmail.com</p>
            <p>Customer Care: Monday to Saturday: 9am to 8pm</p>
          </div>
        </div>
        <div className="text-center mt-10">
          <p className="text-gray-400">© 2024 BonanzaGT. All rights reserved.</p>
        </div>
      </div>

      {/* CSS added in jsx */}
      <style jsx>{`
        /* Footer Column Styling */
        .footer-column h4 {
          font-size: 1.125rem;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: transform 0.3s ease;
        }

        

        /* Footer Link Styling */
        .footer-link {
          font-size: 0.9rem;
          padding: 0.5rem 0;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .footer-link:hover {
          color: #ffcc00;
          transform: translateX(5px);
          cursor: pointer;
        }

        /* Footer Container & Grid Styling */
        footer {
          background-color: #2d2d2d;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        /* Footer Column Hover Effect */
        .footer-column:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }
      `}</style>
    </footer>
  );
};

export default Footer;