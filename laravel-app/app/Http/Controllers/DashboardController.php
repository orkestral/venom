<?php

namespace App\Http\Controllers;

use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Added for $request->user() alternative

class DashboardController extends Controller
{
    protected WhatsAppService $whatsAppService;

    public function __construct(WhatsAppService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $qrCode = null;
        $messages = []; // Initialize messages as an empty array

        if ($user->whatsapp_device_status === 'waiting_qr') {
            $qrCode = $this->whatsAppService->getQrCode($user);
        }

        if ($user->is_whatsapp_connected) {
            $messages = $this->whatsAppService->getMessages($user);
        }

        return view('dashboard.index', compact('user', 'qrCode', 'messages'));
    }

    public function connect(Request $request)
    {
        $user = $request->user();
        $this->whatsAppService->connectDevice($user);

        return redirect()->route('dashboard');
    }

    public function disconnect(Request $request)
    {
        $user = $request->user();
        $this->whatsAppService->disconnectDevice($user);

        return redirect()->route('dashboard');
    }

    public function simulateConnection(Request $request)
    {
        $user = $request->user();
        $deviceId = 'simulated_device_' . uniqid();
        $this->whatsAppService->simulateConnectionSuccess($user, $deviceId);

        return redirect()->route('dashboard');
    }

    public function sendMessage(Request $request)
    {
        $request->validate(['message' => 'required|string|max:1000']);
        $user = $request->user();
        $messageText = $request->input('message');

        if ($user->is_whatsapp_connected) {
            $success = $this->whatsAppService->sendMessage($user, $messageText);
            if ($success) {
                return redirect()->route('dashboard')->with('status', 'Message sent (simulated)!');
            } else {
                return redirect()->route('dashboard')->with('error', 'Failed to send message (simulated).');
            }
        }
        return redirect()->route('dashboard')->with('error', 'WhatsApp not connected.');
    }
}
