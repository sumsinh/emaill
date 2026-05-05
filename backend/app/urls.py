from django.urls import path
from .views import submit_assessment

urlpatterns = [
    path("submit/", submit_assessment, name="submit_assessment"),
]