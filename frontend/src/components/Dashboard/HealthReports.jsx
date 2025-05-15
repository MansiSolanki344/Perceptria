

import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import { collection, query, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaFilePdf, FaChartLine, FaDownload } from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";

const HealthReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const reportsRef = collection(db, "users", user.uid, "uploaded_reports");
        const q = query(reportsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        const reportsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setReports(reportsData);
      } catch (err) {
        console.error("Firestore error:", err);
        setError(err.code === "permission-denied" 
          ? "You don't have permission to view these reports"
          : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [navigate]);

  const fetchReportDetails = async (reportId) => {
    setModalLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const reportRef = doc(db, "users", user.uid, "uploaded_reports", reportId);
      const docSnap = await getDoc(reportRef);
      
      if (docSnap.exists()) {
        setSelectedReport({
          id: docSnap.id,
          ...docSnap.data()
        });
        setShowModal(true);
      } else {
        setError("Report not found");
      }
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("Failed to load report details");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2">Loading your health reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 rounded-lg">
        <div className="flex items-center text-red-600">
          <FaExclamationTriangle className="mr-2" />
          <h3 className="font-medium">Error Loading Reports</h3>
        </div>
        <p className="mt-2 text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <GiHealthNormal className="mr-2 text-blue-600" />
          Your Health Reports
        </h1>
        <button
          onClick={() => navigate("/upload")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload New Report
        </button>
      </div>
      
      {reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FaFilePdf className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No reports found</h3>
          <p className="text-gray-500 mb-6">Upload your first health report to get started</p>
          <button
            onClick={() => navigate("/upload")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload Report
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map(report => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg flex items-center">
                      <FaFilePdf className="text-red-500 mr-2" />
                      {report.filename}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {report.timestamp?.toDate().toLocaleString()}
                    </p>
                  </div>
                  <a 
                    href={report.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600"
                    title="Download PDF"
                  >
                    <FaDownload />
                  </a>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => fetchReportDetails(report.id)}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FaChartLine className="mr-2" />
                    View Detailed Analysis
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {modalLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4">Loading report details...</p>
              </div>
            ) : (
              <>
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    <FaFilePdf className="inline mr-2 text-red-500" />
                    {selectedReport?.filename}
                  </h2>
                  <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">Health Summary</h3>
                    <div className="prose max-w-none whitespace-pre-line">
                      {selectedReport?.health_summary}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">Key Parameters</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Test Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Value</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Unit</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedReport?.parameters_text.split('\n')
                            .filter(line => line.includes('|'))
                            .map((line, index) => {
                              const cells = line.split('|').filter(cell => cell.trim() !== '');
                              if (cells.length >= 3) {
                                return (
                                  <tr key={index}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{cells[0].trim()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{cells[1].trim()}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{cells[2].trim()}</td>
                                  </tr>
                                );
                              }
                              return null;
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 mt-6">
                    <a
                      href={selectedReport?.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                    >
                      <FaDownload className="mr-2" />
                      Download PDF
                    </a>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthReports;