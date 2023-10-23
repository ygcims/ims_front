import React from "react";

const ProgressComparisonReport = () => {
  // Sample data (replace with actual month-to-month comparison data)
  const comparisonData = [
    { month: "January", newLeads: 100, registered: 50 },
    { month: "February", newLeads: 120, registered: 55 },
    // Add more month entries as needed
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Progress and Growth Comparison
      </h2>
      <table className="w-full border-collapse">
        {/* Table headers */}
        <thead>
          <tr>
            <th className="text-left py-2">Month</th>
            <th className="text-left py-2">New Leads</th>
            <th className="text-left py-2">Registered</th>
          </tr>
        </thead>
        <tbody>
          {/* Table rows */}
          {comparisonData.map((entry, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="py-2 px-4">{entry.month}</td>
              <td className="py-2 px-4">{entry.newLeads}</td>
              <td className="py-2 px-4">{entry.registered}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgressComparisonReport;
