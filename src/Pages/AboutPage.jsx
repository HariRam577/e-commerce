import React, { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Users,
  Award,
  TrendingUp,
  Globe,
  Shield,
  Truck,
  Headphones,
  Check,
  Star,
  Target,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("story");

  const stats = [
    { icon: Users, value: "2M+", label: "Happy Customers" },
    { icon: Package, value: "50K+", label: "Products" },
    { icon: Globe, value: "100+", label: "Countries" },
    { icon: Award, value: "15+", label: "Years Experience" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Shopping",
      description:
        "Your data is protected with industry-leading encryption and security measures.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Get your orders delivered quickly with our express shipping options worldwide.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Our dedicated customer service team is always ready to help you anytime.",
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description:
        "We ensure the highest quality products with a 100% satisfaction guarantee.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      description: "Visionary leader with 15+ years in e-commerce",
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      description: "Expert in logistics and supply chain management",
    },
    {
      name: "Emily Rodriguez",
      role: "Chief Marketing Officer",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      description: "Creative strategist driving brand growth",
    },
    {
      name: "David Kim",
      role: "Head of Technology",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
      description: "Innovation leader building cutting-edge solutions",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Customer First",
      description:
        "Every decision we make starts with our customers in mind. Your satisfaction is our success.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We continuously evolve and embrace new technologies to enhance your shopping experience.",
    },
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We conduct business with honesty, transparency, and ethical practices in everything we do.",
    },
    {
      icon: Globe,
      title: "Sustainability",
      description:
        "Committed to eco-friendly practices and reducing our environmental footprint globally.",
    },
  ];

  const milestones = [
    {
      year: "2009",
      event: "ShopHub Founded",
      description: "Started as a small online store",
    },
    {
      year: "2012",
      event: "First Million Customers",
      description: "Reached major milestone",
    },
    {
      year: "2015",
      event: "Global Expansion",
      description: "Launched in 50+ countries",
    },
    {
      year: "2018",
      event: "Mobile App Launch",
      description: "Revolutionary shopping experience",
    },
    {
      year: "2021",
      event: "AI Integration",
      description: "Personalized recommendations",
    },
    {
      year: "2024",
      event: "Carbon Neutral",
      description: "Achieved sustainability goals",
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-theme text-black dark:bg-theme-dark dark:text-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-theme text-black dark:bg-theme-dark dark:text-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              About ShopHub
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Revolutionizing online shopping with innovation, quality, and
              customer satisfaction at our core
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-theme text-black dark:bg-theme-dark dark:text-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <Icon className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold  mb-1">{stat.value}</div>
                <div className="text-sm ">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-theme text-black dark:bg-theme-dark dark:text-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("story")}
              className={`px-8 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === "story"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : " hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Our Story
            </button>
            <button
              onClick={() => setActiveTab("mission")}
              className={`px-8 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === "mission"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : " hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Mission & Vision
            </button>
            <button
              onClick={() => setActiveTab("values")}
              className={`px-8 py-4 font-semibold whitespace-nowrap transition ${
                activeTab === "values"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : " hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Our Values
            </button>
          </div>

          <div className="p-8 md:p-12">
            {activeTab === "story" && (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold  mb-4">
                  The ShopHub Journey
                </h3>
                <p className="text-lg  leading-relaxed">
                  Founded in 2009, ShopHub began with a simple vision: to create
                  an online shopping experience that puts customers first. What
                  started as a small e-commerce platform has grown into a global
                  marketplace serving millions of satisfied customers worldwide.
                </p>
                <p className="text-lg  leading-relaxed">
                  Over the years, we've expanded our product range, improved our
                  technology, and built a dedicated team passionate about
                  delivering excellence. Today, we're proud to be a trusted name
                  in online retail, known for quality products, competitive
                  prices, and exceptional customer service.
                </p>
                <p className="text-lg  leading-relaxed">
                  Our journey continues as we innovate and adapt to meet the
                  evolving needs of our customers, always staying true to our
                  core values of integrity, innovation, and customer
                  satisfaction.
                </p>
              </div>
            )}

            {activeTab === "mission" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold  mb-4">Our Mission</h3>
                  <p className="text-lg  leading-relaxed">
                    To provide an exceptional online shopping experience by
                    offering high-quality products, competitive prices, and
                    outstanding customer service. We strive to make shopping
                    convenient, secure, and enjoyable for everyone.
                  </p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold  mb-4">Our Vision</h3>
                  <p className="text-lg  leading-relaxed">
                    To become the world's most trusted and innovative e-commerce
                    platform, setting new standards in customer experience,
                    sustainability, and technological advancement in online
                    retail.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "values" && (
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 hover:shadow-lg transition"
                    >
                      <Icon className="w-10 h-10 text-blue-600 mb-4" />
                      <h4 className="text-xl font-bold  mb-2">{value.title}</h4>
                      <p className="">{value.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center  mb-12">
          Our Journey Through Time
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 to-purple-600 hidden md:block"></div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-col`}
              >
                <div
                  className={`flex-1 ${
                    index % 2 === 0
                      ? "md:text-right md:pr-12"
                      : "md:text-left md:pl-12"
                  } mb-4 md:mb-0`}
                >
                  <div className="bg-theme text-black dark:bg-theme-dark dark:text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold  mb-2">
                      {milestone.event}
                    </h3>
                    <p className="">{milestone.description}</p>
                  </div>
                </div>

                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white shadow-lg z-10 flex-shrink-0"></div>

                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-theme text-black dark:bg-theme-dark dark:text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center  mb-4">
            Why Choose ShopHub?
          </h2>
          <p className="text-center  mb-12 max-w-2xl mx-auto">
            We're committed to providing the best shopping experience with
            features designed for your convenience
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className=" rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold  mb-2">{feature.title}</h3>
                  <p className="">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center  mb-4">
          Meet Our Leadership Team
        </h2>
        <p className="text-center  mb-12 max-w-2xl mx-auto">
          Passionate individuals driving innovation and excellence in e-commerce
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-theme text-black dark:bg-theme-dark dark:text-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden group">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold  mb-1">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-2">
                  {member.role}
                </p>
                <p className=" text-sm">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-16 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join millions of satisfied customers and discover amazing products
              at unbeatable prices
            </p>
            <button className="bg-theme text-black dark:bg-theme-dark dark:text-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-lg">
              Explore Products <ArrowRight className="inline w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ShopHub
              </h3>
              <p className="text-gray-400">
                Your trusted online shopping destination
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Shipping
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4 text-sm">
                Subscribe for updates and deals
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const Package = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);
