import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, X, RefreshCw } from 'lucide-react';
import axios from 'axios';
import assets from '../assets/assets';

// Configure your API base URL
const API_BASE_URL = 'http://localhost:8080/api/categories';

export default function CategoriesManagement() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Form data state
    const [formData, setFormData] = useState({
        category_name: '',
        parent_category: '',
        description: '',
        is_active: true
    });

    const [selectedFilter, setSelectedFilter] = useState('All Categories');
    const filters = ['All Categories', 'Active', 'Inactive', 'Parent Categories', 'Subcategories'];

    // --- API HELPER FUNCTIONS ---

    // Convert Java Entity (camelCase) to Frontend State (snake_case)
    const mapBackendToFrontend = (data) => {
        return data.map(cat => ({
            category_id: cat.categoryId,
            category_name: cat.categoryName,
            // Handle nested parent object from Java
            parent_category: cat.parentCategory ? cat.parentCategory.categoryId : null,
            description: cat.description,
            is_active: cat.isActive
        }));
    };

    // Fetch all categories
    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_BASE_URL);
            const mappedData = mapBackendToFrontend(response.data);
            setCategories(mappedData);
            setError(null);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError('Failed to connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchCategories();
    }, []);

    // --- FILTERING & STATS ---

    const baseClasses = 'p-2 text-xs font-semibold border-2 rounded-md transition duration-200';
    const inactiveClasses = 'border-[#ffce1f] bg-[#fff3c7] text-amber-950 hover:bg-[#ffe380]';
    const activeClasses = 'border-[#A31800] bg-[#A31800] text-white shadow-md';

    const getFilteredCategories = () => {
        switch (selectedFilter) {
            case 'Active': return categories.filter(cat => cat.is_active);
            case 'Inactive': return categories.filter(cat => !cat.is_active);
            case 'Parent Categories': return categories.filter(cat => cat.parent_category === null);
            case 'Subcategories': return categories.filter(cat => cat.parent_category !== null);
            default: return categories;
        }
    };

    const filteredCategories = getFilteredCategories();

    const stats = {
        total: categories.length,
        active: categories.filter(c => c.is_active).length,
        inactive: categories.filter(c => !c.is_active).length,
        parents: categories.filter(c => c.parent_category === null).length
    };

    // --- HANDLERS ---

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                category_name: category.category_name,
                parent_category: category.parent_category || '',
                description: category.description || '',
                is_active: category.is_active
            });
        } else {
            setEditingCategory(null);
            setFormData({
                category_name: '',
                parent_category: '',
                description: '',
                is_active: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ category_name: '', parent_category: '', description: '', is_active: true });
    };

    const handleSubmit = async () => {
        if (!formData.category_name) return;

        // Construct Payload matching CategoryRequest.java
        const payload = {
            categoryName: formData.category_name,
            description: formData.description,
            isActive: formData.is_active,
            // Map parent ID to the Object structure Java expects: { categoryId: 1 }
            parentCategory: formData.parent_category
                ? { categoryId: parseInt(formData.parent_category) }
                : null
        };

        try {
            if (editingCategory) {
                // UPDATE (PUT)
                await axios.put(`${API_BASE_URL}/${editingCategory.category_id}`, payload);
            } else {
                // CREATE (POST)
                await axios.post(API_BASE_URL, payload);
            }
            // Refresh list after success
            fetchCategories();
            handleCloseModal();
        } catch (err) {
            console.error("Error saving category:", err);
            alert("Failed to save category. Check console for details.");
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`${API_BASE_URL}/${categoryId}`);
                // Remove from local state immediately for UI responsiveness
                setCategories(categories.filter(cat => cat.category_id !== categoryId));
            } catch (err) {
                console.error("Error deleting category:", err);
                alert("Failed to delete. It might be in use by Resources or Subcategories.");
            }
        }
    };

    const getParentName = (parentId) => {
        if (!parentId) return 'None';
        const parent = categories.find(cat => cat.category_id === parentId);
        return parent ? parent.category_name : 'Unknown';
    };

    // --- RENDER ---

    if (isLoading && categories.length === 0) {
        return <div className="p-10 text-center text-red-900 font-bold">Loading Categories...</div>;
    }

    if (error) {
        return (
            <div className="p-10 text-center flex flex-col items-center gap-4">
                <h3 className="text-red-900 font-bold">{error}</h3>
                <button onClick={fetchCategories} className="flex items-center gap-2 px-4 py-2 bg-[#A31800] text-white rounded-md">
                    <RefreshCw className="w-4 h-4" /> Retry
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Stats Cards */}
            <div className="flex justify-between gap-2">
                {/* ... (Your stats cards styling remains exactly the same) ... */}
                <div className="flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-red-700 to-amber-800 text-white">
                    <div className="flex flex-col">
                        <h6>Total Categories</h6>
                        <h4 className="text-3xl font-bold">{stats.total}</h4>
                    </div>
                    <FolderTree className="w-9 h-9" />
                </div>
                <div className="flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-green-600 to-green-800 text-white">
                    <div className="flex flex-col">
                        <h6>Active</h6>
                        <h4 className="text-3xl font-bold">{stats.active}</h4>
                    </div>
                    <FolderTree className="w-9 h-9" />
                </div>
                <div className="flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-gray-600 to-gray-800 text-white">
                    <div className="flex flex-col">
                        <h6>Inactive</h6>
                        <h4 className="text-3xl font-bold">{stats.inactive}</h4>
                    </div>
                    <FolderTree className="w-9 h-9" />
                </div>
                <div className="flex justify-between items-center font-semibold p-3 py-6 w-60 rounded-md shadow-md border-2 border-[#A31800] bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
                    <div className="flex flex-col">
                        <h6>Parent Categories</h6>
                        <h4 className="text-3xl font-bold">{stats.parents}</h4>
                    </div>
                    <FolderTree className="w-9 h-9" />
                </div>
            </div>

            {/* Filter Section */}
            <div className="p-3 px-6 flex flex-col bg-[#FFF7DA] rounded-md shadow-md border-2 border-[#A31800]">
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                        <img className='w-4 h-4' src={assets.filter_1_icon} alt="Filter" />
                        <h4 className="text-red-900 font-bold">Filter Categories</h4>
                    </div>
                </div>
                <div className="flex gap-1 mb-3 flex-wrap">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setSelectedFilter(filter)}
                            className={`${baseClasses} ${
                                selectedFilter === filter ? activeClasses : inactiveClasses
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Categories List */}
            <div>
                <div className="flex justify-between items-center py-2">
                    <h2 className="text-red-900 text-xl font-bold py-1">{selectedFilter}</h2>

                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-3 p-2 h-full bg-[#A31800] text-white text-xs rounded-md font-semibold hover:bg-red-900 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Category
                    </button>
                </div>
                {filteredCategories.length > 0 ? (
                    <div className="w-full bg-[#FFF7DA] rounded-md shadow-md border-2 border-[#A31800] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#A31800] text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Category Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Parent Category</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredCategories.map((category, index) => (
                                    <tr
                                        key={category.category_id}
                                        className={`${index % 2 === 0 ? 'bg-[#fff9e5]' : 'bg-[#FFF7DA]'} border-b border-amber-200`}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {category.category_name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {getParentName(category.parent_category)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {category.description || 'No description'}
                                        </td>
                                        <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            category.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(category)}
                                                    className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.category_id)}
                                                    className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-70 bg-[#FFF7DA] flex rounded-md shadow-md border-2 border-[#A31800]">
                        <div className="w-full h-full flex flex-col justify-center items-center pb-15 box-border">
                            <img className='w-15 h-15' src={assets.warning_icon} alt="No Categories" />
                            <h3 className="text-red-900 font-bold">No categories found</h3>
                            <p className="text-red-900">There are no categories matching your filter.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className='fixed inset-0 flex flex-col justify-center items-center bg-black/40 z-50'>
                    <div className="flex flex-col p-3 px-4 bg-[#FFF7D7] h-auto w-[500px] rounded-lg">
                        <div className='flex justify-between pl-3 mb-2 items-center'>
                            <div className='flex justify-between items-center mt-3'>
                                <h2 className='text-black font-bold text-xl'>
                                    {editingCategory ? 'Edit Category' : 'Create Category'}
                                </h2>
                            </div>
                            <div onClick={handleCloseModal}
                                 className='flex justify-center items-center w-5 h-5 bg-[#B20000] rounded-full cursor-pointer'>
                                <X className="w-2.5 h-2.5 text-white" />
                            </div>
                        </div>

                        <div className='flex min-w-full h-full justify-between p-2 box-border'>
                            <div className='flex flex-col p-4 bg-white w-full rounded-2xl gap-3'>
                                <div>
                                    <label className='text-black font-bold block mb-1'>
                                        Category Name *
                                    </label>
                                    <div className='bg-gray-100 rounded-md'>
                                        <input
                                            type="text"
                                            value={formData.category_name}
                                            onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                                            className="w-full text-black p-2 bg-gray-100 rounded-md focus:outline-none"
                                            placeholder="Enter category name..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className='text-black font-bold block mb-1'>
                                        Parent Category
                                    </label>
                                    <div className='bg-gray-100 rounded-md p-2'>
                                        <select
                                            value={formData.parent_category}
                                            onChange={(e) => setFormData({...formData, parent_category: e.target.value})}
                                            className='focus:outline-none focus:ring-0 appearance-none w-full bg-gray-100 px-2 rounded-md text-black font-semibold'
                                        >
                                            <option value="">None (Parent Category)</option>
                                            {categories
                                                // Filter out self if editing (can't be own parent)
                                                .filter(cat =>
                                                    cat.parent_category === null &&
                                                    (!editingCategory || cat.category_id !== editingCategory.category_id)
                                                )
                                                .map(cat => (
                                                    <option key={cat.category_id} value={cat.category_id}>
                                                        {cat.category_name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className='text-black font-bold block mb-1'>
                                        Description
                                    </label>
                                    <div className='bg-gray-100 rounded-md'>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className='w-full text-black p-2 resize-none bg-gray-100 rounded-md focus:outline-none'
                        placeholder='Enter description...'
                    />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                        className="w-4 h-4 text-[#A31800] border-gray-300 rounded focus:ring-[#A31800]"
                                    />
                                    <label htmlFor="is_active" className="text-black font-bold">
                                        Active
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-end p-2 items-center gap-2'>
                            <button
                                onClick={handleCloseModal}
                                className='bg-gray-400 rounded-lg text-xs font-extrabold p-2 px-5 hover:scale-101 hover:bg-gray-500'>
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className='bg-[#B20000] rounded-lg text-xs font-extrabold p-2 px-5 hover:scale-101'>
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}