# Generated by Django 5.1.7 on 2025-04-11 12:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("quora", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="answerreaction",
            name="reaction_type",
            field=models.CharField(
                choices=[("UPVOTE", "Upvote"), ("DOWNVOTE", "Downvote")],
                default="UPVOTE",
                max_length=255,
            ),
        ),
    ]
