import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-zinc-900 pt-16 text-gray-100">
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
}