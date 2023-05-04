# Generated by Django 4.1.3 on 2023-05-03 21:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("notion_models", "0002_page_is_favorite_page_is_public"),
    ]

    operations = [
        migrations.AddField(
            model_name="page",
            name="parent",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="children",
                to="notion_models.page",
            ),
        ),
    ]