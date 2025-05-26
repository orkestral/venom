<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\WhatsAppService; // Ensure this is imported
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

uses(RefreshDatabase::class); // Use RefreshDatabase trait for Pest

// Helper function to create a user for tests
function createUser(array $attributes = []): User
{
    return User::factory()->create($attributes);
}

test('guests are redirected from dashboard to login', function () {
    $this->get('/dashboard')
        ->assertRedirect('/login');
});

test('dashboard shows disconnected status and connect button for disconnected user', function () {
    $user = createUser(['whatsapp_device_status' => 'disconnected', 'is_whatsapp_connected' => false]);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk()
        ->assertSeeText('WhatsApp Status: disconnected')
        ->assertSeeText('Connect WhatsApp');
});

test('connect action updates status to waiting_qr and view', function () {
    $user = createUser(['whatsapp_device_status' => 'disconnected', 'is_whatsapp_connected' => false]);

    $this->actingAs($user)
        ->post(route('dashboard.connect'))
        ->assertRedirect(route('dashboard'));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'whatsapp_device_status' => 'waiting_qr',
        'is_whatsapp_connected' => false, // Should still be false until QR is scanned
    ]);

    $this->actingAs($user->fresh()) // Re-authenticate with the fresh user model
        ->get('/dashboard')
        ->assertOk()
        ->assertSeeText('WhatsApp Status: waiting_qr')
        ->assertSeeText('Scan the QR code below');
});

test('dashboard shows waiting_qr status and simulate button for waiting_qr user', function () {
    $user = createUser(['whatsapp_device_status' => 'waiting_qr', 'is_whatsapp_connected' => false]);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk()
        ->assertSeeText('WhatsApp Status: waiting_qr')
        ->assertSeeText('Scan the QR code below') // Check for QR image area text
        ->assertSeeText('Simulate Connection Success');
});

test('simulate connection action updates status to connected and view', function () {
    $user = createUser(['whatsapp_device_status' => 'waiting_qr', 'is_whatsapp_connected' => false]);

    $this->actingAs($user)
        ->post(route('dashboard.simulate_connection'))
        ->assertRedirect(route('dashboard'));

    $user->refresh(); // Refresh user model from database
    $this->assertEquals('connected', $user->whatsapp_device_status);
    $this->assertTrue($user->is_whatsapp_connected);
    $this->assertNotNull($user->whatsapp_device_id);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk()
        ->assertSeeText('WhatsApp Status: connected')
        ->assertSeeText('Device Connected ID: ' . $user->whatsapp_device_id)
        ->assertSeeText('Disconnect WhatsApp')
        ->assertSeeText('Send a Message');
});

test('dashboard shows connected status and relevant elements for connected user', function () {
    $user = createUser([
        'whatsapp_device_status' => 'connected',
        'is_whatsapp_connected' => true,
        'whatsapp_device_id' => 'test_device_123'
    ]);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk()
        ->assertSeeText('WhatsApp Status: connected')
        ->assertSeeText('Device Connected ID: test_device_123')
        ->assertSeeText('Disconnect WhatsApp')
        ->assertSeeText('Send a Message');
});

test('disconnect action updates status to disconnected and view', function () {
    $user = createUser([
        'whatsapp_device_status' => 'connected',
        'is_whatsapp_connected' => true,
        'whatsapp_device_id' => 'test_device_123'
    ]);

    $this->actingAs($user)
        ->post(route('dashboard.disconnect'))
        ->assertRedirect(route('dashboard'));

    $user->refresh();
    $this->assertEquals('disconnected', $user->whatsapp_device_status);
    $this->assertFalse($user->is_whatsapp_connected);
    $this->assertNull($user->whatsapp_device_id);


    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk()
        ->assertSeeText('WhatsApp Status: disconnected')
        ->assertSeeText('Connect WhatsApp');
});

test('message can be sent when connected', function () {
    $user = createUser([
        'whatsapp_device_status' => 'connected',
        'is_whatsapp_connected' => true,
        'whatsapp_device_id' => 'test_device_123'
    ]);

    $this->actingAs($user)
        ->post(route('dashboard.send_message'), ['message' => 'Hello World'])
        ->assertRedirect(route('dashboard'))
        ->assertSessionHas('status', 'Message sent (simulated)!');
});

test('message cannot be sent when disconnected', function () {
    $user = createUser(['whatsapp_device_status' => 'disconnected', 'is_whatsapp_connected' => false]);

    $this->actingAs($user)
        ->post(route('dashboard.send_message'), ['message' => 'Hello World'])
        ->assertRedirect(route('dashboard'))
        ->assertSessionHas('error', 'WhatsApp not connected.');
});
