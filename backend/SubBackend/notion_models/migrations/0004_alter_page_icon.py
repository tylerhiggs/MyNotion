# Generated by Django 4.1.3 on 2023-05-03 22:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("notion_models", "0003_page_parent"),
    ]

    operations = [
        migrations.AlterField(
            model_name="page",
            name="icon",
            field=models.CharField(default="E", max_length=2),
        ),
    ]
