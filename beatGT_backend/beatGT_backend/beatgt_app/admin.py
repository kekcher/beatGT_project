from django.contrib import admin
from .models import BeatGtUser, Motherboard, Cpu, Ram, CoolingSystem, Gpu, PowerSupply, Hull, HardDisk
# Register your models here.
class StatusTask(admin.ModelAdmin):
    search_fields = ['status']

admin.site.register(BeatGtUser)
admin.site.register(Motherboard, StatusTask)
admin.site.register(Ram, StatusTask)
admin.site.register(Gpu, StatusTask)
admin.site.register(PowerSupply, StatusTask)
admin.site.register(Cpu, StatusTask)
admin.site.register(CoolingSystem, StatusTask)
admin.site.register(HardDisk, StatusTask)
admin.site.register(Hull, StatusTask)