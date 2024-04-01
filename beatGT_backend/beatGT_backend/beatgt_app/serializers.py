from rest_framework import serializers
from beatgt_app.models import *

class BeatGtUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BeatGtUser
        fields = '__all__'
        extra_kwargs = {
            'avatar': {'required': False, 'allow_null': True}
        }

class MotherboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Motherboard
        fields = '__all__'

class CpuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cpu
        fields = '__all__'

class RamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ram
        fields = '__all__'

class GpuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gpu
        fields = '__all__'

class CoolingSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoolingSystem
        fields = '__all__'

class PowerSypplySerializer(serializers.ModelSerializer):
    class Meta:
        model = PowerSupply
        fields = '__all__'

class HardDiskSerializer(serializers.ModelSerializer):
    class Meta:
        model = HardDisk
        fields = '__all__'

class HullSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hull
        fields = '__all__'

class AssemblySerializer(serializers.ModelSerializer):
    class Meta:
        model = Assembly
        fields = '__all__'