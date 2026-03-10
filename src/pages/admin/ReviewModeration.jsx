import { useState, useEffect } from 'react';
import { Trash2, Plus, Edit, X, Star, Search } from 'lucide-react';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';

const ReviewModeration = () => {
  const { reviews, reviewMeta, addReview, updateReview, deleteReview, fetchReviews } = useData();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReviews({ page: currentPage, search: searchTerm });
  }, [fetchReviews, currentPage, searchTerm]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const reviewData = {
      name: formData.get('name'),
      text: formData.get('text'),
      stars: parseInt(formData.get('stars')),
    };

    if (editingReview) {
      const result = await updateReview({ ...editingReview, ...reviewData });
      if (result.success) {
        showToast('Review updated successfully', 'success');
      } else {
        showToast('Failed to update review', 'error');
      }
    } else {
      const result = await addReview(reviewData);
      if (result.success) {
        showToast('Review added successfully', 'success');
      } else {
        showToast('Failed to add review', 'error');
      }
    }
    setShowReviewModal(false);
    setEditingReview(null);
  };

  const handleDelete = async (id) => {
     if (await confirm('Delete Review', 'Are you sure you want to delete this review?')) {
        const result = await deleteReview(id);
        if (result.success) {
            showToast('Review deleted successfully', 'success');
        } else {
            showToast('Failed to delete review', 'error');
        }
     }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Review Moderation</h2>
          <p className="text-gray-500">View and remove inappropriate client feedback.</p>
        </div>
        <button 
            onClick={() => { setEditingReview(null); setShowReviewModal(true); }}
            className="flex items-center gap-3 px-8 py-4 bg-lime-500 text-navy-900 rounded-2xl font-black hover:bg-lime-400 transition-all uppercase tracking-widest text-xs"
          >
            <Plus className="w-5 h-5" /> New Review
          </button>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search reviews..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-navy-500 focus:border-navy-500 transition-all font-bold text-sm shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <Table
        data={reviews}
        pagination={{
            page: reviewMeta.page,
            pages: reviewMeta.pages,
            total: reviewMeta.total,
            onPageChange: (newPage) => setCurrentPage(newPage)
        }}
        columns={[
          {
            header: "Client",
            accessor: "name",
            className: "font-bold text-gray-900"
          },
          {
            header: "Comment",
            render: (rev) => (
              <span className="text-sm text-gray-600 italic">"{rev.text}"</span>
            )
          },
          {
            header: "Rating",
            render: (rev) => (
              <span className="text-amber-500 font-bold">★ {rev.stars}</span>
            )
          },
          {
            header: "Action",
            render: (rev) => (
              <div className="flex gap-2">
                <button 
                  onClick={() => { setEditingReview(rev); setShowReviewModal(true); }}
                  className="p-2 text-gray-300 hover:text-navy-600"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(rev._id)}
                  className="p-2 text-gray-300 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )
          }
        ]}
        emptyState={
          <div className="text-center py-20 text-gray-400">No reviews found.</div>
        }
      />

       {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={editingReview ? 'Edit Review' : 'Add Review'}
        size="max-w-lg"
      >
        <form onSubmit={handleReviewSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Client Name</label>
              <input name="name" required defaultValue={editingReview?.name} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Review Text</label>
              <textarea name="text" required defaultValue={editingReview?.text} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all h-32" placeholder="Great service..." />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Rating (Stars)</label>
              <div className="relative">
                <Star className="absolute left-4 top-3.5 w-5 h-5 text-amber-400 fill-amber-400" />
                <input name="stars" type="number" min="1" max="5" required defaultValue={editingReview?.stars || 5} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all" />
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-navy-500 text-white rounded-2xl font-black shadow-xl shadow-navy-900/20 hover:bg-navy-600 transition-all uppercase tracking-[0.2em] text-sm">
            Save Review
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ReviewModeration;
