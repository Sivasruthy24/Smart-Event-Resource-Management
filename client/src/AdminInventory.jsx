import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit3, Image as ImageIcon, Package } from 'lucide-react';

const AdminInventory = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newResource, setNewResource] = useState({ name: '', category: '', description: '', image: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/resources');
      setResources(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/resources', newResource);
      setNewResource({ name: '', category: '', description: '', image: '' });
      fetchResources();
      alert("Resource added successfully!");
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Failed to add resource.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource forever?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource.');
    }
  };

  const handleEditSave = async (id, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/resources/${id}`, updatedData);
      setEditingId(null);
      fetchResources();
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Failed to update resource.');
    }
  };

  return (
    <div className="flex h-full bg-slate-50 font-sans overflow-hidden">
      
      {/* LEFT SIDE: CREATE FORM */}
      <div className="w-1/3 bg-white border-r border-slate-200 shadow-sm flex flex-col p-8 z-10 overflow-y-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Manage Inventory</h2>
        <p className="text-slate-500 text-sm mb-8">Add new physical resources to the club's database.</p>
        
        <form onSubmit={handleAdd} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Resource Name</label>
            <input required value={newResource.name} onChange={e => setNewResource({...newResource, name: e.target.value})} className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Projector" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
            <input required value={newResource.category} onChange={e => setNewResource({...newResource, category: e.target.value})} className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Electronics" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <textarea required value={newResource.description} onChange={e => setNewResource({...newResource, description: e.target.value})} rows="4" className="w-full rounded-lg border-slate-300 border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" placeholder="Provide a detailed description..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ImageIcon size={18} className="text-slate-400" />
              </div>
              <input value={newResource.image} onChange={e => setNewResource({...newResource, image: e.target.value})} placeholder="https://..." className="w-full rounded-lg border-slate-300 border pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg">
            Save to Database
          </button>
        </form>
      </div>

      {/* RIGHT SIDE: SCROLLABLE LIST */}
      <div className="w-2/3 bg-slate-50 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Existing Resources</h3>
            <span className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              {resources.length} Items
            </span>
          </div>
          
          {loading ? (
            <div className="text-slate-500 text-center py-10">Loading inventory...</div>
          ) : (
            <div className="space-y-4">
              {resources.map(resource => (
                <div key={resource._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-5 items-start hover:shadow-md transition-shadow">
                  {editingId === resource._id ? (
                    <div className="w-full space-y-3">
                      <input id={`edit-name-${resource._id}`} defaultValue={resource.name} className="w-full border border-slate-300 rounded p-2 font-bold" />
                      <input id={`edit-cat-${resource._id}`} defaultValue={resource.category} className="w-full border border-slate-300 rounded p-2 text-sm" />
                      <textarea id={`edit-desc-${resource._id}`} defaultValue={resource.description} className="w-full border border-slate-300 rounded p-2 text-sm" rows="2" />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => {
                          handleEditSave(resource._id, {
                            name: document.getElementById(`edit-name-${resource._id}`).value,
                            category: document.getElementById(`edit-cat-${resource._id}`).value,
                            description: document.getElementById(`edit-desc-${resource._id}`).value
                          });
                        }} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold">Save</button>
                        <button onClick={() => setEditingId(null)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded text-sm font-bold">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {resource.image && (
                        <img src={resource.image} alt={resource.name} className="w-24 h-24 object-cover rounded-lg bg-slate-100 flex-shrink-0" />
                      )}
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{resource.category}</span>
                            <h4 className="text-lg font-bold text-slate-800 mt-1">{resource.name}</h4>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingId(resource._id)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                              <Edit3 size={18} />
                            </button>
                            <button onClick={() => handleDelete(resource._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-500 mt-2 text-sm leading-relaxed">{resource.description}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {resources.length === 0 && !loading && (
                <div className="text-center py-16 bg-white border border-slate-200 border-dashed rounded-xl">
                  <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">No resources found.</p>
                  <p className="text-slate-400 text-sm mt-1">Add your first resource using the form on the left.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
