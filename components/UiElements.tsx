import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white' | 'ghost' | 'cta' | 'teal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  to?: string;
  icon?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  to, 
  className = '', 
  icon = false,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    // Primary: Brand Blue - Professional Actions
    primary: "bg-brand-blue hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 border border-transparent hover:-translate-y-0.5",
    
    // CTA: Brand Orange - High Priority / Conversion
    cta: "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-orange-500/20 border border-transparent hover:-translate-y-0.5",
    
    // Secondary: Slate - Low Priority
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-transparent",
    
    // Outline: Blue border
    outline: "bg-transparent border-2 border-brand-blue text-brand-blue hover:bg-blue-50",
    
    // White: On dark backgrounds
    white: "bg-white text-brand-blue hover:bg-blue-50 shadow-md border border-white hover:shadow-lg hover:text-blue-700",
    
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",

    // Teal variant
    teal: "bg-brand-teal hover:bg-teal-700 text-white shadow-lg shadow-teal-500/20 border border-transparent hover:-translate-y-0.5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  const content = (
    <>
      {children}
      {icon && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
    </>
  );

  // Map old variants to new if necessary, but try to use new ones
  const variantClass = variants[variant] || variants.primary;

  const combinedClasses = `${baseStyles} ${variantClass} ${sizes[size]} ${className} group`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
};

// --- SECTION ---
interface SectionProps {
  children: ReactNode;
  className?: string;
  bg?: 'white' | 'light' | 'dark' | 'navy' | 'blue';
  id?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className = '', bg = 'white', id }) => {
  const bgColors = {
    white: "bg-white",
    light: "bg-surface", // f8fafc
    dark: "bg-slate-900 text-white",
    navy: "bg-brand-navy text-white", // New Navy background
    blue: "bg-brand-blue text-white", // New Blue background
  };

  return (
    <section id={id} className={`w-full py-20 lg:py-28 ${bgColors[bg]} ${className}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        {children}
      </div>
    </section>
  );
};

// --- CARD ---
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-soft h-full flex flex-col transition-all duration-300 relative overflow-hidden ${hover ? 'hover:shadow-card hover:-translate-y-1 hover:border-blue-200 group' : ''} ${className}`}>
      {children}
    </div>
  );
};

// --- SECTION HEADER ---
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, align = 'center', light = false, className = '' }) => {
  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center mx-auto' : 'text-left'} max-w-3xl ${className}`}>
      {subtitle && (
        <div className={`inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${light ? 'bg-white/10 text-orange-200 border border-white/10' : 'bg-blue-50 text-brand-blue border border-blue-100'}`}>
          <span className={`w-2 h-2 rounded-full ${light ? 'bg-accent' : 'bg-brand-blue'}`}></span>
          {subtitle}
        </div>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] ${light ? 'text-white' : 'text-brand-navy'}`}>
        {title}
      </h2>
      <div className={`w-20 h-1.5 mt-6 rounded-full ${align === 'center' ? 'mx-auto' : ''} ${light ? 'bg-accent' : 'bg-brand-blue'}`}></div>
    </div>
  );
};