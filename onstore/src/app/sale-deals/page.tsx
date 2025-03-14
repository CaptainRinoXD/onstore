// onstore/src/app/sale-deals/page.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import maintenanceGif from "./maintenance.gif";

const SaleDealsPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-3xl mx-auto text-center p-8 md:p-12 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Ưu Đãi Giảm Giá
        </h1>
        <div className="relative w-full h-96 mb-8">
          <Image
            src={maintenanceGif} // Thay bằng URL ảnh bảo trì của bạn
            alt="Đang Bảo Trì"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
        <p className="text-lg text-gray-700 mb-8">
          Trang Ưu Đãi Giảm Giá của chúng tôi hiện đang được bảo trì. Chúng tôi
          xin lỗi vì sự bất tiện này và đang nỗ lực để sớm mang đến cho bạn
          những ưu đãi tuyệt vời!
        </p>

        <p className="text-gray-600">
          Trong thời gian chờ đợi, bạn có thể khám phá các bộ sưu tập khác của
          chúng tôi:
        </p>
        <div className="mt-6 space-y-4 md:space-y-0 md:space-x-4">
          <Link href="/">
            <button className="bg-white text-black border border-black hover:bg-gray-100 font-bold py-2 px-6 rounded-md transition duration-300">
              Về Trang Chủ
            </button>
          </Link>

          <Link href="/producttypes?collection=67737df057b6d44ed5348d82">
            <button className="bg-white text-black border border-black  hover:bg-gray-100 font-bold py-2 px-6 rounded-md transition duration-300">
              Bộ Sưu Tập Mùa Hè
            </button>
          </Link>
          <Link href="/producttypes?collection=67ca92ebc95d75c18bacef1a">
            <button className="bg-white text-black border border-black hover:bg-gray-100 font-bold py-2 px-6 rounded-md transition duration-300">
              Bộ Sưu Tập Mùa Lễ Hội
            </button>
          </Link>
        </div>
      </div>
      <style jsx>{``}</style>
    </div>
  );
};

export default SaleDealsPage;