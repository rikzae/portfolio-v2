<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Project::create([
            'title' => 'SINEO Dashboard',
            'image_url' => '/images/project-1.jpg',
            'description' => 'Sistem Informasi Near-Earth Objects'
        ]);
        
        Project::create([
            'title' => 'SIPI E-Learning',
            'image_url' => '/images/project-2.jpg',
            'description' => 'Interactive Learning System'
        ]);

        Project::create([
            'title' => 'SPP Gateway',
            'image_url' => '/images/project-3.jpg',
            'description' => 'Sistem pembayaran SPP terintegrasi Midtrans'
        ]);
    }
}