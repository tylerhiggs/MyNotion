from django.contrib import admin
from .models import Text, Page, PageContent
# Register your models here.

admin.site.register(Text)
admin.site.register(Page)
admin.site.register(PageContent)
