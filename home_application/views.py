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

from common.mymako import render_mako_context

import datetime
import json
from django.contrib.auth.models import Group
from django.core import serializers
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db import connection, transaction
from django.db.models import Min, Avg, Max, Sum,Count
from django.http import HttpResponse


from common.mymako import render_mako_context,render_json
from home_application.models import TInspectPlan,AccountBkuser

def home(request):
    """
    首页
    """
    return render_mako_context(request, '/home_application/home.html')


def dev_guide(request):
    """
    开发指引
    """
    return render_mako_context(request, '/home_application/dev_guide.html')


def contactus(request):
    """
    联系我们
    """
    return render_mako_context(request, '/home_application/contact.html')

class ComplexEncoder2(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, datetime.date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)
def getUserInfo(request):
    userInfo={}
    menuInfo = {}
    loginInfo = {}

    if request.user.is_authenticated():
        user = request.user
        # print current_user_set
        # current_group_set = Group.objects.get(user=current_user_set)
        # print current_group_set
        # print current_user_set.get_group_permissions()
        userInfo['username'] = user.username
        userInfo['qq'] = user.qq
        userInfo['id'] = user.id
        userInfo['email'] = user.email
        userInfo['fullname'] = 'administrator'

        user = AccountBkuser.objects.filter(username='admin')
        user = user[0]
        user.__dict__.pop("_state")
        ujs = json.dumps(user.__dict__, cls=ComplexEncoder2, ensure_ascii=False)

        menu =[]  #TPlanMenu.objects.all()
        L = []
        for p in menu:
            p.__dict__.pop("_state")
            L.append(p.__dict__)

        dict =[]  # TPlanDict.objects.all()
        list = []
        for p in dict:
            p.__dict__.pop("_state")
            list.append(p.__dict__)

        loginInfo['menus'] = L
        loginInfo['dict'] = list
        loginInfo['userInfo'] = user.__dict__

    json_data = json.dumps(loginInfo, cls=ComplexEncoder2, ensure_ascii=False)
    return HttpResponse(json_data, content_type='application/json')


def userList(request):
    index = request.GET.get('index')
    size = request.GET.get('size')
    userid = request.GET.get('userid')
    fromdate = request.GET.get('fromdate')
    todate = request.GET.get('todate')
    type = request.GET.get('type')

    menu =AccountBkuser.objects.all().order_by('-id')
    maxid = AccountBkuser.objects.aggregate(Count('id'))
    maxid = maxid['id__count']
    paginator = Paginator(menu, size)  # Show 25 contacts per page

    menu = paginator.page(index)
    L = []
    for p in menu:
        p.__dict__.pop("_state")
        L.append(p.__dict__)
    json_data = json.dumps(L, cls=ComplexEncoder2,
                           ensure_ascii=False)  # serializers.serialize("json", menu, ensure_ascii=False,encoding='UTF-8')  # 只有数据没页码
    json_data = json_data.replace("null", '""');
    result = {'success': True, 'rows': json.loads(json_data), 'pageIndex': index, 'pageSize': size, 'pageCount': 5,
              'total': maxid}
    return render_json(result)

def inpectList(request):
    index = request.GET.get('index')
    size = request.GET.get('size')
    userid = request.GET.get('userid')
    fromdate = request.GET.get('fromdate')
    todate = request.GET.get('todate')
    type = request.GET.get('type')

    menu = TInspectPlan.objects.all().order_by('-id')
    maxid = TInspectPlan.objects.aggregate(Count('id'))
    maxid = maxid['id__count']
    paginator = Paginator(menu, size)  # Show 25 contacts per page

    menu = paginator.page(index)
    L = []
    for p in menu:
        p.__dict__.pop("_state")
        L.append(p.__dict__)
    json_data = json.dumps(L, cls=ComplexEncoder2,
                           ensure_ascii=False)  # serializers.serialize("json", menu, ensure_ascii=False,encoding='UTF-8')  # 只有数据没页码
    json_data = json_data.replace("null", '""');
    result = {'success': True, 'rows': json.loads(json_data), 'pageIndex': index, 'pageSize': size, 'pageCount': 5,
              'total': maxid}
    return render_json(result)

