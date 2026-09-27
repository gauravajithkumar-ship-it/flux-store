import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { supabase } from '../../lib/supabase';

const ITEMS_PER_PAGE = 6;

const AdminProducts = () => {
  const { products, isLoading, refreshProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editProduct, setEditProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return ['All', ...cats.sort()];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.upc && p.upc.includes(searchTerm));
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter, products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  
  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      refreshProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const specsString = formData.get('specs');
    const specsArray = specsString ? specsString.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    const productData = {
      id: modalMode === 'add' ? formData.get('name').toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000) : editProduct.id,
      name: formData.get('name'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price')),
      discount: formData.get('discount') ? parseFloat(formData.get('discount')) : null,
      rating: parseFloat(formData.get('rating') || 0),
      stockStatus: formData.get('stockStatus'),
      stockCount: parseInt(formData.get('stockCount') || 0, 10),
      upc: formData.get('upc'),
      img: formData.get('img'),
      specs: specsArray
    };

    try {
      if (modalMode === 'add') {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').update(productData).eq('id', editProduct.id);
        if (error) throw error;
      }
      refreshProducts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return '₹' + price.toLocaleString('en-IN');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Management</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products in database</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products by name, brand, ID, or UPC..."
            className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="bg-black/50 border border-white/10 p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Product Details</th>
                <th className="px-6 py-4 font-medium">UPC Code</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price (INR)</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/10">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand} · {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{product.upc}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-gray-300 border border-white/5">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{formatPrice(product.price)}</span>
                    {product.discount && (
                      <span className="ml-2 text-emerald-400 text-xs">-{product.discount}%</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400 text-xs">★</span>
                      <span className="text-white text-xs">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.stockCount} units</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.stockStatus === 'In Stock' ? 'text-emerald-400 bg-emerald-400/10' :
                      product.stockStatus === 'Low Stock' ? 'text-amber-400 bg-amber-400/10' :
                      'text-red-400 bg-red-400/10'
                    }`}>
                      {product.stockStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No results */}
        {paginatedProducts.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-500">
          <p>Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products</p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded transition-colors ${
                  page === currentPage
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <form onSubmit={handleSubmit} className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{modalMode === 'add' ? 'Add New Product' : `Edit: ${editProduct?.name}`}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Product Name</label>
                  <input name="name" type="text" required defaultValue={editProduct?.name || ''} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none" placeholder="e.g. Galaxy A56 5G" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Brand</label>
                  <input name="brand" type="text" required defaultValue={editProduct?.brand || ''} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none" placeholder="e.g. Samsung" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">UPC Code</label>
                  <input name="upc" type="text" defaultValue={editProduct?.upc || ''} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none font-mono" placeholder="e.g. 8901234560001" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Category</label>
                  <input name="category" type="text" required defaultValue={editProduct?.category || ''} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none" placeholder="e.g. Mobile" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Price (₹)</label>
                  <input name="price" type="number" required defaultValue={editProduct?.price || ''} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Discount (%)</label>
                  <input name="discount" type="number" defaultValue={editProduct?.discount || ''} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none" placeholder="0" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Stock Status</label>
                  <select name="stockStatus" defaultValue={editProduct?.stockStatus || 'In Stock'} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none">
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Stock Count</label>
                  <input name="stockCount" type="number" required defaultValue={editProduct?.stockCount || ''} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none" placeholder="100" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Rating</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={editProduct?.rating || ''} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none" placeholder="4.5" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Image URL</label>
                <input name="img" type="text" defaultValue={editProduct?.img || ''} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none text-xs" placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Specs (comma separated)</label>
                <textarea name="specs" rows="3" defaultValue={editProduct?.specs?.join(', ') || ''} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500/50 focus:outline-none" placeholder="6.6&quot; Super AMOLED, 120Hz Refresh Rate, ..."></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center">
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : modalMode === 'add' ? 'Save Product' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
