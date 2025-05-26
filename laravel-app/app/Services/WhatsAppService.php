<?php

namespace App\Services;

use App\Models\User;

class WhatsAppService
{
    public function getQrCode(User $user): string
    {
        $user->whatsapp_device_status = 'waiting_qr';
        $user->save();

        // Placeholder QR code (1x1 black pixel PNG)
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }

    public function getDeviceStatus(User $user): string
    {
        return $user->whatsapp_device_status;
    }

    public function connectDevice(User $user): void
    {
        $user->whatsapp_device_status = 'waiting_qr';
        $user->is_whatsapp_connected = false;
        $user->whatsapp_device_id = null;
        $user->save();
    }

    public function disconnectDevice(User $user): void
    {
        $user->whatsapp_device_status = 'disconnected';
        $user->is_whatsapp_connected = false;
        $user->whatsapp_device_id = null;
        $user->save();
    }

    public function simulateConnectionSuccess(User $user, string $deviceId): void
    {
        $user->whatsapp_device_status = 'connected';
        $user->is_whatsapp_connected = true;
        $user->whatsapp_device_id = $deviceId;
        $user->save();
    }

    public function sendMessage(\App\Models\User $user, string $message): bool
    {
        // For now, just log the attempt or return true if connected
        if ($user->is_whatsapp_connected) {
            // In a real scenario, you'd interact with the WhatsApp API
            // For this stub, we can log it:
            // \Illuminate\Support\Facades\Log::info("Attempting to send message from user {$user->id}: {$message}");
            // Or simply return true as a placeholder for success
            return true;
        }
        return false;
    }

    public function getMessages(\App\Models\User $user): array
    {
        if (!$user->is_whatsapp_connected) {
            return [];
        }

        // Hardcoded sample messages
        return [
            [
                'id' => 1,
                'sender' => 'OtherUser',
                'text' => 'Hello! How are you doing?',
                'timestamp' => now()->subMinutes(10)->toDateTimeString(),
                'type' => 'received',
            ],
            [
                'id' => 2,
                'sender' => 'You',
                'text' => 'I am doing great, thanks for asking!',
                'timestamp' => now()->subMinutes(8)->toDateTimeString(),
                'type' => 'sent',
            ],
            [
                'id' => 3,
                'sender' => 'OtherUser',
                'text' => 'Glad to hear that. Are we still on for the meeting tomorrow?',
                'timestamp' => now()->subMinutes(5)->toDateTimeString(),
                'type' => 'received',
            ],
            [
                'id' => 4,
                'sender' => 'You',
                'text' => 'Yes, absolutely! See you then.',
                'timestamp' => now()->subMinutes(2)->toDateTimeString(),
                'type' => 'sent',
            ],
        ];
    }
}
