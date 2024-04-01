from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from datetime import datetime
from beatgt_app.serializers import *
from beatgt_app.models import *
from beatgt_app.crypto import create_token, create_hash, check_pswd
from django.db.models import Prefetch
from django.db.models import Count
from django.db.models import Q


# Create your views here.

#Роут регистрации
@csrf_exempt
@api_view(['POST'])
def RegView(req):
    #Проверяем, что пришли нужные поля
    try:
        # Достаём body
        data = JSONParser().parse(req)

        login = data['login']
        password = data['password']
        second_password = data['second_password']
        avatar = data['avatarUrl']
        last_login = datetime.now()


        #Если пришли пустые поля
        if not len(login) or not len(password) or not len(second_password):
            return JsonResponse({'error': 'Заполните все поля формы!'}, status=400)

        #Проверяем, что длина пароля не меньше 8
        if len(password) < 8:
            return JsonResponse({'error': 'Минимальная длина пароля 8 символов!'}, status=400)

        #Если пароли не совпадают
        if password != second_password:
            return JsonResponse({'error': 'Пароли не совпадают!'}, status=400)

        #Захешируем наш пароль
        hash_pswd = create_hash(password)

        #Создаём строку для записи в бд
        row = {
            'login': login,
            'password': hash_pswd,
            'last_login': last_login,
            'role': 'client',
            'avatar': avatar
        }

        #Заносим в бд
        user_serializer = BeatGtUserSerializer(data=row)

        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse({'success': True}, status=201)
        else:
            return JsonResponse({'error': 'Не верный логин или пароль. Возможно логин уже занят!'}, status=400)

    except Exception:
        return JsonResponse({'error': 'Ошибка на стороне сервера!'}, status=500)

@csrf_exempt
@api_view(['POST'])
def AuthView(req):
    try:
        # Достаём body
        data = JSONParser().parse(req)
        login = data['login']
        password = data['password']

        #Проверяем наличие такого пользователя
        user = BeatGtUser.objects.filter(login=login)

        if not len(user):
            return JsonResponse({'error': 'Неверный логин или пароль!'}, status=400)

        user_serializer = BeatGtUserSerializer(user, many=True)

        #Проверим пароли
        if not check_pswd(password, user_serializer.data[0]['password']):
            return JsonResponse({'error': 'Неверный логин или пароль!'}, status=400)

        #Создаём jwt-token
        token = create_token({'login': login, 'last_login': user_serializer.data[0]['last_login']})
        return JsonResponse({
                'token': token,
                'id': user_serializer.data[0]['id'],
                'login': user_serializer.data[0]['login'],
                'role': user_serializer.data[0]['role'],
                'avatar': user_serializer.data[0]['avatar']
        }, status=201)
    except Exception:
        return JsonResponse({'error': 'Ошибка на стороне сервера!'}, status=500)

#Представление для материнской платы
class MotherboardView:
    @staticmethod
    def get_for_pk(id):
        try:
            rec = Motherboard.objects.values().get(pk=id)
            return JsonResponse(rec, status=200)
        except Exception:
            return JsonResponse({'error': 'Комплектующее не найдено'}, status=404)

    @staticmethod
    def get_filter(brand, model):
        filters = Q(brand__icontains=brand) & Q(model__icontains=model)
        result = Motherboard.objects.filter(filters)
        data = MotherboardSerializer(result, many=True)
        return JsonResponse({"obj": data.data}, status=201)

    @staticmethod
    def create(row):
        motherboard_serializer = MotherboardSerializer(data=row)

        if motherboard_serializer.is_valid():
            motherboard_serializer.save()
            return JsonResponse({'success': True}, status=201)
        else:
            return JsonResponse({'error': 'Не удалось сохранить комплектюущее. Возможно оно уже существует!'},status=400)

