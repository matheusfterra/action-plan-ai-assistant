
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface InitialFormProps {
  onSubmit: (data: InitialFormData) => void;
  isSubmitting: boolean;
}

export interface InitialFormData {
  appId: string;
  store: string;
  language: string;
  countryCode: string;
  appSection: string;
  actionArea: string;
  instructions: string;
  suggestKeywords: boolean;
  applicationType: string;
}

const SUPPORTED_LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", 
  "Portuguese", "Russian", "Japanese", "Korean", "Chinese"
];

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "MX", name: "Mexico" },
  { code: "IN", name: "India" },
  { code: "RU", name: "Russia" },
  { code: "CN", name: "China" },
  { code: "KR", name: "South Korea" }
];

const KPI_OPTIONS = [
  "Installation Flux (AB Test)",
  "Conversion Rate",
  "Visibility",
  "App's Page Maintenance",
  "Impressions",
  "Keyword Ranking",
  "Downloads (returning users)",
  "Updates"
];

const OPTIMIZATION_OPTIONS = [
  "Long description",
  "Title",
  "Promotional text",
  "Subtitle",
  "Keyword field"
];

const APPLICATION_TYPES = [
  "Direct Application",
  "AB Test",
  "ABC Test",
  "ABCD Test"
];

const InitialForm: React.FC<InitialFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<InitialFormData>({
    appId: '',
    store: '',
    language: '',
    countryCode: '',
    appSection: '',
    actionArea: '',
    instructions: '',
    suggestKeywords: false,
    applicationType: 'Direct Application'
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
    
    if (!formData.countryCode) {
      newErrors.countryCode = 'Country code is required';
    }
    
    if (!formData.actionArea) {
      newErrors.actionArea = 'KPI selection is required';
    }
    
    if (!formData.appSection) {
      newErrors.appSection = 'Optimization selection is required';
    }
    
    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }
    
    if (!formData.applicationType) {
      newErrors.applicationType = 'Application type is required';
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

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, suggestKeywords: checked }));
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
                Country
              </Label>
              <Select value={formData.countryCode} onValueChange={(value) => handleChange(value, 'countryCode')}>
                <SelectTrigger id="countryCode" className={`h-11 focus-ring ${errors.countryCode ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.countryCode && <p className="text-sm text-destructive">{errors.countryCode}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="actionArea" className="text-sm font-medium">
                Choose KPI
              </Label>
              <Select value={formData.actionArea} onValueChange={(value) => handleChange(value, 'actionArea')}>
                <SelectTrigger id="actionArea" className={`h-11 focus-ring ${errors.actionArea ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select KPI" />
                </SelectTrigger>
                <SelectContent>
                  {KPI_OPTIONS.map((kpi) => (
                    <SelectItem key={kpi.replace(/\s+/g, '-').toLowerCase()} value={kpi}>
                      {kpi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.actionArea && <p className="text-sm text-destructive">{errors.actionArea}</p>}
            </div>

            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="appSection" className="text-sm font-medium">
                Choose an Optimization
              </Label>
              <Select value={formData.appSection} onValueChange={(value) => handleChange(value, 'appSection')}>
                <SelectTrigger id="appSection" className={`h-11 focus-ring ${errors.appSection ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select optimization area" />
                </SelectTrigger>
                <SelectContent>
                  {OPTIMIZATION_OPTIONS.map((option) => (
                    <SelectItem key={option.replace(/\s+/g, '-').toLowerCase()} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.appSection && <p className="text-sm text-destructive">{errors.appSection}</p>}
            </div>
          </div>

          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="applicationType" className="text-sm font-medium">
              Application Type
            </Label>
            <Select value={formData.applicationType} onValueChange={(value) => handleChange(value, 'applicationType')}>
              <SelectTrigger id="applicationType" className={`h-11 focus-ring ${errors.applicationType ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Select application type" />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_TYPES.map((type) => (
                  <SelectItem key={type.replace(/\s+/g, '-').toLowerCase()} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.applicationType && <p className="text-sm text-destructive">{errors.applicationType}</p>}
          </div>

          <div className="flex items-center space-x-2 animate-fade-in">
            <Checkbox 
              id="suggestKeywords" 
              checked={formData.suggestKeywords} 
              onCheckedChange={handleCheckboxChange} 
            />
            <Label 
              htmlFor="suggestKeywords" 
              className="text-sm font-medium cursor-pointer"
            >
              Create Keywords Suggestions
            </Label>
          </div>

          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="instructions" className="text-sm font-medium">
              User Instructions
            </Label>
            <Textarea
              id="instructions"
              placeholder="Describe your objective, intention or strategy with the action plan"
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
