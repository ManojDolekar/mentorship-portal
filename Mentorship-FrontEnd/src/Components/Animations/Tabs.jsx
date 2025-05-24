import React, { useState } from 'react';
import { motion, LayoutGroup } from 'framer-motion';

const tabs = ['Home', 'About', 'Services', 'Contact'];

export default function Tabs() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div className="w-full flex flex-col items-center justify-center mt-10">
      <LayoutGroup>
        <div className="flex space-x-4 border-b-2 pb-2">
          {tabs.map((tab) => (
            <div key={tab} className="relative">
              <button
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-lg font-medium focus:outline-none ${
                  selectedTab === tab ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {tab}
              </button>
              {selectedTab === tab && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"
                />
              )}
            </div>
          ))}
        </div>
      </LayoutGroup>

      <div className="mt-10 text-xl font-semibold">
        {selectedTab === 'Home' && <p>🏠 Welcome Home!</p>}
        {selectedTab === 'About' && <p>📖 About Us Section</p>}
        {selectedTab === 'Services' && <p>🛠 Our Services</p>}
        {selectedTab === 'Contact' && <p>📞 Contact Information</p>}
      </div>
    </div>
  );
}
