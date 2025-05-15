# import os
# import re
# import json
# import pdfplumber
# import matplotlib.pyplot as plt
# from django.http import JsonResponse, FileResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.middleware.csrf import get_token
# from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
# from django.utils.decorators import method_decorator
# from fpdf import FPDF
# import ollama

# # Utility class for processing PDFs
# class HealthReportService:
#     @staticmethod
#     def extract_health_data(pdf_path):
#         extracted_data = {}
#         full_text = ""

#         with pdfplumber.open(pdf_path) as pdf:
#             for page in pdf.pages:
#                 page_text = page.extract_text()
#                 if page_text:
#                     full_text += re.sub(r"\s+", " ", page_text.replace("\n", " ")) + "\n"

#         extracted_data["RawText"] = full_text
#         return extracted_data

#     @staticmethod
#     def generate_health_report(health_data):
#         response = ollama.chat(model="mistral", messages=[{"role": "user", "content": f"Analyze: {health_data}"}])
#         return response["message"]["content"]

# # Upload PDF & Process Health Data
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request, *args, **kwargs):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"error": "No PDF file uploaded"}, status=400)

#         pdf_file = request.FILES["pdf_file"]
#         file_path = default_storage.save(f"uploads/{pdf_file.name}", ContentFile(pdf_file.read()))
#         full_path = default_storage.path(file_path)

#         health_data = HealthReportService.extract_health_data(full_path)
#         health_report_text = HealthReportService.generate_health_report(health_data)
#         pdf_report_path = os.path.join(settings.MEDIA_ROOT, "reports", "health_report.pdf")

#         # Generate PDF report
#         pdf = FPDF()
#         pdf.add_page()
#         pdf.set_font("Arial", size=12)
#         pdf.multi_cell(0, 10, health_report_text)
#         pdf.output(pdf_report_path)

#         default_storage.delete(file_path)  # Clean up uploaded file
#         return JsonResponse({"message": "File processed", "file_url": pdf_report_path})

# # Serve CSRF token for frontend
# class CSRFTokenView(View):
#     @method_decorator(ensure_csrf_cookie)
#     def get(self, request, *args, **kwargs):
#         return JsonResponse({"csrfToken": get_token(request)})


# import os
# import re
# import json
# import pdfplumber
# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.middleware.csrf import get_token
# from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
# from django.utils.decorators import method_decorator
# from fpdf import FPDF
# import ollama

# # Utility class for processing PDFs
# class HealthReportService:
#     @staticmethod
#     def extract_health_data(pdf_path):
#         extracted_data = {}
#         full_text = ""

#         with pdfplumber.open(pdf_path) as pdf:
#             for page in pdf.pages:
#                 page_text = page.extract_text()
#                 if page_text:
#                     full_text += re.sub(r"\s+", " ", page_text.replace("\n", " ")) + "\n"

#         extracted_data["RawText"] = full_text
#         return extracted_data

#     @staticmethod
#     def generate_health_report(health_data):
#         response = ollama.chat(model="mistral", messages=[{"role": "user", "content": f"Analyze: {health_data}"}])
#         return response["message"]["content"]

# # Upload PDF & Process Health Data
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request, *args, **kwargs):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"error": "No PDF file uploaded"}, status=400)

#         pdf_file = request.FILES["pdf_file"]
#         file_path = default_storage.save(f"uploads/{pdf_file.name}", ContentFile(pdf_file.read()))
#         full_path = default_storage.path(file_path)

#         try:
#             # Process the file
#             health_data = HealthReportService.extract_health_data(full_path)
#             health_report_text = HealthReportService.generate_health_report(health_data)

#             # Generate PDF report
#             report_filename = f"health_report_{pdf_file.name}.pdf"
#             pdf_report_path = os.path.join(settings.MEDIA_ROOT, "reports", report_filename)

#             os.makedirs(os.path.dirname(pdf_report_path), exist_ok=True)

#             pdf = FPDF()
#             pdf.add_page()
#             pdf.set_font("Arial", size=12)
#             pdf.multi_cell(0, 10, health_report_text)
#             pdf.output(pdf_report_path)

#             default_storage.delete(file_path)  # Clean up uploaded file

#             return JsonResponse({"message": "File processed", "file_url": f"/media/reports/{report_filename}"})

#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

# # Serve CSRF token for frontend
# class CSRFTokenView(View):
#     @method_decorator(ensure_csrf_cookie)
#     def get(self, request, *args, **kwargs):
#         response = JsonResponse({"csrfToken": get_token(request)})
#         response["Access-Control-Allow-Origin"] = "*"  # Allow all origins
#         response["Access-Control-Allow-Credentials"] = "true"
#         response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
#         response["Access-Control-Allow-Headers"] = "X-CSRFToken, Content-Type"
#         return response



# test proper code
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.middleware.csrf import get_token
# from django.shortcuts import render
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# import os

# # CSRF Token Endpoint
# def get_csrf_token(request):
#     return JsonResponse({'csrfToken': get_token(request)})

# # Upload Test Function
# @csrf_exempt  # Temporarily disable CSRF for testing
# def upload_file(request):
#     if request.method == "POST" and request.FILES.get("file"):
#         uploaded_file = request.FILES["file"]
#         file_name = uploaded_file.name

#         # Save file to media directory
#         file_path = os.path.join("media", file_name)
#         default_storage.save(file_path, ContentFile(uploaded_file.read()))

#         return JsonResponse({"message": "File received!", "filename": file_name, "path": file_path})
    
#     return JsonResponse({"error": "Invalid request"}, status=400)

# import os
# import re
# import json
# import pdfplumber
# import ollama
# from fpdf import FPDF
# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token

# # ========================
# # 1. DEFINE HEALTH FACTORS TO EXTRACT
# # ========================
# test_patterns = {
#     "Blood Sugar": r"(?i)Fasting[\s\.\-]*blood[\s\.\-]*sugar[\s\.\-]*:\s*([\d\.]+)\s*mg/dl",
#     "HbA1c": r"(?i)HbA1c[\s\.\-]*:\s*([\d\.]+)%",
#     "LDL Cholesterol": r"(?i)LDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "HDL Cholesterol": r"(?i)HDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "Triglycerides": r"(?i)Triglyceride[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "Blood Pressure": r"(?i)Blood[\s\.\-]*Pressure[\s\.\-]*:\s*([\d\.]+)/([\d\.]+) mmHg",
#     "TSH (Thyroid)": r"(?i)Serum[\s\.\-]*TSH[\s\.\-]*:\s*([\d\.]+) µIU/ml",
#     "BMI": r"(?i)BMI[\s\.\-]*:\s*([\d\.]+)"
# }

# class HealthReportService:
#     @staticmethod
#     def extract_health_factors(pdf_path):
#         """Extracts only the specific health factors from the PDF."""
#         extracted_results = {key: "Not Found" for key in test_patterns}  # Default values

#         with pdfplumber.open(pdf_path) as pdf:
#             for page in pdf.pages:
#                 page_text = page.extract_text()
#                 if not page_text:
#                     continue  # Skip empty pages
                
#                 # Extract only the required factors
#                 for test, pattern in test_patterns.items():
#                     if extracted_results[test] == "Not Found":  # Only search if not found
#                         match = re.search(pattern, page_text, re.IGNORECASE)
#                         if match:
#                             extracted_results[test] = match.group(1)

#                 # Stop scanning if all factors are extracted
#                 if all(value != "Not Found" for value in extracted_results.values()):
#                     break  

#         return extracted_results

#     @staticmethod
#     def generate_health_report(extracted_factors):
#         """Generates an AI-based health report using only extracted factors."""
#         prompt = f"""
#         Generate a concise health report based on these lab results:

#         {json.dumps(extracted_factors, indent=4)}

#         Report should include:
#         - Summary of key findings 🔍
#         - Analysis of test values 📊
#         - Lifestyle recommendations 🏃‍♂️ (Diet, exercise, habits)
#         - Critical health alerts 🚨

#         Make it easy to understand.
#         """
#         response = ollama.chat(model="gemma:2b", messages=[{"role": "user", "content": prompt}])
#         return response["message"]["content"]

# # ========================
# # 2. DJANGO VIEWS
# # ========================
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request, *args, **kwargs):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"error": "No PDF file uploaded"}, status=400)

#         # Save uploaded file
#         pdf_file = request.FILES["pdf_file"]
#         file_path = default_storage.save(f"uploads/{pdf_file.name}", ContentFile(pdf_file.read()))
#         full_path = default_storage.path(file_path)

#         # Extract health factors
#         extracted_factors = HealthReportService.extract_health_factors(full_path)
#         health_report_text = HealthReportService.generate_health_report(extracted_factors)

#         # Generate PDF Report
#         report_pdf_path = os.path.join(settings.MEDIA_ROOT, "reports", "health_report.pdf")
#         self.create_pdf_report(report_pdf_path, extracted_factors, health_report_text)

#         # Clean up uploaded file
#         default_storage.delete(file_path)

#         return JsonResponse({"message": "File processed", "file_url": report_pdf_path})

#     def create_pdf_report(self, pdf_path, extracted_factors, text_report):
#         """Creates a PDF containing extracted health factors and AI-generated report."""
#         pdf = FPDF()
#         pdf.add_page()
#         pdf.set_font("Arial", 'B', 14)
#         pdf.cell(200, 10, "Health Report", ln=True, align="C")
#         pdf.ln(10)

#         # Add extracted lab data
#         pdf.set_font("Arial", size=12)
#         for test, value in extracted_factors.items():
#             pdf.cell(0, 10, f"{test}: {value}", ln=True)
#         pdf.ln(10)

#         # Add AI-generated analysis
#         pdf.set_font("Arial", "B", 12)
#         pdf.cell(0, 10, "AI Health Analysis:", ln=True)
#         pdf.set_font("Arial", size=12)
#         pdf.multi_cell(0, 10, text_report)

#         pdf.output(pdf_path)

# class CSRFTokenView(View):
#     def get(self, request, *args, **kwargs):
#         return JsonResponse({"csrfToken": get_token(request)})


# re+gemma:2b
# import os
# import re
# import json
# import pdfplumber
# import ollama
# from fpdf import FPDF
# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token

# # ========================
# # 1. DEFINE HEALTH FACTORS TO EXTRACT
# # ========================
# test_patterns = {
#     "Name": r"(?i)Patient's\s+name\s*:\s*([\w\s]+)",
#     "Reg_ID": r"(?i)Reg\.?\s*ID\s*:\s*([\w\-]+)",
#     "Age": r"(?i)Age\s*\/\s*Sex\s*:\s*(\d+)",
#     "Gender": r"(?i)Age\s*\/\s*Sex\s*:\s*\d+\s*Years\s*\/\s*(Male|Female|Other)",
#     "Sample_No": r"(?i)Sample\s*No\.?\s*:\s*(\d+)",
#     "Referred_By": r"(?i)Referred\s*by\s*:\s*([\w\s]+)",
#     "Order_Date_Time": r"(?i)Order\s*Dt\s*\/\s*time\s*:\s*([\d\/\s:]+)",
#     "HbA1c": r"(?i)HbA1c[\s\.\-]*:\s*([\d\.]+)%",
#     "Insulin Levels": r"(?i)Insulin[\s\.\-]*Levels[\s\.\-]*:\s*([\d\.]+) U/L",
#     "RBC Count": r"(?i)Total[\s\.\-]*RBC[\s\.\-]*Count[\s\.\-]*:\s*([\d\.]+) mill/cmm",
#     "Hemoglobin": r"(?i)Hemoglobin[\s\.\-]*:\s*([\d\.]+) g/dl",
#     "PCV": r"(?i)P[\s\.\-]*C[\s\.\-]*V[\s\.\-]*:\s*([\d\.]+) %",
#     "MCV": r"(?i)M[\s\.\-]*C[\s\.\-]*V[\s\.\-]*:\s*([\d\.]+) femtolitre",
#     "MCH": r"(?i)M[\s\.\-]*C[\s\.\-]*H[\s\.\-]*:\s*([\d\.]+) pg",
#     "MCHC": r"(?i)M[\s\.\-]*C[\s\.\-]*H[\s\.\-]*C[\s\.\-]*:\s*([\d\.]+) g/dl",
#     "RDW": r"(?i)R[\s\.\-]*D[\s\.\-]*W[\s\.\-]*:\s*([\d\.]+) %",
#     "Total Cholesterol": r"(?i)Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "LDL Cholesterol": r"(?i)LDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "HDL Cholesterol": r"(?i)HDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "Triglycerides": r"(?i)Triglyceride[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "Blood Pressure": r"(?i)Blood[\s\.\-]*Pressure[\s\.\-]*:\s*([\d\.]+)/([\d\.]+) mmHg",
#     "CRP": r"(?i)CRP[\s\.\-]*:\s*([\d\.]+) mg/L",
#     "BMI": r"(?i)BMI[\s\.\-]*:\s*([\d\.]+)",
#     "Waist-to-Hip Ratio": r"(?i)Waist[\s\.\-]*to[\s\.\-]*Hip[\s\.\-]*Ratio[\s\.\-]*:\s*([\d\.]+)",
#     "Visceral Fat Percentage": r"(?i)Visceral[\s\.\-]*Fat[\s\.\-]*Percentage[\s\.\-]*:\s*([\d\.]+) %",
#     "Thyroid Function": r"(?i)Serum[\s\.\-]*TSH[\s\.\-]*:\s*([\d\.]+) µIU/ml",
#     "Serum B12 Levels": r"(?i)Serum[\s\.\-]*B[\s\.\-]*12[\s\.\-]*Level[\s\.\-]*:\s*([\d\.]+) pg/ml"
# }

