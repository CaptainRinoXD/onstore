// onstore/src/app/contact/page.tsx
import React from 'react';
import Layout from "@/app/components/Layout";

const ContactPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-12 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
              Contact Us
            </h1>

            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <p className="text-gray-700 mb-6 text-center">
                Chúng tôi rất lấy làm cảm kích quý khách, nếu có nhu những thắc
                mắc về đơn hàng, hay sản phẩm, xin vui lòng liên hệ với chúng
                tôi qua các thông tin sau.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Thông tin liên hệ
                  </h2>
                  <div className="mb-4">
                    <p className="text-gray-600 font-medium">Số điện thoại:</p>
                    <p className="text-gray-700">+84 987654321</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-600 font-medium">Email:</p>
                    <p className="text-gray-700">dinhdainhan@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">
                      Giờ chăm sóc hành chính:
                    </p>
                    <p className="text-gray-700">
                      Thứ hai đến thứ bảy: 8:00 đến 17:00
                    </p>
                  </div>
                </div>

                {/* <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send us a Message</h2>
                    <form>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Name
                        </label>
                        <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email
                        </label>
                        <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Email"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                        Message
                        </label>
                        <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Message"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out"
                    >
                        Send Message
                    </button>
                    </form>
                </div> */}
              </div>

              <div className="mt-10 text-center">
                <p className="text-gray-700">
                  Cảm ơn bạn đã lắng nghe và chia sẻ những đóng góp
                  {/* Add social media icons/links here if needed */}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ContactPage;