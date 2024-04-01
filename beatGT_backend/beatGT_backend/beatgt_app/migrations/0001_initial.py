# Generated by Django 5.0.3 on 2024-03-25 13:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('login', models.CharField(max_length=40, unique=True)),
                ('password', models.TextField()),
                ('last_login', models.DateTimeField()),
                ('role', models.CharField(max_length=6)),
                ('avatar', models.TextField()),
            ],
            options={
                'db_table': 'users',
            },
        ),
        migrations.CreateModel(
            name='CoolingSystem',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('brand', models.CharField(max_length=40)),
                ('model', models.CharField(max_length=100)),
                ('cooling_type', models.CharField(max_length=40)),
                ('max_heat_generation', models.IntegerField()),
                ('socket_compatibility', models.TextField()),
                ('power_consumption', models.IntegerField()),
                ('length', models.IntegerField()),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('price', models.IntegerField()),
                ('status', models.CharField(max_length=12)),
                ('logo', models.TextField()),
            ],
            options={
                'db_table': 'cooling_systems',
                'unique_together': {('brand', 'model')},
            },
        ),
        migrations.CreateModel(
            name='Cpu',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('brand', models.CharField(max_length=40)),
                ('model', models.CharField(max_length=100)),
                ('socket', models.CharField(max_length=40)),
                ('generation', models.CharField(max_length=30)),
                ('heat_generation', models.CharField(max_length=30)),
                ('type_ram', models.CharField(max_length=20)),
                ('memory_frequency_specification', models.CharField(max_length=100)),
                ('maximum_memory_size', models.IntegerField()),
                ('price', models.IntegerField()),
                ('status', models.CharField(max_length=12)),
                ('logo', models.TextField()),
            ],
            options={
                'db_table': 'cpus',
                'unique_together': {('brand', 'model')},
            },
        ),
        migrations.CreateModel(
            name='Assembly',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('price', models.IntegerField()),
                ('cooling_system', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.coolingsystem')),
                ('cpu', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.cpu')),
            ],
            options={
                'db_table': 'assemblies',
            },
        ),
        migrations.CreateModel(
            name='Gpu',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('brand', models.CharField(max_length=40)),
                ('model', models.CharField(max_length=100)),
                ('interface', models.CharField(max_length=20)),
                ('power_connector', models.CharField(max_length=30)),
                ('memory_size', models.IntegerField()),
                ('power_consumption', models.IntegerField()),
                ('length', models.IntegerField()),
                ('height', models.IntegerField()),
                ('thickness', models.IntegerField()),
                ('price', models.IntegerField()),
                ('status', models.CharField(max_length=12)),
                ('logo', models.TextField()),
            ],
            options={
                'db_table': 'gpus',
                'unique_together': {('brand', 'model')},
            },
        ),
        migrations.CreateModel(
            name='AssemblyGpu',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.IntegerField()),
                ('assembly', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.assembly')),
                ('gpu', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.gpu')),
            ],
            options={
                'db_table': 'assemb_gpu',
                'unique_together': {('assembly', 'gpu')},
            },
        ),
        migrations.AddField(
            model_name='assembly',
            name='gpu',
            field=models.ManyToManyField(through='beatgt_app.AssemblyGpu', to='beatgt_app.gpu'),
        ),
        migrations.CreateModel(
            name='HardDisk',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('brand', models.CharField(max_length=40)),
                ('model', models.CharField(max_length=100)),
                ('memory_size', models.IntegerField()),
                ('type_disk', models.CharField(max_length=10)),
                ('connector', models.CharField(max_length=40)),
                ('power_consumption', models.IntegerField()),
                ('price', models.IntegerField()),
                ('status', models.CharField(max_length=12)),
                ('logo', models.TextField()),
            ],
            options={
                'db_table': 'hard_disks',
                'unique_together': {('brand', 'model')},
            },
        ),
        migrations.CreateModel(
            name='AssemblyHardDisk',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.IntegerField()),
                ('assembly', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.assembly')),
                ('hard_disk', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.harddisk')),
            ],
            options={
                'db_table': 'assemb_disk',
                'unique_together': {('assembly', 'hard_disk')},
            },
        ),
        migrations.AddField(
            model_name='assembly',
            name='hard_disk',
            field=models.ManyToManyField(through='beatgt_app.AssemblyHardDisk', to='beatgt_app.harddisk'),
        ),
        migrations.CreateModel(
            name='Hull',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('brand', models.CharField(max_length=40)),
                ('model', models.CharField(max_length=100)),
                ('form_factor', models.CharField(max_length=20)),
                ('slots_count', models.IntegerField()),
                ('max_length_gpu', models.IntegerField()),
                ('max_height_culler', models.IntegerField()),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('thickness', models.IntegerField()),
                ('price', models.IntegerField()),
                ('status', models.CharField(max_length=12)),
                ('logo', models.TextField()),
            ],
            options={
                'db_table': 'hulls',
                'unique_together': {('brand', 'model')},
            },
        ),
        migrations.AddField(
            model_name='assembly',
            name='hull',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.hull'),
        ),
        migrations.CreateModel(
            name='Motherboard',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('brand', models.CharField(max_length=40)),
                ('model', models.CharField(max_length=100)),
                ('form_factor', models.CharField(max_length=20)),
                ('power_connector', models.CharField(max_length=30)),
                ('socket', models.CharField(max_length=40)),
                ('chipset', models.CharField(max_length=30)),
                ('type_ram', models.CharField(max_length=20)),
                ('form_factor_ram', models.CharField(max_length=10)),
                ('memory_frequency_specification', models.IntegerField()),
                ('maximum_memory_size', models.IntegerField()),
                ('all_slots', models.TextField()),
                ('count_slots', models.TextField()),
                ('price', models.IntegerField()),
                ('status', models.CharField(max_length=12)),
                ('logo', models.TextField()),
            ],
            options={
                'db_table': 'motherboards',
                'unique_together': {('brand', 'model')},
            },
        ),
        migrations.AddField(
            model_name='assembly',
            name='motherboard',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.motherboard'),
        ),
        migrations.CreateModel(
            name='PowerSupply',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('brand', models.CharField(max_length=40)),
                ('model', models.CharField(max_length=100)),
                ('power', models.IntegerField()),
                ('form_factor', models.CharField(max_length=20)),
                ('power_supply', models.CharField(max_length=100)),
                ('height', models.IntegerField()),
                ('width', models.IntegerField()),
                ('thickness', models.IntegerField()),
                ('price', models.IntegerField()),
                ('status', models.CharField(max_length=12)),
                ('logo', models.TextField()),
            ],
            options={
                'db_table': 'power_supplies',
                'unique_together': {('brand', 'model')},
            },
        ),
        migrations.AddField(
            model_name='assembly',
            name='power_supply',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.powersupply'),
        ),
        migrations.CreateModel(
            name='Ram',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('brand', models.CharField(max_length=40)),
                ('model', models.CharField(max_length=100)),
                ('type_ram', models.CharField(max_length=20)),
                ('form_factor_ram', models.CharField(max_length=10)),
                ('memory_size', models.IntegerField()),
                ('memory_frequency_specification', models.IntegerField()),
                ('price', models.IntegerField()),
                ('status', models.CharField(max_length=12)),
                ('logo', models.TextField()),
            ],
            options={
                'db_table': 'rams',
                'unique_together': {('brand', 'model')},
            },
        ),
        migrations.CreateModel(
            name='AssemblyRam',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.IntegerField()),
                ('assembly', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.assembly')),
                ('ram', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.ram')),
            ],
            options={
                'db_table': 'assemb_ram',
                'unique_together': {('assembly', 'ram')},
            },
        ),
        migrations.AddField(
            model_name='assembly',
            name='ram',
            field=models.ManyToManyField(through='beatgt_app.AssemblyRam', to='beatgt_app.ram'),
        ),
        migrations.AddField(
            model_name='assembly',
            name='like',
            field=models.ManyToManyField(related_name='liked_assemb', to='beatgt_app.user'),
        ),
        migrations.AddField(
            model_name='assembly',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='beatgt_app.user'),
        ),
    ]
