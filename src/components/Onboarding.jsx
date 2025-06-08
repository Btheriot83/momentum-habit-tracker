import React, { useState } from 'react';
import { ChevronRight, Target, Zap, TrendingUp, CheckCircle } from 'lucide-react';

const steps = [
  {
    title: "Welcome to Momentum",
    subtitle: "Achieve Your Goals, Effortlessly",
    description: "Transform your life one habit at a time with our beautifully simple tracking system.",
    icon: Target,
    color: "text-blue-500"
  },
  {
    title: "Build Lasting Habits",
    subtitle: "Start Small, Think Big",
    description: "Focus on consistency over perfection. Small daily actions create extraordinary results.",
    icon: Zap,
    color: "text-yellow-500"
  },
  {
    title: "Track Your Progress",
    subtitle: "See Your Growth",
    description: "Visual streaks and analytics keep you motivated and show how far you've come.",
    icon: TrendingUp,
    color: "text-green-500"
  }
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-sm w-full space-y-8 animate-fade-in">
        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-blue-500 w-8' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
            <Icon className={`w-10 h-10 ${step.color}`} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {step.title}
          </h1>
          <h2 className="text-xl font-medium text-blue-600 dark:text-blue-400">
            {step.subtitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={nextStep}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <span>
            {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
          </span>
          {currentStep === steps.length - 1 ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        {/* Skip Option */}
        {currentStep < steps.length - 1 && (
          <button
            onClick={onComplete}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
          >
            Skip introduction
          </button>
        )}
      </div>
    </div>
  );
}