#Представление для процессора
class CpuView:
    @staticmethod
    def get_for_pk(id):
        try:
            rec = Cpu.objects.values().get(pk=id)
            return JsonResponse(rec, status=200)
        except Exception:
            return JsonResponse({'error': 'Комплектующее не найдено'}, status=404)

    @staticmethod
    def get_filter(brand, model):
        filters = Q(brand__icontains=brand) & Q(model__icontains=model)
        result = Cpu.objects.filter(filters)
        data = CpuSerializer(result, many=True)
        return JsonResponse({"obj": data.data}, status=201)

    @staticmethod
    def create(row):
        cpu_serializer = CpuSerializer(data=row)

        if cpu_serializer.is_valid():
            cpu_serializer.save()
            return JsonResponse({'success': True}, status=201)
        else:
            return JsonResponse({'error': 'Не удалось сохранить комплектюущее. Возможно оно уже существует!'},
                                status=400)

#Представление для оперативной памяти
class RamView:
    @staticmethod
    def get_for_pk(id):
        try:
            rec = Ram.objects.values().get(pk=id)
            return JsonResponse(rec, status=200)
        except Exception:
            return JsonResponse({'error': 'Комплектующее не найдено'}, status=404)

    @staticmethod
    def get_filter(brand, model):
        filters = Q(brand__icontains=brand) & Q(model__icontains=model)
        result = Ram.objects.filter(filters)
        data = RamSerializer(result, many=True)
        return JsonResponse({"obj": data.data}, status=201)

    @staticmethod
    def create(row):
        ram_serializer = RamSerializer(data=row)

        if ram_serializer.is_valid():
            ram_serializer.save()
            return JsonResponse({'success': True}, status=201)
        else:
            return JsonResponse({'error': 'Не удалось сохранить комплектюущее. Возможно оно уже существует!'},
                                status=400)

#Представление для видеокарты
class GpuView:
    @staticmethod
    def get_for_pk(id):
        try:
            rec = Gpu.objects.values().get(pk=id)
            return JsonResponse(rec, status=200)
        except Exception:
            return JsonResponse({'error': 'Комплектующее не найдено'}, status=404)

    @staticmethod
    def get_filter(brand, model):
        filters = Q(brand__icontains=brand) & Q(model__icontains=model)
        result = Gpu.objects.filter(filters)
        data = GpuSerializer(result, many=True)
        return JsonResponse({"obj": data.data}, status=201)

    @staticmethod
    def create(row):
        gpu_serializer = GpuSerializer(data=row)

        if gpu_serializer.is_valid():
            gpu_serializer.save()
            return JsonResponse({'success': True}, status=201)
        else:
            return JsonResponse({'error': 'Не удалось сохранить комплектюущее. Возможно оно уже существует!'},
                                status=400)

#Представление для системы охлаждения
class CoolingSystemView:
    @staticmethod
    def get_for_pk(id):
        try:
            rec = CoolingSystem.objects.values().get(pk=id)
            return JsonResponse(rec, status=200)
        except Exception:
            return JsonResponse({'error': 'Комплектующее не найдено'}, status=404)

    @staticmethod
    def get_filter(brand, model):
        filters = Q(brand__icontains=brand) & Q(model__icontains=model)
        result = CoolingSystem.objects.filter(filters)
        data = CoolingSystemSerializer(result, many=True)
        return JsonResponse({"obj": data.data}, status=201)

    @staticmethod
    def create(row):
        cooling_system_serializer = CoolingSystemSerializer(data=row)

        if cooling_system_serializer.is_valid():
            cooling_system_serializer.save()
            return JsonResponse({'success': True}, status=201)
        else:
            return JsonResponse({'error': 'Не удалось сохранить комплектюущее. Возможно оно уже существует!'},
                                status=400)

