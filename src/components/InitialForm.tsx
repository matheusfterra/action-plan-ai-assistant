
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Check } from 'lucide-react';

interface InitialFormProps {
  onSubmit: (data: InitialFormData) => void;
  isSubmitting: boolean;
}

export interface InitialFormData {
  appId: string;
  store: string;
  language: string;
  countryCode: string;
  instructions: string;
}

const SUPPORTED_LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", 
  "Portuguese", "Russian", "Japanese", "Korean", "Chinese"
];

const InitialForm: React.FC<InitialFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<InitialFormData>({
    appId: '',
    store: '',
    language: '',
    countryCode: '',
    instructions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.appId.trim()) {
      newErrors.appId = 'App ID is required';
    }
    
    if (!formData.store) {
      newErrors.store = 'Store selection is required';
    }
    
    if (!formData.language) {
      newErrors.language = 'Language selection is required';
    }
    
    if (!formData.countryCode.trim()) {
      newErrors.countryCode = 'Country code is required';
    } else if (!/^[A-Z]{2}$/.test(formData.countryCode)) {
      newErrors.countryCode = 'Country code must be 2 uppercase letters';
    }
    
    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    field: keyof InitialFormData,
    value?: string
  ) => {
    if (typeof e === 'string') {
      setFormData(prev => ({ ...prev, [field]: e }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    } else {
      const { value: inputValue } = e.target;
      setFormData(prev => ({ ...prev, [field]: inputValue }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full mb-10 animate-slide-in">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
        <form onSubmit={handleSubmit} className="space-y-6 animate-in-sequence">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="appId" className="text-sm font-medium">
                App ID
              </Label>
              <Input
                id="appId"
                placeholder="Enter your application identifier"
                value={formData.appId}
                onChange={(e) => handleChange(e, 'appId')}
                className={`h-11 focus-ring ${errors.appId ? 'border-destructive' : ''}`}
              />
              {errors.appId && <p className="text-sm text-destructive">{errors.appId}</p>}
            </div>

            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="store" className="text-sm font-medium">
                Select Store
              </Label>
              <Select value={formData.store} onValueChange={(value) => handleChange(value, 'store')}>
                <SelectTrigger id="store" className={`h-11 focus-ring ${errors.store ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select app store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Play Store</SelectItem>
                  <SelectItem value="apple">Apple App Store</SelectItem>
                </SelectContent>
              </Select>
              {errors.store && <p className="text-sm text-destructive">{errors.store}</p>}
            </div>

            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="language" className="text-sm font-medium">
                Select Language
              </Label>
              <Select value={formData.language} onValueChange={(value) => handleChange(value, 'language')}>
                <SelectTrigger id="language" className={`h-11 focus-ring ${errors.language ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Choose a language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.toLowerCase()} value={lang.toLowerCase()}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.language && <p className="text-sm text-destructive">{errors.language}</p>}
            </div>

            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="countryCode" className="text-sm font-medium">
                Country Code
              </Label>
              <Input
                id="countryCode"
                placeholder="Two-letter code (e.g. US, GB)"
                value={formData.countryCode}
                onChange={(e) => handleChange(e, 'countryCode')}
                className={`h-11 focus-ring uppercase ${errors.countryCode ? 'border-destructive' : ''}`}
                maxLength={2}
              />
              {errors.countryCode && <p className="text-sm text-destructive">{errors.countryCode}</p>}
            </div>
          </div>

          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="instructions" className="text-sm font-medium">
              User Instructions
            </Label>
            <Textarea
              id="instructions"
              placeholder="Provide detailed instructions for what you're looking to generate..."
              value={formData.instructions}
              onChange={(e) => handleChange(e, 'instructions')}
              className={`min-h-[150px] resize-y focus-ring ${errors.instructions ? 'border-destructive' : ''}`}
            />
            {errors.instructions && <p className="text-sm text-destructive">{errors.instructions}</p>}
          </div>

          <div className="flex justify-end animate-fade-in">
            <Button 
              type="submit" 
              className="px-6 h-11 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InitialForm;
