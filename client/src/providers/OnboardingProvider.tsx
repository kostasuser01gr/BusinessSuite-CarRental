import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OnboardingContextType {
  isActive: boolean;
  step: number;
  isWaitingForAction: boolean;
  startTour: () => void;
  nextStep: () => void;
  endTour: () => void;
  completeTour: () => void;
  setIsWaiting: (waiting: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);
  const [isWaitingForAction, setIsWaitingForAction] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('adaptive_tour_completed');
    if (!hasSeenTour) {
      // Logic for auto-start if needed
    }
  }, []);

  const startTour = () => {
    setStep(1);
    setIsActive(true);
    setIsWaitingForAction(false);
  };

  const nextStep = () => {
    setStep((s) => s + 1);
    setIsWaitingForAction(false);
  };
  
  const endTour = () => {
    setIsActive(false);
    setStep(0);
    setIsWaitingForAction(false);
  };

  const completeTour = () => {
    localStorage.setItem('adaptive_tour_completed', 'true');
    endTour();
  };

  const setIsWaiting = (waiting: boolean) => setIsWaitingForAction(waiting);

  return (
    <OnboardingContext.Provider value={{ 
      isActive, 
      step, 
      isWaitingForAction, 
      startTour, 
      nextStep, 
      endTour, 
      completeTour, 
      setIsWaiting 
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
