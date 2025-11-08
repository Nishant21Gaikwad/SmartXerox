import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                📄
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">SmartXerox</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Digital Print Ordering</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <span className="animate-pulse">🚀</span>
              <span>Fast, Simple & Secure Printing</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6 sm:mb-8">
              Print Your Documents
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                In Just 3 Steps
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Upload your files online, track your order in real-time, and get your prints ready within 24 hours. No hassle, no waiting in queues.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <span>Start Printing Now</span>
                <span className="text-xl">→</span>
              </button>
              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl border-2 border-gray-200"
              >
                See How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">10k+</div>
                <div className="text-xs sm:text-sm text-gray-600">Orders Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2">24h</div>
                <div className="text-xs sm:text-sm text-gray-600">Delivery Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1 sm:mb-2">4.9⭐</div>
                <div className="text-xs sm:text-sm text-gray-600">User Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-50 blur-3xl animate-pulse"></div>
      </section>

      {/* How It Works - Step by Step Guide */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              How to Use SmartXerox
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to get your documents printed
            </p>
          </div>

          {/* Step 1: Register */}
          <div className="mb-16 sm:mb-24">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-1 lg:order-1">
                <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Create Your Account</h3>
                </div>
                <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                  Register with your name, email, and phone number. It takes less than a minute! Your account will help you track all your orders in one place.
                </p>
                <div className="bg-blue-50 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Quick Registration</p>
                      <p className="text-xs sm:text-sm text-gray-600">Fill in basic details in 30 seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Secure Login</p>
                      <p className="text-xs sm:text-sm text-gray-600">Your data is encrypted and protected</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">One-Time Setup</p>
                      <p className="text-xs sm:text-sm text-gray-600">Register once, use anytime</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-6 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <span>Register Now</span>
                  <span>→</span>
                </button>
              </div>
              <div className="order-2 lg:order-2">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
                    <div className="text-center mb-4">
                      <div className="text-3xl sm:text-4xl mb-2">📝</div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900">Student Registration</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Full Name</p>
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Email Address</p>
                        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 text-white text-center font-semibold text-sm">
                        Create Account
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Upload */}
          <div className="mb-16 sm:mb-24">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
                  <div className="text-center mb-4">
                    <div className="text-3xl sm:text-4xl mb-2">📤</div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900">Upload Your Files</h4>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center mb-4">
                    <div className="text-4xl sm:text-5xl mb-2">📄</div>
                    <p className="text-xs sm:text-sm text-gray-600">Drag & drop or click to upload</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="text-xl">📄</div>
                        <div className="text-xs sm:text-sm">document1.pdf</div>
                      </div>
                      <div className="text-xs text-blue-600 font-medium">Ready</div>
                    </div>
                    <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="text-xl">📄</div>
                        <div className="text-xs sm:text-sm">notes.pdf</div>
                      </div>
                      <div className="text-xs text-green-600 font-medium">Ready</div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Upload Your Files</h3>
                </div>
                <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                  After logging in, go to your student panel and upload the files you want to print. You can add multiple files at once!</p>
                <div className="bg-purple-50 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Multiple Files</p>
                      <p className="text-xs sm:text-sm text-gray-600">Upload PDF, JPG, PNG files (Max 10MB each)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Set Copies & Type</p>
                      <p className="text-xs sm:text-sm text-gray-600">Choose B&W or Color for each file</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Instant Confirmation</p>
                      <p className="text-xs sm:text-sm text-gray-600">Get order confirmation immediately</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-6 px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <span>Go to Dashboard</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Track */}
          <div className="mb-0">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-1 lg:order-1">
                <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold shadow-lg">
                    3
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Track Your Order</h3>
                </div>
                <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                  See real-time status updates of your print job. From "In Queue" to "Ready" - you'll know exactly when to collect your prints.
                </p>
                <div className="bg-green-50 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Live Status Updates</p>
                      <p className="text-xs sm:text-sm text-gray-600">Track: In Queue → Printing → Ready</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">24-Hour Delivery</p>
                      <p className="text-xs sm:text-sm text-gray-600">Your prints ready within a day</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">✓</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Auto-Delete</p>
                      <p className="text-xs sm:text-sm text-gray-600">Files deleted after 24h for privacy</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-2 lg:order-2">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
                    <div className="text-center mb-4">
                      <div className="text-3xl sm:text-4xl mb-2">📊</div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900">My Orders</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs sm:text-sm font-semibold">Assignment.pdf</p>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">In Queue</span>
                        </div>
                        <p className="text-xs text-gray-500">5 copies • B&W</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border-2 border-blue-200">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs sm:text-sm font-semibold">Notes.pdf</p>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Printing</span>
                        </div>
                        <p className="text-xs text-gray-500">3 copies • Color</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-300">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs sm:text-sm font-semibold">Report.pdf</p>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">✓ Ready</span>
                        </div>
                        <p className="text-xs text-gray-500">2 copies • B&W</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* That's it! - Below the grid on all screen sizes */}
            <div className="mt-8 lg:mt-12 max-w-3xl mx-auto">
              <div className="p-4 sm:p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white text-center">
                <p className="text-xl sm:text-2xl font-bold mb-2">🎉 That's it!</p>
                <p className="text-sm sm:text-base opacity-90">Once your status shows "Ready", collect your prints from our counter.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Students Love Us
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Everything you need for hassle-free printing
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Super Fast</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Upload and order in under 2 minutes. No complicated forms or paperwork.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 group-hover:scale-110 transition-transform">
                🔒
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Your documents are encrypted and auto-deleted after 24 hours for privacy.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Order from anywhere - your phone, tablet, or computer. Works on all devices.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 group-hover:scale-110 transition-transform">
                💰
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Affordable Rates</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Student-friendly pricing with no hidden charges. Pay only for what you print.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 group-hover:scale-110 transition-transform">
                🎨
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Color Options</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Choose between B&W or color prints. Set different options for each file.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 group-hover:scale-110 transition-transform">
                ⏰
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">24/7 Access</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Order anytime, day or night. We process orders round the clock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
                Join thousands of students who are already printing smarter with SmartXerox!
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-8 sm:px-12 py-4 sm:py-5 bg-white text-blue-600 rounded-xl hover:bg-gray-100 font-bold text-base sm:text-lg transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center gap-3"
              >
                <span>Create Free Account</span>
                <span className="text-2xl">→</span>
              </button>
              <p className="mt-6 text-sm text-white/80">
                ✨ No credit card required • Takes less than 1 minute
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-xl">
                  📄
                </div>
                <h3 className="text-xl font-bold">SmartXerox</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Fast, reliable, and secure printing service designed for students.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/register')} className="text-gray-400 hover:text-white transition-colors">Register</button></li>
                <li><button onClick={() => navigate('/login')} className="text-gray-400 hover:text-white transition-colors">Login</button></li>
                <li><button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-white transition-colors">Admin Portal</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 support@smartxerox.com</li>
                <li>📞 +91 98765 43210</li>
                <li>🕐 24/7 Support Available</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Real-time Tracking</li>
                <li>✓ 24-Hour Delivery</li>
                <li>✓ Secure Upload</li>
                <li>✓ Affordable Pricing</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">&copy; 2025 SmartXerox. All rights reserved. Made with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
