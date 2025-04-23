import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCheck, Info, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import TabView from './TabView';

interface OutputItem {
  title: string;
  content: string;
}

interface KeywordData {
  keyword: string;
  density: string | number;
  relevance: "Very Low" | "Low" | "Medium" | "High";
  classificationBefore: number | string;
  classificationAfter: number | string;
  goal: string;
}

interface BenchmarkData {
  keyword: string;
  competitor1: number | string;
  competitor2: number | string;
  competitor3: number | string;
  competitor4: number | string;
  competitor5: number | string;
}

interface OutputSectionProps {
  outputs: {
    suggestedText: string;
    hypothesis: string;
    strategy: string;
  } | null;
  isActive: boolean;
  showAfterAdditionalSubmit: boolean;
  showKeywords?: boolean;
  applicationType?: string;
}

const sampleKeywords: KeywordData[] = [
  { keyword: "pedir empréstimo", density: "-", relevance: "Medium", classificationBefore: 110, classificationAfter: 95, goal: "Improve ranking" },
  { keyword: "pagamento", density: "-", relevance: "High", classificationBefore: "-", classificationAfter: "-", goal: "Describe your goal" },
  { keyword: "99 tax", density: "-", relevance: "Very Low", classificationBefore: 1, classificationAfter: "-", goal: "Rank better here" },
  { keyword: "ride app", density: "-", relevance: "Medium", classificationBefore: 45, classificationAfter: 32, goal: "Increase visibility" },
  { keyword: "driver app", density: "-", relevance: "High", classificationBefore: 28, classificationAfter: 17, goal: "Target top 15" },
];

const sampleBenchmarks: BenchmarkData[] = [
  { keyword: "mobility", competitor1: 69, competitor2: 51, competitor3: 78, competitor4: 90, competitor5: "-" },
  { keyword: "solution", competitor1: "-", competitor2: "-", competitor3: "-", competitor4: "-", competitor5: "-" },
  { keyword: "transportation", competitor1: 12, competitor2: 8, competitor3: 15, competitor4: 20, competitor5: 25 },
  { keyword: "driver", competitor1: 5, competitor2: 7, competitor3: 9, competitor4: 11, competitor5: 14 },
  { keyword: "ride sharing", competitor1: 3, competitor2: 4, competitor3: 11, competitor4: 17, competitor5: 22 },
];

const competitors = ["Uber: Ride App", "Lyft", "DiDi", "Bolt", "FreeNow"];

const generateVariations = (applicationType: string, baseOutput: any) => {
  if (applicationType === "1") {
    return null;
  }
  
  const variations = [];
  const count = parseInt(applicationType);
  
  for (let i = 0; i < count; i++) {
    const variationNumber = i + 1;
    
    variations.push({
      id: `variation-${variationNumber}`,
      label: `Variation ${variationNumber}`,
      output: {
        suggestedText: `${baseOutput.suggestedText} (Variation ${variationNumber})`,
        hypothesis: `${baseOutput.hypothesis} (Variation ${variationNumber})`,
        strategy: `${baseOutput.strategy} (Variation ${variationNumber})`,
      },
      keywords: sampleKeywords.map(kw => ({
        ...kw,
        keyword: `${kw.keyword} ${variationNumber}`,
        goal: `${kw.goal} (${variationNumber})`
      })),
      benchmarks: sampleBenchmarks.map(bm => ({
        ...bm,
        keyword: `${bm.keyword} ${variationNumber}`
      }))
    });
  }
  
  return variations;
};

