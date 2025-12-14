import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, X, RefreshCw } from 'lucide-react';
import axios from 'axios';
import assets from '../assets/assets';

// Configure your API base URL

// const API_BASE_URL = 'http://localhost:8000/categories/';
const API_BASE_URL = 'http://localhost:8080/api/categories';


// helper functions
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};
const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: getAuthHeaders()
});

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
                await authAxios.put(`/${editingCategory.category_id}/`, payload);
            } else {
                // CREATE (POST)
                await authAxios.post('', payload);
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
                await authAxios.delete(`/${categoryId}/`);
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
        return <div className="p-10 font-bold text-center text-red-900">Loading Categories...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 p-10 text-center">
                <h3 className="font-bold text-red-900">{error}</h3>
                <button onClick={fetchCategories} className="flex items-center gap-2 px-4 py-2 bg-[#A31800] text-white rounded-md">
                    <RefreshCw className="w-4 h-4" /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className='p-6'>
            <div className='flex items-center gap-2 mb-8'>
                <img src={assets.white_category_icon} className='p-2 bg-red-800 rounded-sm w-13 h-13·'></img>
                <div className="">
                    <h2 className="text-3xl font-bold text-gray-800">Categories Management</h2>
                    <p className="text-gray-500 text-md">Create new and manage existing categories</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="flex justify-between gap-2 mb-8">
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

            {/* Main Content Area */}
            <div className="bg-[#fffbee] rounded-md shadow-md border-2 border-[#530c00]/70  overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col items-center justify-between gap-4 p-4 border-b-2 border-[#A31800] bg-[#A31800] sm:flex-row">
                    <div className="flex gap-2 p-1 bg-red-900 border-2 border-red-900 rounded-lg">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                    selectedFilter === filter
                                        ? 'bg-[#b90600] text-white shadow-sm font-bold'
                                        : 'text-gray-200 hover:text-white'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-[#A31800] text-sm rounded-md font-semibold hover:bg-amber-200 hover:text-red-900 transition-colors border-2 border-amber-900/30 shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        New Category
                    </button>
                </div>

                {/* Table List */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs font-semibold text-white uppercase bg-red-900">
                        <tr>
                            <th className="px-6 py-4">Category Name</th>
                            <th className="px-6 py-4">Parent Category</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white">
                        {filteredCategories.map((category) => (
                            <tr key={category.category_id} className="transition-colors hover:bg-amber-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {category.category_name}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {getParentName(category.parent_category)}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {category.description || 'No description'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                        category.is_active
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-gray-50 text-gray-700 border-gray-200'
                                    }`}>
                                        {category.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenModal(category)}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            title="Edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.category_id)}
                                            className="text-sm font-medium text-red-600 hover:text-red-800"
                                            title="Delete"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredCategories.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                    No categories found for this filter.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40'>
                    <div className="flex flex-col p-3 px-4 bg-[#FFF7D7] h-auto w-[500px] rounded-lg">
                        <div className='flex items-center justify-between pl-3 mb-2'>
                            <div className='flex items-center justify-between mt-3'>
                                <h2 className='text-xl font-bold text-black'>
                                    {editingCategory ? 'Edit Category' : 'Create Category'}
                                </h2>
                            </div>
                        </div>

                        <div className='box-border flex justify-between h-full min-w-full p-2'>
                            <div className='flex flex-col w-full gap-3 p-4 bg-white rounded-2xl'>
                                <div>
                                    <label className='block mb-1 font-bold text-black'>
                                        Category Name *
                                    </label>
                                    <div className='bg-gray-100 rounded-md'>
                                        <input
                                            type="text"
                                            value={formData.category_name}
                                            onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                                            className="w-full p-2 text-sm text-black bg-gray-100 rounded-md focus:outline-none placeholder:text-sm"
                                            placeholder="Enter category name..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className='block mb-1 font-bold text-black'>
                                        Parent Category
                                    </label>
                                    <div className='p-2 bg-gray-100 rounded-md'>
                                        <select
                                            value={formData.parent_category}
                                            onChange={(e) => setFormData({...formData, parent_category: e.target.value})}
                                            className='w-full px-2 text-sm font-semibold text-black bg-gray-100 rounded-md appearance-none focus:outline-none focus:ring-0 placeholder:text-sm'
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
                                    <label className='block mb-1 font-bold text-black'>
                                        Description
                                    </label>
                                    <div className='bg-gray-100 rounded-md'>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            rows={3}
                                            className='w-full p-2 text-sm text-black bg-gray-100 rounded-md resize-none focus:outline-none'
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
                                    <label htmlFor="is_active" className="font-bold text-black">
                                        Active
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-end gap-2 p-2'>
                            <button
                                onClick={handleCloseModal}
                                className='p-2 px-5 text-xs font-extrabold bg-gray-400 rounded-lg hover:scale-101 hover:bg-gray-500'>
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
        </div>
    );
}