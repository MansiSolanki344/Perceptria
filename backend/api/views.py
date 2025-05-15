# working code

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
# import json
# from django.views.decorators.csrf import csrf_exempt
# from django.http import JsonResponse
# from twilio.rest import Client
# from django.conf import settings

# @csrf_exempt
# def send_sms(request):
#     if request.method == 'POST':
#         try:
#             # Decode JSON body
#             data = json.loads(request.body)
#             phone_number = data.get('phone_number')
#             message_text = data.get('message')  # <-- extract message from request

#             if not phone_number or not message_text:
#                 return JsonResponse({"error": "Phone number and message are required"}, status=400)

#             # Twilio credentials
#             twilio_sid = settings.TWILIO_SID
#             twilio_auth_token = settings.TWILIO_AUTH_TOKEN
#             twilio_phone_number = settings.TWILIO_PHONE_NUMBER

#             client = Client(twilio_sid, twilio_auth_token)

#             # Send SMS using the message from request
#             message = client.messages.create(
#                 body=message_text,  # <-- use message from frontend
#                 from_=twilio_phone_number,
#                 to=phone_number
#             )

#             return JsonResponse({"message": "SMS sent successfully!"})

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=405)


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
# # Gemini Prompt Template
# # ========================
# def generate_gemini_health_summary(raw_text):
#     patient_name = extract_patient_name(raw_text) or "the patient"
#     prompt = f"""
# Generate a detailed, easy-to-understand health summary for a female adult patient named {patient_name}, based on her lab results.

# Use a compassionate, friendly tone, as if a kind doctor or health coach is explaining results to her personally. Avoid overly technical medical language unless explained clearly.

# Structure the response with headings, emojis, and patient-friendly sections Present results with positivity and clarity — highlight good news first, and gently explain any concerns with solutions.

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
# """
#     response = model.generate_content(prompt + raw_text)
#     return response.text

# # ========================
# # Upload View
# # ========================
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         username = request.POST.get("username", "default_user").strip().replace(" ", "_")
#         if not username:
#             return JsonResponse({"status": "error", "message": "Username is required."}, status=400)

#         try:
#             # Folder structure
#             date_str = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
#             user_folder = os.path.join(settings.MEDIA_ROOT, "user_reports", username)
#             upload_folder = os.path.join(user_folder, "uploaded_reports")
#             generated_folder = os.path.join(user_folder, "generated_reports")

#             os.makedirs(upload_folder, exist_ok=True)
#             os.makedirs(generated_folder, exist_ok=True)

#             # Save PDF
#             pdf_file = request.FILES["pdf_file"]
#             pdf_filename = f"report_{date_str}.pdf"
#             pdf_path = os.path.join(upload_folder, pdf_filename)
#             with open(pdf_path, "wb") as f:
#                 f.write(pdf_file.read())

#             # Extract text and generate summary
#             extracted_text = extract_text_from_pdf(pdf_path)
#             health_summary = generate_gemini_health_summary(extracted_text)

#             # Save summary
#             summary_filename = f"summary_{date_str}.txt"
#             summary_path = os.path.join(generated_folder, summary_filename)
#             with open(summary_path, "w", encoding="utf-8") as f:
#                 f.write(health_summary)

#             # Convert to media URLs for frontend
#             uploaded_url = settings.MEDIA_URL + os.path.relpath(pdf_path, settings.MEDIA_ROOT).replace("\\", "/")
#             summary_url = settings.MEDIA_URL + os.path.relpath(summary_path, settings.MEDIA_ROOT).replace("\\", "/")

#             return JsonResponse({
#                 "status": "success",
#                 "summary": health_summary,
#                 "raw_text": extracted_text,
#                 "uploaded_url": uploaded_url,
#                 "summary_url": summary_url,
#             })

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)

# # ========================
# # CSRF Token Endpoint
# # ========================
# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})


# code with alerts and pdf but error occures of latin


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
# from datetime import datetime, timedelta
# from fpdf import FPDF  # For PDF creation
# import emoji  # For emoji handling
# import unicodedata  # For text normalization

# # Configure Gemini
# genai.configure(api_key="AIzaSyD897t0s0IAd-DPAp5z3ctbF1jSgoKhZnQ")  # Replace with actual API key
# model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# # ========================
# # Utility: Extract Text from PDF
# # ========================
# def extract_text_from_pdf(pdf_path):
#     """Extract text from PDF with proper encoding handling"""
#     try:
#         doc = fitz.open(pdf_path)
#         full_text = ""
#         for page in doc:
#             text = page.get_text()
#             if text:
#                 # Normalize text and ensure proper encoding
#                 text = unicodedata.normalize('NFKC', text)
#                 full_text += text
#         return full_text.strip()
#     except Exception as e:
#         raise Exception(f"Error extracting PDF text: {str(e)}")

# # ========================
# # Utility: Extract Patient Name from Text
# # ========================
# def extract_patient_name(text):
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
# # Utility: Convert Emojis to Text Descriptions
# # ========================
# def convert_emojis_to_text(text):
#     """Convert emojis to text descriptions with proper encoding handling"""
#     try:
#         # Normalize text first
#         text = unicodedata.normalize('NFKD', text)
#         # Convert emoji to text description with square brackets
#         text = emoji.demojize(text)
#         return text.replace(':', ' [').replace('_', ' ').replace(']', '] ')
#     except Exception as e:
#         # Fallback if emoji conversion fails
#         return text

# # ========================
# # Utility: Replace Day Alerts with Dates
# # ========================
# def replace_day_alerts_with_dates(text):
#     today = datetime.now()
#     for i in range(1, 8):
#         day_str = f"Day {i}:"
#         date_str = (today + timedelta(days=i-1)).strftime("%A, %B %d:")
#         text = text.replace(day_str, date_str)
#     return text

# # ========================
# # PDF Utility
# # ========================
# def save_summary_as_pdf(summary_text, output_path):
#     """Save summary as PDF with Unicode support"""
#     try:
#         # Initialize PDF with Unicode support
#         pdf = FPDF()
#         font_path = r"C:\Users\VICTUS\Desktop\auth\static\fonts\DejaVuSans.ttf"
#         pdf.add_font('DejaVu', '', font_path, uni=True)
#         pdf.set_font('DejaVu', '', 12)
#         pdf.set_auto_page_break(auto=True, margin=15)
#         pdf.add_page()
        
