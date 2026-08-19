import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowRight,
    BookOpen,
    GraduationCap,
    Library,
    Lock,
    Mail,
    UserRound,
} from 'lucide-react';
import { cardVariants, sectionVariants } from '../../lib/animations';
import { useMockAuth } from '../../hooks/useMockAuth';
import { getSafeRedirectPath } from '../../lib/auth';
import BrandLogo from '../../components/ui/BrandLogo';

type AuthMode = 'login' | 'signup';

const GoogleIcon = () => (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-extrabold text-[#111827]">
        G
    </span>
);

const Field = ({
    icon,
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
}: {
    icon: ReactNode;
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: string;
}) => (
    <label className="block text-left">
        <span className="mb-2 block text-sm font-bold text-[#111827]">{label}</span>
        <span className="flex h-12 items-center gap-3 rounded-full border border-[#CFC4B2] bg-white px-4 transition focus-within:border-[#111827] focus-within:ring-2 focus-within:ring-[#111827]/10">
            <span className="text-[#626B78]">{icon}</span>
            <input
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#8A8175]"
                name={name}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                type={type}
                value={value}
            />
        </span>
    </label>
);

const IllustrationPanel = () => (
    <motion.aside
        className="relative hidden min-h-screen overflow-hidden bg-[#8BE8B1] px-12 py-12 lg:flex lg:flex-col lg:justify-between xl:px-16"
        variants={cardVariants}
    >
        <div className="max-w-xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#111827]/15 bg-[#FFFDF8]/85 px-4 py-2 text-sm font-bold text-[#111827]">
                <Library size={18} strokeWidth={2.3} />
                Books for every reader
            </div>
            <h1 className="font-sora mt-8 max-w-xl text-5xl font-extrabold leading-[1.05] text-[#111827] xl:text-6xl">
                Give books a second life.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#253142] xl:text-lg xl:leading-8">
                Join readers across Bangladesh to buy, sell, exchange, and donate books.
            </p>
        </div>

        <div className="relative mx-auto h-[250px] w-full max-w-md">
            <div className="absolute bottom-0 left-0 right-0 h-5 rounded-full bg-[#111827]" />
            <div className="absolute bottom-5 left-5 h-36 w-16 rounded-t-lg border-4 border-[#111827] bg-[#FFFDF8]">
                <div className="h-10 bg-[#F4D35E]" />
                <BookOpen className="mx-auto mt-10 text-[#111827]" size={26} strokeWidth={2} />
            </div>
            <div className="absolute bottom-5 left-28 h-48 w-20 rounded-t-lg border-4 border-[#111827] bg-[#FFFDF8]">
                <div className="h-12 bg-[#A78BFA]" />
                <div className="mx-auto mt-9 h-20 w-3 rounded-full bg-[#111827]" />
            </div>
            <div className="absolute bottom-5 left-56 h-32 w-20 rounded-t-lg border-4 border-[#111827] bg-[#FFFDF8]">
                <div className="h-9 bg-[#F9735B]" />
                <GraduationCap className="mx-auto mt-8 text-[#111827]" size={28} strokeWidth={2} />
            </div>
            <div className="absolute bottom-5 right-5 h-44 w-20 rounded-t-lg border-4 border-[#111827] bg-[#FFFDF8]">
                <div className="h-12 bg-[#7DE3A5]" />
                <div className="mx-auto mt-10 h-12 w-12 rounded-full border-4 border-[#111827]" />
            </div>
        </div>
    </motion.aside>
);

const Login = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated, login, signup } = useMockAuth();
    const isLogin = mode === 'login';
    const redirectPath = getSafeRedirectPath(searchParams.get('redirect'));

    const updateField = (field: keyof typeof formValues, value: string) => {
        setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
        setError('');
        setSuccessMessage('');
    };

    const validateForm = () => {
        if (!formValues.email.trim()) return 'Email is required';
        if (!formValues.password) return 'Password is required';
        if (formValues.password.length < 8) return 'Password must be at least 8 characters';

        if (!isLogin) {
            if (!formValues.name.trim()) return 'Name is required';
            if (formValues.password !== formValues.confirmPassword) return 'Passwords do not match';
        }

        return '';
    };

    const handleAuthSubmit = async (event?: { preventDefault: () => void }) => {
        event?.preventDefault();
        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            if (isLogin) {
                await login({
                    email: formValues.email.trim(),
                    password: formValues.password,
                });
            } else {
                await signup({
                    name: formValues.name.trim(),
                    email: formValues.email.trim(),
                    password: formValues.password,
                });
            }

            navigate(redirectPath, { replace: true });
        } catch (authError) {
            setError(authError instanceof Error ? authError.message : 'Could not connect. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleClick = () => {
        setError('');
        setSuccessMessage('Google login is coming soon.');
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirectPath, { replace: true });
        }
    }, [isAuthenticated, navigate, redirectPath]);

    return (
        <main className="min-h-screen bg-[#FFFDF8] text-[#111827]">
            <motion.div
                className="grid min-h-screen lg:grid-cols-[0.47fr_0.53fr]"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
            >
                <IllustrationPanel />

                <motion.section
                    className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12"
                    variants={cardVariants}
                >
                    <div className="w-full max-w-xl">
                        <div className="mb-8 flex flex-col items-center text-center">
                            <BrandLogo className="h-auto w-[300px] max-w-full" />
                            <p className="mt-3 text-sm font-semibold text-[#626B78]">Welcome to your book community</p>
                        </div>

                        <div className="grid grid-cols-2 rounded-full bg-[#F4EFE6] p-1">
                            <button
                                className={`rounded-full px-4 py-3 text-sm font-extrabold transition ${isLogin ? 'bg-[#111827] text-white' : 'text-[#4F5865] hover:text-[#111827]'}`}
                                onClick={() => setMode('login')}
                                type="button"
                            >
                                Login
                            </button>
                            <button
                                className={`rounded-full px-4 py-3 text-sm font-extrabold transition ${!isLogin ? 'bg-[#111827] text-white' : 'text-[#4F5865] hover:text-[#111827]'}`}
                                onClick={() => setMode('signup')}
                                type="button"
                            >
                                Sign Up
                            </button>
                        </div>

                        <form className="mt-8 space-y-5" onSubmit={handleAuthSubmit}>
                            {!isLogin && (
                                <Field
                                    icon={<UserRound size={18} strokeWidth={2.2} />}
                                    label="Name"
                                    name="name"
                                    onChange={(value) => updateField('name', value)}
                                    placeholder="Enter your name"
                                    value={formValues.name}
                                />
                            )}
                            <Field
                                icon={<Mail size={18} strokeWidth={2.2} />}
                                label="Email"
                                name="email"
                                onChange={(value) => updateField('email', value)}
                                placeholder="Enter your email"
                                type="email"
                                value={formValues.email}
                            />
                            <Field
                                icon={<Lock size={18} strokeWidth={2.2} />}
                                label="Password"
                                name="password"
                                onChange={(value) => updateField('password', value)}
                                placeholder="Enter your password"
                                type="password"
                                value={formValues.password}
                            />
                            {!isLogin && (
                                <Field
                                    icon={<Lock size={18} strokeWidth={2.2} />}
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    onChange={(value) => updateField('confirmPassword', value)}
                                    placeholder="Confirm your password"
                                    type="password"
                                    value={formValues.confirmPassword}
                                />
                            )}

                            {isLogin && (
                                <div className="flex justify-end">
                                    <button className="text-sm font-bold text-[#111827] hover:underline" type="button">
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            {(error || successMessage) && (
                                <div
                                    className={`rounded-lg border px-4 py-3 text-sm font-bold ${
                                        error
                                            ? 'border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]'
                                            : 'border-[#A8EBC4] bg-[#E6F8EF] text-[#14532D]'
                                    }`}
                                >
                                    {error || successMessage}
                                </div>
                            )}

                            <button
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#111827] px-6 text-sm font-extrabold text-white transition hover:bg-[#243041] disabled:cursor-not-allowed disabled:bg-[#626B78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
                                disabled={isSubmitting}
                                type="submit"
                            >
                                {isSubmitting ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
                                <ArrowRight size={18} strokeWidth={2.4} />
                            </button>

                            <button
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#CFC4B2] bg-white px-6 text-sm font-extrabold text-[#111827] transition hover:bg-[#F4EFE6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111827]"
                                onClick={handleGoogleClick}
                                type="button"
                            >
                                <GoogleIcon />
                                Continue with Google
                            </button>
                        </form>

                        <p className="mt-7 text-center text-sm font-semibold text-[#4F5865]">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <button
                                className="font-extrabold text-[#111827] hover:underline"
                                onClick={() => setMode(isLogin ? 'signup' : 'login')}
                                type="button"
                            >
                                {isLogin ? 'Sign up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </motion.section>
            </motion.div>
        </main>
    );
};

export default Login;
