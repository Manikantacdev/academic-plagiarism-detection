import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, X, Eye, EyeOff, Check, FileSearch, Brain, Zap,
    Users, Award, Clock, ChevronDown, Star, ArrowRight,
    BookOpen, GraduationCap, Building2, Globe, Lock, BarChart3
} from 'lucide-react';

interface UserInfo {
    name: string;
    email: string;
}

interface LandingPageProps {
    onLogin: (user: UserInfo) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen relative" style={{ backgroundColor: '#0a0e1a' }}>
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(10,14,26,0.9)' }}>
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(74,144,244,0.2)', color: '#4a90f4' }}>
                            <Shield size={24} strokeWidth={2} />
                        </div>
                        <span className="font-serif font-bold text-xl text-white tracking-tight">AcademicGuard</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Features</a>
                        <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors text-sm font-medium">How It Works</a>
                        <a href="#testimonials" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Testimonials</a>
                        <a href="#faq" className="text-white/70 hover:text-white transition-colors text-sm font-medium">FAQ</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="px-4 py-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => setShowSignupModal(true)}
                            className="px-5 py-2 text-sm font-medium rounded-lg transition-all text-white"
                            style={{ background: 'linear-gradient(135deg, #4a90f4, #8b5cf6)' }}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-40 top-20 w-[900px] h-[900px]">
                        <div className="absolute inset-0 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(74,144,244,0.15) 0%, transparent 70%)' }} />
                        <div className="absolute inset-20 rounded-full" style={{ border: '1px solid rgba(74,144,244,0.2)' }} />
                        <div className="absolute inset-40 rounded-full" style={{ border: '1px solid rgba(74,144,244,0.15)' }} />
                        <div className="absolute inset-60 rounded-full" style={{ border: '1px solid rgba(139,92,246,0.1)' }} />
                    </div>
                    <div className="absolute -left-40 bottom-0 w-[600px] h-[600px] rounded-full blur-[120px]" style={{ backgroundColor: 'rgba(139,92,246,0.1)' }} />
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(74,144,244,0.1)', border: '1px solid rgba(74,144,244,0.2)' }}>
                                <Zap size={16} style={{ color: '#4a90f4' }} />
                                <span className="text-sm font-medium" style={{ color: '#4a90f4' }}>AI-Powered Academic Integrity</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
                                Protect Academic
                                <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4a90f4, #67d4fc, #8b5cf6)' }}>
                                    Integrity with AI
                                </span>
                            </h1>

                            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-xl">
                                Advanced plagiarism detection and AI content analysis trusted by over 500+ universities worldwide.
                                Ensure originality, detect AI-generated content, and maintain academic standards with our
                                comprehensive scanning technology.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-10">
                                <button
                                    onClick={() => setShowSignupModal(true)}
                                    className="group px-8 py-4 text-white font-semibold rounded-xl transition-all flex items-center gap-3"
                                    style={{ background: 'linear-gradient(135deg, #4a90f4, #8b5cf6)', boxShadow: '0 20px 40px rgba(74,144,244,0.3)' }}
                                >
                                    Get Started
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-8 py-4 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/5 transition-all flex items-center gap-3">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                                    Learn More
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop"
                                    alt="Student working on academic paper with laptop"
                                    className="w-full h-auto rounded-2xl"
                                    loading="eager"
                                />
                                <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(74,144,244,0.2), rgba(139,92,246,0.2))' }} />
                            </div>

                            {/* Floating Stats Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="absolute -left-8 top-1/4 p-4 rounded-xl backdrop-blur-xl border border-white/10"
                                style={{ backgroundColor: 'rgba(18,24,41,0.9)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.2)' }}>
                                        <Check size={20} style={{ color: '#22c55e' }} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">98.7%</div>
                                        <div className="text-white/50 text-xs">Originality Score</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating AI Badge */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -right-4 bottom-1/4 p-4 rounded-xl backdrop-blur-xl border border-white/10"
                                style={{ backgroundColor: 'rgba(18,24,41,0.9)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.2)' }}>
                                        <Brain size={20} style={{ color: '#8b5cf6' }} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">AI Detected</div>
                                        <div className="text-white/50 text-xs">GPT-4, Claude, etc.</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-20 pt-10 border-t border-white/10"
                    >
                        <p className="text-center text-white/40 text-sm mb-8">Trusted by leading institutions worldwide</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
                            <div className="flex items-center gap-2 text-white/70">
                                <GraduationCap size={28} />
                                <span className="font-semibold">Harvard</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                                <Building2 size={28} />
                                <span className="font-semibold">MIT</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                                <BookOpen size={28} />
                                <span className="font-semibold">Stanford</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                                <Globe size={28} />
                                <span className="font-semibold">Oxford</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                                <Award size={28} />
                                <span className="font-semibold">Cambridge</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '10M+', label: 'Documents Scanned', icon: FileSearch },
                            { value: '500+', label: 'Universities', icon: GraduationCap },
                            { value: '99.9%', label: 'Accuracy Rate', icon: BarChart3 },
                            { value: '24/7', label: 'Support Available', icon: Clock },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-6 rounded-2xl border border-white/5"
                                style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                            >
                                <stat.icon size={32} className="mx-auto mb-4" style={{ color: '#4a90f4' }} />
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-white/50 text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#4a90f4' }}>Features</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-6">
                            Everything You Need for
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4a90f4, #8b5cf6)' }}> Academic Integrity</span>
                        </h2>
                        <p className="text-white/60 text-lg max-w-2xl mx-auto">
                            Our comprehensive suite of tools helps educators maintain the highest standards of academic honesty
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FileSearch,
                                title: 'Paraphrased & Structurally Rewritten Content',
                                description: 'Detect cleverly reworded and restructured content that maintains the original meaning while changing sentence structure and vocabulary.',
                                color: '#4a90f4',
                                image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop'
                            },
                            {
                                icon: Brain,
                                title: 'AI-Generated & AI-Assisted Rewrites',
                                description: 'Identify content created or enhanced by ChatGPT, Claude, Gemini, and other AI tools with our advanced detection algorithms.',
                                color: '#8b5cf6',
                                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop'
                            },
                            {
                                icon: Clock,
                                title: 'Self-Plagiarism Detection',
                                description: 'Identify reuse of previous work and submissions. Ensure students submit original content for each assignment.',
                                color: '#f59e0b',
                                image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=250&fit=crop'
                            },
                            {
                                icon: BarChart3,
                                title: 'Detailed Reports',
                                description: 'Generate comprehensive similarity reports with source links, matched passages, and actionable recommendations.',
                                color: '#22c55e',
                                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop'
                            },
                            {
                                icon: Lock,
                                title: 'Secure & Private',
                                description: 'Enterprise-grade security with GDPR compliance. Your documents are encrypted and never stored permanently.',
                                color: '#ef4444',
                                image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop'
                            },
                            {
                                icon: Users,
                                title: 'Team Collaboration',
                                description: 'Invite colleagues, share reports, and manage submissions across your entire department or institution.',
                                color: '#06b6d4',
                                image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop'
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all"
                                style={{ backgroundColor: 'rgba(18,24,41,0.5)' }}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0e1a, transparent)' }} />
                                    <div
                                        className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                                    >
                                        <feature.icon size={24} />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                    <p className="text-white/50 leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 relative overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(74,144,244,0.03), transparent)' }} />

                <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#4a90f4' }}>How It Works</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-6">
                            Three Simple Steps to
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4a90f4, #8b5cf6)' }}> Academic Integrity</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection Line */}
                        <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5" style={{ background: 'linear-gradient(90deg, #4a90f4, #8b5cf6)' }} />

                        {[
                            { step: '01', title: 'Upload Document', description: 'Simply drag and drop your document or paste text directly. We support PDF, DOCX, TXT, and more formats.', icon: FileSearch },
                            { step: '02', title: 'AI Analysis', description: 'Our advanced AI scans your content against billions of sources and detects AI-generated text instantly.', icon: Brain },
                            { step: '03', title: 'Get Report', description: 'Receive a detailed originality report with similarity scores, matched sources, and expert recommendations.', icon: BarChart3 },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative text-center"
                            >
                                <div
                                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center relative z-10"
                                    style={{ background: 'linear-gradient(135deg, #4a90f4, #8b5cf6)' }}
                                >
                                    <item.icon size={28} className="text-white" />
                                </div>
                                <div className="text-5xl font-bold text-white/10 absolute -top-4 left-1/2 -translate-x-1/2">{item.step}</div>
                                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                                <p className="text-white/50">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Demo Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 rounded-2xl overflow-hidden border border-white/10 relative"
                        style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&h=600&fit=crop"
                            alt="AcademicGuard Dashboard Preview showing document analysis interface"
                            className="w-full h-auto"
                            loading="lazy"
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(74,144,244,0.1), rgba(139,92,246,0.1))' }} />
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 relative overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(139,92,246,0.03), transparent)' }} />

                <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#4a90f4' }}>Testimonials</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-6">
                            Loved by Educators
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4a90f4, #8b5cf6)' }}> Worldwide</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Dr. Sarah Johnson',
                                role: 'Professor of English, Harvard University',
                                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                                quote: 'AcademicGuard has revolutionized how we handle academic integrity. The AI detection is incredibly accurate and saves us hours of manual review time each week.'
                            },
                            {
                                name: 'Prof. Michael Chen',
                                role: 'Dean of Studies, MIT',
                                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                                quote: 'The detailed reports and source matching have made it easier than ever to provide constructive feedback to students about proper citation and academic writing.'
                            },
                            {
                                name: 'Dr. Emily Williams',
                                role: 'Academic Integrity Officer, Stanford',
                                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
                                quote: 'Since implementing AcademicGuard, we\'ve seen a 60% reduction in plagiarism cases. It\'s become an essential tool for maintaining academic standards at our institution.'
                            },
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-8 rounded-2xl border border-white/10"
                                style={{ backgroundColor: 'rgba(18,24,41,0.5)' }}
                            >
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                                    ))}
                                </div>
                                <p className="text-white/70 leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                        loading="lazy"
                                    />
                                    <div>
                                        <div className="text-white font-semibold">{testimonial.name}</div>
                                        <div className="text-white/50 text-sm">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 relative">
                <div className="max-w-3xl mx-auto px-6 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#4a90f4' }}>FAQ</span>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-6">
                            Frequently Asked
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4a90f4, #8b5cf6)' }}> Questions</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {[
                            { q: 'How accurate is the plagiarism detection?', a: 'Our plagiarism detection has a 99.9% accuracy rate. We compare submissions against over 100 billion web pages, academic journals, books, and previously submitted papers from our extensive database.' },
                            { q: 'Can AcademicGuard detect AI-generated content?', a: 'Yes! Our advanced AI detection can identify content generated by ChatGPT, Claude, Gemini, Copilot, and other AI writing tools with over 99% accuracy. We continuously update our models to detect the latest AI systems.' },
                            { q: 'Is my data secure and private?', a: 'Absolutely. We use enterprise-grade encryption (AES-256) for all data in transit and at rest. Your documents are processed securely and are never stored permanently. We are fully GDPR, FERPA, and CCPA compliant.' },
                            { q: 'Do you offer integrations with LMS platforms?', a: 'Yes, we integrate seamlessly with Canvas, Blackboard, Moodle, Google Classroom, Brightspace, and other popular learning management systems. Our API also allows custom integrations.' },
                            { q: 'How do I get started?', a: 'Simply click the Sign Up button to create your account. Once registered, you can immediately start uploading documents for plagiarism and AI content analysis.' },
                            { q: 'What file formats are supported?', a: 'We support all major document formats including PDF, DOCX, DOC, TXT, RTF, ODT, and HTML. You can also paste text directly into our platform for instant analysis.' },
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="rounded-xl border border-white/10 overflow-hidden"
                                style={{ backgroundColor: 'rgba(18,24,41,0.5)' }}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="text-white font-medium pr-4">{faq.q}</span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-white/50 transition-transform flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-6 pb-6 text-white/60 leading-relaxed">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(74,144,244,0.1), rgba(139,92,246,0.1))' }} />

                <div className="max-w-4xl mx-auto px-6 md:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                            Ready to Protect Academic Integrity?
                        </h2>
                        <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
                            Join 500+ institutions and 50,000+ educators worldwide. Experience the most advanced plagiarism and AI detection platform available.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => setShowSignupModal(true)}
                                className="group px-8 py-4 text-white font-semibold rounded-xl transition-all flex items-center gap-3"
                                style={{ background: 'linear-gradient(135deg, #4a90f4, #8b5cf6)', boxShadow: '0 20px 40px rgba(74,144,244,0.3)' }}
                            >
                                Get Started
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/5 transition-all">
                                Contact Us
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <div className="grid md:grid-cols-5 gap-12 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(74,144,244,0.2)', color: '#4a90f4' }}>
                                    <Shield size={24} />
                                </div>
                                <span className="font-serif font-bold text-xl text-white">AcademicGuard</span>
                            </div>
                            <p className="text-white/50 leading-relaxed mb-6">
                                The most trusted AI-powered plagiarism and content detection platform for academic institutions worldwide. Protecting academic integrity since 2020.
                            </p>
                            <div className="flex gap-4">
                                {['Twitter', 'LinkedIn', 'Facebook', 'YouTube'].map((social) => (
                                    <a key={social} href="#" className="w-10 h-10 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors border border-white/10" aria-label={social}>
                                        <Globe size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {[
                            { title: 'Product', links: ['Features', 'Integrations', 'API Documentation', 'Release Notes'] },
                            { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press Kit', 'Partners'] },
                            { title: 'Support', links: ['Help Center', 'Contact Us', 'System Status', 'Terms of Service', 'Privacy Policy'] },
                        ].map((col, index) => (
                            <div key={index}>
                                <h4 className="text-white font-semibold mb-4">{col.title}</h4>
                                <ul className="space-y-3">
                                    {col.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-white/40 text-sm">© 2026 AcademicGuard. All rights reserved.</p>
                        <div className="flex gap-6 text-white/40 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                            <a href="#" className="hover:text-white transition-colors">GDPR</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Auth Modals */}
            <AnimatePresence>
                {showLoginModal && (
                    <AuthModal
                        type="login"
                        onClose={() => setShowLoginModal(false)}
                        onSubmit={onLogin}
                        onSwitch={() => { setShowLoginModal(false); setShowSignupModal(true); }}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showSignupModal && (
                    <AuthModal
                        type="signup"
                        onClose={() => setShowSignupModal(false)}
                        onSubmit={onLogin}
                        onSwitch={() => { setShowSignupModal(false); setShowLoginModal(true); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Auth Modal Component
import api from '../services/api';

interface AuthModalProps {
    type: 'login' | 'signup';
    onClose: () => void;
    onSubmit: (user: { name: string; email: string }) => void;
    onSwitch: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ type, onClose, onSubmit, onSwitch }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (type === 'signup') {
                if (!name.trim()) throw new Error("Name is required");
                const response = await api.register(name, email, password);
                if (response.success) {
                    onSubmit(response.user);
                }
            } else {
                const response = await api.login(email, password);
                if (response.success) {
                    onSubmit(response.user);
                }
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                style={{ backgroundColor: '#121829' }}
            >
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-white">
                                {type === 'login' ? 'Welcome back' : 'Create account'}
                            </h2>
                            <p className="text-white/50 text-sm mt-1">
                                {type === 'login' ? 'Enter your credentials to continue' : 'Join us to get started'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                            <Shield className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {type === 'signup' && (
                            <div>
                                <label className="block text-white/70 text-sm font-medium mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="Dr.Manikanta"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-all"
                                placeholder="you@university.edu"
                            />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-all pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {type === 'login' && (
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                                    <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                                    Remember me
                                </label>
                                <a href="#" className="hover:underline" style={{ color: '#4a90f4' }}>Forgot password?</a>
                            </div>
                        )}

                        {type === 'signup' && (
                            <label className="flex items-start gap-2 text-white/60 text-sm cursor-pointer">
                                <input type="checkbox" required className="rounded border-white/20 bg-white/5 mt-1" />
                                <span>I agree to the <a href="#" className="underline" style={{ color: '#4a90f4' }}>Terms of Service</a> and <a href="#" className="underline" style={{ color: '#4a90f4' }}>Privacy Policy</a></span>
                            </label>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 text-white font-semibold rounded-xl transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                            style={{ background: 'linear-gradient(135deg, #4a90f4, #8b5cf6)' }}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {type === 'login' ? 'Signing In...' : 'Creating Account...'}
                                </span>
                            ) : (
                                type === 'login' ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-white/50 text-sm mt-6">
                        {type === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button onClick={onSwitch} className="hover:underline font-medium" style={{ color: '#4a90f4' }}>
                            {type === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
