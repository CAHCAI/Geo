# Generated by Django 4.2.16 on 2025-03-25 03:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_usertracking'),
    ]

    operations = [
        migrations.CreateModel(
            name='VisitorTracking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visitor_id', models.CharField(max_length=255, unique=True)),
                ('last_seen', models.DateTimeField(auto_now=True)),
                ('is_staff', models.BooleanField(default=False)),
            ],
        ),
        migrations.DeleteModel(
            name='UserTracking',
        ),
    ]
