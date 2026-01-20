<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Ship Models</title>
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
<body class="bg-zinc-900 text-gray-100 font-sans antialiased min-h-screen p-6 md:p-10">

    <div class="max-w-6xl mx-auto">
        
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-zinc-700 pb-6">
            <div>
                <h1 class="text-4xl font-bold text-purple-400">Ship Models Database</h1>
                <p class="text-zinc-500 mt-1">Backend Administration Console</p>
            </div>
            
            <div class="flex items-center gap-4 mt-4 md:mt-0">
                <span class="bg-zinc-800 border border-zinc-600 text-zinc-300 px-3 py-1 rounded text-xs font-mono tracking-wider uppercase">
                    Backend Mode
                </span>

                <form action="{{ route('admin.logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-bold shadow-lg shadow-red-900/20 transition">
                        Logout
                    </button>
                </form>
            </div>
        </div>

        @if(session('success'))
            <div class="bg-green-900/30 border border-green-900/50 text-green-400 px-4 py-3 rounded mb-6 text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ session('success') }}
            </div>
        @endif

        <div class="bg-zinc-800 rounded-xl shadow-2xl border border-zinc-700 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-zinc-900/50 border-b border-zinc-700 text-xs uppercase text-zinc-500 tracking-wider">
                            <th class="px-6 py-4 font-bold w-24">ID</th>
                            <th class="px-6 py-4 font-bold">Model Name</th>
                            <th class="px-6 py-4 font-bold">Hull Mass</th>
                            <th class="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-700">
                        @foreach($ships as $ship)
                        <tr class="hover:bg-zinc-700/30 transition group">
                            <td class="px-6 py-4 font-mono text-zinc-500 text-sm">#{{ $ship->id }}</td>
                            <td class="px-6 py-4 font-bold text-white text-lg">{{ $ship->name }}</td>
                            <td class="px-6 py-4 text-gray-300 font-mono">{{ $ship->hull_mass }} T</td>
                            <td class="px-6 py-4 text-right flex justify-end items-center gap-3">
                                <a href="{{ route('admin.ships.edit', $ship->id) }}" 
                                   class="text-purple-400 hover:text-white font-medium text-sm transition border-b border-transparent hover:border-purple-400">
                                    Edit
                                </a>
                                
                                <span class="text-zinc-600">|</span>

                                <form action="{{ route('admin.ships.destroy', $ship->id) }}" method="POST" onsubmit="return confirm('WARNING: Are you sure you want to delete the {{ $ship->name }}? This action cannot be undone.');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-400 hover:text-red-300 font-medium text-sm transition border-b border-transparent hover:border-red-400">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            @if($ships->isEmpty())
                <div class="p-12 text-center border-t border-zinc-700">
                    <p class="text-zinc-500 text-lg">No prototypes found in the database.</p>
                </div>
            @endif
        </div>
        
        <div class="mt-8 text-center text-zinc-600 text-xs uppercase tracking-widest">
            EliteManager Admin Console v1.0
        </div>
    </div>
</body>
</html>