# class HealthReportService:
#     @staticmethod
#     def extract_health_factors(pdf_path):
#         """Extracts specific health factors from the PDF."""
#         extracted_results = {key: "Not Found" for key in test_patterns}  

#         with pdfplumber.open(pdf_path) as pdf:
#             for page in pdf.pages:
#                 page_text = page.extract_text()
#                 if not page_text:
#                     continue
                
#                 for test, pattern in test_patterns.items():
#                     if extracted_results[test] == "Not Found": 
#                         match = re.search(pattern, page_text, re.IGNORECASE)
#                         if match:
#                             extracted_results[test] = match.group(1)

#                 if all(value != "Not Found" for value in extracted_results.values()):
#                     break  

#         return extracted_results

#     @staticmethod
#     def generate_health_report(extracted_factors):
#         """Generates an AI-based health report using extracted factors."""
#         prompt = f"""
#         Patient: {extracted_factors.get("Name", "Unknown")}
#         Age: {extracted_factors.get("Age", "Unknown")}
#         Gender: {extracted_factors.get("Gender", "Unknown")}

#         **Generate Ultra-Comprehensive Health Report**

#             **Lab Results:**
#             {json.dumps(extracted_factors, indent=4)}

#             **Create report with this structure:**

#             🌟 **Health Snapshot** (3 emoji-summarized key findings)
#             🎯 **Risk Radar** (Potential health risks ranked by urgency)

#             📈 **Visualization Ideas**
#             - Suggest 3 data visualizations needed (e.g., "Blood Sugar Trend Line Chart")
#             - Recommend 2 health metric correlations to track (e.g., "LDL vs. Exercise Frequency")

#             🍽️ **Personalized Diet Plan**
#             1. 7-day Indian meal plan with portion sizes
#             2. Top 5 superfoods for your specific results
#             3. Hydration schedule with herbal options
#             4. Healthy snack alternatives

#             💪 **Fitness Regimen**
#             - Morning routine (15-min yoga sequence)
#             - Evening activity plan
#             - Weekly walking targets
#             - Deskercise suggestions

#             🌿 **Home Remedies Toolkit**
#             - 3 kitchen ingredients for immediate improvements
#             - Stress-busting tea recipes
#             - Sleep quality enhancers
#             - Traditional Ayurvedic solutions

#             ⚠️ **Red Flag Alerts** (with severity icons)
#             - Immediate risks needing doctor consultation
#             - Silent symptoms to watch for

#             📅 **30-Day Action Plan**
#             - Daily health journal template
#             - Weekly progress checkpoints
#             - Milestone rewards system

#             🧠 **Mind-Body Connection**
#             - Recommended meditation type + duration
#             - Mindfulness exercises
#             - Music therapy suggestions

#             🔍 **Preventive Care Checklist**
#             - 5 must-do screenings
#             - Seasonal health tips
#             - Supplement guide

#             **Formatting Rules:**
#             1. Use emojis in section headers
#             2. Include 2 motivational quotes
#             3. Add "Success Story" examples
#             4. Create progress tracking tables
#             5. Use color coding: 🟢=Safe 🟡=Caution 🔴=Alert
#             6. Include simple illustrations using ASCII art
#             7. Write in friendly, encouraging tone (avoid medical jargon)
#             8. Add "Did You Know?" health facts
#             9. Include comparison tables (Your Value vs Ideal)
#             10. Provide weekly shopping list suggestions
#             """

#         # response = ollama.chat(model="gemma:2b", messages=[{"role": "user", "content": prompt}])
#         response = ollama.chat(
#     model="gemma:2b",
#     messages=[
#         {
#             "role": "system", 
#             "content": "You are HealthGPT - India's most trusted AI health advisor. Use Indian context for food/examples."
#         },
#         {
#             "role": "user",
#             "content": prompt
#         }
#     ]
# )
#         return response["message"]["content"]

# # ========================c
# # 2. DJANGO VIEWS
# # ========================
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request, *args, **kwargs):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"error": "No PDF file uploaded"}, status=400)

#         pdf_file = request.FILES["pdf_file"]
#         file_path = default_storage.save(f"uploads/{pdf_file.name}", ContentFile(pdf_file.read()))
#         full_path = default_storage.path(file_path)

#         extracted_factors = HealthReportService.extract_health_factors(full_path)
#         health_report_text = HealthReportService.generate_health_report(extracted_factors)

#         report_pdf_path = os.path.join(settings.MEDIA_ROOT, "reports", "health_report.pdf")
#         self.create_pdf_report(report_pdf_path, extracted_factors, health_report_text)

#         default_storage.delete(file_path)

#         # ✅ FIX: Use absolute URL for file access
#         report_url = request.build_absolute_uri(settings.MEDIA_URL + "reports/health_report.pdf")
#         return JsonResponse({"message": "File processed", "file_url": report_url})

#     def create_pdf_report(self, pdf_path, extracted_factors, text_report):
#         """Creates a PDF containing extracted health factors and AI-generated report."""
#         os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

#         pdf = FPDF()
#         pdf.add_page()
#         pdf.set_font("Arial", 'B', 14)
#         pdf.cell(200, 10, "Health Report", ln=True, align="C")
#         pdf.ln(10)

#         pdf.set_font("Arial", size=12)
#         for test, value in extracted_factors.items():
#             pdf.cell(0, 10, f"{test}: {value}", ln=True)
#         pdf.ln(10)

#         pdf.set_font("Arial", "B", 12)
#         pdf.cell(0, 10, "AI Health Analysis:", ln=True)
#         pdf.set_font("Arial", size=12)
#         pdf.multi_cell(0, 10, text_report.encode('latin-1', 'ignore').decode('latin-1'))

#         pdf.output(pdf_path)

# class CSRFTokenView(View):
#     def get(self, request, *args, **kwargs):
#         return JsonResponse({"csrfToken": get_token(request)})

# qwen
# import os
# import json
# import re
# import ollama
# import pdfplumber
# from fpdf import FPDF
# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token

# class HealthReportService:
#     @staticmethod
#     def analyze_pdf_with_qwen(pdf_path):
#         """Extracts health factors and generates a report using Qwen LLM."""
#         extracted_text = ""
        
#         with pdfplumber.open(pdf_path) as pdf:
#             for page in pdf.pages:
#                 # Extract text
#                 page_text = page.extract_text()
#                 if page_text:
#                     extracted_text += page_text + "\n"
                
#                 # Extract tables
#                 for table in page.extract_tables():
#                     extracted_text += "\n".join("|".join(row) for row in table) + "\n"
        
#         # Clean text
#         extracted_text = re.sub(r"\s+", " ", extracted_text).strip()

#         prompt = f"""
# Analyze this medical report and extract health metrics. Follow these steps:

# 1. **Text Analysis**:
# "{extracted_text}"

# 2. **Extraction Rules**:
# - Extract values only if explicitly mentioned in the text
# - Use "Not Found" for missing values
# - Maintain original units from the report
# - Preserve numerical values exactly as written

# 3. **Required Output Format** (JSON ONLY):
# {{
#     "extracted_factors": {{
#         "Patient Information": {{
#             "Name": "<full name from report>",
#             "Age": "<age in years>",
#             "Gender": "<Male/Female/Other>",
#             "Patient ID": "<identifier from report>"
#         }},
#         "Biometrics": {{
#             "Height": "<value with units>",
#             "Weight": "<value with units>",
#             "BMI": "<calculated value>"
#         }},
#         "Blood Work": {{
#             "HbA1c": "<value with units>",
#             "Fasting Glucose": "<value with units>",
#             "Total Cholesterol": "<value with units>",
#             "LDL": "<value with units>",
#             "HDL": "<value with units>"
#         }},
#         "Diagnoses": [
#             "<list of diagnosed conditions from report>"
#         ]
#     }},
#     "health_report": "<detailed analysis in markdown format>"
# }}

# 4. **Analysis Requirements**:
# - Compare values to normal ranges
# - Identify critical abnormalities
# - Suggest next steps for concerning values
# - Use layman-friendly language
# - Include emojis for visual indicators (🔴🟡🟢)
# - Add relevant Indian dietary suggestions
# """
        
#         response = ollama.chat(
#             model="qwen2.5:0.5b",
#             messages=[{
#                 "role": "user", 
#                 "content": prompt,
#                 "options": {
#                     "temperature": 0.3,  # Reduces creativity
#                     "num_ctx": 4096  # Larger context window
#                 }
#             }],
#             format="json"
#         )

#         try:
#             output = HealthReportService.parse_llm_response(response["message"]["content"])
#             return output.get("extracted_factors", {}), output.get("health_report", "")
#         except json.JSONDecodeError:
#             return {}, "Error: Unable to parse LLM response."

#     @staticmethod
#     def validate_extraction(extracted_data):
#         """Ensure required fields exist"""
#         required_fields = [
#             "Patient Information.Name",
#             "Blood Work.HbA1c",
#             "Biometrics.BMI"
#         ]

#         for field in required_fields:
#             keys = field.split(".")
#             current = extracted_data
#             for key in keys:
#                 if not isinstance(current, dict) or key not in current:
#                     raise ValueError(f"Missing required field: {field}")
#                 current = current[key]

#         return True

#     @staticmethod
#     def parse_llm_response(response):
#         """Handle malformed JSON responses"""
#         try:
#             # Remove markdown code fences
#             cleaned = re.sub(r"```json|```", "", response)
#             return json.loads(cleaned.strip())
#         except json.JSONDecodeError:
#             # Attempt to fix common formatting issues
#             repaired = re.sub(r",\s*}", "}", cleaned)
#             return json.loads(repaired)

# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request, *args, **kwargs):
#         try:
#             if "pdf_file" not in request.FILES:
#                 return JsonResponse({"error": "No PDF file uploaded"}, status=400)

#             pdf_file = request.FILES["pdf_file"]
#             file_path = default_storage.save(f"uploads/{pdf_file.name}", ContentFile(pdf_file.read()))
#             full_path = default_storage.path(file_path)
#             print(f"Saved file at: {full_path}")  # Debugging

#             extracted_factors, health_report_text = HealthReportService.analyze_pdf_with_qwen(full_path)
#             print("Extracted Data:", json.dumps(extracted_factors, indent=4))  # Debugging

#             HealthReportService.validate_extraction(extracted_factors)

#             report_pdf_path = os.path.join(settings.MEDIA_ROOT, "reports", "health_report.pdf")
#             os.makedirs(os.path.dirname(report_pdf_path), exist_ok=True)  # Ensure directory exists
#             self.create_pdf_report(report_pdf_path, extracted_factors, health_report_text)

