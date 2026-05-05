from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
import resend


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

        # ✅ HTML email (better looking)
        html_message = f"""
        <h2>Hi {name},</h2>
        <p>Here is your Leadership Assessment Result:</p>

        <h3>Scores</h3>
        <ul>
            <li><b>Decision:</b> {scores.get('decision')}</li>
            <li><b>Communication:</b> {scores.get('communication')}</li>
            <li><b>Strategy:</b> {scores.get('strategy')}</li>
        </ul>

        <h3>Feedback</h3>
        <ul>
            <li>{feedback.get('decision')}</li>
            <li>{feedback.get('communication')}</li>
            <li>{feedback.get('strategy')}</li>
        </ul>

        <p>Thank you for taking the assessment.</p>
        """

        # 🔥 RESEND EMAIL (works on Render)
        try:
            resend.api_key = settings.RESEND_API_KEY

            resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to": [email],
                "subject": subject,
                "html": html_message,
            })

            print("EMAIL SENT SUCCESSFULLY")

        except Exception as email_error:
            print("EMAIL ERROR:", str(email_error))

        # ✅ ALWAYS return success (important)
        return JsonResponse({
            "success": True
        })

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    except Exception as e:
        print("ERROR:", str(e))
        return JsonResponse({"error": str(e)}, status=500)