#Представление для блока питания
class PowerSypplyView:
    @staticmethod
    def get_for_pk(id):
        try:
            rec = PowerSupply.objects.values().get(pk=id)
            return JsonResponse(rec, status=200)
        except Exception:
            return JsonResponse({'error': 'Комплектующее не найдено'}, status=404)

    @staticmethod
    def get_filter(brand, model):
        filters = Q(brand__icontains=brand) & Q(model__icontains=model)
        result = PowerSupply.objects.filter(filters)
        data = PowerSypplySerializer(result, many=True)
        return JsonResponse({"obj": data.data}, status=201)

    @staticmethod
    def create(row):
        power_supply_serializer = PowerSypplySerializer(data=row)

        if power_supply_serializer.is_valid():
            power_supply_serializer.save()
            return JsonResponse({'success': True}, status=201)
        else:
            return JsonResponse({'error': 'Не удалось сохранить комплектюущее. Возможно оно уже существует!'},
                                status=400)

#Представление для жёсткого диска
class HardDiskView:
    @staticmethod
    def get_for_pk(id):
        try:
            rec = HardDisk.objects.values().get(pk=id)
            return JsonResponse(rec, status=200)
        except Exception:
            return JsonResponse({'error': 'Комплектующее не найдено'}, status=404)

    @staticmethod
    def get_filter(brand, model):
        filters = Q(brand__icontains=brand) & Q(model__icontains=model)
        result = HardDisk.objects.filter(filters)
        data = HardDiskSerializer(result, many=True)
        return JsonResponse({"obj": data.data}, status=201)

    @staticmethod
    def create(row):
        hard_disk_serializer = HardDiskSerializer(data=row)

        if hard_disk_serializer.is_valid():
            hard_disk_serializer.save()
            return JsonResponse({'success': True}, status=201)
        else:
            return JsonResponse({'error': 'Не удалось сохранить комплектюущее. Возможно оно уже существует!'},
                                status=400)

#Представление для корпуса
class HullView:
    @staticmethod
    def get_for_pk(id):
        try:
            rec = Hull.objects.values().get(pk=id)
            return JsonResponse(rec, status=200)
        except Exception:
            return JsonResponse({'error': 'Комплектующее не найдено'}, status=404)

    @staticmethod
    def get_filter(brand, model):
        filters = Q(brand__icontains=brand) & Q(model__icontains=model)
        result = Hull.objects.filter(filters)
        data = HullSerializer(result, many=True)
        return JsonResponse({"obj": data.data}, status=201)

    @staticmethod
    def create(row):
        hull_serializer = HullSerializer(data=row)

        if hull_serializer.is_valid():
            hull_serializer.save()
            return JsonResponse({'success': True}, status=201)
        else:
            return JsonResponse({'error': 'Не удалось сохранить комплектюущее. Возможно оно уже существует!'},
                                status=400)

