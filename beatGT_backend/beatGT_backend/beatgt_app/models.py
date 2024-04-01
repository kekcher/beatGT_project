from django.db import models

# Create your models here.

#Модель пользователей
class BeatGtUser(models.Model):
    id = models.AutoField(primary_key=True)
    login = models.CharField(max_length=40, null=False, unique=True)
    password = models.TextField(null=False)
    last_login = models.DateTimeField(null=False)
    role = models.CharField(max_length=6, null=False)
    avatar = models.TextField()
    class Meta:
        db_table = 'users'

#Модель материнских плат
class Motherboard(models.Model):
    id = models.AutoField(primary_key=True)
    brand = models.CharField(max_length=40, null=False)
    model = models.CharField(max_length=100, null=False)
    form_factor = models.CharField(max_length=20, null=False)
    power_connector = models.CharField(max_length=30, null=False)
    socket = models.CharField(max_length=40, null=False)
    chipset = models.CharField(max_length=30, null=False)
    type_ram = models.CharField(max_length=20, null=False) #ЧЕРЕЗ ЗАПЯТУЮ ВАЖНО!
    form_factor_ram = models.CharField(max_length=10, null=False)
    memory_frequency_specification = models.IntegerField(null=False) #Считается в МГц
    maximum_memory_size = models.IntegerField(null=False) #Считается в Гб
    all_slots = models.TextField(null=False) #Перечисление всех слотов ЧЕРЕЗ ЗАПЯТУЮ ВАЖНО!!!
    count_slots = models.TextField(null=False) #Перечисление количества слотов ЧЕРЕЗ ЗАПЯТУЮ ВАЖНО!!!
    price = models.IntegerField(null=False) #Средняя стоимость в руб.
    status = models.CharField(max_length=12, null=False)
    logo = models.TextField() #Фотография компонента
    class Meta:
        db_table = 'motherboards'
        unique_together = ('brand', 'model')

#Модель процессоров
class Cpu(models.Model):
    id = models.AutoField(primary_key=True)
    brand = models.CharField(max_length=40, null=False)
    model = models.CharField(max_length=100, null=False)
    socket = models.CharField(max_length=40, null=False)
    generation = models.CharField(max_length=30, null=False)
    heat_generation = models.CharField(max_length=30, null=False) #Тепловыделение от мин-макс ВАЖНО ЧЕРЕЗ ТИРЕ в Вт
    type_ram = models.CharField(max_length=20, null=False)  # ЧЕРЕЗ ЗАПЯТУЮ ВАЖНО!
    memory_frequency_specification = models.CharField(max_length=100, null=False)  # Через запятую тип1 число1, тип2 число2
    maximum_memory_size = models.IntegerField(null=False)  # Считается в Гб
    price = models.IntegerField(null=False)  # Средняя стоимость в руб.
    status = models.CharField(max_length=12, null=False)
    logo = models.TextField()  # Фотография компонента

    class Meta:
        db_table = 'cpus'
        unique_together = ('brand', 'model')

#Модель оперативной памяти
class Ram(models.Model):
    id = models.AutoField(primary_key=True)
    brand = models.CharField(max_length=40, null=False)
    model = models.CharField(max_length=100, null=False)
    type_ram = models.CharField(max_length=20, null=False) #ЧЕРЕЗ ЗАПЯТУЮ ВАЖНО!
    form_factor_ram = models.CharField(max_length=10, null=False)
    memory_size = models.IntegerField(null=False) #Считается в Гб
    memory_frequency_specification = models.IntegerField(null=False)
    price = models.IntegerField(null=False)  # Средняя стоимость в руб.
    status = models.CharField(max_length=12, null=False)
    logo = models.TextField()  # Фотография компонента

    class Meta:
        db_table = 'rams'
        unique_together = ('brand', 'model')

#Модель видеокарт
class Gpu(models.Model):
    id = models.AutoField(primary_key=True)
    brand = models.CharField(max_length=40, null=False)
    model = models.CharField(max_length=100, null=False)
    interface = models.CharField(max_length=20, null=False)
    power_connector = models.CharField(max_length=30, null=False)
    memory_size = models.IntegerField(null=False)  #Объём видеопамяти Считается в Гб
    power_consumption = models.IntegerField(null=False) # потребляемая мощность в Вт
    length = models.IntegerField(null=False)  # длина в мм
    height = models.IntegerField(null=False)  # высота в мм
    thickness = models.IntegerField(null=False)  # толщина в мм
    price = models.IntegerField(null=False)  # Средняя стоимость в руб.
    status = models.CharField(max_length=12, null=False)
    logo = models.TextField()  # Фотография компонента

    class Meta:
        db_table = 'gpus'
        unique_together = ('brand', 'model')

# Модель системы охлождения
class CoolingSystem(models.Model):
    id = models.AutoField(primary_key=True)
    brand = models.CharField(max_length=40, null=False)
    model = models.CharField(max_length=100, null=False)
    cooling_type = models.CharField(max_length=40, null=False)
    max_heat_generation = models.IntegerField(null=False)  # Максимальное тепловыделение в Вт
    socket_compatibility = models.TextField(null=False)  # Все сокеты, которые подходят ЧЕРЕЗ ЗАПЯТУЮ ВАЖНО!!!
    power_consumption = models.IntegerField(null=False)  # потребляемая мощность в Вт
    length = models.IntegerField(null=False)  # длина в мм
    width = models.IntegerField(null=False)  # ширина в мм
    height = models.IntegerField(null=False)  # высота в мм
    price = models.IntegerField(null=False)  # Средняя стоимость в руб.
    status = models.CharField(max_length=12, null=False)
    logo = models.TextField()  # Фотография компонента

    class Meta:
        db_table = 'cooling_systems'
        unique_together = ('brand', 'model')