const OutputSection: React.FC<OutputSectionProps> = ({ 
  outputs, 
  isActive,
  showAfterAdditionalSubmit,
  showKeywords = false,
  applicationType = "Direct Application"
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [sortConfig, setSortConfig] = useState<{column: string | null, direction: 'ascending' | 'descending'}>({
    column: null,
    direction: 'ascending'
  });

  if (!isActive || !outputs || !showAfterAdditionalSubmit) return null;
  
  const variations = generateVariations(applicationType, outputs);
  
  const hasMultipleVariations = variations && variations.length > 1;

  const renderOutputContent = (outputData: any, currentKeywords = sampleKeywords, currentBenchmarks = sampleBenchmarks) => {
    const outputItems: OutputItem[] = [
      { title: 'Suggested Text', content: outputData.suggestedText },
      { title: 'Hypothesis', content: outputData.hypothesis },
      { title: 'Strategy', content: outputData.strategy }
    ];

    return (
      <div className="space-y-6">
        {outputItems.map((item, index) => (
          <div key={index} className="space-y-2 animate-fade-in">
            <div className="flex justify-between items-center">
              <Label htmlFor={`output-${index}`} className="text-sm font-medium">
                {item.title}
              </Label>
              <button
                type="button"
                onClick={() => copyToClipboard(item.content, item.title)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors p-1 rounded focus-ring"
                aria-label={`Copy ${item.title}`}
              >
                {copied[item.title] ? (
                  <CheckCheck className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied[item.title] ? 'Copied' : 'Copy'}
              </button>
            </div>
            <Textarea
              id={`output-${index}`}
              value={item.content}
              readOnly
              className="min-h-[120px] resize-none bg-secondary focus-ring font-mono text-sm"
              data-section={item.title.toLowerCase().replace(/\s+/g, '')}
            />
          </div>
        ))}
        
        {showKeywords && renderKeywordTables(currentKeywords, currentBenchmarks)}
      </div>
    );
  };

  const renderKeywordTables = (currentKeywords = sampleKeywords, currentBenchmarks = sampleBenchmarks) => {
    const sortedKeywords = [...currentKeywords].sort((a: any, b: any) => {
      if (sortConfig.column === null) return 0;
      
      if (a[sortConfig.column] < b[sortConfig.column]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.column] > b[sortConfig.column]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    const sortedBenchmarks = [...currentBenchmarks].sort((a: any, b: any) => {
      if (sortConfig.column === null) return 0;
      
      if (a[sortConfig.column] < b[sortConfig.column]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.column] > b[sortConfig.column]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return (
      <>
        <div className="pt-4 border-t border-border animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Optimized Keywords</h3>
            <button
              type="button"
              onClick={() => copyToClipboard(JSON.stringify(sortedKeywords, null, 2), "Keyword Data")}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors p-1 rounded focus-ring"
              aria-label="Copy Keyword Data"
            >
              <Copy className="h-4 w-4" />
              Export Data
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Analysis of keyword performance and optimization goals</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => requestSort('keyword')} className="cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex items-center gap-1">
                      Keyword
                      <Tooltip>
                        <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>The target search term for optimization</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('density')} className="cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex items-center gap-1">
                      Density
                      <Tooltip>
                        <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>Frequency of keyword appearance in app metadata</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('relevance')} className="cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex items-center gap-1">
                      Relevance
                      <Tooltip>
                        <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>Assessed importance to target audience</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex items-center gap-1">
                      Classification (Before)
                      <Tooltip>
                        <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>Current ranking position</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex items-center gap-1">
                      Classification (After)
                      <Tooltip>
                        <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>Projected ranking after optimization</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('goal')} className="cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex items-center gap-1">
                      Goal
                      <Tooltip>
                        <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>Specific objective for this keyword</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedKeywords.map((keyword, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    <TableCell className="font-medium">{keyword.keyword}</TableCell>
                    <TableCell>{keyword.density}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRelevanceColor(keyword.relevance)}`}>
                        {keyword.relevance}
                      </span>
                    </TableCell>
                    <TableCell>{keyword.classificationBefore}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      {keyword.classificationAfter}
                      {renderRankingIndicator(keyword.classificationBefore, keyword.classificationAfter)}
                    </TableCell>
                    <TableCell>{keyword.goal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Optimized Keywords - Ranking Benchmark</h3>
            <button
              type="button"
              onClick={() => copyToClipboard(JSON.stringify(sortedBenchmarks, null, 2), "Benchmark Data")}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors p-1 rounded focus-ring"
              aria-label="Copy Benchmark Data"
            >
              <Copy className="h-4 w-4" />
              Export Data
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Comparison of keyword rankings across competing apps</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => requestSort('keyword')} className="cursor-pointer hover:bg-muted transition-colors">
                    <div className="flex items-center gap-1">
                      Keyword
                      <Tooltip>
                        <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                        <TooltipContent>The target search term for comparison</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  {competitors.map((competitor, index) => (
                    <TableHead key={index} className="cursor-pointer hover:bg-muted transition-colors">
                      <HoverCard>
                        <HoverCardTrigger>
                          <div className="flex items-center gap-1">
                            {competitor}
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">{competitor}</h4>
                            <p className="text-xs text-muted-foreground">Ranking positions for this competitor. Lower numbers indicate better rankings.</p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBenchmarks.map((benchmark, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    <TableCell className="font-medium">{benchmark.keyword}</TableCell>
                    <TableCell>{benchmark.competitor1}</TableCell>
                    <TableCell>{benchmark.competitor2}</TableCell>
                    <TableCell>{benchmark.competitor3}</TableCell>
                    <TableCell>{benchmark.competitor4}</TableCell>
                    <TableCell>{benchmark.competitor5}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </>
    );
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [field]: true });
      toast({
        description: `${field} copied to clipboard!`,
        duration: 3000,
      });
      
      setTimeout(() => {
        setCopied({ ...copied, [field]: false });
      }, 2000);
    });
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'Very Low': return 'text-red-500 bg-red-50';
      case 'Low': return 'text-orange-500 bg-orange-50';
      case 'Medium': return 'text-amber-500 bg-amber-50';
      case 'High': return 'text-green-600 bg-green-50';
      default: return 'text-gray-500';
    }
  };

  const renderRankingIndicator = (before: number | string, after: number | string) => {
    if (before === '-' || after === '-') return <Minus className="h-4 w-4 text-gray-400" />;
    
    if (typeof before === 'number' && typeof after === 'number') {
      if (after < before) return <ArrowUp className="h-4 w-4 text-green-500" />;
      if (after > before) return <ArrowDown className="h-4 w-4 text-red-500" />;
    }
    
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const requestSort = (column: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.column === column && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ column, direction });
  };

  return (
    <div className="w-full mb-10 animate-slide-in">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
        <h2 className="text-xl font-semibold mb-6">AI-Generated Suggestions</h2>
        
        {hasMultipleVariations ? (
          <TabView 
            items={variations.map(v => ({
              id: v.id,
              label: v.label,
              content: renderOutputContent(v.output, v.keywords, v.benchmarks)
            }))} 
          />
        ) : (
          renderOutputContent(outputs)
        )}
      </div>
    </div>
  );
};

export default OutputSection;
