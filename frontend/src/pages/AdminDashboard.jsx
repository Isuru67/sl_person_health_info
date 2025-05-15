import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';


const AdminDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const navItems = ['Dashboard', 'Hospitals', 'Patients', 'Reports', 'Settings'];

  // Animation variants
  const navItem = {
    hidden: { y: -20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: {
      scale: 1.1,
      textShadow: "0 0 8px rgba(255,255,255,0.8)",
      transition: { type: "spring", stiffness: 300 }
    },
    tap: { scale: 0.95 }
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5555/hospitaldashboard/hospitals"); 
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const handleView = (hospitalId) => {
    navigate(`/hospital-view/${hospitalId}`);
  };

  const handleEdit = (hospitalId) => {
    navigate(`/hospital-edit/${hospitalId}`);
  };

  // eslint-disable-next-line no-unused-vars
  const handleAddNew = () => {
    navigate('/add-hospital');
  };

  const handleDelete = async (hospitalId) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        const response = await fetch(`http://localhost:5555/hospitaldashboard/${hospitalId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setHospitals(hospitals.filter(hospital => hospital.hospitalId !== hospitalId));
          console.log(`Deleted hospital: ${hospitalId}`);
        } else {
          console.error("Failed to delete hospital");
        }
      } catch (error) {
        console.error("Error deleting hospital:", error);
      }
    }
  };

  // Filter hospitals based on search term
  const filteredHospitals = hospitals.filter(hospital => 
    hospital.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.hospitalId?.toString().includes(searchTerm)
  );

  // Stats data
  const stats = [
    { title: "Total Hospitals", value: hospitals.length, color: "from-purple-500 to-indigo-500" },
    { title: "Active", value: hospitals.filter(h => h.status && h.status.toLowerCase() === 'active').length, color: "from-green-500 to-teal-500" },
    { title: "Inactive", value: hospitals.filter(h => h.status && h.status.toLowerCase() === 'inactive').length, color: "from-red-500 to-pink-500" },
    { title: "Pending", value: hospitals.filter(h => h.status && h.status.toLowerCase() === 'pending').length, color: "from-yellow-500 to-amber-500" }
  ];

  // Add new function for PDF generation
  const generatePDFReport = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add Header
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('Hospital Management System Report', 15, 15);
      
      doc.setFontSize(12);
      doc.text(`Generated Date: ${new Date().toLocaleString()}`, 15, 25);

      // Add Statistics Table
      const statisticsData = [
        ['Total Hospitals', hospitals.length],
        ['Active Hospitals', hospitals.filter(h => h.status === 'active').length],
        ['Inactive Hospitals', hospitals.filter(h => h.status === 'inactive').length],
        ['Pending Hospitals', hospitals.filter(h => h.status === 'pending').length]
      ];

      autoTable(doc, {
        startY: 35,
        head: [['Category', 'Count']],
        body: statisticsData,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellWidth: 'auto',
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [100, 100, 100],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        }
      });

      // Add Hospitals Table
      const hospitalsData = hospitals.map(hospital => [
        hospital.hospitalId || '',
        hospital.hospitalName || '',
        hospital.email || '',
        hospital.mobile1 || '',
        hospital.status || ''
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['ID', 'Name', 'Email', 'Contact', 'Status']],
        body: hospitalsData,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 40 },
          2: { cellWidth: 50 },
          3: { cellWidth: 35 },
          4: { cellWidth: 30 }
        }
      });

      // Add Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      doc.save('hospital_management_report.pdf');

    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Add new function for Excel generation
  const generateExcelReport = () => {
    const workbook = XLSX.utils.book_new();
    
    // Convert hospitals data to worksheet
    const worksheetData = hospitals.map(hospital => ({
        'Hospital ID': hospital.hospitalId,
        'Name': hospital.hospitalName,
        'Email': hospital.email,
        'Primary Contact': hospital.mobile1,
        'Secondary Contact': hospital.mobile2,
        'Status': hospital.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hospitals');

    // Generate statistics sheet
    const statsData = [
        ['Statistics', 'Count'],
        ['Total Hospitals', hospitals.length],
        ['Active Hospitals', hospitals.filter(h => h.status === 'active').length],
        ['Pending Approval', hospitals.filter(h => h.status === 'pending').length],
        ['Inactive Hospitals', hospitals.filter(h => h.status === 'inactive').length]
    ];

    const statsWorksheet = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Statistics');

    // Save the file
    XLSX.writeFile(workbook, 'hospital_management_report.xlsx');
  };

  // Add Report Generation Buttons to the UI
  const renderReportButtons = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 mb-6"
    >
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePDFReport}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Download PDF Report
        </motion.button>

        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateExcelReport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Download Excel Report
        </motion.button>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400"
              >
                HealthCare HIMS
              </motion.span>
            </motion.div>
            
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item, i) => (
                <motion.div
                  key={item}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  variants={navItem}
                  onClick={() => setActiveNav(item)}
                  className={`px-4 py-2 rounded-full cursor-pointer ${activeNav === item ? 
                    'bg-white text-purple-600 font-bold' : 
                    'text-white hover:bg-white/20'}`}
                >
                  {item}
                </motion.div>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-10 w-10 rounded-full bg-white flex items-center justify-center cursor-pointer"
              >
                <span className="text-purple-600 font-bold">AD</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow pt-20 px-4">
        <div className="container mx-auto p-6">
          {/* Dashboard Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Hospital Management</h1>
              <p className="text-gray-600 mt-2">View and manage all registered hospitals</p>
            </div>
          </motion.div>

          {/* Add Report Buttons */}
          {renderReportButtons()}

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-r ${stat.color} p-6 rounded-xl shadow-lg text-white`}
              >
                <h3 className="text-lg font-medium">{stat.title}</h3>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Hospitals Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Secondary Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHospitals.length > 0 ? (
                      filteredHospitals.map((hospital) => (
                        <motion.tr 
                          key={hospital.hospitalId}
                          whileHover={{ backgroundColor: "rgba(236, 253, 245, 0.5)" }}
                          className="transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hospital.hospitalId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.hospitalName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.mobile1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hospital.mobile2 || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${hospital.status && hospital.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 
                                hospital.status && hospital.status.toLowerCase() === 'inactive' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                              {hospital.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleView(hospital.hospitalId)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(hospital.hospitalId)}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                Edit
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(hospital.hospitalId)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          {searchTerm ? 'No hospitals match your search' : 'No hospitals found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} HealthCare HIMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;