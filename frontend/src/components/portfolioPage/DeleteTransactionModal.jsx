import { deleteTransaction } from "../../services/transactionApi";

function DeleteTransactionModal({
  deletingTransaction,
  setShowDeleteModal,
  onSuccess,
}) {
  const handleDelete = async () => {
    await deleteTransaction(deletingTransaction._id);

    onSuccess?.();

    setShowDeleteModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-[400px]">
        <h2 className="text-white text-xl font-bold mb-3">
          Delete Transaction
        </h2>

        <p className="text-gray-400 mb-6">
          Are you sure you want to delete this transaction?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 rounded-xl bg-gray-700 text-white cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-red-600 text-white cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTransactionModal;
