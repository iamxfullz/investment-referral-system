import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  TrendingUp, 
  Wallet, 
  Users, 
  Shield, 
  ArrowRight, 
  Star,
  Gift,
  Rocket,
  CheckCircle,
  BarChart3,
  Zap,
  Award,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  Clock,
  DollarSign,
  Target,
  Gem
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  const referralLink = user ? `${window.location.origin}/register?ref=${user.referralCode}` : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      alert('Failed to copy link');
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 rounded-xl p-1.5">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InvestWise
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#plans" className="text-gray-700 hover:text-blue-600 transition-colors">Plans</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleGetStarted}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Go to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                  <button
                    onClick={handleGetStarted}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Trusted by 10,000+ investors
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Grow Your Wealth with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Smart Investing</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Start earning daily returns with our secure investment platform. 
              Build your wealth and earn passive income today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Start Investing Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#features"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div>
                <p className="text-3xl font-bold text-gray-900">$50M+</p>
                <p className="text-sm text-gray-600">Total Invested</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-600">Active Investors</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">4.8★</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>

            {/* Referral Section - Show if logged in */}
            {isAuthenticated && user && (
              <div className="mt-12 max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Invite Friends & Earn Rewards</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Share your referral link and earn 5% commission on every investment your friends make!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
                  <span>Level 1: 5%</span>
                  <span className="w-px h-4 bg-gray-300"></span>
                  <span>Level 2: 3%</span>
                  <span className="w-px h-4 bg-gray-300"></span>
                  <span>Level 3: 1%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose InvestWise?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to grow your wealth and achieve financial freedom.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="bg-blue-600 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Returns</h3>
              <p className="text-gray-600">Earn daily returns on your investments with competitive ROI rates starting from 0.5% per day.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="bg-purple-600 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600">Your investments are protected with advanced security measures and regular audits.</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="bg-green-600 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Referral Rewards</h3>
              <p className="text-gray-600">Earn up to 5% commission on your referrals' investments. Build your network and earn more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start investing in 3 simple steps and watch your money grow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mx-auto shadow-lg">
                  1
                </div>
                <Rocket className="absolute -bottom-2 -right-2 w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up in minutes with your email and get your unique referral code.</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="bg-purple-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mx-auto shadow-lg">
                  2
                </div>
                <Wallet className="absolute -bottom-2 -right-2 w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Plan</h3>
              <p className="text-gray-600">Select from our investment plans and start earning daily returns.</p>
            </div>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="bg-green-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mx-auto shadow-lg">
                  3
                </div>
                <TrendingUp className="absolute -bottom-2 -right-2 w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Earn Returns</h3>
              <p className="text-gray-600">Watch your money grow with daily ROI credited directly to your wallet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Investment Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your investment goals.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
              <p className="text-sm text-gray-600 mb-4">Perfect for starters</p>
              <p className="text-3xl font-bold text-gray-900">0.5%</p>
              <p className="text-sm text-gray-500 mb-4">Daily ROI</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">✅ 30 Days Duration</li>
                <li className="flex items-center gap-2">✅ Min $100</li>
                <li className="flex items-center gap-2">✅ Daily Returns</li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-semibold"
              >
                Get Started
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl transform scale-105 border-2 border-blue-600">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">Standard</h3>
                <span className="bg-yellow-400 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">Popular</span>
              </div>
              <p className="text-sm text-blue-100 mb-4">Best value for money</p>
              <p className="text-3xl font-bold">0.7%</p>
              <p className="text-sm text-blue-100 mb-4">Daily ROI</p>
              <ul className="space-y-2 text-sm text-blue-100 mb-6">
                <li className="flex items-center gap-2">✅ 60 Days Duration</li>
                <li className="flex items-center gap-2">✅ Min $500</li>
                <li className="flex items-center gap-2">✅ Daily Returns</li>
                <li className="flex items-center gap-2">✅ Priority Support</li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold"
              >
                Get Started
              </button>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:border-purple-500">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
              <p className="text-sm text-gray-600 mb-4">For serious investors</p>
              <p className="text-3xl font-bold text-gray-900">1.0%</p>
              <p className="text-sm text-gray-500 mb-4">Daily ROI</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">✅ 90 Days Duration</li>
                <li className="flex items-center gap-2">✅ Min $1000</li>
                <li className="flex items-center gap-2">✅ Daily Returns</li>
                <li className="flex items-center gap-2">✅ VIP Support</li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all font-semibold"
              >
                Get Started
              </button>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:border-green-500">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-sm text-gray-600 mb-4">Maximum returns</p>
              <p className="text-3xl font-bold text-gray-900">1.5%</p>
              <p className="text-sm text-gray-500 mb-4">Daily ROI</p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">✅ 180 Days Duration</li>
                <li className="flex items-center gap-2">✅ Min $5000</li>
                <li className="flex items-center gap-2">✅ Daily Returns</li>
                <li className="flex items-center gap-2">✅ Dedicated Manager</li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all font-semibold"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Investors Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real investors who grew their wealth with us.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                  R
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Rajesh Kumar</p>
                  <p className="text-sm text-gray-500">Investor for 6 months</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">★★★★★</div>
              <p className="text-gray-600">
                "I started with $500 and now I'm earning consistent daily returns. The referral program is amazing!"
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl font-bold text-purple-600">
                  P
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Priya Patel</p>
                  <p className="text-sm text-gray-500">Investor for 3 months</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">★★★★★</div>
              <p className="text-gray-600">
                "The best investment platform I've used. Daily ROI is credited on time and the support is excellent."
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-600">
                  A
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Amit Shah</p>
                  <p className="text-sm text-gray-500">Investor for 1 year</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">★★★★★</div>
              <p className="text-gray-600">
                "I've doubled my investment in less than a year. The referral tree system is brilliant!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of investors and start earning daily returns today.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <span className="ml-2 text-xl font-bold">InvestWise</span>
            </div>
            <p className="text-gray-400 text-sm">
              Grow your wealth with smart investing. Start earning daily returns today.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#plans" className="hover:text-white transition-colors">Plans</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          © 2026 InvestWise. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;