import { Head, useForm, Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="relative min-h-screen bg-black flex flex-col justify-center items-center text-white selection:bg-white selection:text-black">
            <Head title="Admin Login | RKZ." />

            {/* --- KOTAK LOGIN --- */}
            <div className="w-full max-w-md p-8 md:p-12 border border-gray-800 rounded-2xl bg-[#0a0a0a] shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">RESTRICTED AREA</h1>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Creative Technologist Only</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={data.email} 
                            onChange={e => setData('email', e.target.value)} 
                            className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:outline-none focus:border-white transition-colors"
                            required 
                            autoFocus
                        />
                        {errors.email && <div className="text-red-500 text-xs mt-2">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-2">Password</label>
                        <input 
                            type="password" 
                            value={data.password} 
                            onChange={e => setData('password', e.target.value)} 
                            className="w-full bg-transparent border-b border-gray-700 p-2 text-white focus:outline-none focus:border-white transition-colors"
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full pt-4 mt-8 pb-4 bg-white text-black text-xs font-bold tracking-widest uppercase rounded-full hover:bg-gray-200 transition-colors"
                    >
                        {processing ? 'Authenticating...' : 'Access Terminal'}
                    </button>

                    {/* --- TOMBOL KEMBALI --- */}
                    <div className="mt-6 flex justify-center">
                        <Link 
                            href="/" 
                            className="flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase text-gray-600 hover:text-gray-300 transition-colors group"
                        >
                            <span>Return to Website</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}