#         # Process text for PDF
#         pdf_text = convert_emojis_to_text(summary_text)
        
#         # Handle encoding for PDF text
#         try:
#             # Try to encode as latin-1 first (for FPDF compatibility)
#             pdf_text.encode('latin-1')
#         except UnicodeEncodeError:
#             # If that fails, replace unsupported characters
#             pdf_text = pdf_text.encode('latin-1', 'replace').decode('latin-1')
        
#         # Add text to PDF
#         for line in pdf_text.split("\n"):
#             pdf.multi_cell(0, 10, line)
        
#         pdf.output(output_path)
#     except Exception as e:
#         raise Exception(f"Error generating PDF: {str(e)}")

# # ========================
# # Gemini Prompt Template
# # ========================
# def generate_gemini_health_summary(raw_text):
#     patient_name = extract_patient_name(raw_text) or "the patient"
#     prompt = f"""
# Generate a detailed, easy-to-understand health summary for a female adult patient named {patient_name}, based on her lab results.

# [Rest of your existing prompt remains exactly the same...]
# """
#     try:
#         response = model.generate_content(prompt + raw_text)
#         return response.text
#     except Exception as e:
#         raise Exception(f"Error generating Gemini response: {str(e)}")

# # ========================
# # Upload View
# # ========================
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         username = request.POST.get("username", "default_user").strip().replace(" ", "_")
#         if not username:
#             return JsonResponse({"status": "error", "message": "Username is required."}, status=400)

#         try:
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
            
#             # Use chunked writing for reliability
#             with open(pdf_path, "wb") as f:
#                 for chunk in pdf_file.chunks():
#                     f.write(chunk)

#             # Process PDF
#             extracted_text = extract_text_from_pdf(pdf_path)
#             health_summary = generate_gemini_health_summary(extracted_text)
#             health_summary = replace_day_alerts_with_dates(health_summary)

#             # Save text summary (UTF-8 encoded)
#             summary_txt_filename = f"summary_{date_str}.txt"
#             summary_txt_path = os.path.join(generated_folder, summary_txt_filename)
#             with open(summary_txt_path, "w", encoding="utf-8") as f:
#                 f.write(health_summary)

#             # Save PDF summary
#             summary_pdf_filename = f"summary_{date_str}.pdf"
#             summary_pdf_path = os.path.join(generated_folder, summary_pdf_filename)
#             save_summary_as_pdf(health_summary, summary_pdf_path)

#             # Generate URLs
#             uploaded_url = settings.MEDIA_URL + os.path.relpath(pdf_path, settings.MEDIA_ROOT).replace("\\", "/")
#             summary_txt_url = settings.MEDIA_URL + os.path.relpath(summary_txt_path, settings.MEDIA_ROOT).replace("\\", "/")
#             summary_pdf_url = settings.MEDIA_URL + os.path.relpath(summary_pdf_path, settings.MEDIA_ROOT).replace("\\", "/")

#             return JsonResponse({
#                 "status": "success",
#                 "summary": health_summary,
#                 "raw_text": extracted_text,
#                 "uploaded_url": uploaded_url,
#                 "summary_url": summary_txt_url,
#                 "summary_pdf_url": summary_pdf_url,
#             })

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)

# # ========================
# # CSRF Token Endpoint
# # ========================
# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})
# 3 with firestor save
# import os
# import re
# import json
# import fitz  # PyMuPDF
# import emoji
# import firebase_admin
# from firebase_admin import credentials, firestore

# from django.http import JsonResponse
# from django.views import View
# from django.core.files.storage import default_storage
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token
# from datetime import datetime, timedelta
# from fpdf import FPDF
# import google.generativeai as genai

# # ========================
# # Configure Gemini
# # ========================
# genai.configure(api_key="AIzaSyD897t0s0IAd-DPAp5z3ctbF1jSgoKhZnQ")
# model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# # ========================
# # Initialize Firebase
# # ========================
# cred = credentials.Certificate("C:/Users/VICTUS/Desktop/auth/config/perceptria-9e17b-firebase-adminsdk-fbsvc-1060dcb054.json")  # ✅ Replace with actual path
# firebase_admin.initialize_app(cred)
# db = firestore.client()

# # ========================
# # Utility: Extract Text from PDF
# # ========================
# def extract_text_from_pdf(pdf_path):
#     doc = fitz.open(pdf_path)
#     return "".join(page.get_text() for page in doc).strip()

# # ========================
# # Utility: Extract Patient Name
# # ========================
# def extract_patient_name(text):
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
# # Utility: Convert Emojis to Text
# # ========================
# def convert_emojis_to_text(text):
#     return emoji.demojize(text).replace(':', ' [').replace('_', ' ').replace(']', '] ')

# # ========================
# # Utility: Replace "Day X" with Dates
# # ========================
# def replace_day_alerts_with_dates(text):
#     today = datetime.now()
#     for i in range(1, 8):
#         day_str = f"Day {i}:"
#         date_str = (today + timedelta(days=i-1)).strftime("%A, %B %d:")
#         text = text.replace(day_str, date_str)
#     return text

# # ========================
# # Utility: Save Summary as PDF
# # ========================
# def save_summary_as_pdf(summary_text, output_path):
#     pdf = FPDF()
#     pdf.set_auto_page_break(auto=True, margin=15)
#     pdf.add_page()
#     pdf.set_font("Arial", size=12)
#     for line in convert_emojis_to_text(summary_text).split("\n"):
#         pdf.multi_cell(0, 10, line)
#     pdf.output(output_path)

# # ========================
# # Gemini Prompt
# # ========================
# def generate_gemini_health_summary(raw_text):
#     patient_name = extract_patient_name(raw_text) or "the patient"
#     prompt = f"""
# Generate a detailed, easy-to-understand health summary for a female adult patient named {patient_name}, based on her lab results.

