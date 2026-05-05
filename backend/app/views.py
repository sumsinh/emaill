from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import json


@csrf_exempt
def submit_assessment(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        if not request.body:
            return JsonResponse({"error": "Empty body"}, status=400)

        data = json.loads(request.body or "{}")

        print("DATA RECEIVED:", data)

        name = data.get("name")
        email = data.get("email")
        scores = data.get("scores")
        feedback = data.get("feedback")

        # ✅ validation
        if not name or not email:
            return JsonResponse({"error": "Name or Email missing"}, status=400)

        if not scores or not feedback:
            return JsonResponse({"error": "Scores or Feedback missing"}, status=400)

        subject = "Your Leadership Assessment Result"

        message = f"""
Hi {name},

Here is your Leadership Assessment Result:

Scores:
Decision: {scores.get('decision')}
Communication: {scores.get('communication')}
Strategy: {scores.get('strategy')}

Feedback:
Decision: {feedback.get('decision')}
Communication: {feedback.get('communication')}
Strategy: {feedback.get('strategy')}

Thank you for taking the assessment.
"""

        email_msg = EmailMultiAlternatives(
            subject=subject,
            body=message,
            from_email=settings.EMAIL_HOST_USER,
            to=[email],
        )

        # 🔥 IMPORTANT FIX (no crash if email fails)
        try:
            email_msg.send()
            print("EMAIL SENT SUCCESSFULLY")
            return JsonResponse({"success": True})

        except Exception as email_error:
            print("EMAIL ERROR:", str(email_error))

            # still return success so frontend works
            return JsonResponse({
                "success": True,
                "warning": "Email failed but result generated"
            })

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    except Exception as e:
        print("ERROR:", str(e))
        return JsonResponse({"error": str(e)}, status=500)