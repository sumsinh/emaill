from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import json

@csrf_exempt
def submit_assessment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("Received data:", data)

            name = data.get("name", "User")
            email = data.get("email")

            if not email:
                return JsonResponse({
                    "success": False,
                    "error": "Email is required"
                })

            scores = data.get("scores", {})
            feedback = data.get("feedback", {})

            # ✅ EMAIL TEXT
            subject = "Your Leadership Assessment Result"

            message = f"""
Hi {name},

Thanks for completing the assessment.

Scores:
Decision: {scores.get('decision')}
Communication: {scores.get('communication')}
Strategy: {scores.get('strategy')}

Feedback:
Decision: {feedback.get('decision')}
Communication: {feedback.get('communication')}
Strategy: {feedback.get('strategy')}

Regards,
Team
"""

            # ✅ SEND EMAIL
            email_msg = EmailMultiAlternatives(
                subject=subject,
                body=message,
                from_email=settings.EMAIL_HOST_USER,
                to=[email],
            )

            email_msg.send()

            return JsonResponse({"success": True})

        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({"success": False, "error": str(e)})

    return JsonResponse({"message": "Only POST allowed"})