# Use a compassionate, friendly tone, as if a kind doctor or health coach is explaining results to her personally...

# [Prompt trimmed for brevity, keep full in actual use]

# Here is user's lab report text:
# {raw_text}
# """
#     response = model.generate_content(prompt)
#     return response.text

# # ========================
# # Django View: Upload Report
# # ========================
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         username = request.POST.get("username", "default_user").strip().replace(" ", "_")
#         if not username:
#             return JsonResponse({"status": "error", "message": "Username is required."}, status=400)

#         try:
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

#             # Generate summary
#             raw_text = extract_text_from_pdf(pdf_path)
#             summary = generate_gemini_health_summary(raw_text)
#             summary = replace_day_alerts_with_dates(summary)

#             # Save TXT summary
#             summary_txt_filename = f"summary_{date_str}.txt"
#             summary_txt_path = os.path.join(generated_folder, summary_txt_filename)
#             with open(summary_txt_path, "w", encoding="utf-8") as f:
#                 f.write(summary)

#             # Save PDF summary
#             summary_pdf_filename = f"summary_{date_str}.pdf"
#             summary_pdf_path = os.path.join(generated_folder, summary_pdf_filename)
#             save_summary_as_pdf(summary, summary_pdf_path)

#             # Create URLs
#             uploaded_url = settings.MEDIA_URL + os.path.relpath(pdf_path, settings.MEDIA_ROOT).replace("\\", "/")
#             summary_txt_url = settings.MEDIA_URL + os.path.relpath(summary_txt_path, settings.MEDIA_ROOT).replace("\\", "/")
#             summary_pdf_url = settings.MEDIA_URL + os.path.relpath(summary_pdf_path, settings.MEDIA_ROOT).replace("\\", "/")

#             # Get patient name
#             patient_name = extract_patient_name(raw_text)

#             # Upload metadata to Firestore
#             doc_ref = db.collection("user_reports").document(username).collection("summaries").document(date_str)
#             doc_ref.set({
#                 "timestamp": firestore.SERVER_TIMESTAMP,
#                 "patient_name": patient_name,
#                 "summary_text_url": summary_txt_url,
#                 "summary_pdf_url": summary_pdf_url,
#                 "uploaded_report_url": uploaded_url,
#             })

#             return JsonResponse({
#                 "status": "success",
#                 "summary": summary,
#                 "raw_text": raw_text,
#                 "uploaded_url": uploaded_url,
#                 "summary_url": summary_txt_url,
#                 "summary_pdf_url": summary_pdf_url,
#             })

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)

# # ========================
# # CSRF Token Endpoint
# # ========================
# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})


# save with urls

# import os
# import re
# import json
# import base64
# import fitz  # PyMuPDF
# import emoji
# import firebase_admin
# from firebase_admin import credentials, firestore
# from django.http import JsonResponse
# from django.views import View
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token
# from datetime import datetime, timedelta
# from fpdf import FPDF
# import google.generativeai as genai
# from django.core.files.storage import default_storage
# from twilio.rest import Client
# import json
# from django.views.decorators.csrf import csrf_exempt
# from django.http import JsonResponse
# from twilio.rest import Client
# from django.conf import settings

# @csrf_exempt
# def send_sms(request):
#     if request.method == 'POST':
#         try:
#             # Decode JSON body
#             data = json.loads(request.body)
#             phone_number = data.get('phone_number')
#             message_text = data.get('message')  # <-- extract message from request

#             if not phone_number or not message_text:
#                 return JsonResponse({"error": "Phone number and message are required"}, status=400)

#             # Twilio credentials
#             twilio_sid = settings.TWILIO_SID
#             twilio_auth_token = settings.TWILIO_AUTH_TOKEN
#             twilio_phone_number = settings.TWILIO_PHONE_NUMBER

#             client = Client(twilio_sid, twilio_auth_token)

#             # Send SMS using the message from request
#             message = client.messages.create(
#                 body=message_text,  # <-- use message from frontend
#                 from_=twilio_phone_number,
#                 to=phone_number
#             )

#             return JsonResponse({"message": "SMS sent successfully!"})

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=405)


# # ========================
# # Configure Gemini
# # ========================
# genai.configure(api_key="AIzaSyD897t0s0IAd-DPAp5z3ctbF1jSgoKhZnQ")
# model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# # ========================
# # Initialize Firebase
# # ========================
# cred = credentials.Certificate("C:/Users/VICTUS/Desktop/auth/config/perceptria-9e17b-firebase-adminsdk-fbsvc-1060dcb054.json")
# firebase_admin.initialize_app(cred)
# db = firestore.client()

# # ========================
# # Utility Functions
# # ========================
# def extract_text_from_pdf(pdf_path):
#     doc = fitz.open(pdf_path)
#     return "".join(page.get_text() for page in doc).strip()

# def extract_patient_name(text):
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

# def convert_emojis_to_text(text):
#     return emoji.demojize(text).replace(':', ' [').replace('_', ' ').replace(']', '] ')

# def replace_day_alerts_with_dates(text):
#     today = datetime.now()
#     for i in range(1, 8):
#         day_str = f"Day {i}:"
#         date_str = (today + timedelta(days=i-1)).strftime("%A, %B %d:")
#         text = text.replace(day_str, date_str)
#     return text

# def save_summary_as_pdf(summary_text):
#     pdf = FPDF()
#     pdf.set_auto_page_break(auto=True, margin=15)
#     pdf.add_page()
#     pdf.set_font("Arial", size=12)
#     for line in convert_emojis_to_text(summary_text).split("\n"):
#         pdf.multi_cell(0, 10, line)
    
#     temp_path = os.path.join(settings.MEDIA_ROOT, "temp_summary.pdf")
#     pdf.output(temp_path)
    
#     with open(temp_path, "rb") as f:
#         pdf_bytes = f.read()
    
#     os.remove(temp_path)
#     return pdf_bytes

# def generate_gemini_health_summary(raw_text):
#     patient_name = extract_patient_name(raw_text) or "the patient"
#     prompt = f"""
# Generate a detailed, easy-to-understand health summary for a female adult patient named {patient_name}, based on her lab results.