#             default_storage.delete(file_path)
#             report_url = request.build_absolute_uri(settings.MEDIA_URL + "reports/health_report.pdf")
#             return JsonResponse({"message": "File processed", "file_url": report_url})

#         except Exception as e:
#             import traceback
#             error_details = traceback.format_exc()  # Get full stack trace
#             print(f"Error: {error_details}")  # Debugging

#             return JsonResponse({"error": str(e), "details": error_details}, status=500)

#     def create_pdf_report(self, pdf_path, extracted_factors, text_report):
#         """Creates a well-structured PDF containing extracted health factors and AI-generated analysis."""
#         os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

#         pdf = FPDF()
#         pdf.set_auto_page_break(auto=True, margin=15)
#         pdf.add_page()

#         # Title
#         pdf.set_font("Arial", 'B', 16)
#         pdf.cell(200, 10, "Health Report", ln=True, align="C")
#         pdf.ln(10)

#         # Section Headers
#         def add_section_header(title):
#             pdf.set_font("Arial", 'B', 14)
#             pdf.cell(0, 10, title, ln=True)
#             pdf.ln(5)

#         # Add Data Section
#         def add_data_section(data, indent=0):
#             pdf.set_font("Arial", size=12)
#             for key, value in data.items():
#                 if isinstance(value, dict):
#                     pdf.cell(indent, 10, f"{key}:", ln=True)
#                     add_data_section(value, indent + 10)
#                 elif isinstance(value, list):
#                     pdf.cell(indent, 10, f"{key}:", ln=True)
#                     for item in value:
#                         pdf.cell(indent + 10, 10, f"- {item}", ln=True)
#                 else:
#                     pdf.cell(indent, 10, f"{key}: {value}", ln=True)
#             pdf.ln(5)

#         # Patient Information
#         if "Patient Information" in extracted_factors:
#             add_section_header("Patient Information")
#             add_data_section(extracted_factors["Patient Information"])

#         # Biometrics
#         if "Biometrics" in extracted_factors:
#             add_section_header("Biometrics")
#             add_data_section(extracted_factors["Biometrics"])

#         # Blood Work
#         if "Blood Work" in extracted_factors:
#             add_section_header("Blood Work")
#             add_data_section(extracted_factors["Blood Work"])

#         # Diagnoses
#         if "Diagnoses" in extracted_factors:
#             add_section_header("Diagnoses")
#             add_data_section({"Diagnoses": extracted_factors["Diagnoses"]})

#         # AI Health Analysis
#         add_section_header("AI Health Analysis")
#         pdf.set_font("Arial", size=12)
#         pdf.multi_cell(0, 8, text_report.encode('latin-1', 'ignore').decode('latin-1'))

#         # Save PDF
#         pdf.output(pdf_path)


# class CSRFTokenView(View):
#     def get(self, request, *args, **kwargs):
#         return JsonResponse({"csrfToken": get_token(request)})
# import os
# import json
# import pdfplumber
# import ollama
# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token

# class HealthReportService:
#     @staticmethod
#     def extract_health_factors(pdf_path):
#         """Extracts health factors dynamically using Qwen 2.5 0.5B model."""
#         extracted_text = ""

#         try:
#             with pdfplumber.open(pdf_path) as pdf:
#                 for page in pdf.pages:
#                     text = page.extract_text()
#                     if text:
#                         extracted_text += text + "\n"

#             if not extracted_text:
#                 return {"error": "No readable text found in PDF."}

#             prompt = f"""
#             Extract the following health parameters from the given medical report text:

#             - Patient Name
#             - Age
#             - Gender
#             - Registration ID
#             - Sample Number
#             - Referred By
#             - Order Date & Time
#             - HbA1c
#             - Insulin Levels
#             - RBC Count
#             - Hemoglobin
#             - PCV
#             - MCV
#             - MCH
#             - MCHC
#             - RDW
#             - Total Cholesterol
#             - LDL Cholesterol
#             - HDL Cholesterol
#             - Triglycerides
#             - Blood Pressure
#             - CRP
#             - BMI
#             - Waist-to-Hip Ratio
#             - Visceral Fat Percentage
#             - Thyroid Function (TSH)
#             - Serum B12 Levels

#             Provide the extracted values in structured JSON format.

#             **Medical Report Text:**
#             {extracted_text}
#             """

#             response = ollama.chat(
#                 model="qwen2.5:0.5b",  # ✅ Using your locally pulled model
#                 messages=[{"role": "user", "content": prompt}]
#             )

#             if "message" not in response or "content" not in response["message"]:
#                 print("Qwen Response Error:", response)  # Debugging
#                 return {"error": "Unexpected response format from Qwen."}

#             try:
#                 extracted_factors = json.loads(response["message"]["content"])
#             except json.JSONDecodeError:
#                 print("Invalid JSON from Qwen:", response["message"]["content"])  # Debugging
#                 extracted_factors = {"error": "Failed to parse extracted data."}

#         except Exception as e:
#             extracted_factors = {"error": f"Extraction failed: {str(e)}"}
        
#         return extracted_factors

#     @staticmethod
#     def generate_health_report(extracted_factors):
#         """Generates a health report using the Gemma model."""
#         prompt = f"""
#         Patient: {extracted_factors.get("Patient Name", "Unknown")}
#         Age: {extracted_factors.get("Age", "Unknown")}
#         Gender: {extracted_factors.get("Gender", "Unknown")}

#         **Generate Ultra-Comprehensive Health Report**  
#         Lab Results:  
#         {json.dumps(extracted_factors, indent=4)}

#         Structure:
#         - 🌟 Health Snapshot (3 emoji key findings)
#         - 🎯 Risk Radar (Urgent health risks)
#         - 📈 Suggested visualizations & metric correlations
#         - 🍽️ 7-day Indian diet plan
#         - 💪 Fitness routines
#         - 🌿 Home remedies & Ayurvedic tips
#         - ⚠️ Red Flag Alerts (Doctor consultation required)
#         - 📅 30-Day Action Plan
#         - 🧠 Mind-Body wellness practices
#         - 🔍 Preventive care checklist

#         **Use motivational quotes, progress tables, ASCII illustrations, and a friendly tone.**
#         """

#         response = ollama.chat(
#             model="gemma:2b",
#             messages=[{"role": "system", "content": "You are HealthGPT - India's most trusted AI health advisor."},
#                       {"role": "user", "content": prompt}]
#         )

#         return response["message"]["content"]

# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"error": "No PDF file uploaded"}, status=400)

#         file_path = None  # Ensure we define it before the try block

#         try:
#             pdf_file = request.FILES["pdf_file"]
#             file_path = default_storage.save(f"uploads/{pdf_file.name}", ContentFile(pdf_file.read()))
#             full_path = default_storage.path(file_path)

#             if not os.path.exists(full_path):
#                 return JsonResponse({"error": "Failed to save PDF file."}, status=500)

#             extracted_factors = HealthReportService.extract_health_factors(full_path)
            
#             if "error" in extracted_factors:
#                 return JsonResponse({"status": "error", "message": extracted_factors["error"]}, status=500)

#             health_report_text = HealthReportService.generate_health_report(extracted_factors)

#             return JsonResponse({
#                 "status": "success",
#                 "data": {
#                     "factors": extracted_factors,
#                     "report": health_report_text
#                 }
#             })

#         except Exception as e:
#             print("Upload Error:", str(e))  # Debugging
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)
        
#         finally:
#             if file_path and default_storage.exists(file_path):
#                 default_storage.delete(file_path)  # ✅ Safe deletion

# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})


# import os
# import json
# import pytesseract
# from PIL import Image
# from pdf2image import convert_from_path
# import ollama
# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token
# import logging

# # ✅ Set Tesseract Path (Update for Windows)
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# # Create a logger for debugging
# logger = logging.getLogger(__name__)

# class HealthReportService:
#     @staticmethod
#     def split_text_into_paragraphs(text):
#         """Split text into paragraphs or logical chunks based on newline characters."""
#         return text.split("\n\n")

#     @staticmethod
#     def extract_text_from_pdf(pdf_path):
#         """Extracts raw text from a PDF (OCR for scanned PDFs)."""
#         extracted_text = ""

#         try:
#             images = convert_from_path(pdf_path, dpi=300)  # 🔹 Convert PDF to images
#             for img in images:
#                 text = pytesseract.image_to_string(img)  # 🔹 OCR Extraction
#                 extracted_text += text + "\n"

#             if not extracted_text.strip():
#                 return {"error": "No readable text found in PDF."}

#             return extracted_text

#         except Exception as e:
#             return {"error": f"Text extraction failed: {str(e)}"}

#     @staticmethod
#     def preprocess_text(raw_text):
#         """Preprocess the raw OCR text to remove any unnecessary newlines or spaces."""
#         return raw_text.strip().replace('\n', ' ').replace('\r', ' ')

#     @staticmethod
#     def extract_health_factors_with_llm(raw_text):
#         """Uses an LLM (Gemma) to dynamically extract health factors."""
#         # Preprocess the raw OCR text before passing it to the LLM
#         processed_text = HealthReportService.preprocess_text(raw_text)
        
#         # Split the processed text into meaningful paragraphs or chunks
#         text_chunks = HealthReportService.split_text_into_paragraphs(processed_text)

#         extracted_factors = {}
        
#         # Process each paragraph/chunk separately
#         for chunk_index, chunk in enumerate(text_chunks):
#             if not chunk.strip():  # Skip empty chunks
#                 continue
            
#             prompt = f"""
#             Extract the following health parameters from the given medical report text:

#             - Patient Name
#             - Age
#             - Gender
#             - Registration ID
#             - Sample Number
#             - Referred By
#             - Order Date & Time
#             - HbA1c
#             - Insulin Levels
#             - RBC Count
#             - Hemoglobin
#             - PCV
#             - MCV
#             - MCH
#             - MCHC
#             - RDW
#             - Total Cholesterol
#             - LDL Cholesterol
#             - HDL Cholesterol
#             - Triglycerides
#             - Blood Pressure
#             - CRP
#             - BMI
#             - Waist-to-Hip Ratio
#             - Visceral Fat Percentage
#             - Thyroid Function (TSH)
#             - Serum B12 Levels

#             **Medical Report Text:**
#             {chunk}
#             """

#             try:
#                 logger.debug(f"Sending chunk {chunk_index+1}/{len(text_chunks)} to LLM: {chunk[:200]}...")  # Log the first 200 chars of the chunk
#                 response = ollama.chat(
#                     model="gemma:2b",  # ✅ Using Gemma for extraction
#                     messages=[{"role": "user", "content": prompt}]
#                 )

#                 # Log the response from the model
#                 logger.debug(f"Response for chunk {chunk_index+1}: {response}")
                
#                 if "message" in response and "content" in response["message"]:
#                     chunk_factors = json.loads(response["message"]["content"])
#                     extracted_factors.update(chunk_factors)  # Update the extracted factors with each chunk
#                 else:
#                     logger.error(f"No valid response for chunk {chunk_index+1}")
#                     continue  # Continue processing other chunks even if one fails

#             except Exception as e:
#                 logger.error(f"Error processing chunk {chunk_index+1}: {str(e)}")
#                 continue  # Continue processing other chunks even if one fails

#         return extracted_factors

#     @staticmethod
#     def generate_health_report(extracted_factors):
#         """Generates a health report using Gemma."""
#         prompt = f"""
#         Patient: {extracted_factors.get("Patient Name", "Unknown")}
#         Age: {extracted_factors.get("Age", "Unknown")}
#         Gender: {extracted_factors.get("Gender", "Unknown")}

#         **Ultra-Comprehensive Health Report**  
#         Lab Results:  
#         {json.dumps(extracted_factors, indent=4)}

#         Structure:
#         - 🌟 Key Health Highlights
#         - 🎯 Risk Radar (Critical health risks)
#         - 📊 Metric Correlations (e.g., HbA1c vs. BMI)
#         - 🍽️ Personalized Diet Plan
#         - 💪 Fitness & Lifestyle Tips
#         - 🌿 Ayurvedic & Home Remedies
#         - 🚨 Doctor Consultation Red Flags
#         - 📅 30-Day Health Plan
#         - 🧘 Mind-Body Wellness Practices
#         - ✅ Preventive Care Checklist

