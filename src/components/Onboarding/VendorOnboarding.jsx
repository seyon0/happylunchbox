import React, { useState, useEffect } from 'react';
import { VendorOnboardingLayout } from './VendorOnboardingLayout';
import { Step1_SignupForm } from './Step1_SignupForm';
import { Step2_DocumentUpload } from './Step2_DocumentUpload';
import { Step3_StatusTracker } from './Step3_StatusTracker';
import { Step4_DigitalContract } from './Step4_DigitalContract';
import { Step5_WelcomeChecklist } from './Step5_WelcomeChecklist';
import { useApp } from '../../context/AppContext';

export const VendorOnboarding = () => {
  const { user, setUser } = useApp();
  
  // Try to load state from user object or default to step 1
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState({});
  const [onboardingStatus, setOnboardingStatus] = useState('submitted'); // submitted, underReview, approved, rejected
  const [rejectionReason, setRejectionReason] = useState('');

  // Setup DEV mock listener
  useEffect(() => {
    const handleMock = (e) => setOnboardingStatus(e.detail);
    window.addEventListener('mock-status', handleMock);
    return () => window.removeEventListener('mock-status', handleMock);
  }, []);

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);

  const getStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <VendorOnboardingLayout 
            currentStep={1} totalSteps={5} 
            title="Kitchen Details" 
            subtitle="Tell us about your business and where it is located."
          >
            <Step1_SignupForm formData={formData} setFormData={setFormData} onNext={handleNext} />
          </VendorOnboardingLayout>
        );
      case 2:
        return (
          <VendorOnboardingLayout 
            currentStep={2} totalSteps={5} 
            title="Compliance Documents" 
            subtitle="Upload proof of registration and hygiene ratings."
          >
            <Step2_DocumentUpload documents={documents} setDocuments={setDocuments} onNext={handleNext} onBack={handleBack} />
          </VendorOnboardingLayout>
        );
      case 3:
        return (
          <VendorOnboardingLayout 
            currentStep={3} totalSteps={5} 
            title="Application Status" 
            subtitle="Track your approval process."
          >
            <Step3_StatusTracker 
              status={onboardingStatus} 
              rejectionReason={rejectionReason}
              onResubmit={() => setCurrentStep(2)} 
              onProceedToContract={handleNext} 
            />
          </VendorOnboardingLayout>
        );
      case 4:
        return (
          <VendorOnboardingLayout 
            currentStep={4} totalSteps={5} 
            title="Digital Agreement" 
            subtitle="Review and sign your partnership contract."
          >
            <Step4_DigitalContract onNext={handleNext} />
          </VendorOnboardingLayout>
        );
      case 5:
        return (
          <VendorOnboardingLayout 
            currentStep={5} totalSteps={5} 
            title="Welcome Aboard!" 
            subtitle="Let's get your kitchen ready for customers."
          >
            <Step5_WelcomeChecklist />
          </VendorOnboardingLayout>
        );
      default:
        return null;
    }
  };

  return getStepContent();
};
