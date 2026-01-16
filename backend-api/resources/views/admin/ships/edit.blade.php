<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Ship - {{ $ship->name }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        zinc: {
                            700: '#3f3f46',
                            800: '#27272a',
                            900: '#18181b',
                            950: '#09090b',
                        },
                        purple: {
                            400: '#c084fc',
                            500: '#a855f7',
                            600: '#9333ea',
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-zinc-900 text-gray-100 p-6 md:p-10 font-sans antialiased min-h-screen flex items-center justify-center">

    <div class="w-full max-w-3xl bg-zinc-800 p-8 rounded-xl shadow-2xl border border-zinc-700">
        
        <div class="border-b border-zinc-700 pb-4 mb-6">
            <h2 class="text-3xl font-bold text-purple-400">Edit Blueprint: {{ $ship->name }}</h2>
            <p class="text-zinc-500 mt-1">Modify chassis constraints and limitations.</p>
        </div>
        
        <form action="{{ route('admin.ships.update', $ship->id) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label class="block text-zinc-400 text-sm font-bold mb-2">Model Name</label>
                    <input type="text" name="name" value="{{ $ship->name }}" 
                           class="w-full bg-zinc-900 border border-zinc-600 rounded p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-zinc-500 transition">
                </div>

                <div>
                    <label class="block text-zinc-400 text-sm font-bold mb-2">Hull Mass (T)</label>
                    <input type="number" name="hull_mass" value="{{ $ship->hull_mass }}" 
                           class="w-full bg-zinc-900 border border-zinc-600 rounded p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-zinc-500 transition">
                </div>
            </div>

            <div class="bg-zinc-900/50 p-6 rounded-lg border border-zinc-700 mb-8">
                <h3 class="text-lg font-bold text-gray-200 mb-4 border-b border-zinc-700 pb-2">Internal Slot Limits (Max Class)</h3>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-xs uppercase text-purple-400 font-bold mb-1">Frame Shift Drive</label>
                        <input type="number" name="max_fsd" value="{{ $ship->max_fsd }}" max="8" min="1"
                               class="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-center text-white focus:border-purple-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-xs uppercase text-zinc-500 font-bold mb-1">Thrusters</label>
                        <input type="number" name="max_thrusters" value="{{ $ship->max_thrusters }}" max="8" min="1"
                               class="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-center text-white focus:border-purple-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-xs uppercase text-zinc-500 font-bold mb-1">Power Plant</label>
                        <input type="number" name="max_power_plant" value="{{ $ship->max_power_plant ?? 1 }}" max="8" min="1"
                               class="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-center text-white focus:border-purple-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-xs uppercase text-zinc-500 font-bold mb-1">Power Distributor</label>
                        <input type="number" name="max_power_distributor" value="{{ $ship->max_power_distributor ?? 1 }}" max="8" min="1"
                               class="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-center text-white focus:border-purple-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-xs uppercase text-zinc-500 font-bold mb-1">Life Support</label>
                        <input type="number" name="max_life_support" value="{{ $ship->max_life_support ?? 1 }}" max="8" min="1"
                               class="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-center text-white focus:border-purple-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-xs uppercase text-zinc-500 font-bold mb-1">Sensors</label>
                        <input type="number" name="max_sensors" value="{{ $ship->max_sensors ?? 1 }}" max="8" min="1"
                               class="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-center text-white focus:border-purple-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-xs uppercase text-zinc-500 font-bold mb-1">Fuel Tank</label>
                        <input type="number" name="max_fuel_tank" value="{{ $ship->max_fuel_tank ?? 1 }}" max="8" min="1"
                               class="w-full bg-zinc-800 border border-zinc-600 rounded p-2 text-center text-white focus:border-purple-500 focus:outline-none">
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between pt-2">
                <a href="{{ route('admin.ships.index') }}" class="text-zinc-400 hover:text-white transition font-medium text-sm">
                    &larr; Cancel
                </a>

                <button type="submit" class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded shadow-lg shadow-purple-900/20 transition transform hover:scale-105">
                    Update Blueprint
                </button>
            </div>
        </form>
    </div>

</body>
</html>