#         **Use motivational quotes, health progress charts, and a friendly, engaging tone.**
#         """

#         response = ollama.chat(
#             model="gemma:2b",
#             messages=[{"role": "system", "content": "You are HealthGPT - a trusted AI health advisor."},
#                       {"role": "user", "content": prompt}]
#         )

#         return response["message"]["content"]

#     @staticmethod
#     def process_pdf_report(pdf_path):
#         """Complete pipeline: Extracts text, extracts health factors, and generates a report."""
#         raw_text = HealthReportService.extract_text_from_pdf(pdf_path)

#         if "error" in raw_text:
#             return raw_text  # Return error if OCR fails

#         extracted_factors = HealthReportService.extract_health_factors_with_llm(raw_text)

#         if "error" in extracted_factors:
#             return extracted_factors  # Return error if LLM extraction fails

#         health_report = HealthReportService.generate_health_report(extracted_factors)

#         return {"factors": extracted_factors, "report": health_report}


# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"error": "No PDF file uploaded"}, status=400)

#         file_path = None  # Ensure we define it before the try block

#         try:
#             pdf_file = request.FILES["pdf_file"]
#             file_path = default_storage.save(f"uploads/{pdf_file.name}", ContentFile(pdf_file.read()))
#             full_path = default_storage.path(file_path)

#             if not os.path.exists(full_path):
#                 return JsonResponse({"error": "Failed to save PDF file."}, status=500)

#             # ✅ Run Full Pipeline (OCR → Factor Extraction → Report Generation)
#             result = HealthReportService.process_pdf_report(full_path)

#             if "error" in result:
#                 return JsonResponse({"status": "error", "message": result["error"]}, status=500)

#             return JsonResponse({
#                 "status": "success",
#                 "data": result
#             })

#         except Exception as e:
#             logger.error("Upload Error:", str(e))  # Debugging
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)
        
#         finally:
#             if file_path and default_storage.exists(file_path):
#                 default_storage.delete(file_path)  # ✅ Safe deletion


# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})




# import os
# import re
# import json
# import pdfplumber
# import ollama
# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token

# # ========================
# # 1. HEALTH FACTORS TO EXTRACT
# # ========================
# test_patterns = {
#     "Name": r"(?i)Patient's\s+name\s*:\s*([\w\s]+)",
#     "Reg_ID": r"(?i)Reg\.?\s*ID\s*:\s*([\w\-]+)",
#     "Age": r"(?i)Age\s*\/\s*Sex\s*:\s*(\d+)",
#     "Gender": r"(?i)Age\s*\/\s*Sex\s*:\s*\d+\s*Years\s*\/\s*(Male|Female|Other)",
#     "Sample_No": r"(?i)Sample\s*No\.?\s*:\s*(\d+)",
#     "Referred_By": r"(?i)Referred\s*by\s*:\s*([\w\s]+)",
#     "Order_Date_Time": r"(?i)Order\s*Dt\s*\/\s*time\s*:\s*([\d\/\s:]+)",
#     "HbA1c": r"(?i)HbA1c[\s\.\-]*:\s*([\d\.]+)%",
#     "Insulin Levels": r"(?i)Insulin[\s\.\-]*Levels[\s\.\-]*:\s*([\d\.]+) U/L",
#     "RBC Count": r"(?i)Total[\s\.\-]*RBC[\s\.\-]*Count[\s\.\-]*:\s*([\d\.]+) mill/cmm",
#     "Hemoglobin": r"(?i)Hemoglobin[\s\.\-]*:\s*([\d\.]+) g/dl",
#     "PCV": r"(?i)P[\s\.\-]*C[\s\.\-]*V[\s\.\-]*:\s*([\d\.]+) %",
#     "MCV": r"(?i)M[\s\.\-]*C[\s\.\-]*V[\s\.\-]*:\s*([\d\.]+) femtolitre",
#     "MCH": r"(?i)M[\s\.\-]*C[\s\.\-]*H[\s\.\-]*:\s*([\d\.]+) pg",
#     "MCHC": r"(?i)M[\s\.\-]*C[\s\.\-]*H[\s\.\-]*C[\s\.\-]*:\s*([\d\.]+) g/dl",
#     "RDW": r"(?i)R[\s\.\-]*D[\s\.\-]*W[\s\.\-]*:\s*([\d\.]+) %",
#     "Total Cholesterol": r"(?i)Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "LDL Cholesterol": r"(?i)LDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "HDL Cholesterol": r"(?i)HDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "Triglycerides": r"(?i)Triglyceride[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "Blood Pressure": r"(?i)Blood[\s\.\-]*Pressure[\s\.\-]*:\s*([\d\.]+)/([\d\.]+) mmHg",
#     "CRP": r"(?i)CRP[\s\.\-]*:\s*([\d\.]+) mg/L",
#     "BMI": r"(?i)BMI[\s\.\-]*:\s*([\d\.]+)",
#     "Waist-to-Hip Ratio": r"(?i)Waist[\s\.\-]*to[\s\.\-]*Hip[\s\.\-]*Ratio[\s\.\-]*:\s*([\d\.]+)",
#     "Visceral Fat Percentage": r"(?i)Visceral[\s\.\-]*Fat[\s\.\-]*Percentage[\s\.\-]*:\s*([\d\.]+) %",
#     "Thyroid Function": r"(?i)Serum[\s\.\-]*TSH[\s\.\-]*:\s*([\d\.]+) µIU/ml",

# }

# class HealthReportService:
#     @staticmethod
#     def extract_health_factors(pdf_path):
#         """Extracts specific health factors from the PDF."""
#         extracted_results = {}

#         with pdfplumber.open(pdf_path) as pdf:
#             for page in pdf.pages:
#                 page_text = page.extract_text()
#                 if not page_text:
#                     continue
                
#                 for test, pattern in test_patterns.items():
#                     if test not in extracted_results:  
#                         match = re.search(pattern, page_text, re.IGNORECASE)
#                         if match:
#                             extracted_results[test] = match.group(1)

#         return extracted_results

#     @staticmethod
#     def generate_health_report(extracted_factors):
#         """Generates a structured AI-based health report using extracted factors."""
        
#         health_summary = "\n".join([f"- **{key}**: {value}" for key, value in extracted_factors.items()])

#         prompt = f"""
#         Patient: {extracted_factors.get("Name", "Unknown")}
#         Age: {extracted_factors.get("Age", "Unknown")}
#         Gender: {extracted_factors.get("Gender", "Unknown")}

#         Here are the key extracted health factors:
#         {health_summary}

#         **Generate a structured health report with these sections:**
#         🌟 **Health Snapshot** (Key findings)
#         🎯 **Risk Radar** (Potential health risks)
#         🍽️ **Diet Plan**
#         💪 **Fitness Plan**
#         🌿 **Home Remedies**
#         ⚠️ **Red Flag Alerts**
#         📅 **30-Day Action Plan**
#         🧠 **Mind-Body Wellness**

#         Return the report **strictly in valid JSON format**, like this:

#         {{
#             "🌟 Health Snapshot": "...",
#             "🎯 Risk Radar": "...",
#             "🍽️ Diet Plan": "...",
#             "💪 Fitness Plan": "...",
#             "🌿 Home Remedies": "...",
#             "⚠️ Red Flag Alerts": "...",
#             "📅 30-Day Action Plan": "...",
#             "🧠 Mind-Body Wellness": "..."
#         }}
#         """

#         response = ollama.chat(
#             model="gemma:2b",
#             messages=[{"role": "user", "content": prompt}]
#         )

#         try:
#             report_json = json.loads(response["message"]["content"])  
#         except json.JSONDecodeError:
#             report_json = {"error": "Failed to parse AI response."}

#         return report_json

# # ========================
# # 2. DJANGO VIEWS
# # ========================

# @method_decorator(csrf_exempt, name="dispatch")

# class UploadReportView(View):
#     @method_decorator(csrf_exempt)
#     def dispatch(self, *args, **kwargs):
#         return super().dispatch(*args, **kwargs)

#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         try:
#             pdf_file = request.FILES["pdf_file"]
#             file_path = default_storage.save(f"uploads/{pdf_file.name}", ContentFile(pdf_file.read()))
#             full_path = default_storage.path(file_path)

#             if not os.path.exists(full_path):
#                 return JsonResponse({"status": "error", "message": "Failed to save PDF file."}, status=500)

#             # ✅ Extract Health Factors
#             extracted_factors = HealthReportService.extract_health_factors(full_path)

#             if not extracted_factors:  # Check if extraction failed
#                 return JsonResponse({"status": "error", "message": "No health factors found in the PDF."}, status=400)

#             # ✅ Save Extracted Data
#             factors_file = os.path.join(settings.MEDIA_ROOT, "extracted_factors.json")
#             with open(factors_file, "w") as file:
#                 json.dump(extracted_factors, file)

#             # ✅ Generate AI Health Report
#             health_report = HealthReportService.generate_health_report(extracted_factors)

#             # ✅ Ensure AI response is valid JSON
#             try:
#                 content = health_report.get("message", {}).get("content", "{}")
#                 parsed_report = json.loads(content)
#             except json.JSONDecodeError:
#                 parsed_report = {"error": "AI response is not valid JSON."}

#             # ✅ Delete Uploaded PDF **AFTER SUCCESSFUL PROCESSING**
#             default_storage.delete(file_path)

#             return JsonResponse({
#                 "status": "success",
#                 "health_report": parsed_report
#             })

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)


# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})




# import os
# import re
# import json
# import pdfplumber
# import ollama
# from fpdf import FPDF
# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token

# # ========================
# # Define Health Factors to Extract
# # ========================
# TEST_PATTERNS = {
#     "Name": r"(?i)Patient's\s+name\s*:\s*([\w\s]+)",
#     "Reg_ID": r"(?i)Reg\.?\s*ID\s*:\s*([\w\-]+)",
#     "Age": r"(?i)Age\s*\/\s*Sex\s*:\s*(\d+)",
#     "Gender": r"(?i)Age\s*\/\s*Sex\s*:\s*\d+\s*Years\s*\/\s*(Male|Female|Other)",
#     "Sample_No": r"(?i)Sample\s*No\.?\s*:\s*(\d+)",
#     "Referred_By": r"(?i)Referred\s*by\s*:\s*([\w\s]+)",
#     "Order_Date_Time": r"(?i)Order\s*Dt\s*\/\s*time\s*:\s*([\d\/\s:]+)",
#     "HbA1c": r"(?i)HbA1c[\s\.\-]*:\s*([\d\.]+)%",
#     "Insulin Levels": r"(?i)Insulin[\s\.\-]*Levels[\s\.\-]*:\s*([\d\.]+) U/L",
#     "RBC Count": r"(?i)Total[\s\.\-]*RBC[\s\.\-]*Count[\s\.\-]*:\s*([\d\.]+) mill/cmm",
#     "Hemoglobin": r"(?i)Hemoglobin[\s\.\-]*:\s*([\d\.]+) g/dl",
#     "PCV": r"(?i)P[\s\.\-]*C[\s\.\-]*V[\s\.\-]*:\s*([\d\.]+) %",
#     "MCV": r"(?i)M[\s\.\-]*C[\s\.\-]*V[\s\.\-]*:\s*([\d\.]+) femtolitre",
#     "MCH": r"(?i)M[\s\.\-]*C[\s\.\-]*H[\s\.\-]*:\s*([\d\.]+) pg",
#     "MCHC": r"(?i)M[\s\.\-]*C[\s\.\-]*H[\s\.\-]*C[\s\.\-]*:\s*([\d\.]+) g/dl",
#     "Total Cholesterol": r"(?i)Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "LDL Cholesterol": r"(?i)LDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "HDL Cholesterol": r"(?i)HDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "Triglycerides": r"(?i)Triglyceride[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "Blood Pressure": r"(?i)Blood[\s\.\-]*Pressure[\s\.\-]*:\s*([\d\.]+)/([\d\.]+) mmHg",
#     "BMI": r"(?i)BMI[\s\.\-]*:\s*([\d\.]+)",
#     "Waist-to-Hip Ratio": r"(?i)Waist[\s\.\-]*to[\s\.\-]*Hip[\s\.\-]*Ratio[\s\.\-]*:\s*([\d\.]+)",
#     "Serum B12 Levels": r"(?i)Serum[\s\.\-]*B[\s\.\-]*12[\s\.\-]*Level[\s\.\-]*:\s*([\d\.]+) pg/ml"
# }