#Представление для сборки
class AssemblyView:

    @staticmethod
    #Все сборки
    def get_all_assemblies():
        assemblies = Assembly.objects.order_by('-id').select_related(
                'motherboard', 'cpu', 'cooling_system', 'power_supply', 'hull', 'user'
            ).prefetch_related(
                Prefetch('ram', queryset=AssemblyRam.objects.select_related('ram').all(), to_attr='rams'),
                Prefetch('hard_disk', queryset=AssemblyHardDisk.objects.select_related('hard_disk').all(),
                         to_attr='hard_disks'),
                Prefetch('gpu', queryset=AssemblyGpu.objects.select_related('gpu').all(), to_attr='gpus'),
                'like'
            )
        return assemblies

    @staticmethod
    #Сборки пользователя
    def get_user_assemblies(nickname):
        user = BeatGtUser.objects.get(login=nickname)
        assemblies = Assembly.objects.filter(user=user).select_related(
            'motherboard', 'cpu', 'cooling_system', 'power_supply', 'hull', 'user'
        ).prefetch_related(
            Prefetch('ram', queryset=AssemblyRam.objects.select_related('ram').all(), to_attr='rams'),
            Prefetch('hard_disk', queryset=AssemblyHardDisk.objects.select_related('hard_disk').all(),
                     to_attr='hard_disks'),
            Prefetch('gpu', queryset=AssemblyGpu.objects.select_related('gpu').all(), to_attr='gpus'),
            'like'
        )
        return assemblies

    @staticmethod
    #Понравившиеся сборки
    def get_like_assemblies(nickname):
        user = BeatGtUser.objects.get(login=nickname)
        assemblies = Assembly.objects.filter(like=user).select_related(
            'motherboard', 'cpu', 'cooling_system', 'power_supply', 'hull', 'user'
        ).prefetch_related(
            Prefetch('ram', queryset=AssemblyRam.objects.select_related('ram').all(), to_attr='rams'),
            Prefetch('hard_disk', queryset=AssemblyHardDisk.objects.select_related('hard_disk').all(),
                     to_attr='hard_disks'),
            Prefetch('gpu', queryset=AssemblyGpu.objects.select_related('gpu').all(), to_attr='gpus'),
            'like'
        )
        return assemblies

    @staticmethod
    #Сортировка по низкой цене
    def get_low_price_assemblies():
        assemblies = Assembly.objects.order_by('price').select_related(
            'motherboard', 'cpu', 'cooling_system', 'power_supply', 'hull', 'user'
        ).prefetch_related(
            Prefetch('ram', queryset=AssemblyRam.objects.select_related('ram').all(), to_attr='rams'),
            Prefetch('hard_disk', queryset=AssemblyHardDisk.objects.select_related('hard_disk').all(),
                     to_attr='hard_disks'),
            Prefetch('gpu', queryset=AssemblyGpu.objects.select_related('gpu').all(), to_attr='gpus'),
            'like'
        )
        return assemblies

    @staticmethod
    # Сортировка по высокой цене
    def get_high_price_assemblies():
        assemblies = Assembly.objects.order_by('-price').select_related(
            'motherboard', 'cpu', 'cooling_system', 'power_supply', 'hull', 'user'
        ).prefetch_related(
            Prefetch('ram', queryset=AssemblyRam.objects.select_related('ram').all(), to_attr='rams'),
            Prefetch('hard_disk', queryset=AssemblyHardDisk.objects.select_related('hard_disk').all(),
                     to_attr='hard_disks'),
            Prefetch('gpu', queryset=AssemblyGpu.objects.select_related('gpu').all(), to_attr='gpus'),
            'like'
        )
        return assemblies

    @staticmethod
    #Сортировка по низким лайкам
    def get_low_like_assemblies():
        assemblies = Assembly.objects.annotate(likes_count=Count('like')).order_by('likes_count').select_related(
            'motherboard', 'cpu', 'cooling_system', 'power_supply', 'hull', 'user'
        ).prefetch_related(
            Prefetch('ram', queryset=AssemblyRam.objects.select_related('ram').all(), to_attr='rams'),
            Prefetch('hard_disk', queryset=AssemblyHardDisk.objects.select_related('hard_disk').all(),
                     to_attr='hard_disks'),
            Prefetch('gpu', queryset=AssemblyGpu.objects.select_related('gpu').all(), to_attr='gpus'),
            'like'
        )
        return assemblies

    @staticmethod
    # Сортировка по высоким лайкам
    def get_high_like_assemblies():
        assemblies = Assembly.objects.annotate(likes_count=Count('like')).order_by('-likes_count').select_related(
            'motherboard', 'cpu', 'cooling_system', 'power_supply', 'hull', 'user'
        ).prefetch_related(
            Prefetch('ram', queryset=AssemblyRam.objects.select_related('ram').all(), to_attr='rams'),
            Prefetch('hard_disk', queryset=AssemblyHardDisk.objects.select_related('hard_disk').all(),
                     to_attr='hard_disks'),
            Prefetch('gpu', queryset=AssemblyGpu.objects.select_related('gpu').all(), to_attr='gpus'),
            'like'
        )
        return assemblies


    #Получение сборки по первичному ключу
    @staticmethod
    @api_view(['GET'])
    def get_for_pk(req):
        try:
            id = int(req.GET.get('id'))

            #Получение всех информации о сборке
            assembly = Assembly.objects.filter(pk=id).select_related(
                'motherboard', 'cpu', 'cooling_system', 'power_supply', 'hull', 'user'
            ).prefetch_related(
                Prefetch('ram', queryset=AssemblyRam.objects.select_related('ram').all(), to_attr='rams'),
                Prefetch('hard_disk', queryset=AssemblyHardDisk.objects.select_related('hard_disk').all(),
                         to_attr='hard_disks'),
                Prefetch('gpu', queryset=AssemblyGpu.objects.select_related('gpu').all(), to_attr='gpus'),
                'like'
            ).first()

            #Преобразование в ответ
            data = {
                'assembly_id': assembly.id,
                'assembly_name': assembly.name,
                'author': assembly.user.login,
                'author_avatar': assembly.user.avatar,
                'likes': [user.id for user in assembly.like.all()],
                'price': assembly.price,
                'motherboard': {
                    'id': assembly.motherboard.id,
                    'name': f'{assembly.motherboard.brand} {assembly.motherboard.model}',
                    'price': assembly.motherboard.price,
                    'logo': assembly.motherboard.logo,
                    'status': assembly.motherboard.status
                },
                'cpu': {
                    'id': assembly.cpu.id,
                    'name': f'{assembly.cpu.brand} {assembly.cpu.model}',
                    'price': assembly.cpu.price,
                    'logo': assembly.cpu.logo,
                    'status': assembly.cpu.status
                },
                'rams': [{
                    'id': ram.ram.id,
                    'name': f'{ram.ram.brand} {ram.ram.model} {ram.ram.memory_size}гб. кол-во: {ram.count}шт.',
                    'price': ram.ram.price * ram.count,
                    'logo': ram.ram.logo,
                    'status': ram.ram.status
                } for ram in assembly.rams],
                'gpus': [{
                    'id': gpu.gpu.id,
                    'name': f'{gpu.gpu.brand} {gpu.gpu.model} {gpu.gpu.memory_size}гб. кол-во: {gpu.count}шт.',
                    'price': gpu.gpu.price * gpu.count,
                    'logo': gpu.gpu.logo,
                    'status': gpu.gpu.status
                } for gpu in assembly.gpus],
                'cooler': {
                    'id': assembly.cooling_system.id,
                    'name': f'{assembly.cooling_system.brand} {assembly.cooling_system.model}',
                    'price': assembly.cooling_system.price,
                    'logo': assembly.cooling_system.logo,
                    'status': assembly.cooling_system.status
                },
                'power_supply': {
                    'id': assembly.power_supply.id,
                    'name': f'{assembly.power_supply.brand} {assembly.power_supply.model} {assembly.power_supply.power}Вт.',
                    'price': assembly.power_supply.price,
                    'logo': assembly.power_supply.logo,
                    'status': assembly.power_supply.status
                },
                'hard_disks':[{
                    'id': hard_disk.hard_disk.id,
                    'name': f'{hard_disk.hard_disk.brand} {hard_disk.hard_disk.model} {hard_disk.hard_disk.type_disk} {hard_disk.hard_disk.memory_size}гб. кол-во: {hard_disk.count}шт.',
                    'price': hard_disk.hard_disk.price * hard_disk.count,
                    'logo': hard_disk.hard_disk.logo,
                    'status': hard_disk.hard_disk.status
                } for hard_disk in assembly.hard_disks],
                'hull': {
                    'id': assembly.hull.id,
                    'name': f'{assembly.hull.brand} {assembly.hull.model}',
                    'price': assembly.hull.price,
                    'logo': assembly.hull.logo,
                    'status': assembly.hull.status
                }
            }

            return JsonResponse(data, status=200)

        except Exception:
            return JsonResponse({'error': 'Сборка не найдена'}, status=404)

    @csrf_exempt
    @api_view(["GET"])
    #Получение сборок
    def get_assemblies(req):
        try:
            nickname = req.GET.get('nickname') or ''
            type = req.GET.get('type')
            filter = req.GET.get('filter')
            data = []

            if type == 'my':
                assemblies = AssemblyView.get_user_assemblies(nickname)
            elif type == 'like':
                assemblies = AssemblyView.get_like_assemblies(nickname)
            elif filter == 'low_price':
                assemblies = AssemblyView.get_low_price_assemblies()
            elif filter == 'high_price':
                assemblies = AssemblyView.get_high_price_assemblies()
            elif filter == 'low_like':
                assemblies = AssemblyView.get_low_like_assemblies()
            elif filter == 'high_like':
                assemblies = AssemblyView.get_high_like_assemblies()
            else:
                assemblies = AssemblyView.get_all_assemblies()

            for assembly in assemblies:
                tmp = {
                    'assembly_id': assembly.id,
                    'assembly_name': assembly.name,
                    'author': assembly.user.login,
                    'author_avatar': assembly.user.avatar,
                    'likes': [user.id for user in assembly.like.all()],
                    'price': assembly.price,
                    'motherboard': {
                        'id': assembly.motherboard.id,
                        'name': f'{assembly.motherboard.brand} {assembly.motherboard.model}',
                        'price': assembly.motherboard.price,
                        'logo': assembly.motherboard.logo
                    },
                    'cpu': {
                        'id': assembly.cpu.id,
                        'name': f'{assembly.cpu.brand} {assembly.cpu.model}',
                        'price': assembly.cpu.price,
                        'logo': assembly.cpu.logo
                    },
                    'rams': [{
                        'id': ram.ram.id,
                        'name': f'{ram.ram.brand} {ram.ram.model} {ram.ram.memory_size}гб. кол-во: {ram.count}шт.',
                        'price': ram.ram.price * ram.count,
                        'logo': ram.ram.logo
                    } for ram in assembly.rams],
                    'gpus': [{
                        'id': gpu.gpu.id,
                        'name': f'{gpu.gpu.brand} {gpu.gpu.model} {gpu.gpu.memory_size}гб. кол-во: {gpu.count}шт.',
                        'price': gpu.gpu.price * gpu.count,
                        'logo': gpu.gpu.logo
                    } for gpu in assembly.gpus],
                    'cooler': {
                        'id': assembly.cooling_system.id,
                        'name': f'{assembly.cooling_system.brand} {assembly.cooling_system.model}',
                        'price': assembly.cooling_system.price,
                        'logo': assembly.cooling_system.logo
                    },
                    'power_supply': {
                        'id': assembly.power_supply.id,
                        'name': f'{assembly.power_supply.brand} {assembly.power_supply.model} {assembly.power_supply.power}Вт.',
                        'price': assembly.power_supply.price,
                        'logo': assembly.power_supply.logo
                    },
                    'hard_disks': [{
                        'id': hard_disk.hard_disk.id,
                        'name': f'{hard_disk.hard_disk.brand} {hard_disk.hard_disk.model} {hard_disk.hard_disk.type_disk} {hard_disk.hard_disk.memory_size}гб. кол-во: {hard_disk.count}шт.',
                        'price': hard_disk.hard_disk.price * hard_disk.count,
                        'logo': hard_disk.hard_disk.logo
                    } for hard_disk in assembly.hard_disks],
                    'hull': {
                        'id': assembly.hull.id,
                        'name': f'{assembly.hull.brand} {assembly.hull.model}',
                        'price': assembly.hull.price,
                        'logo': assembly.hull.logo
                    }
                }
                data.append(tmp)

            return JsonResponse({'data': data}, status=200)
        except Exception:
            return JsonResponse({'error': 'Сборки не найдены'}, status=404)

    #Удаление сборки
    @csrf_exempt
    @api_view(['DELETE'])
    def delete_assembly(req):
        try:
            assembly_id = int(req.GET.get('id'))
            assembly = Assembly.objects.get(id=assembly_id)
            assembly.delete()
            return JsonResponse({'success': True}, status=201)
        except Exception:
            return JsonResponse({'error': 'Что-то пошло не так'}, status=500)

    #Создание сборки
    @csrf_exempt
    @api_view(['POST'])
    def create(req):
        try:
            data = JSONParser().parse(req)
            print(data)
            # Здесь создаём
            user = BeatGtUser.objects.get(login=data['login'])
            motherboard = Motherboard.objects.get(pk=data['motherboard'])
            cpu = Cpu.objects.get(pk=data['cpu'])
            cooler = CoolingSystem.objects.get(pk=data['cooler'])
            power_supply = PowerSupply.objects.get(pk=data['power_supply'])
            hull = Hull.objects.get(pk=data['hull'])
            rams = [Ram.objects.get(pk=ram['id']) for ram in data['ram']]
            gpus = [Gpu.objects.get(pk=gpu['id']) for gpu in data['gpu']]
            hard_disks = [HardDisk.objects.get(pk=hard_disk['id']) for hard_disk in data['hard_disk']]

            # Заполняем сборку
            assembly = Assembly(
                motherboard=motherboard,
                cpu=cpu,
                cooling_system=cooler,
                power_supply=power_supply,
                user=user,
                name=data['name'],
                hull=hull,
                price=data['price']
            )
            assembly.save()

            # Заполняем М:М
            for i in range(len(rams)):
                assemb_ram = AssemblyRam(assembly=assembly, ram=rams[i], count=data['ram'][i]['count'])
                assemb_ram.save()
            for i in range(len(gpus)):
                assemb_gpu = AssemblyGpu(assembly=assembly, gpu=gpus[i], count=data['gpu'][i]['count'])
                assemb_gpu.save()
            for i in range(len(hard_disks)):
                assemb_disk = AssemblyHardDisk(assembly=assembly, hard_disk=hard_disks[i], count=data['hard_disk'][i]['count'])
                assemb_disk.save()
            return JsonResponse({'success': True}, status=200)
        except Exception:
            return JsonResponse({'error': 'Что-то пошло не так'}, status=500)

    #Поставить убрать лайк
    @csrf_exempt
    @api_view(['POST'])
    def post_like(req):
        data = JSONParser().parse(req)
        user_id = data.get('user_id')
        assembly_id = data.get('assembly_id')

        try:
            user = BeatGtUser.objects.get(pk=user_id)
            assembly = Assembly.objects.get(pk=assembly_id)

            if assembly.like.filter(id=user.id).exists():
                assembly.like.remove(user)
                return JsonResponse({'like': False}, status=200)
            else:
                assembly.like.add(user)
                return JsonResponse({'like': True}, status=200)

            return JsonResponse({'success': True}, status=200)
        except Exception:
            return JsonResponse({'error': 'Что-то пошло не так'}, status=500)

