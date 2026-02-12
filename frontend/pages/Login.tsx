import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-slate-100 dark:border-slate-800 animate-fade-in-up">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                <span className="material-icons text-3xl">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Log in to manage your tasks and notes.</p>
        </div>

        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Email address</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <span className="material-icons text-xl">mail_outline</span>
                    </div>
                    <input className="block w-full rounded-md border-0 py-2.5 pl-10 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6" placeholder="you@example.com" type="email" value="alex@prodspace.com" readOnly />
                </div>
            </div>
            
             <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Password</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <span className="material-icons text-xl">lock_outline</span>
                    </div>
                    <input className="block w-full rounded-md border-0 py-2.5 pl-10 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6" type="password" value="password" readOnly />
                </div>
            </div>

            <button onClick={onLogin} className="flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 transition-all">
                Log in
            </button>
        </div>
        
        <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white dark:bg-slate-900 px-4 text-slate-500">Or continue with</span>
            </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 transition-colors">
                Google
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[#24292F] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#24292F]/90 transition-colors">
                GitHub
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