# class HealthReportService:
#     @staticmethod
#     def extract_health_factors(pdf_path):
#         """Extracts specific health factors from the PDF."""
#         extracted_results = {key: "Not Found" for key in TEST_PATTERNS}

#         with pdfplumber.open(pdf_path) as pdf:
#             for page in pdf.pages:
#                 page_text = page.extract_text()
#                 if not page_text:
#                     continue
                
#                 for test, pattern in TEST_PATTERNS.items():
#                     if extracted_results[test] == "Not Found": 
#                         match = re.search(pattern, page_text, re.IGNORECASE)
#                         if match:
#                             extracted_results[test] = match.group(1)

#                 if all(value != "Not Found" for value in extracted_results.values()):
#                     break  

#         return extracted_results
    
#     @staticmethod
#     def generate_health_report(extracted_factors):
#         """Generates a structured health analysis report."""
        
#         present_factors = {k: v for k, v in extracted_factors.items() if v != "Not Found"}

#         prompt = f"""
#         Generate a **detailed health report** based on the extracted health factors below.

# ### **👤 Patient Details:**
# - **Name:** {present_factors.get('Name', 'N/A')}
# - **Age:** {present_factors.get('Age', 'N/A')}
# - **Gender:** {present_factors.get('Gender', 'N/A')}

# ### **📊 Extracted Health Metrics:**
# {json.dumps(present_factors, indent=2)}

# ### **🩺 Health Report Structure**
# Please structure the report into sections with clear headings. Each section should be **point-wise, concise, and actionable**.

# ---

# ## **1️⃣ Health Summary**  
# - Provide an **overview** of the patient's health.  
# - Highlight **any concerning factors** (e.g., high cholesterol, low hemoglobin).  

# ---

# ## **2️⃣ Detailed Analysis**  
# For each **extracted metric**, include:  
# ✅ **Value & Ideal Range** (e.g., *Cholesterol: 220 mg/dL (Ideal: <200 mg/dL)*)  
# ✅ **What it means** (e.g., *High cholesterol increases heart disease risk.*)  
# ✅ **Risk Level:** 🟢 Normal | 🟡 Borderline | 🔴 Critical  
# ✅ **Symptoms if abnormal** (e.g., *High sugar can cause fatigue, thirst, and blurred vision.*)  
# ✅ **When to consult a doctor** (e.g., *Consult a doctor if cholesterol exceeds 240 mg/dL.*)  

# **Example:**  
# 🔸 **Total Cholesterol: 220 mg/dL** *(Ideal: <200 mg/dL)*  
# - **🟡 Borderline High** - May increase the risk of heart disease.  
# - **🚨 Symptoms:** No symptoms at this stage, but prolonged high cholesterol can lead to artery blockages.  
# - **👨‍⚕️ When to Consult a Doctor:** If cholesterol is persistently high (>240 mg/dL), seek medical advice.  
# - **🛠 What You Can Do:**  
#   - 🥦 **Diet:** Increase fiber intake (oats, nuts, leafy greens).  
#   - 🏃 **Exercise:** 30 mins of cardio daily.  
#   - ⚕️ **Tests to Monitor:** Lipid profile every 6 months.  

# ---

# ## **3️⃣ Dietary Recommendations**  
# - Recommend **foods to eat** for low/borderline metrics.  
# - Suggest **foods to avoid** for high-risk factors.  
# - Provide a **structured diet plan** (e.g., *low-sugar diet for diabetes, high-iron diet for anemia*).  

# ---

# ## **4️⃣ Exercise & Lifestyle Changes**  
# - Suggest **specific exercises** (e.g., *cardio for high cholesterol, strength training for low hemoglobin*).  
# - Recommend **daily habits** (e.g., *reduce screen time before sleep, drink more water*).  
# - Provide a **weekly plan** (e.g., *Monday: 30 mins walking, Tuesday: strength training*).  

# ---

# ## **5️⃣ Monitoring & Next Steps**  
# - Recommend **follow-up tests & their frequency** (e.g., *HbA1c every 3 months for diabetes*).  
# - Suggest **self-monitoring techniques** (e.g., *home BP monitor, glucometer for sugar*).  
# - **When to consult a doctor** based on test results.  

# ---

# **🔹 Ensure the report is simple, structured, and actionable for the patient!**  

#         """

#         response = ollama.chat(
#             model="gemma:2b",
#             messages=[
#                 {"role": "system", "content": "You are DoctorGPT. Provide structured, user-friendly health reports with detailed analysis before offering recommendations."},
#                 {"role": "user", "content": prompt}
#             ]
#         )

#         return response["message"]["content"]

# # ========================
# # 2. DJANGO VIEWS
# # ========================

# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         try:
#             pdf_file = request.FILES["pdf_file"]
#             file_path = default_storage.save(f"uploads/{pdf_file.name}", ContentFile(pdf_file.read()))
#             full_path = default_storage.path(file_path)

#             if not os.path.exists(full_path):
#                 return JsonResponse({"status": "error", "message": "Failed to save PDF file."}, status=500)

#             # ✅ Extract health factors
#             extracted_factors = HealthReportService.extract_health_factors(full_path)

#             # ✅ Generate AI-based health report
#             health_report_text = HealthReportService.generate_health_report(extracted_factors)

#             # ✅ Convert AI report to JSON (if needed)
#             try:
#                 health_report_json = json.loads(health_report_text)
#             except json.JSONDecodeError:
#                 health_report_json = {"report": health_report_text}  

#             # ✅ Delete uploaded file after processing
#             default_storage.delete(file_path)

#             return JsonResponse({
#                 "status": "success",
#                 "extracted_factors": extracted_factors,
#                 "health_report": health_report_json,
#             })

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)

# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})




# import os
# import re
# import json
# import pdfplumber
# import ollama
# from fpdf import FPDF
# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token
# from datetime import datetime, timedelta

# # accounts/views.py

# # ========================
# # Define Health Factors to Extract
# # ========================
# TEST_PATTERNS = {
#     "Name": r"(?i)(?:Patient's\s+name|Name)\s*:\s*([\w\s.]+)",
#     "Reg_ID": r"(?i)Reg\.?\s*ID\s*:\s*([\w\-]+)",
#     "Age": r"(?i)(?:Sex\/Age|Age\/Sex)\s*:\s*(?:\w+\s*\/\s*)?(\d+)?",
#     "Gender": r"(?i)(?:Sex\/Age|Age\/Sex)\s*:\s*\d*\s*\/\s*(Male|Female|Other)?",
#     "Sample_No": r"(?i)Sample\s*No\.?\s*:\s*(\d+)",
#     "Referred By": r"(?i)(?:Referred\s*by|Ref\.\s*By)\s*:\s*([\w\s]+)",
#     "Order_Date_Time": r"(?i)Order\s*Dt\s*\/\s*time\s*:\s*([\d\/\s:]+)",
#     "Insulin Levels": r"(?i)Insulin[\s\.\-]*Levels[\s\.\-]*:\s*([\d\.]+) U/L",
#     "RBC Count": r"(?i)Total[\s\.\-]*RBC[\s\.\-]*Count[\s\.\-]*:\s*([\d\.]+) mill/cmm",
#     "Hemoglobin": r"(?i)Hemoglobin[\s\.\-]*:\s*([\d\.]+) g/dl",
#     "PCV": r"(?i)P[\s\.\-]*C[\s\.\-]*V[\s\.\-]*:\s*([\d\.]+) %",
#     "MCV": r"(?i)M[\s\.\-]*C[\s\.\-]*V[\s\.\-]*:\s*([\d\.]+) femtolitre",
#     "MCH": r"(?i)M[\s\.\-]*C[\s\.\-]*H[\s\.\-]*:\s*([\d\.]+) pg",
#     "MCHC": r"(?i)M[\s\.\-]*C[\s\.\-]*H[\s\.\-]*C[\s\.\-]*:\s*([\d\.]+) g/dl",
#     "Total Cholesterol": r"(?i)Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "LDL Cholesterol": r"(?i)LDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "HDL Cholesterol": r"(?i)HDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "Triglycerides": r"(?i)Triglyceride[\s\.\-]*:\s*([\d\.]+) mg/dl",
#     "Serum B12 Levels": r"(?i)Serum[\s\.\-]*B[\s\.\-]*12[\s\.\-]*Level[\s\.\-]*:\s*([\d\.]+) pg/ml",
#     "Fasting Blood Sugar":r"(?i)(?:Fasting\s*Blood\s*Sugar|Blood\s*Sugar)\s*:\s*([\d.]+)",
#     "Case ID": r"(?i)Case\s*ID\s*:\s*([\w\d]+)",
#     "Patient ID": r"(?i)Pt\.\s*ID\s*:\s*([\w\d]+)", 
#     "Mobile No": r"(?i)Mobile\s*No\.\s*:\s*(\d+)",
#     "Collection Center": r"(?i)(?:Bill\.\s*Loc\.|Collection\s*Center)\s*:\s*([\w\s]+)",
#     "Sample Type": r"(?i)Sample\s*Type\s*:\s*([\w\s]+)",
#     "Sample Collection By": r"(?i)Sample\s*Coll\.\s*By\s*:\s*([\w\s]+)",
#     "Report Date and Time": r"(?i)Report\s*Date\s*and\s*Time\s*:\s*([\d\-:\s]+)",
#     "HbA1c": r"(?i)HbA1C\s*[H]?\s*([\d\.]+)\s*%",
#      "Estimated Avg Glucose (3 Mths)": r"(?i)(?:Estimated\s*Avg\s*Glucose\s*\(3\s*Mths\)|Estimated\s*Avg\s*Glucose)\s*:\s*([\d\.]+)\s*mg/dL",
# }

# # Correct reference ranges for classification
# def classify_value(test, value):
#     ranges = {
#         "Hemoglobin": {"low": 12, "normal": (12, 15), "high": 16},
#         "Total Cholesterol": {"low": 125, "normal": (125, 200), "high": 240},
#         "LDL Cholesterol": {"low": 50, "normal": (50, 130), "high": 160},
#         "HDL Cholesterol": {"low": 40, "normal": (40, 60), "high": 100},
#         "Triglycerides": {"low": 50, "normal": (50, 150), "high": 200},
#         "Serum B12 Levels": {"low": 200, "normal": (200, 900), "high": 1000},
#         "RBC Count": {"low": 4.1, "normal": (4.1, 5.5), "high": 6.0},
#         "PCV": {"low": 36, "normal": (36, 48), "high": 55},
#         "MCV": {"low": 80, "normal": (80, 100), "high": 110},
#         "MCH": {"low": 27, "normal": (27, 32), "high": 35},
#         "MCHC": {"low": 32, "normal": (32, 36), "high": 38},
#         "Fasting Blood Sugar":{"low": 70, "normal": (70, 109), "high": 125},
#           "HbA1c": {"low": 4, "normal": (4, 5.6), "high": 6.5},  # <5.7 Normal, 5.7-6.4 Prediabetes, ≥6.5 Diabetes
#     "Estimated Avg Glucose (3 Mths)": {"low": 70, "normal": (70, 140), "high": 180},  # Ideal for diabetics <140
#     "HbA1a": {"low": 0.5, "normal": (0.5, 2), "high": 3},
    
    
#     }
    

#     if test in ranges:
#         ref = ranges[test]
#         value = float(value)
#         if value < ref["low"]:
#             return "🔴 Low (Critical)"
#         elif isinstance(ref["normal"], tuple) and ref["normal"][0] <= value <= ref["normal"][1]:
#             return "🟢 Normal"
#         elif value > ref["high"]:
#             return "🔴 High"
#         else:
#             return "🟡 Borderline"
#     return "N/A"