# Use a compassionate, friendly tone, as if a kind doctor or health coach is explaining results to her personally...

# Here is user's lab report text:
# {raw_text}
# """
#     response = model.generate_content(prompt)
#     return response.text

# # ========================
# # Django View: Upload Report
# # ========================
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         user_id = request.POST.get("user_id")  # Expecting logged-in user's Firebase UID
#         if not user_id:
#             return JsonResponse({"status": "error", "message": "User ID is required."}, status=400)

#         try:
#             # Read PDF file from request
#             pdf_file = request.FILES["pdf_file"]
#             pdf_filename = f"{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.pdf"
            
#             # Save the PDF to a local file temporarily
#             temp_pdf_path = os.path.join(settings.MEDIA_ROOT, "uploaded_files", pdf_filename)  # Save in the 'uploaded_files' directory
#             if not os.path.exists(os.path.dirname(temp_pdf_path)):
#                 os.makedirs(os.path.dirname(temp_pdf_path))
            
#             with open(temp_pdf_path, "wb") as f:
#                 f.write(pdf_file.read())

#             # In a real-world scenario, you would upload this PDF to a cloud storage service (like Firebase Storage, AWS S3, etc.)
#             # For now, assuming it's a local URL, like "http://localhost:8000/media/uploaded_files/somefile.pdf"
#             pdf_url = f"http://localhost:8000/media/uploaded_files/{pdf_filename}"

#             # Save the URL to Firestore
#             uploaded_reports_ref = db.collection("users").document(user_id).collection("uploaded_reports").document(pdf_filename)
#             uploaded_reports_ref.set({
#                 "timestamp": firestore.SERVER_TIMESTAMP,
#                 "filename": pdf_filename,
#                 "pdf_url": pdf_url,  # Store the PDF URL
#             })

#             # Return response with success and the PDF URL
#             return JsonResponse({
#                 "status": "success",
#                 "message": "PDF uploaded successfully!",
#                 "pdf_url": pdf_url  # Return the URL in the response
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
# import base64
# import fitz  # PyMuPDF
# import emoji
# import firebase_admin
# from firebase_admin import credentials, firestore
# from django.http import JsonResponse
# from django.views import View
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token
# from datetime import datetime, timedelta
# import google.generativeai as genai
# from django.core.files.storage import default_storage
# from twilio.rest import Client
# import json
# from django.views.decorators.csrf import csrf_exempt
# from django.http import JsonResponse
# from twilio.rest import Client
# from django.conf import settings
# import json
# from django.views.decorators.csrf import csrf_exempt
# from django.http import JsonResponse
# from twilio.rest import Client
# from django.conf import settings

# @csrf_exempt
# def send_sms(request):
#     if request.method == 'POST':
#         try:
#             # Decode JSON body
#             data = json.loads(request.body)
#             phone_number = data.get('phone_number')
#             message_text = data.get('message')  # <-- extract message from request

#             if not phone_number or not message_text:
#                 return JsonResponse({"error": "Phone number and message are required"}, status=400)

#             # Twilio credentials
#             twilio_sid = settings.TWILIO_SID
#             twilio_auth_token = settings.TWILIO_AUTH_TOKEN
#             twilio_phone_number = settings.TWILIO_PHONE_NUMBER

#             client = Client(twilio_sid, twilio_auth_token)

#             # Send SMS using the message from request
#             message = client.messages.create(
#                 body=message_text,  # <-- use message from frontend
#                 from_=twilio_phone_number,
#                 to=phone_number
#             )

#             return JsonResponse({"message": "SMS sent successfully!"})

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=405)


# # ========================
# # Initialize Firebase
# # ========================
# cred = credentials.Certificate("C:/Users/VICTUS/Desktop/auth/config/perceptria-9e17b-firebase-adminsdk-fbsvc-1060dcb054.json")
# firebase_admin.initialize_app(cred)
# db = firestore.client()

# # ========================
# # Configure Gemini
# # ========================
# genai.configure(api_key="AIzaSyD897t0s0IAd-DPAp5z3ctbF1jSgoKhZnQ")
# model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# # ========================
# # Utility Functions
# # ========================
# def extract_text_from_pdf(pdf_path):
#     doc = fitz.open(pdf_path)
#     return "".join(page.get_text() for page in doc).strip()

# def extract_patient_name(text):
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

# def convert_emojis_to_text(text):
#     return emoji.demojize(text).replace(':', ' [').replace('_', ' ').replace(']', '] ')

# def replace_day_alerts_with_dates(text):
#     today = datetime.now()
#     for i in range(1, 8):
#         day_str = f"Day {i}:"
#         date_str = (today + timedelta(days=i-1)).strftime("%A, %B %d:")
#         text = text.replace(day_str, date_str)
#     return text

# def generate_gemini_health_summary(raw_text):
#     patient_name = extract_patient_name(raw_text) or "the patient"
#     prompt = f"""
# Generate a detailed, easy-to-understand health summary for a female adult patient named {patient_name}, based on her lab results.

# Use a compassionate, friendly tone, as if a kind doctor or health coach is explaining results to her personally...

# Here is user's lab report text:
# {raw_text}
# """
#     response = model.generate_content(prompt)
#     return response.text

# # ========================
# # Django View: Upload Report
# # ========================
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         user_id = request.POST.get("user_id")  # Expecting logged-in user's Firebase UID
#         if not user_id:
#             return JsonResponse({"status": "error", "message": "User ID is required."}, status=400)

#         try:
#             # Read PDF file from request
#             pdf_file = request.FILES["pdf_file"]
#             pdf_filename = f"{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.pdf"
            
#             # Save the PDF to a local file temporarily
#             temp_pdf_path = os.path.join(settings.MEDIA_ROOT, "uploaded_files", pdf_filename)  # Save in the 'uploaded_files' directory
#             if not os.path.exists(os.path.dirname(temp_pdf_path)):
#                 os.makedirs(os.path.dirname(temp_pdf_path))
            
#             with open(temp_pdf_path, "wb") as f:
#                 f.write(pdf_file.read())