#Получение компоненты по типу и id
@csrf_exempt
@api_view(['GET'])
def GetComponent(req):
    try:
        id = int(req.GET.get('id'))
    except Exception:
        return JsonResponse({'error': 'Ошибка на стороне сервера'}, status=500)
    type = req.GET.get('type')
    if type == 'motherboard':
        return MotherboardView.get_for_pk(id)
    elif type == 'cpu':
        return CpuView.get_for_pk(id)
    elif type == 'ram':
        return RamView.get_for_pk(id)
    elif type == 'gpu':
        return GpuView.get_for_pk(id)
    elif type == 'cooler':
        return CoolingSystemView.get_for_pk(id)
    elif type == 'power_supply':
        return PowerSypplyView.get_for_pk(id)
    elif type == 'hard_disk':
        return HardDiskView.get_for_pk(id)
    elif type == 'hull':
        return HullView.get_for_pk(id)
    else:
        return JsonResponse({'error': 'Комплектующее не найдено'}, status=404)

#Функция создания комплектующего
@csrf_exempt
@api_view(['POST'])
def СreateComponent(req):
    data = JSONParser().parse(req)
    type = data.get('type')
    row = data.get('row')
    if type == 'motherboard':
        return MotherboardView.create(row)
    elif type == 'cpu':
        return CpuView.create(row)
    elif type == 'ram':
        return RamView.create(row)
    elif type == 'gpu':
        return GpuView.create(row)
    elif type == 'cooler':
        return CoolingSystemView.create(row)
    elif type == 'power_supply':
        return PowerSypplyView.create(row)
    elif type == 'hard_disk':
        return HardDiskView.create(row)
    elif type == 'hull':
        return HullView.create(row)
    else:
        return JsonResponse({'error': 'Что-то пошло не так'}, status=500)


