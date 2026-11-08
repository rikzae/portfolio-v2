<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {
        // Mengambil semua data proyek (id, title, image_url, description)
        $projects = Project::all();

        // Mengirimkan data 'projects' sebagai props ke halaman frontend
        return Inertia::render('Portfolio/Index', [
            'projects' => $projects
        ]);
    }
}
