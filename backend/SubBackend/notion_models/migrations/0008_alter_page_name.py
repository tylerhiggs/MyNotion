# Generated by Django 4.1.3 on 2023-04-07 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("notion_models", "0007_alter_page_id_alter_text_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="page",
            name="name",
            field=models.CharField(default="", max_length=36),
        ),
    ]