#             # Extract text from the uploaded PDF
#             extracted_text = extract_text_from_pdf(temp_pdf_path)

#             # Generate health summary using Gemini
#             health_summary = generate_gemini_health_summary(extracted_text)

#             # Save the health summary as plain text to Firestore
#             uploaded_reports_ref = db.collection("users").document(user_id).collection("uploaded_reports").document(pdf_filename)
#             uploaded_reports_ref.set({
#                 "timestamp": firestore.SERVER_TIMESTAMP,
#                 "filename": pdf_filename,
#                 "pdf_url": f"http://localhost:8000/media/uploaded_files/{pdf_filename}",  # Store the PDF URL
#                 "health_summary": health_summary  # Store the health summary as plain text
#             })

#             # Return response with success and the health summary
#             return JsonResponse({
#                 "status": "success",
#                 "message": "PDF uploaded and health summary generated successfully!",
#                 "pdf_url": f"http://localhost:8000/media/uploaded_files/{pdf_filename}",  # Return the URL of the uploaded PDF
#                 "health_summary": health_summary  # Return the health summary text
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
# import base64
# import fitz  # PyMuPDF
# import emoji
# import firebase_admin
# from firebase_admin import credentials, firestore
# from django.http import JsonResponse
# from django.views import View
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token
# from datetime import datetime, timedelta
# import google.generativeai as genai
# from django.core.files.storage import default_storage
# from twilio.rest import Client

# # ========================
# # Initialize Firebase
# # ========================
# cred = credentials.Certificate("C:/Users/VICTUS/Desktop/auth/config/perceptria-9e17b-firebase-adminsdk-fbsvc-1060dcb054.json")
# firebase_admin.initialize_app(cred)
# db = firestore.client()

# # ========================
# # Configure Gemini
# # ========================
# genai.configure(api_key="AIzaSyD897t0s0IAd-DPAp5z3ctbF1jSgoKhZnQ")
# model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# # ========================
# # Utility Functions
# # ========================
# def extract_text_from_pdf(pdf_path):
#     doc = fitz.open(pdf_path)
#     full_text = ""
#     for page in doc:
#         full_text += page.get_text()
#     return full_text.strip()

# def extract_patient_name(text):
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

# def convert_emojis_to_text(text):
#     return emoji.demojize(text).replace(':', ' [').replace('_', ' ').replace(']', '] ')

# def replace_day_alerts_with_dates(text):
#     today = datetime.now()
#     for i in range(1, 8):
#         day_str = f"Day {i}:"
#         date_str = (today + timedelta(days=i-1)).strftime("%A, %B %d:")
#         text = text.replace(day_str, date_str)
#     return text

# def generate_gemini_health_summary(raw_text):
#     patient_name = extract_patient_name(raw_text) or "the patient"
#     prompt = f"""
# Generate a detailed, easy-to-understand health summary for a female adult patient named {patient_name}, based on her lab results.

# Use a compassionate, friendly tone, as if a kind doctor or health coach is explaining results to her personally. Avoid overly technical medical language unless explained clearly.

# Structure the response with headings, emojis, and patient-friendly sections Present results with positivity and clarity — highlight good news first, and gently explain any concerns with solutions.

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

# E. 7-Day Exercise Plan �
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
# """
#     response = model.generate_content(prompt)
#     return response.text

# # ========================
# # SMS Functionality
# # ========================
# @csrf_exempt
# def send_sms(request):
#     if request.method == 'POST':
#         try:
#             # Decode JSON body
#             data = json.loads(request.body)
#             phone_number = data.get('phone_number')
#             message_text = data.get('message')

#             if not phone_number or not message_text:
#                 return JsonResponse({"error": "Phone number and message are required"}, status=400)

#             # Twilio credentials
#             twilio_sid = settings.TWILIO_SID
#             twilio_auth_token = settings.TWILIO_AUTH_TOKEN
#             twilio_phone_number = settings.TWILIO_PHONE_NUMBER

#             client = Client(twilio_sid, twilio_auth_token)

#             # Send SMS using the message from request
#             message = client.messages.create(
#                 body=message_text,
#                 from_=twilio_phone_number,
#                 to=phone_number
#             )

#             return JsonResponse({"message": "SMS sent successfully!"})

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=405)

# # ========================
# # Django View: Upload Report
# # ========================
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         user_id = request.POST.get("user_id")  # Expecting logged-in user's Firebase UID
#         if not user_id:
#             return JsonResponse({"status": "error", "message": "User ID is required."}, status=400)

#         try:
#             # Read PDF file from request
#             pdf_file = request.FILES["pdf_file"]
#             date_str = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
#             pdf_filename = f"report_{date_str}.pdf"
            
#             # Save the PDF to a local file temporarily
#             user_folder = os.path.join(settings.MEDIA_ROOT, "user_reports", user_id)
#             upload_folder = os.path.join(user_folder, "uploaded_reports")
#             generated_folder = os.path.join(user_folder, "generated_reports")

#             os.makedirs(upload_folder, exist_ok=True)
#             os.makedirs(generated_folder, exist_ok=True)

#             pdf_path = os.path.join(upload_folder, pdf_filename)
#             with open(pdf_path, "wb") as f:
#                 f.write(pdf_file.read())

#             # Extract text from the uploaded PDF
#             extracted_text = extract_text_from_pdf(pdf_path)

#             # Generate health summary using Gemini
#             health_summary = generate_gemini_health_summary(extracted_text)

#             # Save summary
#             summary_filename = f"summary_{date_str}.txt"
#             summary_path = os.path.join(generated_folder, summary_filename)
#             with open(summary_path, "w", encoding="utf-8") as f:
#                 f.write(health_summary)

#             # Save to Firestore
#             uploaded_reports_ref = db.collection("users").document(user_id).collection("uploaded_reports").document(pdf_filename)
#             uploaded_reports_ref.set({
#                 "timestamp": firestore.SERVER_TIMESTAMP,
#                 "filename": pdf_filename,
#                 "pdf_url": f"http://localhost:8000/media/user_reports/{user_id}/uploaded_reports/{pdf_filename}",
#                 "health_summary": health_summary
#             })

