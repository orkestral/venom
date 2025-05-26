<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <p class="mb-4">Welcome, {{ $user->name }}!</p>
                    <p class="mb-4">WhatsApp Status: <span class="font-bold">{{ $user->whatsapp_device_status }}</span></p>

                    @if ($user->whatsapp_device_status === 'disconnected')
                        <form method="POST" action="{{ route('dashboard.connect') }}">
                            @csrf
                            <x-primary-button type="submit">
                                {{ __('Connect WhatsApp') }}
                            </x-primary-button>
                        </form>
                    @elseif ($user->whatsapp_device_status === 'waiting_qr')
                        @if ($qrCode)
                            <div class="mb-4">
                                <p>Scan the QR code below with your WhatsApp application:</p>
                                <img src="{{ $qrCode }}" alt="Scan QR Code">
                            </div>
                        @else
                            <p>Generating QR code, please wait or refresh...</p>
                        @endif
                        <form method="POST" action="{{ route('dashboard.simulate_connection') }}" class="mt-4">
                            @csrf
                            <x-secondary-button type="submit">
                                {{ __('Simulate Connection Success') }}
                            </x-secondary-button>
                        </form>
                    @elseif ($user->whatsapp_device_status === 'connected')
                        <p class="mb-4">Device Connected ID: {{ $user->whatsapp_device_id }}</p>
                        <form method="POST" action="{{ route('dashboard.disconnect') }}">
                            @csrf
                            <x-danger-button type="submit">
                                {{ __('Disconnect WhatsApp') }}
                            </x-danger-button>
                        </form>
                    @endif

                    @if ($user->is_whatsapp_connected)
                        <div class="mt-6 p-6 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Send a Message (Stub)</h3>
                            <form method="POST" action="{{ route('dashboard.send_message') }}" class="mt-2">
                                @csrf
                                <div>
                                    <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                                    <textarea id="message" name="message" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:focus:ring-offset-gray-800" required></textarea>
                                </div>
                                <div class="mt-4">
                                    <button type="submit" class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    @endif

                    <!-- Display success/error messages related to sending -->
                    @if (session('status') && Str::contains(session('status'), 'Message sent'))
                        <div class="mt-4 p-4 bg-green-100 dark:bg-green-700 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 rounded">
                            {{ session('status') }}
                        </div>
                    @endif
                    @if (session('error') && Str::contains(session('error'), 'message'))
                        <div class="mt-4 p-4 bg-red-100 dark:bg-red-700 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded">
                            {{ session('error') }}
                        </div>
                    @endif

                    @if ($user->is_whatsapp_connected && !empty($messages))
                        <div class="mt-6 p-6 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Conversation (Stub)</h3>
                            <div class="space-y-4">
                                @foreach ($messages as $message)
                                    <div class="flex {{ $message['type'] === 'sent' ? 'justify-end' : 'justify-start' }}">
                                        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg {{ $message['type'] === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200' }}">
                                            <p class="text-sm">{{ $message['text'] }}</p>
                                            <p class="text-xs mt-1 {{ $message['type'] === 'sent' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400' }}">
                                                {{ $message['sender'] }} - {{ \Carbon\Carbon::parse($message['timestamp'])->diffForHumans() }}
                                            </p>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