#Модель блоков питания
class PowerSupply(models.Model):
    id = models.AutoField(primary_key=True)
    brand = models.CharField(max_length=40, null=False)
    model = models.CharField(max_length=100, null=False)
    power = models.IntegerField(null=False)  # мощность в Вт
    form_factor = models.CharField(max_length=20, null=False)
    power_supply = models.CharField(max_length=100, null=False) #Разъём питания для проца видяхи и материнки через запятую
    height = models.IntegerField(null=False)  # высота в мм
    width = models.IntegerField(null=False)  # ширина в мм
    thickness = models.IntegerField(null=False)  # толщина в мм
    price = models.IntegerField(null=False)  # Средняя стоимость в руб.
    status = models.CharField(max_length=12, null=False)
    logo = models.TextField()  # Фотография компонента

    class Meta:
        db_table = 'power_supplies'
        unique_together = ('brand', 'model')

#Модель жёстких дисков
class HardDisk(models.Model):
    id = models.AutoField(primary_key=True)
    brand = models.CharField(max_length=40, null=False)
    model = models.CharField(max_length=100, null=False)
    memory_size = models.IntegerField(null=False) #Объём накопителя в гб.
    type_disk = models.CharField(max_length=10, null=False) #Тип жёсткого диска
    connector = models.CharField(max_length=40, null=False)  # Разъём нужен для подключения к Материнской плате по типу SATA и другие
    power_consumption = models.IntegerField(null=False)  # потребляемая мощность в Вт
    price = models.IntegerField(null=False)  # Средняя стоимость в руб.
    status = models.CharField(max_length=12, null=False)
    logo = models.TextField()  # Фотография компонента

    class Meta:
        db_table = 'hard_disks'
        unique_together = ('brand', 'model')

#Модель корпусов
class Hull(models.Model):
    id = models.AutoField(primary_key=True)
    brand = models.CharField(max_length=40, null=False)
    model = models.CharField(max_length=100, null=False)
    form_factor = models.CharField(max_length=20, null=False)  # для материнской платы
    slots_count = models.IntegerField(null=False)  # количество слотов расширений для видеокарт
    max_length_gpu = models.IntegerField(null=False)  # максимальная длина видеокарты в мм
    max_height_culler = models.IntegerField(null=False)  # максимальная высота куллера в мм
    width = models.IntegerField(null=False)  # ширина в мм
    height = models.IntegerField(null=False)  # высота в мм
    thickness = models.IntegerField(null=False)  # толщина в мм
    price = models.IntegerField(null=False)  # Средняя стоимость в руб.
    status = models.CharField(max_length=12, null=False)
    logo = models.TextField()  # Фотография компонента

    class Meta:
        db_table = 'hulls'
        unique_together = ('brand', 'model')

#Модель сборки
class Assembly(models.Model):
    id = models.AutoField(primary_key=True)
    motherboard = models.ForeignKey(Motherboard, on_delete=models.CASCADE, null=False)
    cpu = models.ForeignKey(Cpu, on_delete=models.CASCADE, null=False)
    ram = models.ManyToManyField("Ram", through="AssemblyRam")
    hard_disk = models.ManyToManyField("HardDisk", through="AssemblyHardDisk")
    gpu = models.ManyToManyField("GPU", through="AssemblyGpu")
    cooling_system = models.ForeignKey(CoolingSystem, on_delete=models.CASCADE, null=False)
    power_supply = models.ForeignKey(PowerSupply, on_delete=models.CASCADE, null=False)
    hull = models.ForeignKey(Hull, on_delete=models.CASCADE, null=False)
    user = models.ForeignKey(BeatGtUser, on_delete=models.CASCADE, null=False)
    name = models.CharField(max_length=50, null=False)
    price = models.IntegerField(null=False)  # Средняя стоимость в руб.
    like = models.ManyToManyField("BeatGtUser", related_name='liked_assemb')

    class Meta:
        db_table = 'assemblies'

#Модели отношений М:М
class AssemblyRam(models.Model):
    assembly = models.ForeignKey(Assembly, on_delete=models.CASCADE, null=False)
    ram = models.ForeignKey(Ram, on_delete=models.CASCADE, null=False)
    count = models.IntegerField(null=False)  # Кол-во плажек

    class Meta:
        db_table = 'assemb_ram'
        unique_together = ('assembly', 'ram')

class AssemblyGpu(models.Model):
    assembly = models.ForeignKey(Assembly, on_delete=models.CASCADE, null=False)
    gpu = models.ForeignKey(Gpu, on_delete=models.CASCADE, null=False)
    count = models.IntegerField(null=False)  # Кол-во плажек

    class Meta:
        db_table = 'assemb_gpu'
        unique_together = ('assembly', 'gpu')

class AssemblyHardDisk(models.Model):
    assembly = models.ForeignKey(Assembly, on_delete=models.CASCADE, null=False)
    hard_disk = models.ForeignKey(HardDisk, on_delete=models.CASCADE, null=False)
    count = models.IntegerField(null=False)  # Кол-во плажек

    class Meta:
        db_table = 'assemb_disk'
        unique_together = ('assembly', 'hard_disk')
