# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-05-01 11:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skinRefApp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='description',
            name='entrezid',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