#             # Convert to media URLs for frontend
#             uploaded_url = settings.MEDIA_URL + os.path.relpath(pdf_path, settings.MEDIA_ROOT).replace("\\", "/")
#             summary_url = settings.MEDIA_URL + os.path.relpath(summary_path, settings.MEDIA_ROOT).replace("\\", "/")

#             # Return response with success and the health summary
#             return JsonResponse({
#                 "status": "success",
#                 "message": "PDF uploaded and health summary generated successfully!",
#                 "summary": health_summary,
#                 "raw_text": extracted_text,
#                 "uploaded_url": uploaded_url,
#                 "summary_url": summary_url,
#                 "pdf_url": f"http://localhost:8000/media/user_reports/{user_id}/uploaded_reports/{pdf_filename}"
#             })

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)

# # ========================
# # CSRF Token Endpoint
# # ========================
# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})

# latest
# import os
# import re
# import json
# import fitz  # PyMuPDF
# import emoji
# import firebase_admin
# from firebase_admin import credentials, firestore
# from django.http import JsonResponse
# from django.views import View
# from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
# from django.middleware.csrf import get_token
# from datetime import datetime, timedelta
# import google.generativeai as genai
# from django.core.files.storage import default_storage
# from twilio.rest import Client

# # ========================
# # Initialize Firebase
# # ========================
# cred = credentials.Certificate("C:/Users/VICTUS/Desktop/auth/config/perceptria-9e17b-firebase-adminsdk-fbsvc-1060dcb054.json")
# firebase_admin.initialize_app(cred)
# db = firestore.client()

# # ========================
# # Configure Gemini
# # ========================
# genai.configure(api_key="AIzaSyD897t0s0IAd-DPAp5z3ctbF1jSgoKhZnQ")
# model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# # ========================
# # Utility Functions
# # ========================
# def extract_text_from_pdf(pdf_path):
#     doc = fitz.open(pdf_path)
#     full_text = ""
#     for page in doc:
#         full_text += page.get_text()
#     return full_text.strip()

# def extract_patient_name(text):
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

# def convert_emojis_to_text(text):
#     return emoji.demojize(text).replace(':', ' [').replace('_', ' ').replace(']', '] ')

# def replace_day_alerts_with_dates(text):
#     today = datetime.now()
#     for i in range(1, 8):
#         day_str = f"Day {i}:"
#         date_str = (today + timedelta(days=i-1)).strftime("%A, %B %d:")
#         text = text.replace(day_str, date_str)
#     return text

# def generate_gemini_health_summary(raw_text):
#     patient_name = extract_patient_name(raw_text) or "the patient"
#     prompt = f"""
# Generate a detailed, easy-to-understand health summary for a female adult patient named {patient_name}, based on her lab results.

# Use a compassionate, friendly tone, as if a kind doctor or health coach is explaining results to her personally. Avoid overly technical medical language unless explained clearly.

# Structure the response with headings, emojis, and patient-friendly sections Present results with positivity and clarity — highlight good news first, and gently explain any concerns with solutions.

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
# """
#     response = model.generate_content(prompt)
#     return response.text

# def extract_parameters(text):
#     """
#     Extracts counts like Hemoglobin, RBC, WBC, Platelets, BP, etc. from the raw text.
#     Saves them line by line.
#     """
#     pattern = re.compile(r"(\b(?:hemoglobin|rbc|wbc|platelets?|bp|blood pressure|glucose|sugar|hdl|ldl|cholesterol|triglycerides?)\b[^:\n]*[:\-]?\s*\d+\.?\d*\s*\w*)", re.IGNORECASE)
#     matches = pattern.findall(text)
#     return matches

# # ========================
# # SMS Functionality
# # ========================
# @csrf_exempt
# def send_sms(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#             phone_number = data.get('phone_number')
#             message_text = data.get('message')

#             if not phone_number or not message_text:
#                 return JsonResponse({"error": "Phone number and message are required"}, status=400)

#             client = Client(settings.TWILIO_SID, settings.TWILIO_AUTH_TOKEN)

#             message = client.messages.create(
#                 body=message_text,
#                 from_=settings.TWILIO_PHONE_NUMBER,
#                 to=phone_number
#             )

#             return JsonResponse({"message": "SMS sent successfully!"})

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=405)

# # ========================
# # Django View: Upload Report
# # ========================
# @method_decorator(csrf_exempt, name="dispatch")
# class UploadReportView(View):
#     def post(self, request):
#         if "pdf_file" not in request.FILES:
#             return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

#         user_id = request.POST.get("user_id")
#         if not user_id:
#             return JsonResponse({"status": "error", "message": "User ID is required."}, status=400)

#         try:
#             pdf_file = request.FILES["pdf_file"]
#             date_str = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
#             pdf_filename = f"report_{date_str}.pdf"

#             user_folder = os.path.join(settings.MEDIA_ROOT, "user_reports", user_id)
#             upload_folder = os.path.join(user_folder, "uploaded_reports")
#             generated_folder = os.path.join(user_folder, "generated_reports")

#             os.makedirs(upload_folder, exist_ok=True)
#             os.makedirs(generated_folder, exist_ok=True)

#             pdf_path = os.path.join(upload_folder, pdf_filename)
#             with open(pdf_path, "wb") as f:
#                 f.write(pdf_file.read())

#             extracted_text = extract_text_from_pdf(pdf_path)
#             health_summary = generate_gemini_health_summary(extracted_text)

#             # Save health summary
#             summary_filename = f"summary_{date_str}.txt"
#             summary_path = os.path.join(generated_folder, summary_filename)
#             with open(summary_path, "w", encoding="utf-8") as f:
#                 f.write(health_summary)

#             # Extract and save parameters
#             parameters = extract_parameters(extracted_text)
#             parameters_filename = f"parameters_{date_str}.txt"
#             parameters_path = os.path.join(generated_folder, parameters_filename)
#             with open(parameters_path, "w", encoding="utf-8") as f:
#                 for param in parameters:
#                     f.write(param.strip() + "\n")
#             with open(parameters_path, "r", encoding="utf-8") as param_file:
#                 parameters_content = param_file.read()