# class HealthReportService:
#     @staticmethod
#     def extract_health_factors(pdf_path):
#         """Extracts specific health factors from the PDF."""
#         extracted_results = {key: "Not Found" for key in TEST_PATTERNS}

#         with pdfplumber.open(pdf_path) as pdf:
#             for page in pdf.pages:
#                 page_text = page.extract_text()
#                 if not page_text:
#                     continue
                
#                 for test, pattern in TEST_PATTERNS.items():
#                     if extracted_results[test] == "Not Found": 
#                         match = re.search(pattern, page_text, re.IGNORECASE)
#                         if match:
#                             extracted_results[test] = match.group(1)

#                 if all(value != "Not Found" for value in extracted_results.values()):
#                     break  

#         # Classify values based on reference ranges
#         for test, value in extracted_results.items():
#             if value != "Not Found":
#                 extracted_results[test] = {
#                     "value": value,
#                     "classification": classify_value(test, value)
#                 }

#         return extracted_results
    
#     @staticmethod
#     def generate_health_report(extracted_factors):
#         """Generates a structured health analysis report."""
#         filtered_factors = {
#             key: value for key, value in extracted_factors.items()
#             if value != "Not Found" and value.get("value", "").strip()
#         }

#         prompt = f"""
#         Generate a **detailed health report** based strictly on the extracted health factors below.
#         Do not add interpretations or default values beyond what is provided.

#         ### **👤 Patient Details:**
#         - **Name:** {filtered_factors.get('Name', {}).get('value', 'N/A')}
#         - **Age:** {filtered_factors.get('Age', {}).get('value', 'N/A')}
#         - **Gender:** {filtered_factors.get('Gender', {}).get('value', 'N/A')}

#         ### **📊 Extracted Health Metrics:**
#         {json.dumps(filtered_factors, indent=2)}

#         ### **🩺 Health Report Structure**
#         Please structure the report into sections with clear headings. Each section should be **point-wise, concise, and actionable**.

#         ---

#         ## **1️⃣ Health Summary**  
#         - Provide an **overview** of the patient’s health based only on the extracted values.  
#         - **Do not** mention unextracted factors (i.e., factors with 'Not Found' or missing values).  
#         - Highlight **any concerning factors** based on their classification.  

#         ---

#         ## **2️⃣ Detailed Analysis**  
#         For each **extracted metric**, include:  
#         ✅ **Value & Ideal Range** (if applicable)  
#         ✅ **What it means** (based on the extracted value)  
#         ✅ **Risk Level:** 🟢 Normal | 🟡 Borderline | 🔴 Critical  
#         ✅ **Symptoms if abnormal** (if applicable)  
#         ✅ **When to consult a doctor**  
#         ✅ **Actionable steps** (e.g., diet, exercise, monitoring)  

#         ---

#         ## **3️⃣ Dietary Recommendations**  
#         - Suggest foods based on extracted values.  
#         - Do not generalize; only include recommendations for factors present in the report.  

#         ---

#         ## **4️⃣ Exercise & Lifestyle Changes**  
#         - Provide specific recommendations based on extracted values.  
#         - Avoid generic lifestyle advice unrelated to extracted factors.  

#         ---

#         ## **5️⃣ Monitoring & Next Steps**  
#         - Recommend follow-up tests for extracted factors only.  
#         - Provide self-monitoring techniques where applicable.  
#         - When to consult a doctor based on extracted values.  

#         ---

#         **🔹 Ensure the report is strictly based on extracted data without additional assumptions.**  
#         """
        
#         response = ollama.chat(
#             model="gemma:2b",
#             messages=[
#                 {"role": "system", "content": "You are DoctorGPT. Provide structured, user-friendly health reports with detailed analysis before offering recommendations."},
#                 {"role": "user", "content": prompt}
#             ]
#         )

#         return response["message"]["content"]
    
# class HealthReminderService:
#     REMINDERS_DIR = os.path.join(settings.BASE_DIR, 'health_reminders')
    
#     @staticmethod
#     def generate_reminders(patient_name, extracted_factors):
#         """Generate personalized reminders based on health factors."""
#         if not os.path.exists(HealthReminderService.REMINDERS_DIR):
#             os.makedirs(HealthReminderService.REMINDERS_DIR)
        
#         # Filter only critical or borderline factors
#         critical_factors = {
#             k: v for k, v in extracted_factors.items() 
#             if v != "Not Found" and isinstance(v, dict) and 
#             ("🔴" in v.get("classification", "") or "🟡" in v.get("classification", ""))
#         }
        
#         if not critical_factors:
#             return None
        
#         # Generate reminder content using LLM
#         prompt = f"""
#         Generate **personalized health reminders** for {patient_name} based on these critical/borderline health factors:
#         {json.dumps(critical_factors, indent=2)}
        
#         Requirements:
#         1. Create 3 daily reminders (morning, afternoon, evening) for 7 days
#         2. Each reminder should:
#            - Be specific to the health condition
#            - Include actionable steps (medication, diet, exercise)
#            - Be concise (max 160 characters for SMS)
#         3. Format as JSON with this structure:
#            {{
#              "patient_name": "{patient_name}",
#              "date_generated": "YYYY-MM-DD",
#              "reminders": {{
#                "Day 1": {{
#                  "morning": "Reminder text",
#                  "afternoon": "Reminder text",
#                  "evening": "Reminder text"
#                }},
#                // ... up to Day 7
#              }}
#            }}
#         """
        
#         response = ollama.chat(
#             model="gemma:2b",
#             messages=[
#                 {"role": "system", "content": "You are a medical assistant that generates concise, actionable health reminders."},
#                 {"role": "user", "content": prompt}
#             ]
#         )
        
#         try:
#             reminders = json.loads(response["message"]["content"])
#             return reminders
#         except json.JSONDecodeError:
#             # Fallback if LLM doesn't return valid JSON
#             return HealthReminderService._generate_fallback_reminders(patient_name, critical_factors)
    
#     @staticmethod
#     def _generate_fallback_reminders(patient_name, critical_factors):
#         """Fallback reminder generation if LLM fails"""
#         today = datetime.now().date()
#         reminders = {
#             "patient_name": patient_name,
#             "date_generated": str(today),
#             "reminders": {}
#         }
        
#         for day in range(1, 8):
#             date_str = str(today + timedelta(days=day-1))
#             reminders["reminders"][f"Day {day}"] = {
#                 "morning": f"{patient_name}, take your supplements & have iron-rich breakfast. Checked on {date_str}",
#                 "afternoon": f"{patient_name}, drink enough water & take short walk. Checked on {date_str}",
#                 "evening": f"{patient_name}, have early dinner & monitor symptoms. Checked on {date_str}"
#             }
        
#         return reminders
    
#     @staticmethod
#     def save_reminders(reminders):
#         """Save reminders to a JSON file organized by date and patient name"""
#         if not reminders:
#             return None
            
#         patient_name = reminders.get("patient_name", "unknown").replace(" ", "_")
#         date_str = reminders.get("date_generated", datetime.now().strftime("%Y-%m-%d"))
        
#         filename = f"{date_str}_{patient_name}_reminders.json"
#         filepath = os.path.join(HealthReminderService.REMINDERS_DIR, filename)
        
#         with open(filepath, 'w') as f:
#             json.dump(reminders, f, indent=2)
        
#         return filepath
    
    

# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         try:
#             pdf_file = request.FILES["pdf_file"]
#             file_path = default_storage.save(f"uploads/{pdf_file.name}", ContentFile(pdf_file.read()))
#             full_path = default_storage.path(file_path)

#             if not os.path.exists(full_path):
#                 return JsonResponse({"status": "error", "message": "Failed to save PDF file."}, status=500)

#             # ✅ Extract health factors and classify
#             extracted_factors = HealthReportService.extract_health_factors(full_path)
#             patient_name = extracted_factors.get('Name', {}).get('value', 'Unknown').split('Reg. ID')[0].strip()
#             # ✅ Generate AI-based health report
#             health_report_text = HealthReportService.generate_health_report(extracted_factors)
#             reminders = HealthReminderService.generate_reminders(patient_name, extracted_factors)
#             reminder_filepath = HealthReminderService.save_reminders(reminders)

#             # ✅ Convert AI report to JSON (if needed)
#             try:
#                 health_report_json = json.loads(health_report_text)
#             except json.JSONDecodeError:
#                 health_report_json = {"report": health_report_text}  

#             # ✅ Delete uploaded file after processing
#             default_storage.delete(file_path)

#             return JsonResponse({
#                 "status": "success",
#                 "extracted_factors": extracted_factors,
#                 "health_report": health_report_json,
#                 "reminders_generated": bool(reminders),
#                 "reminders_file": reminder_filepath or "No critical factors found"
#             })

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)

# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})


# # import os
# # import re
# # import json
# # import pdfplumber
# # import ollama
# # from fpdf import FPDF
# # from django.http import JsonResponse
# # from django.views import View
# # from django.core.files.storage import default_storage
# # from django.core.files.base import ContentFile
# # from django.conf import settings
# # from django.views.decorators.csrf import csrf_exempt
# # from django.utils.decorators import method_decorator
# # from django.middleware.csrf import get_token
# # from datetime import datetime, timedelta

# # # ========================
# # # Define Health Factors to Extract
# # # ========================
# # TEST_PATTERNS = {
# #     "Name": r"(?i)(?:Patient's\s+name|Name)\s*:\s*([\w\s.]+)",
# #     "Reg_ID": r"(?i)Reg\.?\s*ID\s*:\s*([\w\-]+)",
# #     "Age": r"(?i)(?:Sex\/Age|Age\/Sex)\s*:\s*(?:\w+\s*\/\s*)?(\d+)?",
# #     "Gender": r"(?i)(?:Sex\/Age|Age\/Sex)\s*:\s*\d*\s*\/\s*(Male|Female|Other)?",
# #     "Sample_No": r"(?i)Sample\s*No\.?\s*:\s*(\d+)",
# #     "Referred By": r"(?i)(?:Referred\s*by|Ref\.\s*By)\s*:\s*([\w\s]+)",
# #     "Order_Date_Time": r"(?i)Order\s*Dt\s*\/\s*time\s*:\s*([\d\/\s:]+)",
# #     "Insulin Levels": r"(?i)Insulin[\s\.\-]*Levels[\s\.\-]*:\s*([\d\.]+) U/L",
# #     "RBC Count": r"(?i)Total[\s\.\-]*RBC[\s\.\-]*Count[\s\.\-]*:\s*([\d\.]+) mill/cmm",
# #     "Hemoglobin": r"(?i)Hemoglobin[\s\.\-]*:\s*([\d\.]+) g/dl",
# #     "PCV": r"(?i)P[\s\.\-]*C[\s\.\-]*V[\s\.\-]*:\s*([\d\.]+) %",
# #     "MCV": r"(?i)M[\s\.\-]*C[\s\.\-]*V[\s\.\-]*:\s*([\d\.]+) femtolitre",
# #     "MCH": r"(?i)M[\s\.\-]*C[\s\.\-]*H[\s\.\-]*:\s*([\d\.]+) pg",
# #     "MCHC": r"(?i)M[\s\.\-]*C[\s\.\-]*H[\s\.\-]*C[\s\.\-]*:\s*([\d\.]+) g/dl",
# #     "Total Cholesterol": r"(?i)Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
# #     "LDL Cholesterol": r"(?i)LDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
# #     "HDL Cholesterol": r"(?i)HDL[\s\.\-]*Cholesterol[\s\.\-]*:\s*([\d\.]+) mg/dl",
# #     "Triglycerides": r"(?i)Triglyceride[\s\.\-]*:\s*([\d\.]+) mg/dl",
# #     "Serum B12 Levels": r"(?i)Serum[\s\.\-]*B[\s\.\-]*12[\s\.\-]*Level[\s\.\-]*:\s*([\d\.]+) pg/ml",
# #     "Fasting Blood Sugar": r"(?i)(?:Fasting\s*Blood\s*Sugar|Blood\s*Sugar)\s*:\s*([\d.]+)",
# #     "Case ID": r"(?i)Case\s*ID\s*:\s*([\w\d]+)",
# #     "Patient ID": r"(?i)Pt\.\s*ID\s*:\s*([\w\d]+)", 
# #     "Mobile No": r"(?i)Mobile\s*No\.\s*:\s*(\d+)",
# #     "Collection Center": r"(?i)(?:Bill\.\s*Loc\.|Collection\s*Center)\s*:\s*([\w\s]+)",
# #     "Sample Type": r"(?i)Sample\s*Type\s*:\s*([\w\s]+)",
# #     "Sample Collection By": r"(?i)Sample\s*Coll\.\s*By\s*:\s*([\w\s]+)",
# #     "Report Date and Time": r"(?i)Report\s*Date\s*and\s*Time\s*:\s*([\d\-:\s]+)",
# #     "HbA1c": r"(?i)HbA1C\s*[H]?\s*([\d\.]+)\s*%",
# #     "Estimated Avg Glucose (3 Mths)": r"(?i)(?:Estimated\s*Avg\s*Glucose\s*\(3\s*Mths\)|Estimated\s*Avg\s*Glucose)\s*:\s*([\d\.]+)\s*mg/dL",
# # }

