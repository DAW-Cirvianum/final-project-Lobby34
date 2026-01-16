<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Elite Manager</title>
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
<body class="bg-zinc-900 flex items-center justify-center h-screen font-sans antialiased text-gray-100">

    <div class="w-full max-w-sm bg-zinc-800 p-8 rounded-xl shadow-2xl border border-zinc-700">
        
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-purple-400">Admin Command</h1>
            <p class="text-zinc-500 text-sm mt-1">Authorized Personnel Only</p>
        </div>
        
        @if($errors->any())
            <div class="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded mb-6 text-sm text-center">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('login.post') }}" method="POST" class="space-y-5">
            @csrf
            
            <div>
                <label class="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Username or Email</label>
                <input type="text" name="login" 
                       class="w-full bg-zinc-900 border border-zinc-600 rounded p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
                       placeholder="Commander Name"
                       required autofocus>
            </div>

            <div>
                <label class="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
                <input type="password" name="password" 
                       class="w-full bg-zinc-900 border border-zinc-600 rounded p-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" 
                       placeholder="••••••••"
                       required>
            </div>

            <button class="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded shadow-lg shadow-purple-900/20 transition transform hover:scale-[1.02] duration-200" type="submit">
                Initialize Session
            </button>
        </form>

        <div class="mt-8 text-center border-t border-zinc-700 pt-4">
            <p class="text-zinc-600 text-xs">EliteManager v1.0 // Admin Access</p>
        </div>
    </div>

</body>
</html>