#             # Upload to Firestore
#             uploaded_reports_ref = db.collection("users").document(user_id).collection("uploaded_reports").document(pdf_filename)
#             uploaded_reports_ref.set({
#                 "timestamp": firestore.SERVER_TIMESTAMP,
#                 "filename": pdf_filename,
#                 "pdf_url": f"http://localhost:8000/media/user_reports/{user_id}/uploaded_reports/{pdf_filename}",
#                 "health_summary": health_summary,
#                 "parameters_text": parameters_content  # save parameters as array also
#             })

#             uploaded_url = settings.MEDIA_URL + os.path.relpath(pdf_path, settings.MEDIA_ROOT).replace("\\", "/")
#             summary_url = settings.MEDIA_URL + os.path.relpath(summary_path, settings.MEDIA_ROOT).replace("\\", "/")
#             parameters_url = settings.MEDIA_URL + os.path.relpath(parameters_path, settings.MEDIA_ROOT).replace("\\", "/")

#             return JsonResponse({
#                 "status": "success",
#                 "message": "PDF uploaded and health summary generated successfully!",
#                 "summary": health_summary,
#                 "raw_text": extracted_text,
#                 "uploaded_url": uploaded_url,
#                 "summary_url": summary_url,
#                 "parameters_url": parameters_url,
#             })

#         except Exception as e:
#             return JsonResponse({"status": "error", "message": str(e)}, status=500)

# # ========================
# # CSRF Token Endpoint
# # ========================
# class CSRFTokenView(View):
#     def get(self, request):
#         return JsonResponse({"csrfToken": get_token(request)})
import re
import os
import json
import fitz  # PyMuPDF
import firebase_admin
from firebase_admin import credentials, firestore
from django.http import JsonResponse
from django.views import View
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from datetime import datetime, timedelta
import google.generativeai as genai
from twilio.rest import Client

from dotenv import load_dotenv
import os

# Go up two directories from the current file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
env_path = os.path.join(BASE_DIR, '.env')
load_dotenv(dotenv_path=env_path)



