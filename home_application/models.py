# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云(BlueKing) available.
Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
"""

# from django.db import models
import uuid

from django.db import models

class AccountBkuser(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=128)
    chname = models.CharField(max_length=254)
    company = models.CharField(max_length=128)
    qq = models.CharField(max_length=32)
    phone = models.CharField(max_length=64)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'account_bkuser'

class TInspectPlan(models.Model):
    id = models.IntegerField(primary_key=True, editable=False)
    cron_expression = models.CharField(max_length=100, blank=True, null=True)
    plan_desc = models.CharField(max_length=200, blank=True, null=True)
    plan_status = models.CharField(max_length=1, blank=True, null=True)
    user_id = models.CharField(max_length=32, blank=True, null=True)
    update_time = models.DateTimeField(blank=True, null=True)
    plan_name = models.CharField(max_length=32, blank=True, null=True)
    ip = models.TextField(blank=True, null=True)
    ip_id = models.TextField(blank=True, null=True)
    sys_type = models.CharField(max_length=100, blank=True, null=True)
    begin_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    alarmfieldk = models.CharField(max_length=100, blank=True, null=True)
    alarmfieldv = models.CharField(max_length=200, blank=True, null=True)
    plan_type = models.IntegerField(blank=True, null=True)
    create_time = models.DateTimeField(blank=True, null=True)
    circletype = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 't_inspect_plan'