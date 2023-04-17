from django.contrib import admin
from .models import Text, Page, PageContent
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

# Register your models here.

admin.site.register(Text)
admin.site.register(Page)
admin.site.register(PageContent)

admin.site.register(get_user_model(), UserAdmin)
