<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    // Menampilkan halaman depan portofolio beserta data proyek
    public function index()
    {
        // Mengambil semua proyek dari database
        $projects = Project::latest()->get();
        
        return Inertia::render('Portfolio/Index', [
            'projects' => $projects
        ]);
    }

    // Menyimpan proyek baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_link' => 'nullable|url',
            'image' => 'nullable|image|max:4096', // Maksimal 4MB
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        Project::create($validated);

        return redirect()->back();
    }

    // Memperbarui proyek yang sudah ada
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_link' => 'nullable|url',
            'image' => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($project->image_url && str_starts_with($project->image_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $project->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            
            // Simpan gambar baru
            $path = $request->file('image')->store('projects', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        $project->update($validated);

        return redirect()->back();
    }

    // Menghapus proyek
    public function destroy(Project $project)
    {
        // Hapus file gambar dari server (storage) sebelum menghapus data di database
        if ($project->image_url && str_starts_with($project->image_url, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $project->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $project->delete();

        return redirect()->back();
    }
}