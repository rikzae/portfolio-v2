import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

export default function ProjectManager({ projects, onClose }) {
    const [view, setView] = useState('list'); // 'list', 'create', 'edit'
    const [editingId, setEditingId] = useState(null);

    // Inertia Form Helper
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        project_link: '',
        image: null, // Untuk upload file
    });

    const handleAdd = () => {
        reset();
        setView('create');
    };

    const handleEdit = (project) => {
        setData({
            title: project.title,
            description: project.description,
            project_link: project.project_link || '',
            image: null, // Kosongkan agar tidak wajib upload ulang
        });
        setEditingId(project.id);
        setView('edit');
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus proyek ini?')) {
            router.delete(`/projects/${id}`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (view === 'edit') {
            // Laravel Inertia butuh trik _method: 'put' untuk upload file
            router.post(`/projects/${editingId}`, {
                _method: 'put',
                ...data
            }, {
                onSuccess: () => setView('list')
            });
        } else {
            post('/projects', {
                onSuccess: () => setView('list')
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl text-white">
                
                {/* Header Modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold tracking-widest uppercase">
                        {view === 'list' ? 'Manage Projects' : view === 'create' ? 'Add New Project' : 'Edit Project'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white font-bold">✕</button>
                </div>

                {/* Konten Modal */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    
                    {/* TAMPILAN: DAFTAR PROYEK */}
                    {view === 'list' && (
                        <div>
                            <button onClick={handleAdd} className="mb-6 px-4 py-2 bg-white text-black text-xs font-bold tracking-widest rounded-md hover:bg-gray-200 uppercase">
                                + Add Project
                            </button>
                            
                            <div className="space-y-4">
                                {projects.map(proj => (
                                    <div key={proj.id} className="flex justify-between items-center bg-gray-900 p-4 rounded-lg border border-gray-800">
                                        <div>
                                            <h3 className="font-bold">{proj.title}</h3>
                                            <p className="text-xs text-gray-500">{proj.description}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEdit(proj)} className="px-3 py-1 bg-gray-800 text-xs rounded hover:bg-gray-700">Edit</button>
                                            <button onClick={() => handleDelete(proj.id)} className="px-3 py-1 bg-red-900/50 text-red-400 text-xs rounded hover:bg-red-900">Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && <p className="text-sm text-gray-500">Tidak ada proyek.</p>}
                            </div>
                        </div>
                    )}

                    {/* TAMPILAN: FORM TAMBAH / EDIT */}
                    {(view === 'create' || view === 'edit') && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Title</label>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} required
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-white" />
                                {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                            </div>
                            
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Description (opsional)</label>
                                <input type="text" value={data.description} onChange={e => setData('description', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-white" />
                            </div>
                            
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Project Link (opsional)</label>
                                <input type="url" value={data.project_link} onChange={e => setData('project_link', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-white" />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">
                                    Project Image {view === 'edit' && '(Kosongkan jika tidak ingin mengubah)'}
                                </label>
                                <input type="file" accept="image/*" onChange={e => setData('image', e.target.files[0])}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setView('list')} className="px-4 py-2 bg-gray-800 text-xs rounded hover:bg-gray-700">Cancel</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-white text-black text-xs font-bold rounded hover:bg-gray-200">
                                    {processing ? 'Saving...' : 'Save Project'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}