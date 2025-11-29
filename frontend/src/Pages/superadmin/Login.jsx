/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import IlusImage from "../../assets/ilus.jpg"; // ilustrasi optional
import axios from "axios";
export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username: values.username,
        password: values.password,
      });

      // Ambil data dari response
      const { token, user } = response.data;

      // Simpan token di localStorage
      localStorage.setItem("token", token);
      // console.log(response);
      // Opsional: simpan data user di state global / context
      onLogin && onLogin(user);

      // Tampilkan toast sukses
      toast.success(`Login berhasil! Halo ${user.name}`);

      // Redirect sesuai role
      if (user.role === "superadmin") {
        navigate("/superadmin/dashboard");
      } else if (user.role === "staff") {
        navigate("/staff/input-transaksi");
      }
    } catch (error) {
      console.error(error);

      // Tampilkan toast error
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login gagal. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600">
      {/* Floating blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-purple-400/30 rounded-full filter blur-3xl animate-blob -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-400/30 rounded-full filter blur-3xl animate-blob animation-delay-2000 -z-10"></div>
      <div className="absolute top-1/3 right-[-5%] w-80 h-80 bg-yellow-300/20 rounded-full filter blur-2xl animate-blob animation-delay-4000 -z-10"></div>

      {/* Card login */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl flex flex-col md:flex-row bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-500"
      >
        {/* Illustration kiri */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-tr from-indigo-400 to-purple-500 flex items-center justify-center">
          <img
            src={IlusImage}
            alt="Illustration"
            className="w-3/4 h-3/4 object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Form kanan */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          <Card className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border-none p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold text-gray-800">
                FMS Portal
              </h1>
              <p className="text-gray-600">
                Login untuk mengakses sistem keuangan
              </p>
            </div>

            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Username wajib diisi" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Masukkan username"
                  size="large"
                  className="rounded-xl focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition-all"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Password wajib diisi" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Masukkan password"
                  size="large"
                  className="rounded-xl focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition-all"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg rounded-xl transition-all hover:shadow-2xl"
              >
                Login
              </Button>

              <div className="mt-4 text-right">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Lupa Password?
                </a>
              </div>
            </Form>
          </Card>

          {/* Decorative rounded shape bawah */}
          <div className="absolute -bottom-10 left-0 w-full h-20 bg-blue-100 rounded-t-full -z-10"></div>
        </div>
      </motion.div>

      {/* Animasi blob */}
      <style>
        {`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}
      </style>
    </div>
  );
}
