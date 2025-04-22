
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TabViewProps {
  items: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
}

const TabView: React.FC<TabViewProps> = ({ 
  items, 
  defaultTab = items?.[0]?.id || '' 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4 grid w-full grid-cols-4 bg-muted/50">
        {items.map((item) => (
          <TabsTrigger 
            key={item.id} 
            value={item.id}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {items.map((item) => (
        <TabsContent key={item.id} value={item.id} className="pt-2">
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabView;