TWILIO_SID = os.getenv('TWILIO_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

# ========================
# Initialize Firebase
# ========================
cred = credentials.Certificate("C:/Users/VICTUS/Desktop/Major Project/auth/config/perceptria-9e17b-firebase-adminsdk-fbsvc-1060dcb054.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# ========================
# Configure Gemini
# ========================
genai.configure(api_key="AIzaSyD897t0s0IAd-DPAp5z3ctbF1jSgoKhZnQ")
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

# ========================
# Utility Functions
# ========================
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    return full_text.strip()

def extract_patient_name(text):
    patterns = [
        r"Patient Name:\s*([^\n]+)",
        r"Name:\s*([^\n]+)",
        r"Patient:\s*([^\n]+)",
        r"Patient's Name:\s*([^\n]+)"
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None

# ========================
# Predefined Parameters
# ========================
# The parameters you want to extract from the report
PARAMETERS_TO_EXTRACT = [
    "Hemoglobin",
    "Total Cholesterol",
    "LDL Cholesterol",
    "HDL Cholesterol",
    "RBC Count",
    "Platelet Count",
    "Fasting Blood Sugar",
    "HbA1c",
    "Glucose",
    "Serum B12",
    "WBC Count",
    "Triglycerides",
    "PCV",
    "MCV",
    "MCH",
    "MCHC"
]

# ========================
# Generate Health Summary
# ========================
def generate_gemini_health_summary(raw_text):
    patient_name = extract_patient_name(raw_text) or "the patient"
    prompt = f"""
Generate a detailed, easy-to-understand health summary for a female adult patient named {patient_name}, based on her lab results.

Use a compassionate, friendly tone, as if a kind doctor or health coach is explaining results to her personally. Avoid overly technical medical language unless explained clearly.

Structure the response with headings, emojis, and patient-friendly sections. Present results with positivity and clarity — highlight good news first, and gently explain any concerns with solutions.

Tailor your recommendations to include diet, exercise, lifestyle tips, and supplements, with separate guidance for vegetarian and non-vegetarian preferences where needed.

Conclude with a personal, uplifting message of hope and encouragement, written in a heartfelt, speech-friendly tone — as if you are talking directly to {patient_name} to comfort and empower her. Use gentle language and emojis.

⚠️ **Critical Formatting Rules:**
- **Headings** must use double asterisks (`**`) for bold (e.g., `**A. Health Summary 🩺**`).
- **Everywhere else**, **DO NOT use asterisks (`*`)** for bullet points or emphasis. Use dashes (`-`) or plain text instead.
- **Diet Plan**: List meals directly after the day label without bullets (e.g., `**Day 1:** Breakfast: Oatmeal...`).

---

**Strict Section Formatting (Follow Exactly):**

**A. Health Summary 🩺**
[Write a friendly, brief overview here, explaining the purpose of the report.]

✅ **Good News 🎉**
- [Highlight positive results with dashes (`-`) and emojis.]
- [Example: "Your blood sugar is normal! 🎉"]

⚠️ **Areas of Concern**
[Create a table of abnormal results with columns: Test | Value | Normal Range | Status | Meaning]

**B. Red Flags & Concerns ⚠️**
[Explain abnormal results in simple terms. Keep sentences clear and concise.]

**C. Simulated Doctor Advice 👨‍⚕️**
[Provide actionable advice. Example: "Schedule a follow-up with your doctor to discuss XYZ."]

**D. 7-Day Diet Plan 🍽️**
[Strict format: No asterisks. Example:]
🥬 **Vegetarian**
**Day 1:** Breakfast: Oatmeal; Lunch: Lentil soup; Dinner: Stir-fry
**Day 2:** Breakfast: Tofu scramble; Lunch: Quinoa salad; Dinner: Curry
[... Continue for 7 days]

🍗 **Non-Vegetarian**
**Day 1:** Breakfast: Scrambled eggs; Lunch: Chicken sandwich; Dinner: Salmon
[... Continue for 7 days]

**E. 7-Day Exercise Plan 🏃**
- [Use dashes (`-`) for activities. Example:]
- Monday: Gentle yoga (20 minutes)
- Tuesday: 30-minute walk

**F. Lifestyle Tips 🌿**
- Hydration: Drink 8 glasses of water daily.
- Sleep: Aim for 7-8 hours nightly.

**G. Supplements & Food Suggestions 💊**
- Iron-rich foods: Spinach, lentils, red meat (if non-vegetarian).
- Vitamin B12: Dairy, eggs, fortified cereals.

**H. Health Product Suggestions (Optional) 🏥**
- Fitness tracker to monitor steps.
- Blood pressure monitor (if recommended).

**I. Reminders & Follow-ups 🔁**
- Retest in 4–6 weeks.
- Keep a symptom journal.

❣️ **L. Motivational Note – Uplifting Closing Message**
[Address {patient_name} directly with empathy. Example:]
"Dear {patient_name}, you’re stronger than you think! 💪 Small steps lead to big changes. 🌱 We’re rooting for you! 🙌"

---

**Here is the user's lab report text:**
{raw_text}


"""
    response = model.generate_content(prompt)
    return response.text

# ========================
# Extract Predefined Parameters Using Gemini
# ========================
def extract_parameters_using_gemini(text):
    """
    Use Gemini to extract the predefined lab test parameters (such as Hemoglobin, Cholesterol, etc.)
    from the raw lab report text. 
    """
    # Construct the prompt to extract these specific parameters
    prompt = f"""
Please extract the following test parameters from the lab report:
- Hemoglobin
- Total Cholesterol
- LDL Cholesterol
- HDL Cholesterol
- RBC Count
- Platelet Count
- Fasting Blood Sugar
- HbA1c
- Glucose
- Serum B12
- WBC Count
- Triglycerides
- PCV
- MCV
- MCH
- MCHC

For each parameter that you find in the report, extract:
- Test Name (e.g., Hemoglobin, Cholesterol, etc.)
- Value
- Unit (if present, e.g., mg/dL, g/dL, etc.)

Here is the user's lab report text:
{text}
"""
    response = model.generate_content(prompt)
    return response.text

# ========================
# SMS Functionality
# ========================
from twilio.base.exceptions import TwilioRestException

@csrf_exempt
def send_sms(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            phone_number = data.get('phone_number')
            message_text = data.get('message')

            print("Incoming request to send SMS:")
            print("Phone:", phone_number)
            print("Message:", message_text)

            if not phone_number or not message_text:
                return JsonResponse({"error": "Phone number and message are required"}, status=400)

            client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)

            message = client.messages.create(
                body=message_text,
                from_=TWILIO_PHONE_NUMBER,
                to=phone_number
            )

            print("SMS sent. SID:", message.sid)
            return JsonResponse({"message": "SMS sent successfully!"})

        except TwilioRestException as e:
            print("TwilioRestException:", e)
            return JsonResponse({"error": f"Twilio Error: {e}"}, status=500)
        except Exception as e:
            print("General Exception:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

# ========================
# Django View: Upload Report
# ========================
@method_decorator(csrf_exempt, name="dispatch")
class UploadReportView(View):
    def post(self, request):
        if "pdf_file" not in request.FILES:
            return JsonResponse({"status": "error", "message": "No PDF file uploaded"}, status=400)

        user_id = request.POST.get("user_id")
        if not user_id:
            return JsonResponse({"status": "error", "message": "User ID is required."}, status=400)

        try:
            pdf_file = request.FILES["pdf_file"]
            date_str = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            pdf_filename = f"report_{date_str}.pdf"

            user_folder = os.path.join(settings.MEDIA_ROOT, "user_reports", user_id)
            upload_folder = os.path.join(user_folder, "uploaded_reports")
            generated_folder = os.path.join(user_folder, "generated_reports")

            os.makedirs(upload_folder, exist_ok=True)
            os.makedirs(generated_folder, exist_ok=True)

            pdf_path = os.path.join(upload_folder, pdf_filename)
            with open(pdf_path, "wb") as f:
                f.write(pdf_file.read())

            extracted_text = extract_text_from_pdf(pdf_path)
            health_summary = generate_gemini_health_summary(extracted_text)

            # Save health summary
            summary_filename = f"summary_{date_str}.txt"
            summary_path = os.path.join(generated_folder, summary_filename)
            with open(summary_path, "w", encoding="utf-8") as f:
                f.write(health_summary)

            # Extract and save predefined parameters using Gemini
            parameters = extract_parameters_using_gemini(extracted_text)
            parameters_filename = f"parameters_{date_str}.txt"
            parameters_path = os.path.join(generated_folder, parameters_filename)
            with open(parameters_path, "w", encoding="utf-8") as f:
                f.write(parameters)

            # Upload to Firestore
            uploaded_reports_ref = db.collection("users").document(user_id).collection("uploaded_reports").document(pdf_filename)
            uploaded_reports_ref.set({
                "timestamp": firestore.SERVER_TIMESTAMP,
                "filename": pdf_filename,
                "pdf_url": f"http://localhost:8000/media/user_reports/{user_id}/uploaded_reports/{pdf_filename}",
                "health_summary": health_summary,
                "parameters_text": parameters  # store the parameters returned by Gemini
            })

            uploaded_url = settings.MEDIA_URL + os.path.relpath(pdf_path, settings.MEDIA_ROOT).replace("\\", "/")
            summary_url = settings.MEDIA_URL + os.path.relpath(summary_path, settings.MEDIA_ROOT).replace("\\", "/")
            parameters_url = settings.MEDIA_URL + os.path.relpath(parameters_path, settings.MEDIA_ROOT).replace("\\", "/")

            return JsonResponse({
                "status": "success",
                "message": "PDF uploaded and health summary generated successfully!",
                "summary": health_summary,
                "raw_text": extracted_text,
                "uploaded_url": uploaded_url,
                "summary_url": summary_url,
                "parameters_url": parameters_url,
            })

        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

# ========================
# CSRF Token Endpoint
# ========================
class CSRFTokenView(View):
    def get(self, request):
        return JsonResponse({"csrfToken": get_token(request)})
