import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Layout/Footer";

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Check authentication status when component mounts
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authToken");
    
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    
    // Set visibility for animations
    setIsVisible(true);
    
    // Setup intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });
    
    // Observe elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, [navigate]);

  // Get current date formatted
  const getCurrentDateFormatted = () => {
    const options = { month: 'long', year: 'numeric' };
    return currentMonth.toLocaleDateString('en-US', options);
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: "", isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = isSameDay(date, new Date());
      const isSelected = isSameDay(date, selectedDate);
      const hasEvent = Math.random() > 0.7; // Random events for demo purposes
      
      days.push({
        day,
        isCurrentMonth: true,
        isToday,
        isSelected,
        hasEvent
      });
    }
    
    return days;
  };

  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Handle date selection
  const handleDateClick = (day) => {
    if (day.isCurrentMonth) {
      const newSelectedDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day.day
      );
      setSelectedDate(newSelectedDate);
    }
  };

  const days = getDaysInMonth(currentMonth);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center py-6 border-b border-blue-100">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl font-bold text-blue-600 m-0">Perceptria</h1>
            <p className="text-sm text-blue-400 m-0">Advanced Health Analytics</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-x-4"
          >
            <button 
              onClick={() => navigate("/login")} 
              className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/signup")} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Sign Up
            </button>
          </motion.div>
        </header>

        <main className="py-12">
          {/* Hero Section with Simplified Text */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex-1 min-w-[300px]"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800 leading-tight">
                Precision Health <span className="text-blue-600">Monitoring</span>
              </h2>
              <p className="text-xl leading-relaxed text-gray-600 mb-8">
                Perceptria delivers clinical-grade health analytics and personalized insights to help you maintain optimal wellness and make informed healthcare decisions.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex-1 min-w-[300px] relative"
            >
              {/* Simple Calendar Component */}
              <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-blue-100 transform hover:shadow-2xl transition-all duration-500">
                <div className="bg-blue-600 text-white p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Calendar</h3>
                    <div className="flex items-center">
                      <button 
                        onClick={handlePrevMonth}
                        className="text-white hover:bg-blue-500 p-1 rounded-full mr-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <span>{getCurrentDateFormatted()}</span>
                      <button 
                        onClick={handleNextMonth}
                        className="text-white hover:bg-blue-500 p-1 rounded-full ml-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {dayNames.map(day => (
                      <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => (
                      <div
                        key={index}
                        onClick={() => handleDateClick(day)}
                        className={`
                          cursor-pointer text-center py-2 rounded-lg transition-all duration-200
                          ${day.isCurrentMonth ? '' : 'invisible'}
                          ${day.isSelected ? 'bg-blue-600 text-white font-bold' : ''}
                          ${day.isToday && !day.isSelected ? 'bg-blue-100 font-bold' : ''}
                          ${!day.isSelected && !day.isToday ? 'hover:bg-blue-50' : ''}
                        `}
                      >
                        <div className="relative">
                          <span>{day.day}</span>
                          {day.hasEvent && day.isCurrentMonth && (
                            <div className={`w-1 h-1 rounded-full mx-auto mt-1 ${day.isSelected ? 'bg-white' : 'bg-blue-500'}`}></div>

                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm">
                          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors duration-300">
                        View Events
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-100 rounded-full animate-pulse-slow opacity-50"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-green-100 rounded-full animate-float-delayed opacity-50"></div>
            </motion.div>
          </div>

          {/* Features Section with Animation */}
          <section className="mb-20 animate-on-scroll opacity-0">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl font-bold text-blue-600 mb-4">Advanced Health Technology</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our platform combines medical expertise with cutting-edge analytics to deliver meaningful insights for your health journey.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: "Clinical Analytics",
                  description: "Access medical-grade metrics and analysis powered by clinical research and validated health models.",
                  delay: 0.8
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  title: "HIPAA Compliant",
                  description: "Your health information is protected with enterprise-grade security and full regulatory compliance.",
                  delay: 1.0
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  title: "Seamless Integration",
                  description: "Connect with your healthcare providers and existing health devices for a comprehensive view.",
                  delay: 1.2
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
                  transition={{ duration: 0.7, delay: feature.delay }}
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100"
                >
                  <div className="text-blue-600 mb-4 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Stats Section */}
          <section className="mb-20 animate-on-scroll opacity-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { number: "98%", label: "Accuracy Rate" },
                { number: "24/7", label: "Monitoring" },
                { number: "15+", label: "Health Metrics" },
                { number: "100K+", label: "Patients Served" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="bg-blue-50 p-6 rounded-lg text-center border border-blue-100"
                >
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
       <Footer />
      </div>

      {/* Add required CSS for custom animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.2;
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;