#Функция получения числа пользователей и сборок
@csrf_exempt
@api_view(['GET'])
def GetCountUserAssem(req):
    try:
        data = {
            'user_count': BeatGtUser.objects.count(),
            'assembly_count': Assembly.objects.count()
        }
        return JsonResponse(data, status=200)
    except Exception:
        return JsonResponse({'error': 'Что-то пошло не так'}, status=500)

#Функция нахождения комплектующего по бренду и модели
@csrf_exempt
@api_view(['GET'])
def GetFilterComponent(req):
    type = req.GET.get('type')
    brand_search = req.GET.get('brand') or ''
    model_search = req.GET.get('model') or ''
    if type == 'motherboard':
        return MotherboardView.get_filter(brand_search, model_search)
    elif type == 'cpu':
        return CpuView.get_filter(brand_search, model_search)
    elif type == 'ram':
        return RamView.get_filter(brand_search, model_search)
    elif type == 'gpu':
        return GpuView.get_filter(brand_search, model_search)
    elif type == 'cooler':
        return CoolingSystemView.get_filter(brand_search, model_search)
    elif type == 'power_supply':
        return PowerSypplyView.get_filter(brand_search, model_search)
    elif type == 'hard_disk':
        return HardDiskView.get_filter(brand_search, model_search)
    elif type == 'hull':
        return HullView.get_filter(brand_search, model_search)
    else:
        return JsonResponse({'error': 'Что-то пошло не так'}, status=500)



