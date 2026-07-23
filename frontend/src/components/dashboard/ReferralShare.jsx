import React, { useState } from 'react';
import { Copy, Share2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const ReferralShare = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on InvestmentApp!',
          text: `Join me on InvestmentApp using my referral link:`,
          url: referralLink,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      handleCopy();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Referral Program</h3>
        <span className="ml-auto text-sm text-gray-500">
          Your Referral Code: <span className="font-bold text-blue-600">{user.referralCode}</span>
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3">
        Share your referral link and earn commissions when your friends invest!
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>💡 Share this link with friends. You earn:</p>
        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
          <li>Level 1: 5% of their investment</li>
          <li>Level 2: 3% of their investment</li>
          <li>Level 3: 1% of their investment</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralShare;