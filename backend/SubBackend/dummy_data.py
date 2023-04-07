from notion_models.models import Page, Text
from django.contrib.auth import get_user_model
print("creating superuser")
user_model = get_user_model()
user_model.objects.create_superuser(
    "admin", "thiggs911@gmail.com", "qexre0-riqtun-roTriv")