def Test(req):
    #Здесь создаём
    user = BeatGtUser.objects.get(login='dima')
    motherboard = Motherboard.objects.get(pk=3)
    cpu = Cpu.objects.get(pk=3)
    cooler = CoolingSystem.objects.get(pk=3)
    power_supply = PowerSupply.objects.get(pk=3)
    hull = Hull.objects.get(pk=3)
    rams = [Ram.objects.get(pk=ram['ram_id']) for ram in [{'ram_id': 3, 'count': 1}]]
    gpus = [Gpu.objects.get(pk=gpu['gpu_id']) for gpu in [{'gpu_id': 3, 'count': 1}]]
    hard_disks = [HardDisk.objects.get(pk=hard_disk['hard_disk_id']) for hard_disk in [{'hard_disk_id': 3, 'count':1}]]

    #Заполняем сборку
    assembly = Assembly(
        motherboard=motherboard,
        cpu=cpu,
        cooling_system=cooler,
        power_supply=power_supply,
        user=user,
        name='Норм сборка',
        hull=hull,
        price=142320
    )
    assembly.save()

    #Заполняем М:М
    for ram in rams:
        assemb_ram = AssemblyRam(assembly=assembly, ram=ram, count=1)
        assemb_ram.save()
    for gpu in gpus:
        assemb_gpu = AssemblyGpu(assembly=assembly, gpu=gpu, count=1)
        assemb_gpu.save()
    for hard_disk in hard_disks:
        assemb_disk = AssemblyHardDisk(assembly=assembly, hard_disk=hard_disk, count=1)
        assemb_disk.save()


    return JsonResponse({'status': 'success'}, status=200)