# # # Correct reference ranges for classification
# # def classify_value(test, value):
# #     ranges = {
# #         "Hemoglobin": {"low": 12, "normal": (12, 15), "high": 16},
# #         "Total Cholesterol": {"low": 125, "normal": (125, 200), "high": 240},
# #         "LDL Cholesterol": {"low": 50, "normal": (50, 130), "high": 160},
# #         "HDL Cholesterol": {"low": 40, "normal": (40, 60), "high": 100},
# #         "Triglycerides": {"low": 50, "normal": (50, 150), "high": 200},
# #         "Serum B12 Levels": {"low": 200, "normal": (200, 900), "high": 1000},
# #         "RBC Count": {"low": 4.1, "normal": (4.1, 5.5), "high": 6.0},
# #         "PCV": {"low": 36, "normal": (36, 48), "high": 55},
# #         "MCV": {"low": 80, "normal": (80, 100), "high": 110},
# #         "MCH": {"low": 27, "normal": (27, 32), "high": 35},
# #         "MCHC": {"low": 32, "normal": (32, 36), "high": 38},
# #         "Fasting Blood Sugar": {"low": 70, "normal": (70, 109), "high": 125},
# #         "HbA1c": {"low": 4, "normal": (4, 5.6), "high": 6.5},
# #         "Estimated Avg Glucose (3 Mths)": {"low": 70, "normal": (70, 140), "high": 180},
# #     }
    
# #     if test in ranges:
# #         ref = ranges[test]
# #         try:
# #             value = float(value)
# #             if value < ref["low"]:
# #                 return "🔴 Low (Critical)"
# #             elif isinstance(ref["normal"], tuple) and ref["normal"][0] <= value <= ref["normal"][1]:
# #                 return "🟢 Normal"
# #             elif value > ref["high"]:
# #                 return "🔴 High"
# #             else:
# #                 return "🟡 Borderline"
# #         except (ValueError, TypeError):
# #             return "N/A"
# #     return "N/A"

# # class HealthReportService:
# #     @staticmethod
# #     def extract_health_factors(pdf_path):
# #         """Extracts specific health factors from the PDF."""
# #         extracted_results = {key: "Not Found" for key in TEST_PATTERNS}

# #         with pdfplumber.open(pdf_path) as pdf:
# #             for page in pdf.pages:
# #                 page_text = page.extract_text()
# #                 if not page_text:
# #                     continue
                
# #                 for test, pattern in TEST_PATTERNS.items():
# #                     if extracted_results[test] == "Not Found": 
# #                         match = re.search(pattern, page_text, re.IGNORECASE)
# #                         if match:
# #                             extracted_results[test] = match.group(1)

# #                 if all(value != "Not Found" for value in extracted_results.values()):
# #                     break  

# #         # Classify values based on reference ranges
# #         for test, value in extracted_results.items():
# #             if value != "Not Found":
# #                 extracted_results[test] = {
# #                     "value": value,
# #                     "classification": classify_value(test, value)
# #                 }

# #         return extracted_results
    
# #     @staticmethod
# #     def generate_health_report(extracted_factors):
# #         """Generates a structured health analysis report."""
# #         filtered_factors = {
# #             key: value for key, value in extracted_factors.items()
# #             if value != "Not Found" and value.get("value", "").strip()
# #         }

# #         prompt = f"""
# #         Generate a **detailed health report** based strictly on the extracted health factors below.
# #         Do not add interpretations or default values beyond what is provided.

# #         ### **👤 Patient Details:**
# #         - **Name:** {filtered_factors.get('Name', {}).get('value', 'N/A')}
# #         - **Age:** {filtered_factors.get('Age', {}).get('value', 'N/A')}
# #         - **Gender:** {filtered_factors.get('Gender', {}).get('value', 'N/A')}

# #         ### **📊 Extracted Health Metrics:**
# #         {json.dumps(filtered_factors, indent=2)}

# #         ### **🩺 Health Report Structure**
# #         Please structure the report into sections with clear headings. Each section should be **point-wise, concise, and actionable**.

# #         ---

# #         ## **1️⃣ Health Summary**  
# #         - Provide an **overview** of the patient’s health based only on the extracted values.  
# #         - **Do not** mention unextracted factors (i.e., factors with 'Not Found' or missing values).  
# #         - Highlight **any concerning factors** based on their classification.  

# #         ---

# #         ## **2️⃣ Detailed Analysis**  
# #         For each **extracted metric**, include:  
# #         ✅ **Value & Ideal Range** (if applicable)  
# #         ✅ **What it means** (based on the extracted value)  
# #         ✅ **Risk Level:** 🟢 Normal | 🟡 Borderline | 🔴 Critical  
# #         ✅ **Symptoms if abnormal** (if applicable)  
# #         ✅ **When to consult a doctor**  
# #         ✅ **Actionable steps** (e.g., diet, exercise, monitoring)  

# #         ---

# #         ## **3️⃣ Dietary Recommendations**  
# #         - Suggest foods based on extracted values.  
# #         - Do not generalize; only include recommendations for factors present in the report.  

# #         ---

# #         ## **4️⃣ Exercise & Lifestyle Changes**  
# #         - Provide specific recommendations based on extracted values.  
# #         - Avoid generic lifestyle advice unrelated to extracted factors.  

# #         ---

# #         ## **5️⃣ Monitoring & Next Steps**  
# #         - Recommend follow-up tests for extracted factors only.  
# #         - Provide self-monitoring techniques where applicable.  
# #         - When to consult a doctor based on extracted values.  

# #         ---

# #         **🔹 Ensure the report is strictly based on extracted data without additional assumptions.**  
# #         """
        
# #         response = ollama.chat(
# #             model="gemma:2b",
# #             messages=[
# #                 {"role": "system", "content": "You are DoctorGPT. Provide structured, user-friendly health reports with detailed analysis before offering recommendations."},
# #                 {"role": "user", "content": prompt}
# #             ]
# #         )

# #         return response["message"]["content"]
# # class HealthReminderService:
# #     REMINDERS_DIR = os.path.join(settings.MEDIA_ROOT, 'health_reminders')
    
# #     @staticmethod
# #     def generate_reminders(patient_name, extracted_factors):
# #         """Generate personalized reminders based on health factors."""
# #         os.makedirs(HealthReminderService.REMINDERS_DIR, exist_ok=True)
        
# #         critical_factors = {
# #             k: v for k, v in extracted_factors.items() 
# #             if v != "Not Found" and isinstance(v, dict) and 
# #             ("🔴" in v.get("classification", "") or "🟡" in v.get("classification", ""))
# #         }
        
# #         if not critical_factors:
# #             return None
        
# #         prompt = f"""
# #         Generate personalized health reminders for {patient_name} based on these health factors:
# #         {json.dumps(critical_factors, indent=2)}
        
# #         Create 3 daily reminders (morning, afternoon, evening) for 7 days.
# #         Each reminder should be specific to the health conditions mentioned.
# #         Format as JSON with day-wise structure.
# #         """
        
# #         try:
# #             response = ollama.chat(
# #                 model="gemma:2b",
# #                 messages=[
# #                     {"role": "system", "content": "You generate specific, actionable health reminders."},
# #                     {"role": "user", "content": prompt}
# #                 ]
# #             )
# #             reminders = json.loads(response["message"]["content"])
# #             reminders.update({
# #                 "patient_name": patient_name,
# #                 "date_generated": datetime.now().strftime("%Y-%m-%d"),
# #                 "health_factors": critical_factors
# #             })
# #             return reminders
# #         except (json.JSONDecodeError, KeyError):
# #             return HealthReminderService._generate_fallback_reminders(patient_name, critical_factors)
    
# #     @staticmethod
# #     def _generate_fallback_reminders(patient_name, critical_factors):
# #         """Fallback reminder generation"""
# #         today = datetime.now().date()
# #         main_factor = next(iter(critical_factors.keys()), "health")
        
# #         reminders = {
# #             "patient_name": patient_name,
# #             "date_generated": str(today),
# #             "health_factors": critical_factors,
# #             "reminders": {}
# #         }
        
# #         for day in range(1, 8):
# #             day_key = f"Day {day}"
# #             reminders["reminders"][day_key] = {
# #                 "morning": f"Morning: Check your {main_factor} levels and take prescribed medications.",
# #                 "afternoon": f"Afternoon: Have a healthy lunch and take a short walk to manage your {main_factor}.",
# #                 "evening": f"Evening: Monitor symptoms and prepare for tomorrow's reminders."
# #             }
        
# #         return reminders
    
# #     @staticmethod
# #     def save_reminders(reminders):
# #         """Save reminders to a JSON file in media folder"""
# #         if not reminders:
# #             return None
            
# #         try:
# #             patient_name = reminders.get("patient_name", "unknown").replace(" ", "_")
# #             date_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            
# #             filename = f"reminders_{date_str}_{patient_name}.json"
# #             filepath = os.path.join(HealthReminderService.REMINDERS_DIR, filename)
            
# #             with open(filepath, 'w') as f:
# #                 json.dump(reminders, f, indent=2)
            
# #             return os.path.join('health_reminders', filename)
# #         except Exception as e:
# #             print(f"Error saving reminders: {e}")
# #             return None

# # @method_decorator(csrf_exempt, name="dispatch")
# # class UploadReportView(View):
# #     def post(self, request):
# #         if "pdf_file" not in request.FILES:
# #             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

# #         try:
# #             # 1. Save uploaded file temporarily
# #             pdf_file = request.FILES["pdf_file"]
# #             temp_path = default_storage.save(f"temp_reports/{pdf_file.name}", ContentFile(pdf_file.read()))
# #             full_path = default_storage.path(temp_path)

# #             # 2. Process the report
# #             extracted_factors = HealthReportService.extract_health_factors(full_path)
# #             patient_name = extracted_factors.get('Name', {}).get('value', 'Unknown').split('Reg. ID')[0].strip()
# #             health_report = HealthReportService.generate_health_report(extracted_factors)
            
# #             # 3. Generate and save reminders
# #             reminders = HealthReminderService.generate_reminders(patient_name, extracted_factors)
# #             reminder_path = HealthReminderService.save_reminders(reminders)
            
# #             # 4. Build response
# #             response_data = {
# #                 "status": "success",
# #                 "patient_name": patient_name,
# #                 "extracted_factors": extracted_factors,
# #                 "health_report": health_report,
# #                 "reminders": {
# #                     "generated": bool(reminders),
# #                     "file_path": reminder_path,
# #                     "file_url": request.build_absolute_uri(settings.MEDIA_URL + reminder_path) if reminder_path else None
# #                 }
# #             }

# #             # 5. Clean up
# #             default_storage.delete(temp_path)
            
# #             return JsonResponse(response_data)

# #         except Exception as e:
# #             if 'temp_path' in locals() and default_storage.exists(temp_path):
# #                 default_storage.delete(temp_path)
# #             return JsonResponse({"status": "error", "message": str(e)}, status=500)

# # class CSRFTokenView(View):
# #     def get(self, request):
# #         return JsonResponse({"csrfToken": get_token(request)})




