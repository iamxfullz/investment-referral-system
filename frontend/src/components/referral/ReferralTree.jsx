import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { User, ChevronDown, ChevronRight } from 'lucide-react';

const ReferralTree = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    fetchReferralTree();
  }, []);

  const fetchReferralTree = async () => {
    setLoading(true);
    try {
      const response = await api.get('/referrals/tree');
      setTreeData(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load referral tree');
    } finally {
      setLoading(false);
    }
  };

  const TreeNode = ({ node, level = 0 }) => {
    const [expanded, setExpanded] = useState(true);

    if (!node || !node.user) return null;

    const hasChildren = node.referrals && node.referrals.length > 0;

    return (
      <div className="ml-4" style={{ marginLeft: level * 24 }}>
        <div
          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer"
          onClick={() => hasChildren && setExpanded(!expanded)}
        >
          {hasChildren && (
            <button className="text-gray-500">
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{node.user.fullName}</p>
            <p className="text-xs text-gray-500">{node.user.email}</p>
          </div>
          <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            Level {node.level}
          </span>
          {node.referrals && (
            <span className="ml-auto text-xs text-gray-400">
              {node.referrals.length} referrals
            </span>
          )}
        </div>

        {expanded && hasChildren && (
          <div className="border-l-2 border-gray-200 ml-4">
            {node.referrals.map((child, index) => (
              <TreeNode key={index} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchReferralTree} />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral Tree</h3>
      {treeData ? (
        <TreeNode node={treeData} />
      ) : (
        <p className="text-gray-500 text-center py-8">No referrals found</p>
      )}
    </div>
  );
};

export default ReferralTree;