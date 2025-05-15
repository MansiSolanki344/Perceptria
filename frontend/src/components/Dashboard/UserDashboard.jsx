

import React, { useState, useEffect } from "react";
import { 
  FaFilePdf, 
  FaChartLine, 
  FaCalendarAlt, 
  FaDownload, 
  FaExchangeAlt, 
  FaHistory, 
  FaArrowLeft, 
  FaArrowRight,
  FaInfoCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebaseConfig";
import { collection, query, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const UserDashboard = () => {
  const navigate = useNavigate();
  
  // User state
  const [userName, setUserName] = useState("User");
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [error, setError] = useState(null);
  
  // Reports state
  const [uploadedReports, setUploadedReports] = useState([]);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  
  // Comparison state
  const [comparisonMode, setComparisonMode] = useState(false);
  const [reportToCompare, setReportToCompare] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("glucose");
  const [comparisonData, setComparisonData] = useState(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState("uploaded");
  const [showTrends, setShowTrends] = useState(false);
  const [healthSummary, setHealthSummary] = useState(null);
  const [highlightedReport, setHighlightedReport] = useState(null);
  
  // Health metrics definitions
  const metrics = {
    glucose: { label: "Blood Glucose", unit: "mg/dL", normalRange: "70-100", paramName: "Blood Glucose" },
    cholesterol: { label: "Cholesterol", unit: "mg/dL", normalRange: "125-200", paramName: "Total Cholesterol" },
    bloodPressure: { label: "Blood Pressure", unit: "mmHg", normalRange: "120/80", paramName: "Blood Pressure" },
    hemoglobin: { label: "Hemoglobin", unit: "g/dL", normalRange: "12-16", paramName: "Hemoglobin" },
    wbc: { label: "White Blood Cells", unit: "K/μL", normalRange: "4.5-11.0", paramName: "WBC" }
  };
  
  // Trend data state
  const [trendData, setTrendData] = useState([]);

  // Load data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setUserName(user.displayName || "User");
        
        // Get uploaded reports
        const reportsRef = collection(db, "users", user.uid, "uploaded_reports");
        const q = query(reportsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        const reportsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.filename || "Unnamed Report",
            uploadDate: data.timestamp?.toDate().toISOString(),
            provider: data.provider || "Unknown Provider",
            thumbnailUrl: "/api/placeholder/150/200",
            fileType: "pdf",
            fileSize: data.fileSize || "Unknown size",
            pdf_url: data.pdf_url || "",
            summary: extractHealthMetrics(data.parameters_text),
            // health_summary: data.health_summary || "",
            parameters_text: data.parameters_text || ""
          };
        });
        
        setUploadedReports(reportsData);
        
        // Generate insights reports from uploaded reports
        const insightsReports = generateInsightsReports(reportsData);
        setGeneratedReports(insightsReports);
        
        // Generate trend data from reports
        const trends = generateTrendData(reportsData);
        setTrendData(trends);
        
        // Set health summary
        // const summary = generateHealthSummary(reportsData);
        // setHealthSummary(summary);
        
      } catch (err) {
        console.error("Firestore error:", err);
        setError(err.code === "permission-denied" 
          ? "You don't have permission to view these reports"
          : "Failed to load reports");
      } finally {
        setLoadingDashboard(false);
      }
    });

    return unsubscribe;
  }, [navigate]);

  // Extract health metrics from parameters text
  const extractHealthMetrics = (parametersText) => {
    if (!parametersText) return null;
    
    const metrics = {};
    const lines = parametersText.split('\n');
    
    // Map each metric to its key
    const metricMapping = {
      "Blood Glucose": "glucose",
      "Glucose": "glucose",
      "Total Cholesterol": "cholesterol",
      "Cholesterol": "cholesterol",
      "Blood Pressure": "bloodPressure",
      "Hemoglobin": "hemoglobin",
      "WBC": "wbc",
      "White Blood Cells": "wbc",
      "White Blood Cell Count": "wbc"
    };
    
    lines.forEach(line => {
      if (line.includes('|')) {
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
        if (cells.length >= 2) {
          const testName = cells[0];
          const value = cells[1];
          
          // Check for each metric in our mapping
          Object.entries(metricMapping).forEach(([name, key]) => {
            if (testName.includes(name)) {
              if (key === "bloodPressure") {
                // Handle blood pressure special case (format: 120/80)
                const match = value.match(/(\d+)[\/\s]*(\d+)/);
                if (match) {
                  metrics[key] = `${match[1]}/${match[2]}`;
                }
              } else {
                // Handle numeric values
                const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
                if (!isNaN(numValue)) {
                  metrics[key] = numValue;
                }
              }
            }
          });
        }
      }
    });
    
    // Set default values for missing metrics
    if (!metrics.glucose) metrics.glucose = 95;
    if (!metrics.cholesterol) metrics.cholesterol = 180;
    if (!metrics.bloodPressure) metrics.bloodPressure = "120/80";
    if (!metrics.hemoglobin) metrics.hemoglobin = 14;
    if (!metrics.wbc) metrics.wbc = 6.0;
    
    return metrics;
  };

  // Generate insights reports based on uploaded reports
  const generateInsightsReports = (reports) => {
    if (reports.length === 0) return [];
    
    // Sort reports by date
    const sortedReports = [...reports].sort((a, b) => 
      new Date(b.uploadDate) - new Date(a.uploadDate)
    );
    
    const insightsReports = [];
    
    // Quarterly Health Trends
    if (sortedReports.length >= 2) {
      insightsReports.push({
        id: "gen1",
        name: "Quarterly Health Trends",
        generationDate: new Date().toISOString(),
        fileType: "pdf",
        fileSize: "1.4 MB",
        summaryText: generateQuarterlyInsight(sortedReports)
      });
    }
    
    // Annual Health Summary
    if (sortedReports.length >= 3) {
      insightsReports.push({
        id: "gen2",
        name: "Annual Health Summary",
        generationDate: new Date().toISOString(),
        fileType: "pdf",
        fileSize: "2.1 MB",
        summaryText: generateAnnualInsight(sortedReports)
      });
    }
    
    // Health Analysis Report
    if (sortedReports.length >= 1) {
      insightsReports.push({
        id: "gen3",
        name: "Health Analysis Report",
        generationDate: new Date().toISOString(),
        fileType: "pdf",
        fileSize: "3.5 MB",
        summaryText: generateHealthAnalysis(sortedReports[0])
      });
    }
    
    return insightsReports;
  };

  // Generate quarterly health insight text
  const generateQuarterlyInsight = (reports) => {
    if (reports.length < 2) return "Not enough data for quarterly analysis.";
    
    const current = reports[0].summary;
    const previous = reports[1].summary;
    
    if (!current || !previous) return "Insufficient data for comparison.";
    
    const glucoseChange = ((current.glucose - previous.glucose) / previous.glucose * 100).toFixed(1);
    const cholesterolChange = ((current.cholesterol - previous.cholesterol) / previous.cholesterol * 100).toFixed(1);
    
    let insight = "Quarterly health trend analysis: ";
    
    if (Math.abs(parseFloat(glucoseChange)) > 5) {
      insight += `Blood glucose has ${parseFloat(glucoseChange) > 0 ? 'increased' : 'decreased'} by ${Math.abs(parseFloat(glucoseChange))}%. `;
    } else {
      insight += "Blood glucose levels remain stable. ";
    }
    
    if (Math.abs(parseFloat(cholesterolChange)) > 5) {
      insight += `Cholesterol has ${parseFloat(cholesterolChange) > 0 ? 'increased' : 'decreased'} by ${Math.abs(parseFloat(cholesterolChange))}%. `;
    } else {
      insight += "Cholesterol levels remain consistent. ";
    }
    
    insight += "Continue monitoring and maintaining current health regimen.";
    
    return insight;
  };

  // Generate annual health insight text
  const generateAnnualInsight = (reports) => {
    if (reports.length < 3) return "Not enough data for annual analysis.";
    
    const newest = reports[0].summary;
    const oldest = reports[reports.length - 1].summary;
    
    if (!newest || !oldest) return "Insufficient data for year-over-year comparison.";
    
    const glucoseChange = ((newest.glucose - oldest.glucose) / oldest.glucose * 100).toFixed(1);
    const cholesterolChange = ((newest.cholesterol - oldest.cholesterol) / oldest.cholesterol * 100).toFixed(1);
    
    let insight = "Annual health summary: ";
    
    if (parseFloat(glucoseChange) < 0 && parseFloat(cholesterolChange) < 0) {
      insight += "Excellent progress! Both glucose and cholesterol have decreased over the past year. ";
    } else if (parseFloat(glucoseChange) < 0 || parseFloat(cholesterolChange) < 0) {
      insight += "Good progress in some areas. ";
      if (parseFloat(glucoseChange) < 0) {
        insight += `Glucose levels have improved by ${Math.abs(parseFloat(glucoseChange))}%. `;
      } else {
        insight += `Cholesterol levels have improved by ${Math.abs(parseFloat(cholesterolChange))}%. `;
      }
    } else {
      insight += "Year-over-year metrics show some areas requiring attention. ";
    }
    
    insight += "Recommend discussing these trends with your healthcare provider during your next visit.";
    
    return insight;
  };

  // Generate health analysis text for a single report
  const generateHealthAnalysis = (report) => {
    if (!report || !report.summary) return "Insufficient data for analysis.";
    
    const metrics = report.summary;
    let analysis = "";
    
    // Glucose analysis
    if (metrics.glucose < 70) {
      analysis += "Blood glucose is below normal range. Recommend monitoring for symptoms of hypoglycemia. ";
    } else if (metrics.glucose > 100) {
      analysis += "Blood glucose is elevated. Consider dietary adjustments and follow up testing. ";
    } else {
      analysis += "Blood glucose is within healthy range. ";
    }
    
    // Cholesterol analysis
    if (metrics.cholesterol < 125) {
      analysis += "Cholesterol is below normal range. Discuss with healthcare provider. ";
    } else if (metrics.cholesterol > 200) {
      analysis += "Cholesterol is elevated. Consider diet and lifestyle adjustments. ";
    } else {
      analysis += "Cholesterol is within healthy range. ";
    }
    
    // Blood pressure analysis
    const bpParts = metrics.bloodPressure.split('/');
    if (bpParts.length === 2) {
      const systolic = parseInt(bpParts[0]);
      const diastolic = parseInt(bpParts[1]);
      
      if (systolic > 130 || diastolic > 80) {
        analysis += "Blood pressure is elevated. Regular monitoring recommended. ";
      } else if (systolic < 90 || diastolic < 60) {
        analysis += "Blood pressure is low. Discuss with healthcare provider if symptomatic. ";
      } else {
        analysis += "Blood pressure is within optimal range. ";
      }
    }
    
    return analysis;
  };

  // Generate trend data from reports
  const generateTrendData = (reports) => {
    if (reports.length === 0) return [];
    
    // Sort reports by date, oldest first
    const sortedReports = [...reports].sort((a, b) => 
      new Date(a.uploadDate) - new Date(b.uploadDate)
    );
    
    return sortedReports.map(report => {
      const date = new Date(report.uploadDate);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      return {
        date: monthNames[date.getMonth()],
        fullDate: date.toISOString(),
        ...report.summary
      };
    });
  };

  // Generate health summary
  const generateHealthSummary = (reports) => {
    if (reports.length === 0) return null;
    
    // Sort reports by date
    const sortedReports = [...reports].sort((a, b) => 
      new Date(b.uploadDate) - new Date(a.uploadDate)
    );
    
    const newestReport = sortedReports[0];
    const oldestReport = sortedReports[sortedReports.length - 1];
    
    if (!newestReport.summary || !oldestReport.summary) {
      return {
        overallStatus: "Unknown",
        riskLevel: "Unknown",
        improvements: [],
        concerns: ["Insufficient data for analysis"],
        recommendations: ["Upload more health reports for comprehensive analysis"]
      };
    }
    
    const newest = newestReport.summary;
    const oldest = oldestReport.summary;
    
    const improvements = [];
    const concerns = [];
    let overallStatus = "Good";
    let riskLevel = "Low";
    
    // Check cholesterol
    if (newest.cholesterol < oldest.cholesterol) {
      const reduction = ((oldest.cholesterol - newest.cholesterol) / oldest.cholesterol * 100).toFixed(0);
      improvements.push(`Cholesterol reduced by ${reduction}%`);
    } else if (newest.cholesterol > 200) {
      concerns.push("Elevated cholesterol levels");
      overallStatus = "Needs Attention";
      riskLevel = "Moderate";
    }
    
    // Check glucose
    if (newest.glucose < oldest.glucose && oldest.glucose > 100) {
      const reduction = ((oldest.glucose - newest.glucose) / oldest.glucose * 100).toFixed(0);
      improvements.push(`Blood glucose improved by ${reduction}%`);
    } else if (newest.glucose > 100) {
      concerns.push("Elevated blood glucose levels");
      overallStatus = "Needs Attention";
      riskLevel = "Moderate";
    }
    
    // Check blood pressure
    const newestBP = newest.bloodPressure.split('/');
    const oldestBP = oldest.bloodPressure.split('/');
    
    if (newestBP.length === 2 && oldestBP.length === 2) {
      const newestSystolic = parseInt(newestBP[0]);
      const oldestSystolic = parseInt(oldestBP[0]);
      
      if (newestSystolic < oldestSystolic && oldestSystolic > 120) {
        improvements.push("Blood pressure normalized");
      } else if (newestSystolic > 130) {
        concerns.push("Elevated blood pressure");
        overallStatus = "Needs Attention";
        riskLevel = "Moderate";
      }
    }
    
    // Generate recommendations
    const recommendations = [
      "Maintain regular health check-ups",
      "Stay hydrated and maintain balanced nutrition"
    ];
    
    if (concerns.length > 0) {
      recommendations.push("Discuss these concerns with your healthcare provider");
    }
    
    if (sortedReports.length < 3) {
      recommendations.push("Upload more health reports for better trend analysis");
    }
    
    return {
      overallStatus,
      riskLevel,
      improvements,
      concerns,
      recommendations
    };
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Unknown date";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle report selection
  const handleReportSelect = (report) => {
    setSelectedReport(report);
    setHighlightedReport(null);
    setComparisonMode(false);
    setComparisonData(null);
    setReportToCompare(null);
  };

  // Handle report comparison selection
  const handleReportToCompareSelect = (report) => {
    setReportToCompare(report);
    setHighlightedReport(null);
  };

  // Toggle comparison mode
  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    if (!comparisonMode) {
      setReportToCompare(null);
      setComparisonData(null);
    }
  };

  // Generate comparison data
  const handleCompare = () => {
    if (!selectedReport || !reportToCompare) return;

    // Generate comparison data between the two reports
    const generatedData = {
      reports: [selectedReport, reportToCompare],
      dates: [
        formatDate(selectedReport.uploadDate || selectedReport.generationDate), 
        formatDate(reportToCompare.uploadDate || reportToCompare.generationDate)
      ],
      values: {},
      differences: {},
      percentChanges: {}
    };

    Object.keys(metrics).forEach(key => {
      if (selectedReport.summary && reportToCompare.summary) {
        if (key === 'bloodPressure') {
          const [sys1, dia1] = selectedReport.summary[key].split('/').map(Number);
          const [sys2, dia2] = reportToCompare.summary[key].split('/').map(Number);
          
          generatedData.values[key] = [
            selectedReport.summary[key],
            reportToCompare.summary[key]
          ];
          
          generatedData.differences[key] = {
            systolic: sys1 - sys2,
            diastolic: dia1 - dia2
          };
          
          generatedData.percentChanges[key] = {
            systolic: ((sys1 - sys2) / sys2 * 100).toFixed(1),
            diastolic: ((dia1 - dia2) / dia2 * 100).toFixed(1)
          };
        } else {
          const val1 = selectedReport.summary[key];
          const val2 = reportToCompare.summary[key];
          
          generatedData.values[key] = [val1, val2];
          generatedData.differences[key] = (val1 - val2).toFixed(1);
          generatedData.percentChanges[key] = ((val1 - val2) / val2 * 100).toFixed(1);
        }
      }
    });
    
    setComparisonData(generatedData);
  };

  // Convert blood pressure for charting
  const processTrendDataForChart = (data) => {
    return data.map(item => {
      const newItem = {...item};
      if (typeof item.bloodPressure === 'string' && item.bloodPressure.includes('/')) {
        const [systolic, diastolic] = item.bloodPressure.split('/').map(Number);
        newItem.systolic = systolic;
        newItem.diastolic = diastolic;
        delete newItem.bloodPressure;
      }
      return newItem;
    });
  };

  const chartTrendData = processTrendDataForChart(trendData);

  // Get color based on metric value comparison to normal range
  const getMetricValueColor = (metricKey, value) => {
    if (metricKey === "bloodPressure") return "text-blue-600";
    
    const normalRange = metrics[metricKey].normalRange;
    const [min, max] = normalRange.split('-').map(Number);
    
    if (value < min) return "text-yellow-500";
    if (value > max) return "text-red-500";
    return "text-green-500";
  };

  if (loadingDashboard) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-blue-600 font-medium text-lg"
          >
            Loading your health records...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="max-w-md mx-auto p-4 bg-red-50 rounded-lg shadow-md">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Health Dashboard</h1>
              <p className="text-gray-600 mt-2 text-lg">
                Welcome back, <span className="font-semibold">{userName}</span>
              </p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md p-4 flex items-center"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <FaInfoCircle className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Health Status</p>
                <p className="text-lg font-bold text-green-600">{healthSummary?.overallStatus || "Good"}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Reports and Uploads */}
          <div className="lg:col-span-1">
            


            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-5 mb-6"
            >
              {/* Tabs for uploaded vs generated reports */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === "uploaded" 
                    ? "text-blue-600 border-b-2 border-blue-500" 
                    : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("uploaded")}
                >
                  Uploaded Reports
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === "generated" 
                    ? "text-blue-600 border-b-2 border-blue-500" 
                    : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("generated")}
                >
                  Generated Insights
                </button>
              </div>

              {/* Reports List */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "uploaded" ? (
                    <>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-700">Your Medical Reports</h3>
                        <button
                          onClick={() => navigate("/upload")}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Upload New
                        </button>
                      </div>
                      
                      {uploadedReports.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <FaFilePdf className="mx-auto text-3xl text-gray-300 mb-2" />
                          <p className="text-gray-500 text-sm">No reports uploaded yet</p>
                          <button
                            onClick={() => navigate("/upload")}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Upload Report
                          </button>
                        </div>
                      ) : (
                        uploadedReports.map((report) => (
                          <motion.div
                            key={report.id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleReportSelect(report)}
                            onMouseEnter={() => setHighlightedReport(report.id)}
                            onMouseLeave={() => setHighlightedReport(null)}
                            className={`mb-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedReport && selectedReport.id === report.id 
                                ? "border-blue-500 bg-blue-50" 
                                : highlightedReport === report.id
                                  ? "border-gray-300 bg-gray-50"
                                  : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <FaFilePdf className="text-blue-600" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-medium text-gray-800">{report.name}</h4>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <FaCalendarAlt className="mr-1" /> 
                                  {formatDate(report.uploadDate)}
                                  <span className="mx-2">•</span>
                                  {report.provider}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Generated Health Insights</h3>
                      {generatedReports.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <FaChartLine className="mx-auto text-3xl text-gray-300 mb-2" />
                          <p className="text-gray-500 text-sm">No insights generated yet</p>
                          <p className="text-xs text-gray-400 mt-1">Upload more reports to generate insights</p>
                        </div>
                      ) : (
                        generatedReports.map((report) => (
                          <motion.div
                          key={report.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleReportSelect(report)}
                          onMouseEnter={() => setHighlightedReport(report.id)}
                          onMouseLeave={() => setHighlightedReport(null)}
                          className={`mb-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedReport && selectedReport.id === report.id 
                              ? "border-blue-500 bg-blue-50" 
                              : highlightedReport === report.id
                                ? "border-gray-300 bg-gray-50"
                                : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-lg mr-3">
                              <FaChartLine className="text-green-600" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium text-gray-800">{report.name}</h4>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <FaCalendarAlt className="mr-1" /> 
                                {formatDate(report.generationDate)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Health Summary Section */}
          {healthSummary && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-5"
            >
              <div className="flex items-center mb-4">
                <GiHealthNormal className="text-blue-600 text-xl mr-2" />
                <h3 className="text-lg font-semibold text-gray-700">Health Summary</h3>
              </div>
              
              <div className="flex items-center mb-3">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  healthSummary.riskLevel === "Low" ? "bg-green-500" :
                  healthSummary.riskLevel === "Moderate" ? "bg-yellow-500" : "bg-red-500"
                }`}></div>
                <span className="font-medium">Risk Level: {healthSummary.riskLevel}</span>
              </div>
              
              {healthSummary.improvements.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Improvements</h4>
                  <ul className="text-sm text-gray-600">
                    {healthSummary.improvements.map((item, i) => (
                      <li key={i} className="flex items-center py-1">
                        <span className="text-green-500 mr-2">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {healthSummary.concerns.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Areas of Concern</h4>
                  <ul className="text-sm text-gray-600">
                    {healthSummary.concerns.map((item, i) => (
                      <li key={i} className="flex items-center py-1">
                        <span className="text-yellow-500 mr-2">!</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Recommendations</h4>
                <ul className="text-sm text-gray-600">
                  {healthSummary.recommendations.map((item, i) => (
                    <li key={i} className="flex items-center py-1">
                      <span className="text-blue-500 mr-2">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        {/* Middle Column - Report Viewer / Comparison */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-5 mb-6"
          >
            {/* Report Viewer Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {comparisonMode ? "Report Comparison" : "Report Viewer"}
              </h3>
              <div className="flex space-x-2">
                {selectedReport && (
                  <button
                    onClick={toggleComparisonMode}
                    className={`px-3 py-1 text-xs rounded flex items-center ${
                      comparisonMode 
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <FaExchangeAlt className="mr-1" /> 
                    {comparisonMode ? "Exit Comparison" : "Compare"}
                  </button>
                )}
                <button
                  onClick={() => setShowTrends(!showTrends)}
                  className={`px-3 py-1 text-xs rounded flex items-center ${
                    showTrends 
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  <FaHistory className="mr-1" /> 
                  {showTrends ? "Hide Trends" : "Show Trends"}
                </button>
              </div>
            </div>

            {/* Report Content */}
            <AnimatePresence mode="wait">
              {selectedReport ? (
                comparisonMode ? (
                  <motion.div
                    key="comparison"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {/* Selected Report */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-600 mb-2">Selected Report</h4>
                      <p className="text-sm text-gray-500 mb-3">
                        {formatDate(selectedReport.uploadDate || selectedReport.generationDate)}
                      </p>
                      
                      {selectedReport.summary ? (
                        <div className="space-y-2">
                          {Object.keys(metrics).map(key => (
                            <div key={key} className="p-2 bg-gray-50 rounded flex justify-between">
                              <span className="text-sm text-gray-600">{metrics[key].label}</span>
                              <span className={`text-sm font-medium ${getMetricValueColor(key, selectedReport.summary[key])}`}>
                                {selectedReport.summary[key]} {metrics[key].unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="italic text-gray-500 text-sm">
                          {selectedReport.summaryText || "No detailed metrics available"}
                        </div>
                      )}
                    </div>
                    
                    {/* Report to Compare */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      {reportToCompare ? (
                        <>
                          <h4 className="font-medium text-green-600 mb-2">Comparison Report</h4>
                          <p className="text-sm text-gray-500 mb-3">
                            {formatDate(reportToCompare.uploadDate || reportToCompare.generationDate)}
                          </p>
                          
                          {reportToCompare.summary ? (
                            <div className="space-y-2">
                              {Object.keys(metrics).map(key => (
                                <div key={key} className="p-2 bg-gray-50 rounded flex justify-between">
                                  <span className="text-sm text-gray-600">{metrics[key].label}</span>
                                  <span className={`text-sm font-medium ${getMetricValueColor(key, reportToCompare.summary[key])}`}>
                                    {reportToCompare.summary[key]} {metrics[key].unit}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="italic text-gray-500 text-sm">
                              {reportToCompare.summaryText || "No detailed metrics available"}
                            </div>
                          )}
                          
                          <button
                            onClick={handleCompare}
                            className="mt-4 w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center justify-center"
                          >
                            <FaExchangeAlt className="mr-2" /> Generate Comparison
                          </button>
                        </>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center py-6">
                          <p className="text-gray-500 text-sm mb-4">Select a report to compare</p>
                          <div className="space-y-3 w-full">
                            {uploadedReports
                              .filter(r => r.id !== selectedReport.id)
                              .slice(0, 3)
                              .map(report => (
                                <button
                                  key={report.id}
                                  onClick={() => handleReportToCompareSelect(report)}
                                  className="w-full p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-left text-sm"
                                >
                                  <div className="font-medium">{report.name}</div>
                                  <div className="text-xs text-gray-500">{formatDate(report.uploadDate)}</div>
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Comparison Results */}
                    {comparisonData && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="col-span-2 mt-2 border border-blue-200 bg-blue-50 rounded-lg p-4"
                      >
                        <h4 className="text-blue-700 font-medium mb-3">Comparison Results</h4>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {Object.keys(metrics).map(key => (
                            <div key={key} className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="text-gray-700 font-medium mb-1">{metrics[key].label}</div>
                              
                              <div className="flex justify-between text-sm">
                                <div className="text-gray-500">First:</div>
                                <div className="font-medium">
                                  {comparisonData.values[key] && comparisonData.values[key][0]}
                                </div>
                              </div>
                              
                              <div className="flex justify-between text-sm">
                                <div className="text-gray-500">Second:</div>
                                <div className="font-medium">
                                  {comparisonData.values[key] && comparisonData.values[key][1]}
                                </div>
                              </div>
                              
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                {key === 'bloodPressure' ? (
                                  <>
                                    <div className="flex justify-between text-sm">
                                      <div className="text-gray-500">Systolic:</div>
                                      <div className={`font-medium ${
                                        comparisonData.differences[key]?.systolic > 0 
                                          ? "text-red-500" 
                                          : comparisonData.differences[key]?.systolic < 0 
                                            ? "text-green-500" 
                                            : "text-gray-600"
                                      }`}>
                                        {comparisonData.differences[key]?.systolic > 0 ? "+" : ""}
                                        {comparisonData.differences[key]?.systolic} 
                                        ({comparisonData.percentChanges[key]?.systolic}%)
                                      </div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <div className="text-gray-500">Diastolic:</div>
                                      <div className={`font-medium ${
                                        comparisonData.differences[key]?.diastolic > 0 
                                          ? "text-red-500" 
                                          : comparisonData.differences[key]?.diastolic < 0 
                                            ? "text-green-500" 
                                            : "text-gray-600"
                                      }`}>
                                        {comparisonData.differences[key]?.diastolic > 0 ? "+" : ""}
                                        {comparisonData.differences[key]?.diastolic} 
                                        ({comparisonData.percentChanges[key]?.diastolic}%)
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex justify-between text-sm">
                                    <div className="text-gray-500">Change:</div>
                                    <div className={`font-medium ${
                                      parseFloat(comparisonData.differences[key]) > 0 
                                        ? key === 'cholesterol' || key === 'glucose' ? "text-red-500" : "text-green-500"
                                        : parseFloat(comparisonData.differences[key]) < 0 
                                          ? key === 'cholesterol' || key === 'glucose' ? "text-green-500" : "text-red-500"
                                          : "text-gray-600"
                                    }`}>
                                      {parseFloat(comparisonData.differences[key]) > 0 ? "+" : ""}
                                      {comparisonData.differences[key]} 
                                      ({comparisonData.percentChanges[key]}%)
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : showTrends ? (
                  <motion.div
                    key="trends"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-700">Health Trends Over Time</h4>
                      <div className="flex gap-2">
                        {Object.keys(metrics).map(key => (
                          <button
                            key={key}
                            onClick={() => setSelectedMetric(key)}
                            className={`px-2 py-1 text-xs rounded ${
                              selectedMetric === key
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {metrics[key].label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg h-64">
                      {trendData.length > 1 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          {selectedMetric === "bloodPressure" ? (
                            <LineChart data={chartTrendData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="systolic" stroke="#8884d8" name="Systolic" />
                              <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" name="Diastolic" />
                            </LineChart>
                          ) : (
                            <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Line 
                                type="monotone" 
                                dataKey={selectedMetric} 
                                stroke="#8884d8" 
                                strokeWidth={2}
                                name={metrics[selectedMetric].label} 
                              />
                              
                              {/* Add reference lines for normal ranges */}
                              {selectedMetric !== "bloodPressure" && metrics[selectedMetric].normalRange.split('-').map((value, index) => (
  <ReferenceLine 
    key={index} 
    y={parseFloat(value)} 
    stroke={index === 0 ? "#ffbb33" : "#ff6666"} 
    strokeDasharray="3 3"
    label={{ value: `${index === 0 ? 'Min' : 'Max'}: ${value}`, position: 'insideTopRight' }}
  />
))}
                            </LineChart>
                          )}
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-gray-500">Not enough data for trend analysis</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{selectedReport.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(selectedReport.uploadDate || selectedReport.generationDate)}
                          {selectedReport.provider && ` • ${selectedReport.provider}`}
                        </p>
                      </div>
                      
                     
                    </div>
                    
                    {selectedReport.summary ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-3">Key Health Metrics</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.keys(metrics).map(key => (
                            <div key={key} className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="text-sm text-gray-500">{metrics[key].label}</div>
                              <div className={`text-lg font-semibold ${getMetricValueColor(key, selectedReport.summary[key])}`}>
                                {selectedReport.summary[key]} <span className="text-xs text-gray-500">{metrics[key].unit}</span>
                              </div>
                              <div className="mt-1 text-xs text-gray-400">
                                Normal: {metrics[key].normalRange} {metrics[key].unit}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {selectedReport.health_summary && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <h4 className="text-blue-800 font-medium mb-2">Health Summary</h4>
                            <p className="text-sm text-gray-700">{selectedReport.health_summary}</p>
                          </div>
                        )}
                      </div>
                    ) : selectedReport.summaryText ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-3">Generated Insight</h4>
                        <p className="text-gray-700">{selectedReport.summaryText}</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-gray-500">No detailed information available for this report</p>
                      </div>
                    )}
                    
                    {selectedReport.parameters_text && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Detailed Parameters</h4>
                        <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-64">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap">{selectedReport.parameters_text}</pre>
                        </div>
                      </div>
                    )}
                    
                    {/* Report Navigation */}
                    {uploadedReports.length > 1 && (
                      <div className="mt-6 flex justify-between">
                        <button
                          onClick={() => {
                            const currentIndex = uploadedReports.findIndex(r => r.id === selectedReport.id);
                            if (currentIndex < uploadedReports.length - 1) {
                              handleReportSelect(uploadedReports[currentIndex + 1]);
                            }
                          }}
                          disabled={uploadedReports.findIndex(r => r.id === selectedReport.id) === uploadedReports.length - 1}
                          className="px-3 py-1 flex items-center text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaArrowLeft className="mr-1" /> Previous Report
                        </button>
                        
                        <button
                          onClick={() => {
                            const currentIndex = uploadedReports.findIndex(r => r.id === selectedReport.id);
                            if (currentIndex > 0) {
                              handleReportSelect(uploadedReports[currentIndex - 1]);
                            }
                          }}
                          disabled={uploadedReports.findIndex(r => r.id === selectedReport.id) === 0}
                          className="px-3 py-1 flex items-center text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next Report <FaArrowRight className="ml-1" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <FaFilePdf className="text-gray-300 text-5xl mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Report Selected</h3>
                  <p className="text-gray-500 max-w-sm">
                    Select a report from the list to view its details or upload a new report.
                  </p>
                  <button
                    onClick={() => navigate("/upload")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Upload New Report
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
);
};

export default UserDashboard;


// // import React, { useState, useEffect } from "react";
// // import { 
// //   FaFilePdf, 
// //   FaChartLine, 
// //   FaCalendarAlt, 
// //   FaDownload, 
// //   FaExchangeAlt, 
// //   FaHistory, 
// //   FaArrowLeft, 
// //   FaArrowRight,
// //   FaInfoCircle,
// //   FaExclamationTriangle
// // } from "react-icons/fa";
// // import { GiHealthNormal } from "react-icons/gi";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { 
// //   BarChart, 
// //   Bar, 
// //   LineChart, 
// //   Line, 
// //   XAxis, 
// //   YAxis, 
// //   CartesianGrid, 
// //   Tooltip, 
// //   Legend, 
// //   ResponsiveContainer,
// //   ReferenceLine
// // } from "recharts";
// // // import { FaUpload, FaUser, FaChartBar } from 'react-icons/fa';
// // import { FaUpload, FaArrowUp } from 'react-icons/fa';



// // import { useNavigate } from "react-router-dom";
// // import { db, auth } from "../../firebase/firebaseConfig";
// // import { collection, query, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
// // import { onAuthStateChanged } from "firebase/auth";

// // const UserDashboard = () => {
// //   const navigate = useNavigate();
  
// //   // User state
// //   const [userName, setUserName] = useState("User");
// //   const [loadingDashboard, setLoadingDashboard] = useState(true);
// //   const [error, setError] = useState(null);
  
// //   // Reports state
// //   const [uploadedReports, setUploadedReports] = useState([]);
// //   const [generatedReports, setGeneratedReports] = useState([]);
// //   const [selectedReport, setSelectedReport] = useState(null);
// //   const [pageNumber, setPageNumber] = useState(1);
  
// //   // Comparison state
// //   const [comparisonMode, setComparisonMode] = useState(false);
// //   const [reportToCompare, setReportToCompare] = useState(null);
// //   const [selectedMetric, setSelectedMetric] = useState("glucose");
// //   const [comparisonData, setComparisonData] = useState(null);
  
// //   // UI state
// //   const [activeTab, setActiveTab] = useState("uploaded");
// //   const [showTrends, setShowTrends] = useState(false);
// //   const [healthSummary, setHealthSummary] = useState(null);
// //   const [highlightedReport, setHighlightedReport] = useState(null);
  
// //   // Health metrics definitions
// //   const metrics = {
// //     glucose: { label: "Blood Glucose", unit: "mg/dL", normalRange: "70-100", paramName: "Blood Glucose" },
// //     cholesterol: { label: "Cholesterol", unit: "mg/dL", normalRange: "125-200", paramName: "Total Cholesterol" },
// //     bloodPressure: { label: "Blood Pressure", unit: "mmHg", normalRange: "120/80", paramName: "Blood Pressure" },
// //     hemoglobin: { label: "Hemoglobin", unit: "g/dL", normalRange: "12-16", paramName: "Hemoglobin" },
// //     wbc: { label: "White Blood Cells", unit: "K/μL", normalRange: "4.5-11.0", paramName: "WBC" }
// //   };
  
// //   // Trend data state
// //   const [trendData, setTrendData] = useState([]);

// //   // Load data from Firebase
// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
// //       if (!user) {
// //         navigate("/login");
// //         return;
// //       }

// //       try {
// //         setUserName(user.displayName || "User");
        
// //         // Get uploaded reports
// //         const reportsRef = collection(db, "users", user.uid, "uploaded_reports");
// //         const q = query(reportsRef, orderBy("timestamp", "desc"));
// //         const querySnapshot = await getDocs(q);
        
// //         const reportsData = querySnapshot.docs.map(doc => {
// //           const data = doc.data();
// //           return {
// //             id: doc.id,
// //             name: data.filename || "Unnamed Report",
// //             uploadDate: data.timestamp?.toDate().toISOString(),
// //             provider: data.provider || "Unknown Provider",
// //             thumbnailUrl: "/api/placeholder/150/200",
// //             fileType: "pdf",
// //             fileSize: data.fileSize || "Unknown size",
// //             pdf_url: data.pdf_url || "",
// //             summary: extractHealthMetrics(data.parameters_text),
// //             parameters_text: data.parameters_text || ""
// //           };
// //         });
        
// //         setUploadedReports(reportsData);
        
// //         // Generate insights reports from uploaded reports
// //         const insightsReports = generateInsightsReports(reportsData);
// //         setGeneratedReports(insightsReports);
        
// //         // Generate trend data from reports
// //         const trends = generateTrendData(reportsData);
// //         setTrendData(trends);
        
// //         // Set health summary
// //         const summary = generateHealthSummary(reportsData);
// //         setHealthSummary(summary);
        
// //       } catch (err) {
// //         console.error("Firestore error:", err);
// //         setError(err.code === "permission-denied" 
// //           ? "You don't have permission to view these reports"
// //           : "Failed to load reports");
// //       } finally {
// //         setLoadingDashboard(false);
// //       }
// //     });

// //     return unsubscribe;
// //   }, [navigate]);

// //   // Extract health metrics from parameters text
// //   const extractHealthMetrics = (parametersText) => {
// //     if (!parametersText) return null;
    
// //     const metrics = {};
// //     const lines = parametersText.split('\n');
    
// //     // Map each metric to its key
// //     const metricMapping = {
// //       "Blood Glucose": "glucose",
// //       "Glucose": "glucose",
// //       "Total Cholesterol": "cholesterol",
// //       "Cholesterol": "cholesterol",
// //       "Blood Pressure": "bloodPressure",
// //       "Hemoglobin": "hemoglobin",
// //       "WBC": "wbc",
// //       "White Blood Cells": "wbc",
// //       "White Blood Cell Count": "wbc"
// //     };
    
// //     lines.forEach(line => {
// //       if (line.includes('|')) {
// //         const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
// //         if (cells.length >= 2) {
// //           const testName = cells[0];
// //           const value = cells[1];
          
// //           // Check for each metric in our mapping
// //           Object.entries(metricMapping).forEach(([name, key]) => {
// //             if (testName.includes(name)) {
// //               if (key === "bloodPressure") {
// //                 // Handle blood pressure special case (format: 120/80)
// //                 const match = value.match(/(\d+)[\/\s]*(\d+)/);
// //                 if (match) {
// //                   metrics[key] = `${match[1]}/${match[2]}`;
// //                 }
// //               } else {
// //                 // Handle numeric values
// //                 const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
// //                 if (!isNaN(numValue)) {
// //                   metrics[key] = numValue;
// //                 }
// //               }
// //             }
// //           });
// //         }
// //       }
// //     });
    
// //     return metrics;
// //   };

// //   // Generate insights reports based on uploaded reports
// //   const generateInsightsReports = (reports) => {
// //     if (reports.length === 0) return [];
    
// //     // Sort reports by date
// //     const sortedReports = [...reports].sort((a, b) => 
// //       new Date(b.uploadDate) - new Date(a.uploadDate)
// //     );
    
// //     const insightsReports = [];
    
// //     // Quarterly Health Trends
// //     if (sortedReports.length >= 2) {
// //       insightsReports.push({
// //         id: "gen1",
// //         name: "Quarterly Health Trends",
// //         generationDate: new Date().toISOString(),
// //         fileType: "pdf",
// //         fileSize: "1.4 MB",
// //         summaryText: generateQuarterlyInsight(sortedReports)
// //       });
// //     }
    
// //     // Annual Health Summary
// //     if (sortedReports.length >= 3) {
// //       insightsReports.push({
// //         id: "gen2",
// //         name: "Annual Health Summary",
// //         generationDate: new Date().toISOString(),
// //         fileType: "pdf",
// //         fileSize: "2.1 MB",
// //         summaryText: generateAnnualInsight(sortedReports)
// //       });
// //     }
    
// //     // Health Analysis Report
// //     if (sortedReports.length >= 1) {
// //       insightsReports.push({
// //         id: "gen3",
// //         name: "Health Analysis Report",
// //         generationDate: new Date().toISOString(),
// //         fileType: "pdf",
// //         fileSize: "3.5 MB",
// //         summaryText: generateHealthAnalysis(sortedReports[0])
// //       });
// //     }
    
// //     return insightsReports;
// //   };

// //   // Generate quarterly health insight text
// //   const generateQuarterlyInsight = (reports) => {
// //     if (reports.length < 2) return "Not enough data for quarterly analysis.";
    
// //     const current = reports[0].summary;
// //     const previous = reports[1].summary;
    
// //     if (!current || !previous) return "Insufficient data for comparison.";
    
// //     const glucoseChange = ((current.glucose - previous.glucose) / previous.glucose * 100).toFixed(1);
// //     const cholesterolChange = ((current.cholesterol - previous.cholesterol) / previous.cholesterol * 100).toFixed(1);
    
// //     let insight = "Quarterly health trend analysis: ";
    
// //     if (Math.abs(parseFloat(glucoseChange)) > 5) {
// //       insight += `Blood glucose has ${parseFloat(glucoseChange) > 0 ? 'increased' : 'decreased'} by ${Math.abs(parseFloat(glucoseChange))}%. `;
// //     } else {
// //       insight += "Blood glucose levels remain stable. ";
// //     }
    
// //     if (Math.abs(parseFloat(cholesterolChange)) > 5) {
// //       insight += `Cholesterol has ${parseFloat(cholesterolChange) > 0 ? 'increased' : 'decreased'} by ${Math.abs(parseFloat(cholesterolChange))}%. `;
// //     } else {
// //       insight += "Cholesterol levels remain consistent. ";
// //     }
    
// //     insight += "Continue monitoring and maintaining current health regimen.";
    
// //     return insight;
// //   };

// //   // Generate annual health insight text
// //   const generateAnnualInsight = (reports) => {
// //     if (reports.length < 3) return "Not enough data for annual analysis.";
    
// //     const newest = reports[0].summary;
// //     const oldest = reports[reports.length - 1].summary;
    
// //     if (!newest || !oldest) return "Insufficient data for year-over-year comparison.";
    
// //     const glucoseChange = ((newest.glucose - oldest.glucose) / oldest.glucose * 100).toFixed(1);
// //     const cholesterolChange = ((newest.cholesterol - oldest.cholesterol) / oldest.cholesterol * 100).toFixed(1);
    
// //     let insight = "Annual health summary: ";
    
// //     if (parseFloat(glucoseChange) < 0 && parseFloat(cholesterolChange) < 0) {
// //       insight += "Excellent progress! Both glucose and cholesterol have decreased over the past year. ";
// //     } else if (parseFloat(glucoseChange) < 0 || parseFloat(cholesterolChange) < 0) {
// //       insight += "Good progress in some areas. ";
// //       if (parseFloat(glucoseChange) < 0) {
// //         insight += `Glucose levels have improved by ${Math.abs(parseFloat(glucoseChange))}%. `;
// //       } else {
// //         insight += `Cholesterol levels have improved by ${Math.abs(parseFloat(cholesterolChange))}%. `;
// //       }
// //     } else {
// //       insight += "Year-over-year metrics show some areas requiring attention. ";
// //     }
    
// //     insight += "Recommend discussing these trends with your healthcare provider during your next visit.";
    
// //     return insight;
// //   };

// //   // Generate health analysis text for a single report
// //   const generateHealthAnalysis = (report) => {
// //     if (!report || !report.summary) return "Insufficient data for analysis.";
    
// //     const metrics = report.summary;
// //     let analysis = "";
    
// //     // Glucose analysis
// //     if (metrics.glucose < 70) {
// //       analysis += "Blood glucose is below normal range. Recommend monitoring for symptoms of hypoglycemia. ";
// //     } else if (metrics.glucose > 100) {
// //       analysis += "Blood glucose is elevated. Consider dietary adjustments and follow up testing. ";
// //     } else {
// //       analysis += "Blood glucose is within healthy range. ";
// //     }
    
// //     // Cholesterol analysis
// //     if (metrics.cholesterol < 125) {
// //       analysis += "Cholesterol is below normal range. Discuss with healthcare provider. ";
// //     } else if (metrics.cholesterol > 200) {
// //       analysis += "Cholesterol is elevated. Consider diet and lifestyle adjustments. ";
// //     } else {
// //       analysis += "Cholesterol is within healthy range. ";
// //     }
    
// //     // Blood pressure analysis
// //     const bpParts = (metrics.bloodPressure || '').split('/');

// //     if (bpParts.length === 2) {
// //       const systolic = parseInt(bpParts[0]);
// //       const diastolic = parseInt(bpParts[1]);
      
// //       if (systolic > 130 || diastolic > 80) {
// //         analysis += "Blood pressure is elevated. Regular monitoring recommended. ";
// //       } else if (systolic < 90 || diastolic < 60) {
// //         analysis += "Blood pressure is low. Discuss with healthcare provider if symptomatic. ";
// //       } else {
// //         analysis += "Blood pressure is within optimal range. ";
// //       }
// //     }
    
// //     return analysis;
// //   };

// //   // Generate trend data from reports
// //   const generateTrendData = (reports) => {
// //     if (reports.length === 0) return [];
    
// //     // Filter out reports without summary data
// //     const reportsWithSummary = reports.filter(report => report.summary && 
// //       Object.keys(report.summary).length > 0);
    
// //     if (reportsWithSummary.length < 2) {
// //       // Generate some sample fluctuating data if there's not enough real data
// //       // This is just for demonstration - in production, you would only use actual data
// //       const sampleData = [];
// //       const baseDate = new Date();
// //       const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
// //       for (let i = 0; i < 12; i++) {
// //         const date = new Date(baseDate);
// //         date.setMonth(baseDate.getMonth() - i);
        
// //         sampleData.unshift({
// //           date: monthNames[date.getMonth()],
// //           fullDate: date.toISOString(),
// //           glucose: 85 + Math.sin(i * 0.9) * 15,
// //           cholesterol: 170 + Math.cos(i * 0.7) * 20,
// //           bloodPressure: `${120 + Math.round(Math.sin(i * 0.8) * 10)}/${80 + Math.round(Math.cos(i * 0.8) * 5)}`,
// //           hemoglobin: 14 + Math.sin(i * 0.5) * 1.5,
// //           wbc: 7 + Math.cos(i * 0.6) * 1.5
// //         });
// //       }
      
// //       return sampleData;
// //     }
    
// //     // Sort reports by date, oldest first
// //     const sortedReports = [...reportsWithSummary].sort((a, b) => 
// //       new Date(a.uploadDate) - new Date(b.uploadDate)
// //     );
    
// //     // Ensure we have a diverse range of dates
// //     // If we have only a few reports, create some interpolated data points
// //     if (sortedReports.length < 4) {
// //       const result = [];
// //       const oldestDate = new Date(sortedReports[0].uploadDate);
// //       const newestDate = new Date(sortedReports[sortedReports.length - 1].uploadDate);
// //       const monthsDiff = (newestDate.getFullYear() - oldestDate.getFullYear()) * 12 + 
// //                          (newestDate.getMonth() - oldestDate.getMonth());
      
// //       // If we have reports spanning multiple months, interpolate the data
// //       if (monthsDiff > 1) {
// //         const reportsByMonth = {};
// //         const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
// //         // Map existing reports to months
// //         sortedReports.forEach(report => {
// //           const date = new Date(report.uploadDate);
// //           const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
// //           reportsByMonth[monthKey] = report;
// //         });
        
// //         // Create a complete series with interpolated data for missing months
// //         for (let i = 0; i <= monthsDiff; i++) {
// //           const currentDate = new Date(oldestDate);
// //           currentDate.setMonth(oldestDate.getMonth() + i);
// //           const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
          
// //           if (reportsByMonth[monthKey]) {
// //             // We have real data for this month
// //             const date = new Date(reportsByMonth[monthKey].uploadDate);
// //             result.push({
// //               date: monthNames[date.getMonth()],
// //               fullDate: reportsByMonth[monthKey].uploadDate,
// //               ...reportsByMonth[monthKey].summary
// //             });
// //           } else {
// //             // Interpolate data for this month
// //             const prevIndex = Math.max(0, result.length - 1);
// //             const nextReportIndex = sortedReports.findIndex(report => 
// //               new Date(report.uploadDate) > currentDate);
// //             const nextIndex = nextReportIndex !== -1 ? nextReportIndex : sortedReports.length - 1;
            
// //             // Skip interpolation if we don't have enough data yet
// //             if (result.length === 0) continue;
            
// //             const prevData = result[prevIndex];
// //             const nextData = {
// //               ...sortedReports[nextIndex].summary
// //             };
            
// //             // Calculate progress between previous and next known points
// //             const prevDate = new Date(prevData.fullDate);
// //             const nextDate = new Date(sortedReports[nextIndex].uploadDate);
// //             const totalDiff = nextDate - prevDate;
// //             const currentDiff = currentDate - prevDate;
// //             const progress = totalDiff > 0 ? currentDiff / totalDiff : 0;
            
// //             // Interpolate each metric
// //             const interpolatedData = {
// //               date: monthNames[currentDate.getMonth()],
// //               fullDate: currentDate.toISOString()
// //             };
            
// //             // Interpolate numeric metrics
// //             ['glucose', 'cholesterol', 'hemoglobin', 'wbc'].forEach(metric => {
// //               if (prevData[metric] !== undefined && nextData[metric] !== undefined) {
// //                 interpolatedData[metric] = prevData[metric] + 
// //                   (nextData[metric] - prevData[metric]) * progress;
// //               }
// //             });
            
// //             // Handle blood pressure specially
// //             if (prevData.bloodPressure && nextData.bloodPressure) {
// //               const [prevSys, prevDia] = prevData.bloodPressure.split('/').map(Number);
// //               const [nextSys, nextDia] = nextData.bloodPressure.split('/').map(Number);
              
// //               if (!isNaN(prevSys) && !isNaN(prevDia) && !isNaN(nextSys) && !isNaN(nextDia)) {
// //                 const interpolatedSys = Math.round(prevSys + (nextSys - prevSys) * progress);
// //                 const interpolatedDia = Math.round(prevDia + (nextDia - prevDia) * progress);
// //                 interpolatedData.bloodPressure = `${interpolatedSys}/${interpolatedDia}`;
// //               }
// //             }
            
// //             result.push(interpolatedData);
// //           }
// //         }
        
// //         return result;
// //       }
// //     }
    
// //     // If we just have a few reports close together, return those as they are
// //     return sortedReports.map(report => {
// //       const date = new Date(report.uploadDate);
// //       const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
// //       return {
// //         date: monthNames[date.getMonth()],
// //         fullDate: date.toISOString(),
// //         ...report.summary
// //       };
// //     });
// //   };

// //   // Generate health summary
// //   const generateHealthSummary = (reports) => {
// //     if (reports.length === 0) return null;
    
// //     // Filter reports that have summary data
// //     const reportsWithSummary = reports.filter(report => report.summary);
    
// //     if (reportsWithSummary.length === 0) {
// //       return {
// //         overallStatus: "Unknown",
// //         riskLevel: "Unknown",
// //         improvements: [],
// //         concerns: ["Insufficient data for analysis"],
// //         recommendations: ["Upload more health reports for comprehensive analysis"]
// //       };
// //     }
    
// //     // Sort reports by date
// //     const sortedReports = [...reportsWithSummary].sort((a, b) => 
// //       new Date(b.uploadDate) - new Date(a.uploadDate)
// //     );
    
// //     const newestReport = sortedReports[0];
// //     const oldestReport = sortedReports[sortedReports.length - 1];
    
// //     const newest = newestReport.summary;
// //     const oldest = oldestReport.summary;
    
// //     const improvements = [];
// //     const concerns = [];
// //     let overallStatus = "Good";
// //     let riskLevel = "Low";
    
// //     // Check cholesterol
// //     if (newest.cholesterol && oldest.cholesterol) {
// //       if (newest.cholesterol < oldest.cholesterol) {
// //         const reduction = ((oldest.cholesterol - newest.cholesterol) / oldest.cholesterol * 100).toFixed(0);
// //         improvements.push(`Cholesterol reduced by ${reduction}%`);
// //       } else if (newest.cholesterol > 200) {
// //         concerns.push("Elevated cholesterol levels");
// //         overallStatus = "Needs Attention";
// //         riskLevel = "Moderate";
// //       }
// //     }
    
// //     // Check glucose
// //     if (newest.glucose && oldest.glucose) {
// //       if (newest.glucose < oldest.glucose && oldest.glucose > 100) {
// //         const reduction = ((oldest.glucose - newest.glucose) / oldest.glucose * 100).toFixed(0);
// //         improvements.push(`Blood glucose improved by ${reduction}%`);
// //       } else if (newest.glucose > 100) {
// //         concerns.push("Elevated blood glucose levels");
// //         overallStatus = "Needs Attention";
// //         riskLevel = "Moderate";
// //       }
// //     }
    
// //     // Check blood pressure
// //     if (newest.bloodPressure && oldest.bloodPressure) {
// //       const newestBP = newest.bloodPressure.split('/');
// //       const oldestBP = oldest.bloodPressure.split('/');
      
// //       if (newestBP.length === 2 && oldestBP.length === 2) {
// //         const newestSystolic = parseInt(newestBP[0]);
// //         const oldestSystolic = parseInt(oldestBP[0]);
        
// //         if (newestSystolic < oldestSystolic && oldestSystolic > 120) {
// //           improvements.push("Blood pressure normalized");
// //         } else if (newestSystolic > 130) {
// //           concerns.push("Elevated blood pressure");
// //           overallStatus = "Needs Attention";
// //           riskLevel = "Moderate";
// //         }
// //       }
// //     }
    
// //     // Generate recommendations
// //     const recommendations = [
// //       "Maintain regular health check-ups",
// //       "Stay hydrated and maintain balanced nutrition"
// //     ];
    
// //     if (concerns.length > 0) {
// //       recommendations.push("Discuss these concerns with your healthcare provider");
// //     }
    
// //     if (sortedReports.length < 3) {
// //       recommendations.push("Upload more health reports for better trend analysis");
// //     }
    
// //     return {
// //       overallStatus,
// //       riskLevel,
// //       improvements,
// //       concerns,
// //       recommendations
// //     };
// //   };

// //   // Format date for display
// //   const formatDate = (date) => {
// //     if (!date) return "Unknown date";
// //     return new Date(date).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric'
// //     });
// //   };

// //   // Handle report selection
// //   const handleReportSelect = (report) => {
// //     setSelectedReport(report);
// //     setHighlightedReport(null);
// //     setComparisonMode(false);
// //     setComparisonData(null);
// //     setReportToCompare(null);
// //   };

// //   // Handle report comparison selection
// //   const handleReportToCompareSelect = (report) => {
// //     setReportToCompare(report);
// //     setHighlightedReport(null);
// //   };

// //   // Toggle comparison mode
// //   const toggleComparisonMode = () => {
// //     setComparisonMode(!comparisonMode);
// //     if (!comparisonMode) {
// //       setReportToCompare(null);
// //       setComparisonData(null);
// //     }
// //   };

// //   // Generate comparison data
// //   const handleCompare = () => {
// //     if (!selectedReport || !reportToCompare) return;

// //     // Generate comparison data between the two reports
// //     const generatedData = {
// //       reports: [selectedReport, reportToCompare],
// //       dates: [
// //         formatDate(selectedReport.uploadDate || selectedReport.generationDate), 
// //         formatDate(reportToCompare.uploadDate || reportToCompare.generationDate)
// //       ],
// //       values: {},
// //       differences: {},
// //       percentChanges: {}
// //     };

// //     Object.keys(metrics).forEach(key => {
// //       if (selectedReport.summary && reportToCompare.summary) {
// //         if (key === 'bloodPressure') {
// //           const [sys1, dia1] = selectedReport.summary[key].split('/').map(Number);
// //           const [sys2, dia2] = reportToCompare.summary[key].split('/').map(Number);
          
// //           generatedData.values[key] = [
// //             selectedReport.summary[key],
// //             reportToCompare.summary[key]
// //           ];
          
// //           generatedData.differences[key] = {
// //             systolic: sys1 - sys2,
// //             diastolic: dia1 - dia2
// //           };
          
// //           generatedData.percentChanges[key] = {
// //             systolic: ((sys1 - sys2) / sys2 * 100).toFixed(1),
// //             diastolic: ((dia1 - dia2) / dia2 * 100).toFixed(1)
// //           };
// //         } else {
// //           const val1 = selectedReport.summary[key];
// //           const val2 = reportToCompare.summary[key];
          
// //           generatedData.values[key] = [val1, val2];
// //           generatedData.differences[key] = (val1 - val2).toFixed(1);
// //           generatedData.percentChanges[key] = ((val1 - val2) / val2 * 100).toFixed(1);
// //         }
// //       }
// //     });
    
// //     setComparisonData(generatedData);
// //   };

// //   // Convert blood pressure for charting
// //   const processTrendDataForChart = (data) => {
// //     return data.map(item => {
// //       const newItem = {...item};
// //       if (typeof item.bloodPressure === 'string' && item.bloodPressure.includes('/')) {
// //         const [systolic, diastolic] = item.bloodPressure.split('/').map(Number);
// //         newItem.systolic = systolic;
// //         newItem.diastolic = diastolic;
// //         delete newItem.bloodPressure;
// //       }
// //       return newItem;
// //     });
// //   };

// //   const chartTrendData = processTrendDataForChart(trendData);

// //   // Get color based on metric value comparison to normal range
// //   const getMetricValueColor = (metricKey, value) => {
// //     if (metricKey === "bloodPressure") return "text-blue-600";
    
// //     const normalRange = metrics[metricKey].normalRange;
// //     const [min, max] = normalRange.split('-').map(Number);
    
// //     if (value < min) return "text-yellow-500";
// //     if (value > max) return "text-red-500";
// //     return "text-green-500";
// //   };

// //   if (loadingDashboard) {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
// //         <div className="flex flex-col items-center">
// //           <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
// //           <motion.p 
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             transition={{ delay: 0.5 }}
// //             className="mt-6 text-blue-600 font-medium text-lg"
// //           >
// //             Loading your health records...
// //           </motion.p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
// //         <div className="max-w-md mx-auto p-4 bg-red-50 rounded-lg shadow-md">
// //           <div className="flex items-center text-red-600">
// //             <FaExclamationTriangle className="mr-2" />
// //             <h3 className="font-medium">Error Loading Reports</h3>
// //           </div>
// //           <p className="mt-2 text-red-700">{error}</p>
// //           <button 
// //             onClick={() => window.location.reload()}
// //             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
// //           >
// //             Try Again
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
// //       <div className="container mx-auto px-4 py-8">
// //         {/* Dashboard Header */}
// //         <motion.div
// //           className="mb-8"
// //           initial={{ opacity: 0, y: -20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.5 }}
// //         >
// //           <div className="flex justify-between items-center">
// //             <div>
// //               <h1 className="text-4xl font-bold text-gray-800">Health Dashboard</h1>
// //               <p className="text-gray-600 mt-2 text-lg">
// //                 Welcome back, <span className="font-semibold">{userName}</span>
// //               </p>
// //             </div>
// //             <motion.div 
// //              whileHover={{ scale: 1.05 }}
// //              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow flex items-center transition-all"
// //              onClick={() => navigate('/upload')}
// //            >
// //              <FaUpload className="mr-2" />
// //              Upload Report
// //            </motion.div>
// //          </div>
         
// //          {/* Health Summary Card */}
// //          {healthSummary && (
// //            <motion.div 
// //              className="mt-8 p-6 bg-white rounded-xl shadow-lg"
// //              initial={{ opacity: 0, y: 20 }}
// //              animate={{ opacity: 1, y: 0 }}
// //              transition={{ delay: 0.2, duration: 0.5 }}
// //            >
// //              <div className="flex items-start justify-between">
// //                <div>
// //                  <h2 className="text-2xl font-bold mb-3 text-gray-800">Health Summary</h2>
// //                  <div className="flex items-center mb-4">
// //                    <div className={`rounded-full w-3 h-3 mr-2 ${
// //                      healthSummary.overallStatus === "Good" 
// //                        ? "bg-green-500" 
// //                        : healthSummary.overallStatus === "Needs Attention" 
// //                          ? "bg-yellow-500" 
// //                          : "bg-gray-400"
// //                    }`}></div>
// //                    <p className="text-gray-700">
// //                      Overall status: <span className="font-semibold">{healthSummary.overallStatus}</span>
// //                    </p>
// //                    <div className="mx-4 w-px h-5 bg-gray-300"></div>
// //                    <div className={`rounded-full w-3 h-3 mr-2 ${
// //                      healthSummary.riskLevel === "Low" 
// //                        ? "bg-green-500" 
// //                        : healthSummary.riskLevel === "Moderate" 
// //                          ? "bg-yellow-500" 
// //                          : healthSummary.riskLevel === "High" 
// //                            ? "bg-red-500" 
// //                            : "bg-gray-400"
// //                    }`}></div>
// //                    <p className="text-gray-700">
// //                      Risk level: <span className="font-semibold">{healthSummary.riskLevel}</span>
// //                    </p>
// //                  </div>
// //                </div>
// //                <button 
// //                  className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
// //                  onClick={() => setShowTrends(!showTrends)}
// //                >
// //                  <FaChartLine className="mr-1" />
// //                  {showTrends ? 'Hide Trends' : 'Show Trends'}
// //                </button>
// //              </div>
             
// //              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                {/* Improvements */}
               
               
// //                {/* Concerns */}
               
               
// //                {/* Recommendations */}
// //                <div className="bg-blue-50 p-4 rounded-lg">
// //                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
// //                    <FaInfoCircle className="mr-1 text-blue-600" />
// //                    Recommendations
// //                  </h3>
// //                  <ul className="space-y-1">
// //                    {healthSummary.recommendations.map((item, index) => (
// //                      <li key={`recommendation-${index}`} className="text-gray-700 flex items-start">
// //                        <span className="text-blue-600 mr-2">•</span>
// //                        {item}
// //                      </li>
// //                    ))}
// //                  </ul>
// //                </div>
// //              </div>
             
// //              {/* Trends Visualization */}
// //              <AnimatePresence>
// //                {showTrends && (
// //                  <motion.div 
// //                    className="mt-6 pt-6 border-t border-gray-200"
// //                    initial={{ opacity: 0, height: 0 }}
// //                    animate={{ opacity: 1, height: 'auto' }}
// //                    exit={{ opacity: 0, height: 0 }}
// //                    transition={{ duration: 0.3 }}
// //                  >
// //                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Health Trends</h3>
                   
// //                    <div className="mb-4">
// //                      <div className="flex space-x-2 mb-3">
// //                        {Object.entries(metrics).map(([key, metric]) => (
// //                          <button
// //                            key={key}
// //                            className={`px-3 py-1 rounded-full text-sm font-medium ${
// //                              selectedMetric === key 
// //                                ? 'bg-blue-600 text-white' 
// //                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
// //                            }`}
// //                            onClick={() => setSelectedMetric(key)}
// //                          >
// //                            {metric.label}
// //                          </button>
// //                        ))}
// //                      </div>
                     
// //                      <div className="h-72 bg-white p-4 rounded-lg shadow-sm">
// //                        <ResponsiveContainer width="100%" height="100%">
// //                          {selectedMetric === 'bloodPressure' ? (
// //                            <LineChart
// //                              data={chartTrendData}
// //                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// //                            >
// //                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
// //                              <XAxis dataKey="date" />
// //                              <YAxis />
// //                              <Tooltip />
// //                              <Legend />
// //                              <ReferenceLine y={120} stroke="#8884d8" strokeDasharray="3 3" label="Normal Systolic" />
// //                              <ReferenceLine y={80} stroke="#82ca9d" strokeDasharray="3 3" label="Normal Diastolic" />
// //                              <Line 
// //                                type="monotone" 
// //                                dataKey="systolic" 
// //                                name="Systolic" 
// //                                stroke="#8884d8" 
// //                                activeDot={{ r: 8 }} 
// //                              />
// //                              <Line 
// //                                type="monotone" 
// //                                dataKey="diastolic" 
// //                                name="Diastolic" 
// //                                stroke="#82ca9d" 
// //                              />
// //                            </LineChart>
// //                          ) : (
// //                            <LineChart
// //                              data={trendData}
// //                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
// //                            >
// //                              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
// //                              <XAxis dataKey="date" />
// //                              <YAxis />
// //                              <Tooltip />
// //                              <Legend />
// //                              {selectedMetric === 'glucose' && (
// //                                <ReferenceLine y={100} stroke="#ff7300" strokeDasharray="3 3" label="Normal Max" />
// //                              )}
// //                              {selectedMetric === 'cholesterol' && (
// //                                <ReferenceLine y={200} stroke="#ff7300" strokeDasharray="3 3" label="Normal Max" />
// //                              )}
// //                              <Line 
// //                                type="monotone" 
// //                                dataKey={selectedMetric} 
// //                                name={metrics[selectedMetric].label} 
// //                                stroke="#8884d8" 
// //                                activeDot={{ r: 8 }} 
// //                              />
// //                            </LineChart>
// //                          )}
// //                        </ResponsiveContainer>
// //                      </div>
// //                    </div>
// //                  </motion.div>
// //                )}
// //              </AnimatePresence>
// //            </motion.div>
// //          )}
// //        </motion.div>
       
// //        {/* Reports Section */}
// //        <div className="flex flex-col md:flex-row gap-6">
// //          {/* Reports List */}
// //          <motion.div 
// //            className="w-full md:w-1/3"
// //            initial={{ opacity: 0, x: -20 }}
// //            animate={{ opacity: 1, x: 0 }}
// //            transition={{ delay: 0.3, duration: 0.5 }}
// //          >
// //            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
// //              <div className="flex border-b border-gray-200">
// //                <button
// //                  className={`flex-1 px-4 py-3 text-center font-medium ${
// //                    activeTab === 'uploaded' 
// //                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
// //                      : 'text-gray-600 hover:bg-gray-50'
// //                  }`}
// //                  onClick={() => setActiveTab('uploaded')}
// //                >
// //                  <FaFilePdf className="inline-block mr-2" />
// //                  Uploaded Reports
// //                </button>
// //                <button
// //                  className={`flex-1 px-4 py-3 text-center font-medium ${
// //                    activeTab === 'generated' 
// //                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
// //                      : 'text-gray-600 hover:bg-gray-50'
// //                  }`}
// //                  onClick={() => setActiveTab('generated')}
// //                >
// //                  <FaChartLine className="inline-block mr-2" />
// //                  Insights
// //                </button>
// //              </div>
             
// //              <div className="max-h-[600px] overflow-y-auto">
// //                {activeTab === 'uploaded' ? (
// //                  uploadedReports.length === 0 ? (
// //                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
// //                      <FaFilePdf className="text-gray-400 text-5xl mb-4" />
// //                      <p className="text-gray-600 mb-4">You haven't uploaded any health reports yet</p>
// //                      <button
// //                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //                        onClick={() => navigate('/upload')}
// //                      >
// //                        Upload Your First Report
// //                      </button>
// //                    </div>
// //                  ) : (
// //                    <ul className="divide-y divide-gray-200">
// //                      {uploadedReports.map((report) => (
// //                        <motion.li
// //                          key={report.id}
// //                          whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.7)" }}
// //                          className={`p-4 cursor-pointer flex items-start ${
// //                            selectedReport?.id === report.id ? 'bg-blue-50' : ''
// //                          } ${
// //                            highlightedReport?.id === report.id ? 'bg-green-50' : ''
// //                          }`}
// //                          onClick={() => handleReportSelect(report)}
// //                        >
// //                          <div className="bg-blue-100 rounded-lg p-2 mr-3">
// //                            <FaFilePdf className="text-blue-600" />
// //                          </div>
// //                          <div className="flex-1 min-w-0">
// //                            <p className="font-medium text-gray-800 truncate">{report.name}</p>
// //                            <p className="text-sm text-gray-500">
// //                              {formatDate(report.uploadDate)}
// //                            </p>
// //                            <p className="text-xs text-gray-500 mt-1">{report.provider}</p>
// //                          </div>
// //                          {comparisonMode && selectedReport?.id !== report.id && (
// //                            <button
// //                              className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200"
// //                              onClick={(e) => {
// //                                e.stopPropagation();
// //                                handleReportToCompareSelect(report);
// //                              }}
// //                            >
// //                              Compare
// //                            </button>
// //                          )}
// //                        </motion.li>
// //                      ))}
// //                    </ul>
// //                  )
// //                ) : (
// //                  generatedReports.length === 0 ? (
// //                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
// //                      <FaChartLine className="text-gray-400 text-5xl mb-4" />
// //                      <p className="text-gray-600 mb-4">No health insights available yet</p>
// //                      <p className="text-sm text-gray-500">Upload more reports to generate insights</p>
// //                    </div>
// //                  ) : (
// //                    <ul className="divide-y divide-gray-200">
// //                      {generatedReports.map((report) => (
// //                        <motion.li
// //                          key={report.id}
// //                          whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.7)" }}
// //                          className={`p-4 cursor-pointer flex items-start ${
// //                            selectedReport?.id === report.id ? 'bg-blue-50' : ''
// //                          }`}
// //                          onClick={() => handleReportSelect(report)}
// //                        >
// //                          <div className="bg-purple-100 rounded-lg p-2 mr-3">
// //                            <FaChartLine className="text-purple-600" />
// //                          </div>
// //                          <div className="flex-1 min-w-0">
// //                            <p className="font-medium text-gray-800 truncate">{report.name}</p>
// //                            <p className="text-sm text-gray-500">
// //                              {formatDate(report.generationDate)}
// //                            </p>
// //                          </div>
// //                        </motion.li>
// //                      ))}
// //                    </ul>
// //                  )
// //                )}
// //              </div>
// //            </div>
// //          </motion.div>
         
// //          {/* Report Details */}
// //          <motion.div 
// //            className="w-full md:w-2/3"
// //            initial={{ opacity: 0, x: 20 }}
// //            animate={{ opacity: 1, x: 0 }}
// //            transition={{ delay: 0.4, duration: 0.5 }}
// //          >
// //            {selectedReport ? (
// //              <div className="bg-white rounded-xl shadow-lg p-6">
// //                <div className="flex justify-between items-start mb-4">
// //                  <div>
// //                    <h2 className="text-2xl font-bold text-gray-800">{selectedReport.name}</h2>
// //                    <p className="text-gray-600">
// //                      {selectedReport.uploadDate 
// //                        ? `Uploaded on ${formatDate(selectedReport.uploadDate)}` 
// //                        : `Generated on ${formatDate(selectedReport.generationDate)}`
// //                      }
// //                    </p>
// //                  </div>
// //                  <div className="flex">
// //                    <button
// //                      className={`px-3 py-1 rounded-lg flex items-center text-sm font-medium mr-2 ${
// //                        comparisonMode 
// //                          ? 'bg-green-600 text-white' 
// //                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
// //                      }`}
// //                      onClick={toggleComparisonMode}
// //                      disabled={!selectedReport.summary}
// //                    >
// //                      <FaExchangeAlt className="mr-1" />
// //                      {comparisonMode ? 'Exit Comparison' : 'Compare'}
// //                    </button>
// //                    {selectedReport.fileType === 'pdf' && (
// //                      <button
// //                        className="px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center text-sm font-medium hover:bg-blue-700"
// //                      >
// //                        <FaDownload className="mr-1" />
// //                        Download
// //                      </button>
// //                    )}
// //                  </div>
// //                </div>
               
// //                {comparisonMode ? (
// //                  <div className="border rounded-lg p-4 bg-gray-50 mb-6">
// //                    <h3 className="font-medium text-gray-800 mb-3">Comparison Mode</h3>
                   
// //                    {reportToCompare ? (
// //                      <>
// //                        <div className="flex items-center justify-between mb-4">
// //                          <div className="flex-1">
// //                            <span className="text-sm text-gray-600">Report 1 (Selected):</span>
// //                            <p className="font-medium text-gray-800">{selectedReport.name}</p>
// //                          </div>
// //                          <FaExchangeAlt className="mx-2 text-gray-500" />
// //                          <div className="flex-1">
// //                            <span className="text-sm text-gray-600">Report 2 (Comparing):</span>
// //                            <p className="font-medium text-gray-800">{reportToCompare.name}</p>
// //                          </div>
// //                        </div>
                       
// //                        <button
// //                          className="w-full py-2 bg-green-600 text-white rounded-lg flex items-center justify-center font-medium hover:bg-green-700 mb-4"
// //                          onClick={handleCompare}
// //                        >
// //                          <FaChartLine className="mr-2" />
// //                          Generate Comparison
// //                        </button>
                       
// //                        {comparisonData && (
// //                          <div className="mt-6">
// //                            <h3 className="font-medium text-gray-800 mb-4">Comparison Results</h3>
                           
// //                            <div className="space-y-4">
// //                              {Object.entries(metrics).map(([key, metric]) => {
// //                                if (!comparisonData.values[key]) return null;
                               
// //                                if (key === 'bloodPressure') {
// //                                  const diff = comparisonData.differences[key];
// //                                  const change = comparisonData.percentChanges[key];
                                 
// //                                  return (
// //                                    <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
// //                                      <div className="flex justify-between mb-2">
// //                                        <h4 className="font-medium text-gray-800">{metric.label}</h4>
// //                                        <span className="text-gray-500 text-sm">{metric.unit}</span>
// //                                      </div>
                                     
// //                                      <div className="flex justify-between mb-2">
// //                                        <div>
// //                                          <span className="text-sm text-gray-600">
// //                                            {comparisonData.dates[0]}:
// //                                          </span>
// //                                          <span className="ml-2 font-medium">
// //                                            {comparisonData.values[key][0]}
// //                                          </span>
// //                                        </div>
                                       
// //                                        <div>
// //                                          <span className="text-sm text-gray-600">
// //                                            {comparisonData.dates[1]}:
// //                                          </span>
// //                                          <span className="ml-2 font-medium">
// //                                            {comparisonData.values[key][1]}
// //                                          </span>
// //                                        </div>
// //                                      </div>
                                     
// //                                      <div className="mt-2 pt-2 border-t border-gray-200">
// //                                        <div className="flex justify-between">
// //                                          <div>
// //                                            <span className="text-sm text-gray-600">
// //                                              Systolic:
// //                                            </span>
// //                                            <span className={`ml-1 font-medium ${
// //                                              diff.systolic > 0
// //                                                ? 'text-red-600'
// //                                                : diff.systolic < 0
// //                                                  ? 'text-green-600'
// //                                                  : 'text-gray-800'
// //                                            }`}>
// //                                              {diff.systolic > 0 ? '+' : ''}{diff.systolic} mmHg 
// //                                              ({change.systolic > 0 ? '+' : ''}{change.systolic}%)
// //                                            </span>
// //                                          </div>
                                         
// //                                          <div>
// //                                            <span className="text-sm text-gray-600">
// //                                              Diastolic:
// //                                            </span>
// //                                            <span className={`ml-1 font-medium ${
// //                                              diff.diastolic > 0
// //                                                ? 'text-red-600'
// //                                                : diff.diastolic < 0
// //                                                  ? 'text-green-600'
// //                                                  : 'text-gray-800'
// //                                            }`}>
// //                                              {diff.diastolic > 0 ? '+' : ''}{diff.diastolic} mmHg
// //                                              ({change.diastolic > 0 ? '+' : ''}{change.diastolic}%)
// //                                            </span>
// //                                          </div>
// //                                        </div>
// //                                      </div>
// //                                    </div>
// //                                  );
// //                                }
                               
// //                                return (
// //                                  <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
// //                                    <div className="flex justify-between mb-2">
// //                                      <h4 className="font-medium text-gray-800">{metric.label}</h4>
// //                                      <span className="text-gray-500 text-sm">{metric.unit}</span>
// //                                    </div>
                                   
// //                                    <div className="flex justify-between mb-2">
// //                                      <div>
// //                                        <span className="text-sm text-gray-600">
// //                                          {comparisonData.dates[0]}:
// //                                        </span>
// //                                        <span className={`ml-2 font-medium ${
// //                                          getMetricValueColor(key, comparisonData.values[key][0])
// //                                        }`}>
// //                                          {comparisonData.values[key][0]}
// //                                        </span>
// //                                      </div>
                                     
// //                                      <div>
// //                                        <span className="text-sm text-gray-600">
// //                                          {comparisonData.dates[1]}:
// //                                        </span>
// //                                        <span className={`ml-2 font-medium ${
// //                                          getMetricValueColor(key, comparisonData.values[key][1])
// //                                        }`}>
// //                                          {comparisonData.values[key][1]}
// //                                        </span>
// //                                      </div>
// //                                    </div>
                                   
// //                                    <div className="mt-2 pt-2 border-t border-gray-200">
// //                                      <span className="text-sm text-gray-600">
// //                                        Change:
// //                                      </span>
// //                                      <span className={`ml-1 font-medium ${
// //                                        parseFloat(comparisonData.differences[key]) > 0
// //                                          ? 'text-red-600'
// //                                          : parseFloat(comparisonData.differences[key]) < 0
// //                                            ? 'text-green-600'
// //                                            : 'text-gray-800'
// //                                      }`}>
// //                                        {parseFloat(comparisonData.differences[key]) > 0 ? '+' : ''}
// //                                        {comparisonData.differences[key]} {metric.unit} 
// //                                        ({comparisonData.percentChanges[key] > 0 ? '+' : ''}{comparisonData.percentChanges[key]}%)
// //                                      </span>
// //                                    </div>
// //                                  </div>
// //                                );
// //                              })}
// //                            </div>
// //                          </div>
// //                        )}
// //                      </>
// //                    ) : (
// //                      <div className="text-center py-4">
// //                        <p className="text-gray-600 mb-2">Select another report to compare with</p>
// //                        <FaArrowLeft className="inline-block text-gray-500" />
// //                      </div>
// //                    )}
// //                  </div>
// //                ) : selectedReport.uploadDate ? (
// //                  // For uploaded reports
// //                  <div>
// //                    {selectedReport.summary ? (
// //                      <div className="mb-6">
// //                        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
// //                          <GiHealthNormal className="mr-2 text-blue-600" />
// //                          Health Metrics
// //                        </h3>
                       
// //                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //                          {Object.entries(metrics).map(([key, metric]) => (
// //                            <div key={key} className="bg-gray-50 p-4 rounded-lg">
// //                              <div className="flex justify-between mb-1">
// //                                <h4 className="font-medium text-gray-700">{metric.label}</h4>
// //                                <span className="text-gray-500 text-sm">{metric.unit}</span>
// //                              </div>
// //                              {selectedReport.summary[key] ? (
// //                                <>
// //                                  <div className={`text-xl font-bold ${
// //                                    getMetricValueColor(key, selectedReport.summary[key])
// //                                  }`}>
// //                                    {selectedReport.summary[key]}
// //                                  </div>
// //                                  <div className="text-xs text-gray-500 mt-1">
// //                                    Normal range: {metric.normalRange}
// //                                  </div>
// //                                </>
// //                              ) : (
// //                                <div className="text-gray-500 italic">Not available</div>
// //                              )}
// //                            </div>
// //                          ))}
// //                        </div>
// //                      </div>
// //                    ) : null}
                   
// //                    <div>
// //                      <h3 className="font-medium text-gray-800 mb-3 flex items-center">
// //                        <FaFilePdf className="mr-2 text-red-600" />
// //                        Report Preview
// //                      </h3>
                     
// //                      <div className="border border-gray-300 rounded-lg bg-gray-100 p-4 flex justify-center">
// //                        <div className="bg-white shadow-lg max-w-md p-4 rounded border border-gray-200">
// //                          {selectedReport.parameters_text ? (
// //                            <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800">
// //                              {selectedReport.parameters_text}
// //                            </pre>
// //                          ) : (
// //                            <div className="bg-gray-200 rounded w-full h-80 flex items-center justify-center">
// //                              <span className="text-gray-500">PDF preview not available</span>
// //                            </div>
// //                          )}
// //                        </div>
// //                      </div>
// //                    </div>
// //                  </div>
// //                ) : (
// //                  // For generated reports
// //                  <div>
// //                    <div className="p-6 bg-purple-50 rounded-lg mb-6">
// //                      <h3 className="font-medium text-purple-800 mb-2 flex items-center">
// //                        <FaChartLine className="mr-2 text-purple-700" />
// //                        Health Insights
// //                      </h3>
// //                      <p className="text-gray-700">{selectedReport.summaryText}</p>
// //                    </div>
                   
// //                    <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
// //                      <div className="text-center">
// //                        <FaFilePdf className="text-red-500 text-4xl mx-auto mb-3" />
// //                        <p className="text-gray-700 mb-3">Insights Report</p>
// //                        <button 
// //                          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center mx-auto hover:bg-blue-700"
// //                        >
// //                          <FaDownload className="mr-2" />
// //                          Download Full Report
// //                        </button>
// //                      </div>
// //                    </div>
// //                  </div>
// //                )}
// //              </div>
// //            ) : (
// //              <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center">
// //                <div className="bg-blue-100 rounded-full p-6 mb-4">
// //                  <FaFilePdf className="text-blue-600 text-4xl" />
// //                </div>
// //                <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Report</h3>
// //                <p className="text-gray-600 max-w-md">
// //                  View your health information by selecting a report from the list on the left.
// //                </p>
// //              </div>
// //            )}
// //          </motion.div>
// //        </div>
// //      </div>
// //    </div>
// //  );
// // };

// // export default UserDashboard;


// import React, { useState, useEffect } from "react";
// import { 
//   FaFilePdf, 
//   FaChartLine, 
//   FaCalendarAlt, 
//   FaDownload, 
//   FaExchangeAlt, 
//   FaHistory, 
//   FaArrowLeft, 
//   FaArrowRight,
//   FaInfoCircle,
//   FaExclamationTriangle
// } from "react-icons/fa";
// import { GiHealthNormal } from "react-icons/gi";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   BarChart, 
//   Bar, 
//   LineChart, 
//   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer,
//   ReferenceLine
// } from "recharts";
// import { FaUpload, FaArrowUp } from 'react-icons/fa';
// import { useNavigate } from "react-router-dom";
// import { db, auth } from "../../firebase/firebaseConfig";
// import { collection, query, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// const UserDashboard = () => {
//   const navigate = useNavigate();
  
//   // User state
//   const [userName, setUserName] = useState("User");
//   const [loadingDashboard, setLoadingDashboard] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Reports state
//   const [uploadedReports, setUploadedReports] = useState([]);
//   const [generatedReports, setGeneratedReports] = useState([]);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
  
//   // Comparison state
//   const [comparisonMode, setComparisonMode] = useState(false);
//   const [reportToCompare, setReportToCompare] = useState(null);
//   const [selectedMetric, setSelectedMetric] = useState("glucose");
//   const [comparisonData, setComparisonData] = useState(null);
//   const [isComparing, setIsComparing] = useState(false);
  
//   // UI state
//   const [activeTab, setActiveTab] = useState("uploaded");
//   const [showTrends, setShowTrends] = useState(false);
//   const [healthSummary, setHealthSummary] = useState(null);
//   const [highlightedReport, setHighlightedReport] = useState(null);
  
//   // Health metrics definitions
//   const metrics = {
//     glucose: { label: "Blood Glucose", unit: "mg/dL", normalRange: "70-100", paramName: "Blood Glucose" },
//     cholesterol: { label: "Cholesterol", unit: "mg/dL", normalRange: "125-200", paramName: "Total Cholesterol" },
//     bloodPressure: { label: "Blood Pressure", unit: "mmHg", normalRange: "120/80", paramName: "Blood Pressure" },
//     hemoglobin: { label: "Hemoglobin", unit: "g/dL", normalRange: "12-16", paramName: "Hemoglobin" },
//     wbc: { label: "White Blood Cells", unit: "K/μL", normalRange: "4.5-11.0", paramName: "WBC" }
//   };
  
//   // Trend data state
//   const [trendData, setTrendData] = useState([]);

//   // Load data from Firebase (unchanged from original)
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         navigate("/login");
//         return;
//       }

//       try {
//         setUserName(user.displayName || "User");
        
//         // Get uploaded reports
//         const reportsRef = collection(db, "users", user.uid, "uploaded_reports");
//         const q = query(reportsRef, orderBy("timestamp", "desc"));
//         const querySnapshot = await getDocs(q);
        
//         const reportsData = querySnapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             name: data.filename || "Unnamed Report",
//             uploadDate: data.timestamp?.toDate().toISOString(),
//             provider: data.provider || "Unknown Provider",
//             thumbnailUrl: "/api/placeholder/150/200",
//             fileType: "pdf",
//             fileSize: data.fileSize || "Unknown size",
//             pdf_url: data.pdf_url || "",
//             summary: extractHealthMetrics(data.parameters_text),
//             parameters_text: data.parameters_text || ""
//           };
//         });
        
//         setUploadedReports(reportsData);
        
//         // Generate insights reports from uploaded reports
//         const insightsReports = generateInsightsReports(reportsData);
//         setGeneratedReports(insightsReports);
        
//         // Generate trend data from reports
//         const trends = generateTrendData(reportsData);
//         setTrendData(trends);
        
//         // Set health summary
//         const summary = generateHealthSummary(reportsData);
//         setHealthSummary(summary);
        
//       } catch (err) {
//         console.error("Firestore error:", err);
//         setError(err.code === "permission-denied" 
//           ? "You don't have permission to view these reports"
//           : "Failed to load reports");
//       } finally {
//         setLoadingDashboard(false);
//       }
//     });

//     return unsubscribe;
//   }, [navigate]);

//   // Extract health metrics from parameters text (unchanged)
//   const extractHealthMetrics = (parametersText) => {
//     if (!parametersText) return null;
    
//     const metrics = {};
//     const lines = parametersText.split('\n');
    
//     // Map each metric to its key
//     const metricMapping = {
//       "Blood Glucose": "glucose",
//       "Glucose": "glucose",
//       "Total Cholesterol": "cholesterol",
//       "Cholesterol": "cholesterol",
//       "Blood Pressure": "bloodPressure",
//       "Hemoglobin": "hemoglobin",
//       "WBC": "wbc",
//       "White Blood Cells": "wbc",
//       "White Blood Cell Count": "wbc"
//     };
    
//     lines.forEach(line => {
//       if (line.includes('|')) {
//         const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
//         if (cells.length >= 2) {
//           const testName = cells[0];
//           const value = cells[1];
          
//           // Check for each metric in our mapping
//           Object.entries(metricMapping).forEach(([name, key]) => {
//             if (testName.includes(name)) {
//               if (key === "bloodPressure") {
//                 // Handle blood pressure special case (format: 120/80)
//                 const match = value.match(/(\d+)[\/\s]*(\d+)/);
//                 if (match) {
//                   metrics[key] = `${match[1]}/${match[2]}`;
//                 }
//               } else {
//                 // Handle numeric values
//                 const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
//                 if (!isNaN(numValue)) {
//                   metrics[key] = numValue;
//                 }
//               }
//             }
//           });
//         }
//       }
//     });
    
//     return metrics;
//   };

//   // Generate insights reports (unchanged)
//   const generateInsightsReports = (reports) => {
//     if (reports.length === 0) return [];
    
//     // Sort reports by date
//     const sortedReports = [...reports].sort((a, b) => 
//       new Date(b.uploadDate) - new Date(a.uploadDate)
//     );
    
//     const insightsReports = [];
    
//     // Quarterly Health Trends
//     if (sortedReports.length >= 2) {
//       insightsReports.push({
//         id: "gen1",
//         name: "Quarterly Health Trends",
//         generationDate: new Date().toISOString(),
//         fileType: "pdf",
//         fileSize: "1.4 MB",
//         summaryText: generateQuarterlyInsight(sortedReports)
//       });
//     }
    
//     // Annual Health Summary
//     if (sortedReports.length >= 3) {
//       insightsReports.push({
//         id: "gen2",
//         name: "Annual Health Summary",
//         generationDate: new Date().toISOString(),
//         fileType: "pdf",
//         fileSize: "2.1 MB",
//         summaryText: generateAnnualInsight(sortedReports)
//       });
//     }
    
//     // Health Analysis Report
//     if (sortedReports.length >= 1) {
//       insightsReports.push({
//         id: "gen3",
//         name: "Health Analysis Report",
//         generationDate: new Date().toISOString(),
//         fileType: "pdf",
//         fileSize: "3.5 MB",
//         summaryText: generateHealthAnalysis(sortedReports[0])
//       });
//     }
    
//     return insightsReports;
//   };

//   // Generate quarterly health insight text (unchanged)
//   const generateQuarterlyInsight = (reports) => {
//     if (reports.length < 2) return "Not enough data for quarterly analysis.";
    
//     const current = reports[0].summary;
//     const previous = reports[1].summary;
    
//     if (!current || !previous) return "Insufficient data for comparison.";
    
//     const glucoseChange = ((current.glucose - previous.glucose) / previous.glucose * 100).toFixed(1);
//     const cholesterolChange = ((current.cholesterol - previous.cholesterol) / previous.cholesterol * 100).toFixed(1);
    
//     let insight = "Quarterly health trend analysis: ";
    
//     if (Math.abs(parseFloat(glucoseChange)) > 5) {
//       insight += `Blood glucose has ${parseFloat(glucoseChange) > 0 ? 'increased' : 'decreased'} by ${Math.abs(parseFloat(glucoseChange))}%. `;
//     } else {
//       insight += "Blood glucose levels remain stable. ";
//     }
    
//     if (Math.abs(parseFloat(cholesterolChange)) > 5) {
//       insight += `Cholesterol has ${parseFloat(cholesterolChange) > 0 ? 'increased' : 'decreased'} by ${Math.abs(parseFloat(cholesterolChange))}%. `;
//     } else {
//       insight += "Cholesterol levels remain consistent. ";
//     }
    
//     insight += "Continue monitoring and maintaining current health regimen.";
    
//     return insight;
//   };

//   // Generate annual health insight text (unchanged)
//   const generateAnnualInsight = (reports) => {
//     if (reports.length < 3) return "Not enough data for annual analysis.";
    
//     const newest = reports[0].summary;
//     const oldest = reports[reports.length - 1].summary;
    
//     if (!newest || !oldest) return "Insufficient data for year-over-year comparison.";
    
//     const glucoseChange = ((newest.glucose - oldest.glucose) / oldest.glucose * 100).toFixed(1);
//     const cholesterolChange = ((newest.cholesterol - oldest.cholesterol) / oldest.cholesterol * 100).toFixed(1);
    
//     let insight = "Annual health summary: ";
    
//     if (parseFloat(glucoseChange) < 0 && parseFloat(cholesterolChange) < 0) {
//       insight += "Excellent progress! Both glucose and cholesterol have decreased over the past year. ";
//     } else if (parseFloat(glucoseChange) < 0 || parseFloat(cholesterolChange) < 0) {
//       insight += "Good progress in some areas. ";
//       if (parseFloat(glucoseChange) < 0) {
//         insight += `Glucose levels have improved by ${Math.abs(parseFloat(glucoseChange))}%. `;
//       } else {
//         insight += `Cholesterol levels have improved by ${Math.abs(parseFloat(cholesterolChange))}%. `;
//       }
//     } else {
//       insight += "Year-over-year metrics show some areas requiring attention. ";
//     }
    
//     insight += "Recommend discussing these trends with your healthcare provider during your next visit.";
    
//     return insight;
//   };

//   // Generate health analysis text for a single report (unchanged)
//   const generateHealthAnalysis = (report) => {
//     if (!report || !report.summary) return "Insufficient data for analysis.";
    
//     const metrics = report.summary;
//     let analysis = "";
    
//     // Glucose analysis
//     if (metrics.glucose < 70) {
//       analysis += "Blood glucose is below normal range. Recommend monitoring for symptoms of hypoglycemia. ";
//     } else if (metrics.glucose > 100) {
//       analysis += "Blood glucose is elevated. Consider dietary adjustments and follow up testing. ";
//     } else {
//       analysis += "Blood glucose is within healthy range. ";
//     }
    
//     // Cholesterol analysis
//     if (metrics.cholesterol < 125) {
//       analysis += "Cholesterol is below normal range. Discuss with healthcare provider. ";
//     } else if (metrics.cholesterol > 200) {
//       analysis += "Cholesterol is elevated. Consider diet and lifestyle adjustments. ";
//     } else {
//       analysis += "Cholesterol is within healthy range. ";
//     }
    
//     // Blood pressure analysis
//     const bpParts = (metrics.bloodPressure || '').split('/');

//     if (bpParts.length === 2) {
//       const systolic = parseInt(bpParts[0]);
//       const diastolic = parseInt(bpParts[1]);
      
//       if (systolic > 130 || diastolic > 80) {
//         analysis += "Blood pressure is elevated. Regular monitoring recommended. ";
//       } else if (systolic < 90 || diastolic < 60) {
//         analysis += "Blood pressure is low. Discuss with healthcare provider if symptomatic. ";
//       } else {
//         analysis += "Blood pressure is within optimal range. ";
//       }
//     }
    
//     return analysis;
//   };

//   // Generate trend data from reports (unchanged)
//   // Generate trend data from reports
// const generateTrendData = (reports) => {
//   if (reports.length === 0) return [];
  
//   // Filter out reports without summary data
//   const reportsWithSummary = reports.filter(report => report.summary && 
//     Object.keys(report.summary).length > 0);
  
//   if (reportsWithSummary.length < 2) {
//     // Generate some sample fluctuating data if there's not enough real data
//     const sampleData = [];
//     const baseDate = new Date();
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
//     for (let i = 0; i < 12; i++) {
//       const date = new Date(baseDate);
//       date.setMonth(baseDate.getMonth() - i);
      
//       sampleData.unshift({
//         date: monthNames[date.getMonth()],
//         fullDate: date.toISOString(),
//         glucose: 85 + Math.sin(i * 0.9) * 15,
//         cholesterol: 170 + Math.cos(i * 0.7) * 20,
//         bloodPressure: `${120 + Math.round(Math.sin(i * 0.8) * 10)}/${80 + Math.round(Math.cos(i * 0.8) * 5)}`, // Fixed this line
//         hemoglobin: 14 + Math.sin(i * 0.5) * 1.5,
//         wbc: 7 + Math.cos(i * 0.6) * 1.5
//       });
//     }
    
//     return sampleData;
//   }
  
//   // Sort reports by date, oldest first
//   const sortedReports = [...reportsWithSummary].sort((a, b) => 
//     new Date(a.uploadDate) - new Date(b.uploadDate)
//   );
//     // Ensure we have a diverse range of dates
//     // If we have only a few reports, create some interpolated data points
//     if (sortedReports.length < 4) {
//       const result = [];
//       const oldestDate = new Date(sortedReports[0].uploadDate);
//       const newestDate = new Date(sortedReports[sortedReports.length - 1].uploadDate);
//       const monthsDiff = (newestDate.getFullYear() - oldestDate.getFullYear()) * 12 + 
//                          (newestDate.getMonth() - oldestDate.getMonth());
      
//       // If we have reports spanning multiple months, interpolate the data
//       if (monthsDiff > 1) {
//         const reportsByMonth = {};
//         const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
//         // Map existing reports to months
//         sortedReports.forEach(report => {
//           const date = new Date(report.uploadDate);
//           const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
//           reportsByMonth[monthKey] = report;
//         });
        
//         // Create a complete series with interpolated data for missing months
//         for (let i = 0; i <= monthsDiff; i++) {
//           const currentDate = new Date(oldestDate);
//           currentDate.setMonth(oldestDate.getMonth() + i);
//           const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
          
//           if (reportsByMonth[monthKey]) {
//             // We have real data for this month
//             const date = new Date(reportsByMonth[monthKey].uploadDate);
//             result.push({
//               date: monthNames[date.getMonth()],
//               fullDate: reportsByMonth[monthKey].uploadDate,
//               ...reportsByMonth[monthKey].summary
//             });
//           } else {
//             // Interpolate data for this month
//             const prevIndex = Math.max(0, result.length - 1);
//             const nextReportIndex = sortedReports.findIndex(report => 
//               new Date(report.uploadDate) > currentDate);
//             const nextIndex = nextReportIndex !== -1 ? nextReportIndex : sortedReports.length - 1;
            
//             // Skip interpolation if we don't have enough data yet
//             if (result.length === 0) continue;
            
//             const prevData = result[prevIndex];
//             const nextData = {
//               ...sortedReports[nextIndex].summary
//             };
            
//             // Calculate progress between previous and next known points
//             const prevDate = new Date(prevData.fullDate);
//             const nextDate = new Date(sortedReports[nextIndex].uploadDate);
//             const totalDiff = nextDate - prevDate;
//             const currentDiff = currentDate - prevDate;
//             const progress = totalDiff > 0 ? currentDiff / totalDiff : 0;
            
//             // Interpolate each metric
//             const interpolatedData = {
//               date: monthNames[currentDate.getMonth()],
//               fullDate: currentDate.toISOString()
//             };
            
//             // Interpolate numeric metrics
//             ['glucose', 'cholesterol', 'hemoglobin', 'wbc'].forEach(metric => {
//               if (prevData[metric] !== undefined && nextData[metric] !== undefined) {
//                 interpolatedData[metric] = prevData[metric] + 
//                   (nextData[metric] - prevData[metric]) * progress;
//               }
//             });
            
//             // Handle blood pressure specially
//             if (prevData.bloodPressure && nextData.bloodPressure) {
//               const [prevSys, prevDia] = prevData.bloodPressure.split('/').map(Number);
//               const [nextSys, nextDia] = nextData.bloodPressure.split('/').map(Number);
              
//               if (!isNaN(prevSys) && !isNaN(prevDia) && !isNaN(nextSys) && !isNaN(nextDia)) {
//                 const interpolatedSys = Math.round(prevSys + (nextSys - prevSys) * progress);
//                 const interpolatedDia = Math.round(prevDia + (nextDia - prevDia) * progress);
//                 interpolatedData.bloodPressure = `${interpolatedSys}/${interpolatedDia}`;
//               }
//             }
            
//             result.push(interpolatedData);
//           }
//         }
        
//         return result;
//       }
//     }
    
//     // If we just have a few reports close together, return those as they are
//     return sortedReports.map(report => {
//       const date = new Date(report.uploadDate);
//       const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
//       return {
//         date: monthNames[date.getMonth()],
//         fullDate: date.toISOString(),
//         ...report.summary
//       };
//     });
//   };

//   // Generate health summary (unchanged)
//   const generateHealthSummary = (reports) => {
//     if (reports.length === 0) return null;
    
//     // Filter reports that have summary data
//     const reportsWithSummary = reports.filter(report => report.summary);
    
//     if (reportsWithSummary.length === 0) {
//       return {
//         overallStatus: "Unknown",
//         riskLevel: "Unknown",
//         improvements: [],
//         concerns: ["Insufficient data for analysis"],
//         recommendations: ["Upload more health reports for comprehensive analysis"]
//       };
//     }
    
//     // Sort reports by date
//     const sortedReports = [...reportsWithSummary].sort((a, b) => 
//       new Date(b.uploadDate) - new Date(a.uploadDate)
//     );
    
//     const newestReport = sortedReports[0];
//     const oldestReport = sortedReports[sortedReports.length - 1];
    
//     const newest = newestReport.summary;
//     const oldest = oldestReport.summary;
    
//     const improvements = [];
//     const concerns = [];
//     let overallStatus = "Good";
//     let riskLevel = "Low";
    
//     // Check cholesterol
//     if (newest.cholesterol && oldest.cholesterol) {
//       if (newest.cholesterol < oldest.cholesterol) {
//         const reduction = ((oldest.cholesterol - newest.cholesterol) / oldest.cholesterol * 100).toFixed(0);
//         improvements.push(`Cholesterol reduced by ${reduction}%`);
//       } else if (newest.cholesterol > 200) {
//         concerns.push("Elevated cholesterol levels");
//         overallStatus = "Needs Attention";
//         riskLevel = "Moderate";
//       }
//     }
    
//     // Check glucose
//     if (newest.glucose && oldest.glucose) {
//       if (newest.glucose < oldest.glucose && oldest.glucose > 100) {
//         const reduction = ((oldest.glucose - newest.glucose) / oldest.glucose * 100).toFixed(0);
//         improvements.push(`Blood glucose improved by ${reduction}%`);
//       } else if (newest.glucose > 100) {
//         concerns.push("Elevated blood glucose levels");
//         overallStatus = "Needs Attention";
//         riskLevel = "Moderate";
//       }
//     }
    
//     // Check blood pressure
//     if (newest.bloodPressure && oldest.bloodPressure) {
//       const newestBP = newest.bloodPressure.split('/');
//       const oldestBP = oldest.bloodPressure.split('/');
      
//       if (newestBP.length === 2 && oldestBP.length === 2) {
//         const newestSystolic = parseInt(newestBP[0]);
//         const oldestSystolic = parseInt(oldestBP[0]);
        
//         if (newestSystolic < oldestSystolic && oldestSystolic > 120) {
//           improvements.push("Blood pressure normalized");
//         } else if (newestSystolic > 130) {
//           concerns.push("Elevated blood pressure");
//           overallStatus = "Needs Attention";
//           riskLevel = "Moderate";
//         }
//       }
//     }
    
//     // Generate recommendations
//     const recommendations = [
//       "Maintain regular health check-ups",
//       "Stay hydrated and maintain balanced nutrition"
//     ];
    
//     if (concerns.length > 0) {
//       recommendations.push("Discuss these concerns with your healthcare provider");
//     }
    
//     if (sortedReports.length < 3) {
//       recommendations.push("Upload more health reports for better trend analysis");
//     }
    
//     return {
//       overallStatus,
//       riskLevel,
//       improvements,
//       concerns,
//       recommendations
//     };
//   };

//   // Format date for display (unchanged)
//   const formatDate = (date) => {
//     if (!date) return "Unknown date";
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Handle report selection with comparison mode reset
//   const handleReportSelect = (report) => {
//     setSelectedReport(report);
//     setHighlightedReport(null);
//     if (comparisonMode) {
//       setComparisonMode(false);
//       setComparisonData(null);
//       setReportToCompare(null);
//     }
//   };

//   // Handle report comparison selection
//   const handleReportToCompareSelect = (report) => {
//     setReportToCompare(report);
//     setHighlightedReport(report);
//     setError(null); // Clear any previous errors
//   };

//   // Toggle comparison mode with proper state reset
//   const toggleComparisonMode = () => {
//     if (!selectedReport?.summary) {
//       setError("Selected report doesn't have health metrics to compare");
//       return;
//     }
    
//     setComparisonMode(!comparisonMode);
//     setComparisonData(null);
//     setReportToCompare(null);
//     setError(null);
//   };

//   // Generate comparison data with proper error handling
//   const handleCompare = () => {
//     if (!selectedReport || !reportToCompare) {
//       setError("Please select two reports to compare");
//       return;
//     }

//     if (!selectedReport.summary || !reportToCompare.summary) {
//       setError("One or both reports don't have health metrics to compare");
//       return;
//     }

//     setIsComparing(true);
//     setError(null);

//     try {
//       // Generate comparison data between the two reports
//       const generatedData = {
//         reports: [selectedReport, reportToCompare],
//         dates: [
//           formatDate(selectedReport.uploadDate || selectedReport.generationDate), 
//           formatDate(reportToCompare.uploadDate || reportToCompare.generationDate)
//         ],
//         values: {},
//         differences: {},
//         percentChanges: {}
//       };

//       // Only compare metrics that exist in both reports
//       Object.keys(metrics).forEach(key => {
//         if (selectedReport.summary[key] !== undefined && reportToCompare.summary[key] !== undefined) {
//           if (key === 'bloodPressure') {
//             const bp1 = selectedReport.summary[key] || "0/0";
//             const bp2 = reportToCompare.summary[key] || "0/0";
            
//             const [sys1, dia1] = bp1.split('/').map(Number);
//             const [sys2, dia2] = bp2.split('/').map(Number);
            
//             if (!isNaN(sys1) && !isNaN(dia1) && !isNaN(sys2) && !isNaN(dia2)) {
//               generatedData.values[key] = [bp1, bp2];
//               generatedData.differences[key] = {
//                 systolic: sys1 - sys2,
//                 diastolic: dia1 - dia2
//               };
//               generatedData.percentChanges[key] = {
//                 systolic: ((sys1 - sys2) / sys2 * 100).toFixed(1),
//                 diastolic: ((dia1 - dia2) / dia2 * 100).toFixed(1)
//               };
//             }
//           } else {
//             const val1 = parseFloat(selectedReport.summary[key]);
//             const val2 = parseFloat(reportToCompare.summary[key]);
            
//             if (!isNaN(val1) && !isNaN(val2)) {
//               generatedData.values[key] = [val1, val2];
//               generatedData.differences[key] = (val1 - val2).toFixed(1);
//               generatedData.percentChanges[key] = ((val1 - val2) / val2 * 100).toFixed(1);
//             }
//           }
//         }
//       });

//       // Check if we actually have any comparable metrics
//       if (Object.keys(generatedData.values).length === 0) {
//         setError("No comparable health metrics found between these reports");
//         return;
//       }

//       setComparisonData(generatedData);
//     } catch (err) {
//       console.error("Comparison error:", err);
//       setError("Failed to generate comparison. Please try different reports.");
//     } finally {
//       setIsComparing(false);
//     }
//   };

//   // Convert blood pressure for charting (unchanged)
//   const processTrendDataForChart = (data) => {
//     return data.map(item => {
//       const newItem = {...item};
//       if (typeof item.bloodPressure === 'string' && item.bloodPressure.includes('/')) {
//         const [systolic, diastolic] = item.bloodPressure.split('/').map(Number);
//         newItem.systolic = systolic;
//         newItem.diastolic = diastolic;
//         delete newItem.bloodPressure;
//       }
//       return newItem;
//     });
//   };

//   const chartTrendData = processTrendDataForChart(trendData);

//   // Get color based on metric value comparison to normal range (unchanged)
//   const getMetricValueColor = (metricKey, value) => {
//     if (metricKey === "bloodPressure") return "text-blue-600";
    
//     const normalRange = metrics[metricKey].normalRange;
//     const [min, max] = normalRange.split('-').map(Number);
    
//     if (value < min) return "text-yellow-500";
//     if (value > max) return "text-red-500";
//     return "text-green-500";
//   };

//   // Check if reports can be compared
//   const canCompare = selectedReport && reportToCompare && 
//                     selectedReport.summary && reportToCompare.summary &&
//                     Object.keys(selectedReport.summary).length > 0 && 
//                     Object.keys(reportToCompare.summary).length > 0;

//   if (loadingDashboard) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
//         <div className="flex flex-col items-center">
//           <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           <motion.p 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5 }}
//             className="mt-6 text-blue-600 font-medium text-lg"
//           >
//             Loading your health records...
//           </motion.p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
//         <div className="max-w-md mx-auto p-4 bg-red-50 rounded-lg shadow-md">
//           <div className="flex items-center text-red-600">
//             <FaExclamationTriangle className="mr-2" />
//             <h3 className="font-medium">Error Loading Reports</h3>
//           </div>
//           <p className="mt-2 text-red-700">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
//       <div className="container mx-auto px-4 py-8">
//         {/* Dashboard Header */}
//         <motion.div
//           className="mb-8"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-800">Health Dashboard</h1>
//               <p className="text-gray-600 mt-2 text-lg">
//                 Welcome back, <span className="font-semibold">{userName}</span>
//               </p>
//             </div>
//             <motion.div 
//               whileHover={{ scale: 1.05 }}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow flex items-center transition-all"
//               onClick={() => navigate('/upload')}
//             >
//               <FaUpload className="mr-2" />
//               Upload Report
//             </motion.div>
//           </div>
          
//           {/* Health Summary Card */}
//           {healthSummary && (
//             <motion.div 
//               className="mt-8 p-6 bg-white rounded-xl shadow-lg"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//             >
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-3 text-gray-800">Health Summary</h2>
//                   <div className="flex items-center mb-4">
//                     <div className={`rounded-full w-3 h-3 mr-2 ${
//                       healthSummary.overallStatus === "Good" 
//                         ? "bg-green-500" 
//                         : healthSummary.overallStatus === "Needs Attention" 
//                           ? "bg-yellow-500" 
//                           : "bg-gray-400"
//                     }`}></div>
//                     <p className="text-gray-700">
//                       Overall status: <span className="font-semibold">{healthSummary.overallStatus}</span>
//                     </p>
//                     <div className="mx-4 w-px h-5 bg-gray-300"></div>
//                     <div className={`rounded-full w-3 h-3 mr-2 ${
//                       healthSummary.riskLevel === "Low" 
//                         ? "bg-green-500" 
//                         : healthSummary.riskLevel === "Moderate" 
//                           ? "bg-yellow-500" 
//                           : healthSummary.riskLevel === "High" 
//                             ? "bg-red-500" 
//                             : "bg-gray-400"
//                     }`}></div>
//                     <p className="text-gray-700">
//                       Risk level: <span className="font-semibold">{healthSummary.riskLevel}</span>
//                     </p>
//                   </div>
//                 </div>
//                 <button 
//                   className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
//                   onClick={() => setShowTrends(!showTrends)}
//                 >
//                   <FaChartLine className="mr-1" />
//                   {showTrends ? 'Hide Trends' : 'Show Trends'}
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {/* Improvements */}
//                 {healthSummary.improvements.length > 0 && (
//                   <div className="bg-green-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-green-700 mb-2 flex items-center">
//                       <FaArrowUp className="mr-1 text-green-600" />
//                       Improvements
//                     </h3>
//                     <ul className="space-y-1">
//                       {healthSummary.improvements.map((item, index) => (
//                         <li key={`improvement-${index}`} className="text-gray-700 flex items-start">
//                           <span className="text-green-600 mr-2">•</span>
//                           {item}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
                
//                 {/* Concerns */}
//                 {healthSummary.concerns.length > 0 && (
//                   <div className="bg-yellow-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-yellow-700 mb-2 flex items-center">
//                       <FaExclamationTriangle className="mr-1 text-yellow-600" />
//                       Areas to Watch
//                     </h3>
//                     <ul className="space-y-1">
//                       {healthSummary.concerns.map((item, index) => (
//                         <li key={`concern-${index}`} className="text-gray-700 flex items-start">
//                           <span className="text-yellow-600 mr-2">•</span>
//                           {item}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
                
//                 {/* Recommendations */}
//                 <div className="bg-blue-50 p-4 rounded-lg">
//                   <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
//                     <FaInfoCircle className="mr-1 text-blue-600" />
//                     Recommendations
//                   </h3>
//                   <ul className="space-y-1">
//                     {healthSummary.recommendations.map((item, index) => (
//                       <li key={`recommendation-${index}`} className="text-gray-700 flex items-start">
//                         <span className="text-blue-600 mr-2">•</span>
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
              
//               {/* Trends Visualization */}
//               <AnimatePresence>
//                 {showTrends && (
//                   <motion.div 
//                     className="mt-6 pt-6 border-t border-gray-200"
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: 'auto' }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <h3 className="text-xl font-semibold mb-4 text-gray-800">Health Trends</h3>
                    
//                     <div className="mb-4">
//                       <div className="flex space-x-2 mb-3">
//                         {Object.entries(metrics).map(([key, metric]) => (
//                           <button
//                             key={key}
//                             className={`px-3 py-1 rounded-full text-sm font-medium ${
//                               selectedMetric === key 
//                                 ? 'bg-blue-600 text-white' 
//                                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                             }`}
//                             onClick={() => setSelectedMetric(key)}
//                           >
//                             {metric.label}
//                           </button>
//                         ))}
//                       </div>
                      
//                       <div className="h-72 bg-white p-4 rounded-lg shadow-sm">
//                         <ResponsiveContainer width="100%" height="100%">
//                           {selectedMetric === 'bloodPressure' ? (
//                             <LineChart
//                               data={chartTrendData}
//                               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                             >
//                               <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
//                               <XAxis dataKey="date" />
//                               <YAxis />
//                               <Tooltip />
//                               <Legend />
//                               <ReferenceLine y={120} stroke="#8884d8" strokeDasharray="3 3" label="Normal Systolic" />
//                               <ReferenceLine y={80} stroke="#82ca9d" strokeDasharray="3 3" label="Normal Diastolic" />
//                               <Line 
//                                 type="monotone" 
//                                 dataKey="systolic" 
//                                 name="Systolic" 
//                                 stroke="#8884d8" 
//                                 activeDot={{ r: 8 }} 
//                               />
//                               <Line 
//                                 type="monotone" 
//                                 dataKey="diastolic" 
//                                 name="Diastolic" 
//                                 stroke="#82ca9d" 
//                               />
//                             </LineChart>
//                           ) : (
//                             <LineChart
//                               data={trendData}
//                               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                             >
//                               <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
//                               <XAxis dataKey="date" />
//                               <YAxis />
//                               <Tooltip />
//                               <Legend />
//                               {selectedMetric === 'glucose' && (
//                                 <ReferenceLine y={100} stroke="#ff7300" strokeDasharray="3 3" label="Normal Max" />
//                               )}
//                               {selectedMetric === 'cholesterol' && (
//                                 <ReferenceLine y={200} stroke="#ff7300" strokeDasharray="3 3" label="Normal Max" />
//                               )}
//                               <Line 
//                                 type="monotone" 
//                                 dataKey={selectedMetric} 
//                                 name={metrics[selectedMetric].label} 
//                                 stroke="#8884d8" 
//                                 activeDot={{ r: 8 }} 
//                               />
//                             </LineChart>
//                           )}
//                         </ResponsiveContainer>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           )}
//         </motion.div>
        
//         {/* Reports Section */}
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Reports List */}
//           <motion.div 
//             className="w-full md:w-1/3"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3, duration: 0.5 }}
//           >
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//               <div className="flex border-b border-gray-200">
//                 <button
//                   className={`flex-1 px-4 py-3 text-center font-medium ${
//                     activeTab === 'uploaded' 
//                       ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
//                       : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                   onClick={() => setActiveTab('uploaded')}
//                 >
//                   <FaFilePdf className="inline-block mr-2" />
//                   Uploaded Reports
//                 </button>
//                 <button
//                   className={`flex-1 px-4 py-3 text-center font-medium ${
//                     activeTab === 'generated' 
//                       ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
//                       : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                   onClick={() => setActiveTab('generated')}
//                 >
//                   <FaChartLine className="inline-block mr-2" />
//                   Insights
//                 </button>
//               </div>
              
//               <div className="max-h-[600px] overflow-y-auto">
//                 {activeTab === 'uploaded' ? (
//                   uploadedReports.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//                       <FaFilePdf className="text-gray-400 text-5xl mb-4" />
//                       <p className="text-gray-600 mb-4">You haven't uploaded any health reports yet</p>
//                       <button
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                         onClick={() => navigate('/upload')}
//                       >
//                         Upload Your First Report
//                       </button>
//                     </div>
//                   ) : (
//                     <ul className="divide-y divide-gray-200">
//                       {uploadedReports.map((report) => (
//                         <motion.li
//                           key={report.id}
//                           whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.7)" }}
//                           className={`p-4 cursor-pointer flex items-start ${
//                             selectedReport?.id === report.id ? 'bg-blue-50' : ''
//                           } ${
//                             highlightedReport?.id === report.id ? 'bg-green-50' : ''
//                           }`}
//                           onClick={() => handleReportSelect(report)}
//                         >
//                           <div className="bg-blue-100 rounded-lg p-2 mr-3">
//                             <FaFilePdf className="text-blue-600" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="font-medium text-gray-800 truncate">{report.name}</p>
//                             <p className="text-sm text-gray-500">
//                               {formatDate(report.uploadDate)}
//                             </p>
//                             <p className="text-xs text-gray-500 mt-1">{report.provider}</p>
//                           </div>
//                           {comparisonMode && selectedReport?.id !== report.id && (
//                             <button
//                               className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleReportToCompareSelect(report);
//                               }}
//                             >
//                               Compare
//                             </button>
//                           )}
//                         </motion.li>
//                       ))}
//                     </ul>
//                   )
//                 ) : (
//                   generatedReports.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//                       <FaChartLine className="text-gray-400 text-5xl mb-4" />
//                       <p className="text-gray-600 mb-4">No health insights available yet</p>
//                       <p className="text-sm text-gray-500">Upload more reports to generate insights</p>
//                     </div>
//                   ) : (
//                     <ul className="divide-y divide-gray-200">
//                       {generatedReports.map((report) => (
//                         <motion.li
//                           key={report.id}
//                           whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.7)" }}
//                           className={`p-4 cursor-pointer flex items-start ${
//                             selectedReport?.id === report.id ? 'bg-blue-50' : ''
//                           }`}
//                           onClick={() => handleReportSelect(report)}
//                         >
//                           <div className="bg-purple-100 rounded-lg p-2 mr-3">
//                             <FaChartLine className="text-purple-600" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="font-medium text-gray-800 truncate">{report.name}</p>
//                             <p className="text-sm text-gray-500">
//                               {formatDate(report.generationDate)}
//                             </p>
//                           </div>
//                         </motion.li>
//                       ))}
//                     </ul>
//                   )
//                 )}
//               </div>
//             </div>
//           </motion.div>
          
//           {/* Report Details */}
//           <motion.div 
//             className="w-full md:w-2/3"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4, duration: 0.5 }}
//           >
//             {selectedReport ? (
//               <div className="bg-white rounded-xl shadow-lg p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800">{selectedReport.name}</h2>
//                     <p className="text-gray-600">
//                       {selectedReport.uploadDate 
//                         ? `Uploaded on ${formatDate(selectedReport.uploadDate)}` 
//                         : `Generated on ${formatDate(selectedReport.generationDate)}`
//                       }
//                     </p>
//                   </div>
//                   <div className="flex">
//                     <button
//                       className={`px-3 py-1 rounded-lg flex items-center text-sm font-medium mr-2 ${
//                         comparisonMode 
//                           ? 'bg-green-600 text-white' 
//                           : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                       }`}
//                       onClick={toggleComparisonMode}
//                       disabled={!selectedReport.summary}
//                     >
//                       <FaExchangeAlt className="mr-1" />
//                       {comparisonMode ? 'Exit Comparison' : 'Compare'}
//                     </button>
//                     {selectedReport.fileType === 'pdf' && (
//                       <button
//                         className="px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center text-sm font-medium hover:bg-blue-700"
//                       >
//                         <FaDownload className="mr-1" />
//                         Download
//                       </button>
//                     )}
//                   </div>
//                 </div>
                
//                 {error && (
//                   <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
//                     <FaExclamationTriangle className="inline mr-2" />
//                     {error}
//                   </div>
//                 )}
                
//                 {comparisonMode ? (
//                   <div className="border rounded-lg p-4 bg-gray-50 mb-6">
//                     <h3 className="font-medium text-gray-800 mb-3">Comparison Mode</h3>
                    
//                     {reportToCompare ? (
//                       <>
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex-1">
//                             <span className="text-sm text-gray-600">Report 1 (Selected):</span>
//                             <p className="font-medium text-gray-800">{selectedReport.name}</p>
//                           </div>
//                           <FaExchangeAlt className="mx-2 text-gray-500" />
//                           <div className="flex-1">
//                             <span className="text-sm text-gray-600">Report 2 (Comparing):</span>
//                             <p className="font-medium text-gray-800">{reportToCompare.name}</p>
//                           </div>
//                         </div>
                        
//                         <button
//                           className="w-full py-2 bg-green-600 text-white rounded-lg flex items-center justify-center font-medium hover:bg-green-700 mb-4"
//                           onClick={handleCompare}
//                           disabled={isComparing || !canCompare}
//                         >
//                           {isComparing ? (
//                             <>
//                               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                               </svg>
//                               Comparing...
//                             </>
//                           ) : (
//                             <>
//                               <FaChartLine className="mr-2" />
//                               Generate Comparison
//                             </>
//                           )}
//                         </button>
                        
//                         {comparisonData ? (
//                           <div className="mt-6">
//                             <h3 className="font-medium text-gray-800 mb-4">Comparison Results</h3>
                            
//                             {Object.keys(comparisonData.values).length === 0 ? (
//                               <div className="text-center py-4 text-gray-500">
//                                 No comparable metrics found between these reports
//                               </div>
//                             ) : (
//                               <div className="space-y-4">
//                                 {Object.entries(metrics).map(([key, metric]) => {
//                                   if (!comparisonData.values[key]) return null;
                                  
//                                   if (key === 'bloodPressure') {
//                                     const diff = comparisonData.differences[key];
//                                     const change = comparisonData.percentChanges[key];
                                    
//                                     return (
//                                       <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
//                                         <div className="flex justify-between mb-2">
//                                           <h4 className="font-medium text-gray-800">{metric.label}</h4>
//                                           <span className="text-gray-500 text-sm">{metric.unit}</span>
//                                         </div>
                                        
//                                         <div className="flex justify-between mb-2">
//                                           <div>
//                                             <span className="text-sm text-gray-600">
//                                               {comparisonData.dates[0]}:
//                                             </span>
//                                             <span className="ml-2 font-medium">
//                                               {comparisonData.values[key][0]}
//                                             </span>
//                                           </div>
                                          
//                                           <div>
//                                             <span className="text-sm text-gray-600">
//                                               {comparisonData.dates[1]}:
//                                             </span>
//                                             <span className="ml-2 font-medium">
//                                               {comparisonData.values[key][1]}
//                                             </span>
//                                           </div>
//                                         </div>
                                        
//                                         <div className="mt-2 pt-2 border-t border-gray-200">
//                                           <div className="flex justify-between">
//                                             <div>
//                                               <span className="text-sm text-gray-600">
//                                                 Systolic:
//                                               </span>
//                                               <span className={`ml-1 font-medium ${
//                                                 diff.systolic > 0
//                                                   ? 'text-red-600'
//                                                   : diff.systolic < 0
//                                                     ? 'text-green-600'
//                                                     : 'text-gray-800'
//                                               }`}>
//                                                 {diff.systolic > 0 ? '+' : ''}{diff.systolic} mmHg 
//                                                 ({change.systolic > 0 ? '+' : ''}{change.systolic}%)
//                                               </span>
//                                             </div>
                                            
//                                             <div>
//                                               <span className="text-sm text-gray-600">
//                                                 Diastolic:
//                                               </span>
//                                               <span className={`ml-1 font-medium ${
//                                                 diff.diastolic > 0
//                                                   ? 'text-red-600'
//                                                   : diff.diastolic < 0
//                                                     ? 'text-green-600'
//                                                     : 'text-gray-800'
//                                               }`}>
//                                                 {diff.diastolic > 0 ? '+' : ''}{diff.diastolic} mmHg
//                                                 ({change.diastolic > 0 ? '+' : ''}{change.diastolic}%)
//                                               </span>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     );
//                                   }
                                  
//                                   return (
//                                     <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
//                                       <div className="flex justify-between mb-2">
//                                         <h4 className="font-medium text-gray-800">{metric.label}</h4>
//                                         <span className="text-gray-500 text-sm">{metric.unit}</span>
//                                       </div>
                                      
//                                       <div className="flex justify-between mb-2">
//                                         <div>
//                                           <span className="text-sm text-gray-600">
//                                             {comparisonData.dates[0]}:
//                                           </span>
//                                           <span className={`ml-2 font-medium ${
//                                             getMetricValueColor(key, comparisonData.values[key][0])
//                                           }`}>
//                                             {comparisonData.values[key][0]}
//                                           </span>
//                                         </div>
                                        
//                                         <div>
//                                           <span className="text-sm text-gray-600">
//                                             {comparisonData.dates[1]}:
//                                           </span>
//                                           <span className={`ml-2 font-medium ${
//                                             getMetricValueColor(key, comparisonData.values[key][1])
//                                           }`}>
//                                             {comparisonData.values[key][1]}
//                                           </span>
//                                         </div>
//                                       </div>
                                      
//                                       <div className="mt-2 pt-2 border-t border-gray-200">
//                                         <span className="text-sm text-gray-600">
//                                           Change:
//                                         </span>
//                                         <span className={`ml-1 font-medium ${
//                                           parseFloat(comparisonData.differences[key]) > 0
//                                             ? 'text-red-600'
//                                             : parseFloat(comparisonData.differences[key]) < 0
//                                               ? 'text-green-600'
//                                               : 'text-gray-800'
//                                         }`}>
//                                           {parseFloat(comparisonData.differences[key]) > 0 ? '+' : ''}
//                                           {comparisonData.differences[key]} {metric.unit} 
//                                           ({comparisonData.percentChanges[key] > 0 ? '+' : ''}{comparisonData.percentChanges[key]}%)
//                                         </span>
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             )}
//                           </div>
//                         ) : (
//                           <div className="text-center py-4 text-gray-500">
//                             {isComparing ? (
//                               <div className="flex items-center justify-center">
//                                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                                 Generating comparison...
//                               </div>
//                             ) : (
//                               "Select a report to compare with and click 'Generate Comparison'"
//                             )}
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <div className="text-center py-4 text-gray-500">
//                         <p className="text-gray-600 mb-2">Select another report to compare with</p>
//                         <FaArrowLeft className="inline-block text-gray-500" />
//                       </div>
//                     )}
//                   </div>
//                 ) : selectedReport.uploadDate ? (
//                   // For uploaded reports
//                   <div>
//                     {selectedReport.summary ? (
//                       <div className="mb-6">
//                         <h3 className="font-medium text-gray-800 mb-3 flex items-center">
//                           <GiHealthNormal className="mr-2 text-blue-600" />
//                           Health Metrics
//                         </h3>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                           {Object.entries(metrics).map(([key, metric]) => (
//                             <div key={key} className="bg-gray-50 p-4 rounded-lg">
//                               <div className="flex justify-between mb-1">
//                                 <h4 className="font-medium text-gray-700">{metric.label}</h4>
//                                 <span className="text-gray-500 text-sm">{metric.unit}</span>
//                               </div>
//                               {selectedReport.summary[key] ? (
//                                 <>
//                                   <div className={`text-xl font-bold ${
//                                     getMetricValueColor(key, selectedReport.summary[key])
//                                   }`}>
//                                     {selectedReport.summary[key]}
//                                   </div>
//                                   <div className="text-xs text-gray-500 mt-1">
//                                     Normal range: {metric.normalRange}
//                                   </div>
//                                 </>
//                               ) : (
//                                 <div className="text-gray-500 italic">Not available</div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) : null}
                    
//                     <div>
//                       <h3 className="font-medium text-gray-800 mb-3 flex items-center">
//                         <FaFilePdf className="mr-2 text-red-600" />
//                         Report Preview
//                       </h3>
                      
//                       <div className="border border-gray-300 rounded-lg bg-gray-100 p-4 flex justify-center">
//                         <div className="bg-white shadow-lg max-w-md p-4 rounded border border-gray-200">
//                           {selectedReport.parameters_text ? (
//                             <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800">
//                               {selectedReport.parameters_text}
//                             </pre>
//                           ) : (
//                             <div className="bg-gray-200 rounded w-full h-80 flex items-center justify-center">
//                               <span className="text-gray-500">PDF preview not available</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   // For generated reports
//                   <div>
//                     <div className="p-6 bg-purple-50 rounded-lg mb-6">
//                       <h3 className="font-medium text-purple-800 mb-2 flex items-center">
//                         <FaChartLine className="mr-2 text-purple-700" />
//                         Health Insights
//                       </h3>
//                       <p className="text-gray-700">{selectedReport.summaryText}</p>
//                     </div>
                    
//                     <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
//                       <div className="text-center">
//                         <FaFilePdf className="text-red-500 text-4xl mx-auto mb-3" />
//                         <p className="text-gray-700 mb-3">Insights Report</p>
//                         <button 
//                           className="px-4 py-2 bg-blue-600 text-white rounded flex items-center mx-auto hover:bg-blue-700"
//                         >
//                           <FaDownload className="mr-2" />
//                           Download Full Report
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center text-center">
//                 <div className="bg-blue-100 rounded-full p-6 mb-4">
//                   <FaFilePdf className="text-blue-600 text-4xl" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Report</h3>
//                 <p className="text-gray-600 max-w-md">
//                   View your health information by selecting a report from the list on the left.
//                 </p>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;