def userDetail(request):
    id = request.GET.get('id')
    user = PlatUser.objects.filter(id=id)
    user = user[0]
    user.__dict__.pop("_state")
    userinfo = {}
    userinfo['obj'] = user.__dict__
    json_data = json.dumps(userinfo, cls=ComplexEncoder2, ensure_ascii=False)
    json_data = json_data.replace("null", '""');
    return HttpResponse(json_data, content_type='application/json')

def taskDetail(request):
    id = request.GET.get('id')
    user = PlatUser.objects.filter(id=id)
    user = user[0]
    user.__dict__.pop("_state")
    userinfo = {}
    userinfo['obj'] = user.__dict__
    json_data = json.dumps(userinfo, cls=ComplexEncoder2, ensure_ascii=False)
    json_data = json_data.replace("null", '""');
    return HttpResponse(json_data, content_type='application/json')

def inpectSave(request):
    dictStr = request.GET.get('json')
    dict = json.loads(dictStr)
    if hasattr(dict, 'pid'):
        dict.pid = -1
    else:
        dict['pid'] = -1
    maxid = TInspectPlan.objects.aggregate(Max('id'))
    maxid = maxid['id__max']
    autoid = 'D{0:0>6}'.format(7)
    if dict['id'] > 0:
        res = TInspectPlan(id=dict['id'],cron_expression=dict['cron_expression'],ip=dict['ip'], plan_name=dict['plan_name'], begin_time=dict['begin_time'],
                        end_time=dict['end_time'], sys_type=dict['sys_type'], plan_status=0, plan_desc=dict['plan_desc'],create_time=datetime.datetime.now()).save()
    else:
        res = TInspectPlan(cron_expression=dict['cron_expression'], ip=dict['ip'], plan_name=dict['plan_name'],
                       begin_time=dict['begin_time'],
                       end_time=dict['end_time'], sys_type=dict['sys_type'], plan_status=0, plan_desc=dict['plan_desc'],
                       create_time=datetime.datetime.now()).save()

    if res:
        result = {'success': True, 'msg': 'ok'}
    else:
        result = {'success': True, 'msg': 'ok'}
    return render_json(result)

def userSave(request):
    dictStr = request.GET.get('json')
    dict = json.loads(dictStr)

    maxid = AccountBkuser.objects.aggregate(Max('id'))
    maxid = maxid['id__max']
    autoid = 'D{0:0>6}'.format(7)
    if dict['id']>0:
        res = AccountBkuser(id=dict['id'],chname=dict['chname'],qq=dict['qq'], phone=dict['phone'], username=dict['username'],
                            is_superuser=dict['is_superuser'], email=dict['email'], is_staff=0, company=dict['company'],
                            date_joined=datetime.datetime.now(), last_login=datetime.datetime.now()).save()
    else:
        res = AccountBkuser(chname=dict['chname'], qq=dict['qq'], phone=dict['phone'], username=dict['username'],
                       is_superuser=dict['is_superuser'], email=dict['email'], is_staff=0, company=dict['company'],date_joined=datetime.datetime.now(),last_login=datetime.datetime.now()).save()

    if res:
        result = {'success': True, 'msg': 'ok'}
    else:
        result = {'success': True, 'msg': 'ok'}
    return render_json(result)

def inpectDelIds(request):
    ids = request.GET.get('ids')
    ids = ids.split(',')
    for id in ids:
        TInspectPlan.objects.get(id=id).delete()
    result = {"success": True, "message": "删除成功"}
    return render_json(result)

def inpectDel(request):
    id = request.GET.get('id')
    TInspectPlan.objects.get(id=id).delete()
    result = {"success": True, "message": "删除成功"}
    return render_json(result)

def userDel(request):
    id = request.GET.get('id')
    AccountBkuser.objects.get(id=id).delete()
    result = {"success": True, "message": "删除成功"}
    return render_json(result)