# import os
# import re
# import json
# import fitz  # PyMuPDF
# import google.generativeai as genai
# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token
# from datetime import datetime

# # Configure Gemini
# genai.configure(api_key="AIzaSyD897t0s0IAd-DPAp5z3ctbF1jSgoKhZnQ")
# model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# # ========================
# # Utility: Extract Text from PDF
# # ========================
# def extract_text_from_pdf(pdf_path):
#     doc = fitz.open(pdf_path)
#     full_text = ""
#     for page in doc:
#         full_text += page.get_text()
#     return full_text.strip()

# # ========================
# # Define Gemini Prompt Template
# # ========================
# def generate_gemini_health_summary(raw_text):
#     prompt = f"""
# Generate a detailed, easy-to-understand health summary for a female adult patient named Geetaben, based on her lab results.

# Use a compassionate, friendly tone, as if a kind doctor or health coach is explaining results to her personally. Avoid overly technical medical language unless explained clearly.

# Structure the response with headings, emojis, and patient-friendly sections. Present results with positivity and clarity — highlight good news first, and gently explain any concerns with solutions.

# Tailor your recommendations to include diet, exercise, lifestyle tips, and supplements, with separate guidance for vegetarian and non-vegetarian preferences where needed.

# Conclude with a personal, uplifting message of hope and encouragement, written in a heartfelt, speech-friendly tone — as if you are talking directly to Geetaben to comfort and empower her. Use gentle language and emojis.

# ⚠️ If any values are critically abnormal, suggest she consult her doctor.

# Structure the output in these sections:

# A. Health Summary 🩺
# Friendly greeting and quick overview of the purpose of the report.

# ✅ Good News
# Highlight results that are in a healthy or normal range. Use emojis and reassuring language.

# ⚠️ Areas of Concern
# Create a table summarizing abnormal results with simple explanations:
# Test | Value | Normal Range | Status | Meaning

# B. Red Flags & Concerns ⚠️
# Explain what abnormal results might mean in plain language. Mention symptoms or risks in a calm and informative tone.

# C. Simulated Doctor Advice 👨‍⚕️
# Suggest next steps like supplements, injections, or follow-ups. Mention if she should consult a doctor.

# D. 7-Day Diet Plan 🍽️
# Give two versions:

# 🥬 Vegetarian

# 🍗 Non-Vegetarian
# Include meals for breakfast, lunch, dinner, and snacks using a table format.

# E. 7-Day Exercise Plan 🏃
# Give two versions based on diet type. Focus on light to moderate activities (yoga, walking, stretching) that suit someone with fatigue or low energy.

# F. Lifestyle Tips 🌿
# Bullet point list of habits like hydration, rest, avoiding alcohol/smoking, stress reduction, etc.

# G. Supplements & Food Suggestions 💊
# Recommend vitamins and food sources to support her condition. Include iron, vitamin B12, vitamin C, folate, etc.

# H. Health Product Suggestions (Optional) 🏥
# Optional: Suggest home health tools like BP monitor, multivitamin brands, or a fitness tracker.

# I. Reminders & Follow-ups 🔁
# Encourage retesting in 4–6 weeks, journaling meals/symptoms, and scheduling a doctor visit if needed.

# ❣️ L. Motivational Note – Uplifting Closing Message
# Write a detailed, emotionally supportive closing message to name which is present in pdf in a tone that sounds warm, spoken, and comforting — suitable for future conversion into a speech or audio message.

# Use kind, hopeful language and empathetic emojis. Address her directly. Include these themes:

# You’re strong

# Healing is possible

# Every small step matters

# She is not alone

# Better days are ahead

# Her body can recover

# You believe in her

# Make this feel like a hug in words 💖


    
# Here is user in pdf's lab report text:
# {raw_text}

# ⚠️ Important:

# Don’t ask questions. Don’t apologize. Wait for the lab report text, then start processing immediately. You will be given the PDF of the health report.
# """
#     response = model.generate_content(prompt + raw_text)  # Combine prompt and text
#     return response.text
# # ========================
# # Upload View
# # ========================
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         # Get username from request (you can modify how you send this)
#         username = request.POST.get("username", "default_user").strip().replace(" ", "_")
#         if not username:
#             return JsonResponse({"status": "error", "message": "Username is required."}, status=400)

#         try:
#             # Prepare folder structure
#             date_str = datetime.now().strftime("%Y-%m-%d")
#             user_folder = os.path.join(settings.MEDIA_ROOT, username)
#             upload_folder = os.path.join(user_folder, "uploaded_reports")
#             generated_folder = os.path.join(user_folder, "generated_reports")

#             os.makedirs(upload_folder, exist_ok=True)
#             os.makedirs(generated_folder, exist_ok=True)

#             # Save uploaded PDF
#             pdf_file = request.FILES["pdf_file"]
#             pdf_filename = f"report_{date_str}.pdf"
#             pdf_path = os.path.join(upload_folder, pdf_filename)
#             with open(pdf_path, "wb") as f:
#                 f.write(pdf_file.read())

#             # ✅ Extract raw text
#             extracted_text = extract_text_from_pdf(pdf_path)

#             # ✅ Generate health summary using Gemini
#             health_summary = generate_gemini_health_summary(extracted_text)

#             # ✅ Save generated summary
#             summary_filename = f"summary_{date_str}.txt"
#             summary_path = os.path.join(generated_folder, summary_filename)
#             with open(summary_path, "w", encoding="utf-8") as f:
#                 f.write(health_summary)

#             return JsonResponse({
#                 "status": "success",
#                 "summary": health_summary,
#                 "raw_text": extracted_text,
#                 "uploaded_path": pdf_path,
#                 "summary_path": summary_path,
#             })

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)
# # ========================
# # CSRF Token Endpoint
# # ========================
# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})


# import os
# import re
# import json
# import fitz  # PyMuPDF
# import google.generativeai as genai
# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.core.files.base import ContentFile
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token
# from datetime import datetime

# # Configure Gemini
# genai.configure(api_key="AIzaSyD897t0s0IAd-DPAp5z3ctbF1jSgoKhZnQ")
# model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# # ========================
# # Utility: Extract Text from PDF
# # ========================
# def extract_text_from_pdf(pdf_path):
#     doc = fitz.open(pdf_path)
#     full_text = ""
#     for page in doc:
#         full_text += page.get_text()
#     return full_text.strip()

# # ========================
# # Utility: Extract Patient Name from Text
# # ========================
# def extract_patient_name(text):
#     # Try to find patient name patterns in the text
#     patterns = [
#         r"Patient Name:\s*([^\n]+)",
#         r"Name:\s*([^\n]+)",
#         r"Patient:\s*([^\n]+)",
#         r"Patient's Name:\s*([^\n]+)"
#     ]
    
#     for pattern in patterns:
#         match = re.search(pattern, text, re.IGNORECASE)
#         if match:
#             return match.group(1).strip()
    
#     return None

# # ========================
# # Define Gemini Prompt Template
# # ========================
# def generate_gemini_health_summary(raw_text):
#     # Extract patient name from the report
#     patient_name = extract_patient_name(raw_text) or "the patient"
    
#     prompt = f"""
# Generate a detailed, easy-to-understand health summary for a female adult patient named {patient_name}, based on her lab results.

# Use a compassionate, friendly tone, as if a kind doctor or health coach is explaining results to her personally. Avoid overly technical medical language unless explained clearly.

# Structure the response with headings, emojis, and patient-friendly sections. Present results with positivity and clarity — highlight good news first, and gently explain any concerns with solutions.

# Tailor your recommendations to include diet, exercise, lifestyle tips, and supplements, with separate guidance for vegetarian and non-vegetarian preferences where needed.

# Conclude with a personal, uplifting message of hope and encouragement, written in a heartfelt, speech-friendly tone — as if you are talking directly to {patient_name} to comfort and empower her. Use gentle language and emojis.

# ⚠️ If any values are critically abnormal, suggest she consult her doctor.

# Structure the output in these sections:

# A. Health Summary 🩺
# Friendly greeting and quick overview of the purpose of the report.

# ✅ Good News
# Highlight results that are in a healthy or normal range. Use emojis and reassuring language.

# ⚠️ Areas of Concern
# Create a table summarizing abnormal results with simple explanations:
# Test | Value | Normal Range | Status | Meaning

# B. Red Flags & Concerns ⚠️
# Explain what abnormal results might mean in plain language. Mention symptoms or risks in a calm and informative tone.

# C. Simulated Doctor Advice 👨‍⚕️
# Suggest next steps like supplements, injections, or follow-ups. Mention if she should consult a doctor.

# D. 7-Day Diet Plan 🍽️
# Give two versions:

# 🥬 Vegetarian

# 🍗 Non-Vegetarian
# Include meals for breakfast, lunch, dinner, and snacks using a table format.

# E. 7-Day Exercise Plan 🏃
# Give two versions based on diet type. Focus on light to moderate activities (yoga, walking, stretching) that suit someone with fatigue or low energy.

# F. Lifestyle Tips 🌿
# Bullet point list of habits like hydration, rest, avoiding alcohol/smoking, stress reduction, etc.

# G. Supplements & Food Suggestions 💊
# Recommend vitamins and food sources to support her condition. Include iron, vitamin B12, vitamin C, folate, etc.

# H. Health Product Suggestions (Optional) 🏥
# Optional: Suggest home health tools like BP monitor, multivitamin brands, or a fitness tracker.

# I. Reminders & Follow-ups 🔁
# Encourage retesting in 4–6 weeks, journaling meals/symptoms, and scheduling a doctor visit if needed.

# ❣️ L. Motivational Note – Uplifting Closing Message
# Write a detailed, emotionally supportive closing message to {patient_name} in a tone that sounds warm, spoken, and comforting — suitable for future conversion into a speech or audio message.

# Use kind, hopeful language and empathetic emojis. Address her directly. Include these themes:

# You're strong

# Healing is possible

# Every small step matters

# She is not alone

# Better days are ahead

# Her body can recover

# You believe in her

# Make this feel like a hug in words 💖

# Here is user's lab report text:
# {raw_text}

# ⚠️ Important:
# Don't ask questions. Don't apologize. Wait for the lab report text, then start processing immediately. You will be given the PDF of the health report.
# """
#     response = model.generate_content(prompt + raw_text)  # Combine prompt and text
#     return response.text

# # ========================
# # Upload View
# # ========================
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         # Get username from request (you can modify how you send this)
#         username = request.POST.get("username", "default_user").strip().replace(" ", "_")
#         if not username:
#             return JsonResponse({"status": "error", "message": "Username is required."}, status=400)

#         try:
#             # Prepare folder structure
#             date_str = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
#             user_folder = os.path.join(settings.MEDIA_ROOT, "user_reports", username)
#             upload_folder = os.path.join(user_folder, "uploaded_reports")
#             generated_folder = os.path.join(user_folder, "generated_reports")

#             os.makedirs(upload_folder, exist_ok=True)
#             os.makedirs(generated_folder, exist_ok=True)

#             # Save uploaded PDF
#             pdf_file = request.FILES["pdf_file"]
#             pdf_filename = f"report_{date_str}.pdf"
#             pdf_path = os.path.join(upload_folder, pdf_filename)
#             with open(pdf_path, "wb") as f:
#                 f.write(pdf_file.read())

#             # Extract raw text
#             extracted_text = extract_text_from_pdf(pdf_path)

#             # Generate health summary using Gemini
#             health_summary = generate_gemini_health_summary(extracted_text)

#             # Save generated summary
#             summary_filename = f"summary_{date_str}.txt"
#             summary_path = os.path.join(generated_folder, summary_filename)
#             with open(summary_path, "w", encoding="utf-8") as f:
#                 f.write(health_summary)

#             return JsonResponse({
#                 "status": "success",
#                 "summary": health_summary,
#                 "raw_text": extracted_text,
#                 "uploaded_path": os.path.relpath(pdf_path, settings.MEDIA_ROOT),
#                 "summary_path": os.path.relpath(summary_path, settings.MEDIA_ROOT),
#             })

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)

# # ========================
# # CSRF Token Endpoint
# # ========================
# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})
