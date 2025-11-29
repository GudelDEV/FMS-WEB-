import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import financeImage from "../assets/notfound.png"; // bisa ganti dengan ilustrasi keuangan

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      {/* Image / Illustration */}
      <img
        src={financeImage}
        alt="Page Not Found"
        className="w-64 md:w-96 mb-6 animate-fadeIn"
      />

      {/* Title */}
      <h1 className="text-6xl md:text-7xl font-extrabold text-gray-300 mb-4 flex items-center justify-center">
        <ExclamationCircleOutlined className="mr-2 text-red-500" />
        404
      </h1>

      {/* Subtitle */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-gray-500 mb-6 max-w-md">
        Maaf, halaman yang kamu cari tidak tersedia. Mungkin sudah dihapus atau
        URL salah.
      </p>

      {/* Button */}
      <Button type="primary" size="large" onClick={() => navigate("/")}>
        Kembali ke Dashboard
      </Button>
    </div>
  );
}
