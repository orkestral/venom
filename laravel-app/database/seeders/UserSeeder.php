<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'whatsapp_device_id' => null,
                'is_whatsapp_connected' => false,
                'whatsapp_device_status' => 'disconnected', // Corrected column name
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Test User',
                'email' => 'user@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'whatsapp_device_id' => null,
                'is_whatsapp_connected' => false,
                'whatsapp_device_status' => 'disconnected', // Corrected column name
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
