import './scss/create_assembly.scss';
import { component_status, add_component_head } from '../../constants';
import AppSvg from '../../svg/AppSvg';
import { AppContext } from '../../App';
import { getAddComponents, addAssembly } from '../../service/route';

import { ComponentStatusBox, AddComponent, SaveAssembly } from './components/components';
import { useState, useContext } from 'react';

export default function CreateAssembly() {

    const { deviceSize } = useContext(AppContext);

    const [windowIdx, setWindowIdx] = useState(0);
    const [load, setLoad] = useState(false);
    const [searchComponents, setSearchComponents] = useState([]);
    const [search, setSearch] = useState('');
    const [count, setCount] = useState(1);
    const [name, setName] = useState('');
    const [componentIdx, setComponentIdx] = useState(JSON.parse(sessionStorage.getItem('idx')) || 0);
    const [errorComponent, setErrorComponent] = useState(JSON.parse(sessionStorage.getItem('error')) || {
        hull: [],
        motherboard: [],
        cpu: [],
        cooler: [],
        ram: [],
        gpu: [],
        hard_disk: [],
        power_supply: []
    });
    const [componentsInfo, setComponentsInfo] = useState(JSON.parse(sessionStorage.getItem('assemblyInfo')) || []);
    const [checkInfo, setCheckInfo] = useState(JSON.parse(sessionStorage.getItem('checkInfo')) || {
        hull: {
            form_factor: null, //Форм фактор для сравнения с материнской платой
            slots_count: null, //Общее кол-во слотов занятости для видеокарт
            max_length_gpu: null, //Максимальная длина видеокарты
            max_height_culler: null, //Максимальная высота куллера
        },
        motherboard: {
            socket: null, //Для процессора
            type_ram: null, //Типы поддерживаемой оперативной памяти
            memory_frequency_specification: null, //Частотная спецификация для оперативной памяти
            maximum_memory_size: null, //Максимальный объём оперативной памяти
            all_slots: null, //Содержит в себе тип разъёма и кол-во
        },
        cpu: {
            max_heat_generation: null, //макс тепловыделение для куллера
            type_rams: null, //Здесь тип и частота операвтивной памяти
            maximum_memory_size: null, //Максимальный объём оперативной памяти
        },
        cooler: {
            max_heat_generation: null, //макс тепловыделение для процессора
            all_socket: null, //Все поддерживаемые сокеты для процессора
            power_consumption: null, //Потребляема мощность для БП
        },
        ram: [], //Хранит в себе массив объектов
        gpu: [], //Хранит в себе массив объектов
        hard_disk: [], //Хранит в себе массив объектов
        power_supply: {}
    })

    //Функция отправки сборки
    function handleSubmit(e, price){
        e.preventDefault();

        setLoad(true);

        const data={
            name: name,
            price: price,
            login: JSON.parse(localStorage.getItem('user'))?.nickname,
            hull: 0,
            motherboard: 0,
            cpu: 0,
            cooler: 0,
            ram: [],
            gpu: [],
            hard_disk: [],
            power_supply: 0 
        }

        componentsInfo.forEach(item => {
            if(typeof(data[item.type]) === "object"){
                data[item.type] = [...data[item.type], {id: item.id, count: item.count}]
            }else{
                data[item.type] = item.id
            }
        })

        addAssembly(data)
        .then(d => {
            sessionStorage.clear();
            window.location.href = '/home';
        })
        .catch(e => alert('Что-то пошло не так. Возможно вы не добавили какую-то деталь'))
        .finally(_ => {
            setLoad(false);
        })

    }

    //Функция заполнения ошибок в стейт и в сессион стораже
    function setErrorComponentSession(type, error) {
        const session_error = {
            ...errorComponent,
            [type]: error ? [...errorComponent[type], error] : []
        };
        sessionStorage.setItem('error', JSON.stringify(session_error))
        setErrorComponent({
            ...errorComponent,
            [type]: error ? [...errorComponent[type], error] : []
        })
    }

    //Функция заполнения информации  в стейт и в сессион стораже
    function setCheckInfoSession(type, data) {
        const check_info = {
            ...checkInfo,
            [type]: data
        }
        setCheckInfo({
            ...checkInfo,
            [type]: data
        })
        sessionStorage.setItem('checkInfo', JSON.stringify(check_info))
    }

    //Функция переключения вкладок
    function slideWindow(type) {
        if (type) {
            setWindowIdx((((windowIdx + 1) % 3) + 3) % 3);
        } else {
            setWindowIdx((((windowIdx - 1) % 3) + 3) % 3);
        }
    }

    //Функция нахождения комплектующего
    function handleSearchComponents(value, type) {
        setSearch(value);
        if (!value) {
            setSearchComponents([]);
            return;
        }
        setLoad(true);
        const searchParams = value.split(',');
        getAddComponents(searchParams[0]?.trim(), searchParams[1]?.trim(), type)
            .then(d => {
                setSearchComponents(d.obj);
            })
            .catch(e => {
                setSearchComponents([]);
            })
            .finally(_ => {
                setLoad(false);
            })
    }

    //Функция ввода количества
    function handleChangeCount(e) {
        setCount(+e.target.value);
    }

    //Функция ввода названия сборки
    function handleChangeName(e) {
        setName(e.target.value);
    }

    //Функция формирования информации о компоненте
    function getObjComponent(c, type, count) {
        return {
            id: c.id,
            type: type,
            name: `${c.brand} ${c.model} кол-во ${count}шт.`,
            price: count * c.price,
            logo: c.logo,
            count: count
        }
    }

    //Вспомогательная функция для заполнения сборки(одно комплектюущее одного типа)
    function helpAddComponent(data, type) {
        //Если комплектующее не подтверждено выведем предупреждение
        if (data.status !== 'accepted') {
            alert('Внимание комплектующее может нести не достоверную информацию! В случая, если информация не подтвердится комплектующще и сброка будут удалены!')
        }
        const info = getObjComponent(data, type, 1);
        const help_arr_info = componentsInfo.find(item => item.type === type) ? componentsInfo.map(item => { return item.type === type ? info : item }) : [...componentsInfo, info];
        componentsInfo.find(item => item.type === type) ? setComponentsInfo(componentsInfo.map(item => { return item.type === type ? info : item })) : setComponentsInfo([...componentsInfo, info]);
        sessionStorage.setItem('assemblyInfo', JSON.stringify(help_arr_info));
    }

    //Вспомогательная функция для заполнения сборки(много комплектюущее одного типа)
    function helpAddComponentMult(data, type) {
        //Если комплектующее не подтверждено выведем предупреждение
        if (data.status !== 'accepted') {
            alert('Внимание комплектующее может нести не достоверную информацию! В случая, если информация не подтвердится комплектующще и сброка будут удалены!')
        }
        const info = getObjComponent(data, type, count);
        const help_arr_info = [...componentsInfo, info];
        setComponentsInfo([...componentsInfo, info]);
        sessionStorage.setItem('assemblyInfo', JSON.stringify(help_arr_info));
    }

    //Заполнения свойств для сравнения Корпуса
    function setCheckHull(data) {
        setCheckInfoSession('hull', {
            form_factor: data.form_factor,
            slots_count: data.slots_count,
            max_length_gpu: data.max_length_gpu,
            max_height_culler: data.max_height_culler,
        })
    }

    //Заполнение свойств для сравнения Материнской платы
    function setCheckMotherboard(data) {
        const type_rams = data.type_ram.split(',');
        const slots = data.all_slots.split(',');
        const counts = data.count_slots.split(',');
        const all_slots = slots.map((item, idx) => { return { 'slot': item, 'count': +counts[idx] || 0 } })
        setCheckInfoSession('motherboard', {
            socket: data.socket,
            type_ram: type_rams,
            form_factor_ram: data.form_factor_ram,
            memory_frequency_specification: data.memory_frequency_specification,
            maximum_memory_size: data.maximum_memory_size,
            all_slots: all_slots
        })
    }

    //Функция проверки материнской платы с остальными комплектующими
    function checkMotherboard(data) {
        if ((checkInfo.hull.form_factor !== data.form_factor)) {
            setErrorComponentSession('motherboard', 'Форм факторы не совпадают')
        } else {
            setErrorComponentSession('motherboard')
        }
        return;
    }

    //Заполение сравнительной информации для процессора
    function setCheckCpu(data) {
        const spec = data.memory_frequency_specification.split(',');
        const type_rams = spec.map(item => {
            const tmp = item.trim().split(' ');
            return {
                'type': tmp[0],
                'spec': +tmp[1]
            }
        })
        setCheckInfoSession('cpu', {
            max_heat_generation: parseInt(data.heat_generation.split('-').pop()),
            type_rams: type_rams,
            maximum_memory_size: data.maximum_memory_size
        })
    }

    //Проверка процессора
    function checkCpu(data) {
        if (data.socket !== checkInfo.motherboard.socket.replace('Socket', '')) {
            setErrorComponentSession('cpu', 'Сокеты не совпадают')
        } else {
            setErrorComponentSession('cpu')
        }
    }

    //Заполнение сравнительной информации для Куллера
    function setCheckCooler(data) {
        const slots = data.socket_compatibility.split(',').map(item => item.trim());
        setCheckInfoSession('cooler', {
            max_heat_generation: data.max_heat_generation,
            all_socket: slots, //Все поддерживаемые сокеты для процессора
            power_consumption: data.power_consumption, //Потребляема мощность для БП
        });
    }

    //Проверить куллер
    function checkCooler(data) {
        const sockets = data.socket_compatibility.split(',').map(item => item.replace('Socket', '').trim());
        if (!sockets.find(item => checkInfo.motherboard.socket.includes(item))) {
            setErrorComponentSession('cooler', 'Кулер не подходит по сокету')
        } else if (data.height > checkInfo.hull.max_height_culler) {
            setErrorComponentSession('cooler', 'Куллер не подходит по высоте');
        } else if (data.max_heat_generation < checkInfo.cpu.max_heat_generation) {
            setErrorComponentSession('cooler', 'С такми куллером процессор сгорит');
        } else {
            setErrorComponentSession('cooler');
        }
    }

    //Заполнение сравнительной информации для оперативной памяти
    function setCheckRam(data) {
        setCheckInfoSession('ram', [...checkInfo.ram, {
            type: data.type_ram,
            form_factor: data.form_factor_ram,
            memory_size: data.memory_size * count,
            memory_frequency_specification: data.memory_frequency_specification
        }])
    }

    //Проверка оперативной памяти с другими
    function checkRam(data) {
        let max_memory_size_mother = checkInfo.motherboard.maximum_memory_size;
        let max_memory_size_cpu = checkInfo.cpu.maximum_memory_size;
        let tmp_rams_memory = data.memory_size * count;
        checkInfo.ram.forEach(item => {
            tmp_rams_memory += item.memory_size
        })
        if (max_memory_size_mother < tmp_rams_memory) {
            setErrorComponentSession('ram', 'Превышен допустимый объём для материнской платы')
        }
        if (max_memory_size_cpu < tmp_rams_memory) {
            setErrorComponentSession('ram', 'Превышен допустимый объём для процессора')
        }
        if (!checkInfo.motherboard.type_ram.includes(data.type_ram)) {
            setErrorComponentSession('ram', 'Материнская плата не поддерживает тип памяти')
        } else if (checkInfo.motherboard.memory_frequency_specification < data.memory_frequency_specification) {
            setErrorComponentSession('ram', 'Материнская плата не поддерживает частоту опреативной памяти')
        }

        const cpu_type_ram = checkInfo.cpu.type_rams.find(item => item.type === data.type_ram)

        if (!cpu_type_ram) {
            setErrorComponentSession('ram', 'Процессор не поддерживает тип памяти')
        } else if (cpu_type_ram?.spec < data.memory_frequency_specification) {
            setErrorComponentSession('ram', 'Процессор не поддерживает частоту опреативной памяти')
        }
    }

    //Заполнение сравнения для видеокарты
    function setCheckGpu(data) {
        setCheckInfoSession('gpu', [...checkInfo.gpu, {
            interface: data.interface,
            power_consumption: data.power_consumption * count,
            length: data.length
        }]);
    }

    //Проверка видеокарты 
    function checkGpu(data) {
        //Слот, который занимает видеокарта
        const tmp_interface = checkInfo.motherboard.all_slots.find(item => item.slot.includes(data.interface));
        let busy_interface_mother = count;
        let busy_slots_hull = 1
        if (checkInfo.hull.max_length_gpu < data.length) {
            setErrorComponentSession('gpu', 'Видеокарта не подойдёт к корпусу');
        }
        if (!tmp_interface) {
            setErrorComponentSession('gpu', 'Материнская плата не поддерживает интерфейс видеокарты')
        }
        checkInfo.gpu.forEach(item => {
            if (item.interface === data.interface) {
                busy_interface_mother += 1;
            }
            busy_slots_hull += 1;
        })

        if (busy_interface_mother > tmp_interface.count) {
            setErrorComponentSession('gpu', 'Все слоты в материнской плате заняты')
        }
        if (busy_slots_hull > checkInfo.hull.slots_count) {
            setErrorComponentSession('gpu', 'Место в корпусе занято')
        }
    }

    //Заполнение иформации для сравненяи жёсткого диска
    function setCheckDisk(data) {
        setCheckInfoSession('hard_disk',[...checkInfo.hard_disk, {
            connector: data.connector,
            power_consumption: data.power_consumption
        }]);
    }

    //Проверка жёсткого диска
    function checkDisk(data) {
        //Слот, который занимает жёсткий диск
        const tmp_interface = checkInfo.motherboard.all_slots.find(item => item.slot.includes(data.connector));
        let busy_interface_mother = count;
        if (!tmp_interface) {
            setErrorComponentSession('hard_disk', 'Материнская плата не поддерживает интерфейс жёсткого диска')
        }

        checkInfo.hard_disk.forEach(item => {
            if (item.connector === data.connector) {
                busy_interface_mother += 1;
            }
        })

        if (busy_interface_mother > tmp_interface.count) {
            setErrorComponentSession('hard_disk', 'Все слоты в материнской плате заняты')
        }
    }

    //Проверка блока питания
    function checkPower(data) {
        if (checkInfo.hull.form_factor !== data.form_factor) {
            setErrorComponentSession('power_supply', 'Блок питания не подойдёт к корпусу')
        }

        let busy_power = 0;

        checkInfo.gpu.forEach(item => {
            busy_power += item.power_consumption
        })

        busy_power += checkInfo.cooler.power_consumption;

        checkInfo.hard_disk.forEach(item => {
            busy_power += item.power_consumption
        })

        if (busy_power > data.power) {
            setErrorComponentSession('power_supply', 'Блок питания не выдержит нагрузку')
        } else {
            setErrorComponentSession('power_supply')
        }

    }

    //Функция добавления компонeнта
    function handleAddComponent(type, data) {
        switch (type) {
            case 'hull':
                setCheckHull(data)
                helpAddComponent(data, type);
                break;
            case 'motherboard':
                setCheckMotherboard(data);
                checkMotherboard(data);
                helpAddComponent(data, type);
                break;
            case 'cpu':
                setCheckCpu(data);
                checkCpu(data);
                helpAddComponent(data, type);
                break;
            case 'cooler':
                setCheckCooler(data);
                checkCooler(data);
                helpAddComponent(data, type);
                break;
            case 'ram':
                setCheckRam(data);
                checkRam(data);
                helpAddComponentMult(data, type);
                break;
            case 'gpu':
                setCheckGpu(data);
                checkGpu(data);
                helpAddComponentMult(data, type);
                break;
            case 'hard_disk':
                setCheckDisk(data);
                checkDisk(data);
                helpAddComponentMult(data, type);
                break;
            case 'power_supply':
                checkPower(data);
                helpAddComponent(data, type)
                break;
            default:
                return;
        }
    }

    //Функция очистки всей сборки
    function handleClear() {
        sessionStorage.clear();
        setComponentIdx(0);
        setSearchComponents([]);
        setSearch('');
        setCount(1);
        setErrorComponent({
            hull: [],
            motherboard: [],
            cpu: [],
            cooler: [],
            ram: [],
            gpu: [],
            hard_disk: [],
            power_supply: []
        });
        setComponentsInfo([]);
    }

    //Функция по нажатию назад
    function handleBack(type) {
        const idx = componentIdx - 1;
        setComponentIdx(componentIdx - 1);
        sessionStorage.setItem('idx', idx);
        setComponentsInfo([...componentsInfo.filter(item => item.type !== type)]);
        setErrorComponent({
            ...errorComponent,
            [type]: []
        });
        setSearch('');
        setCount(1);
        setSearchComponents([]);
        setCheckInfo({
            ...checkInfo,
            [type]: checkInfo[type].length ? [] : {}
        })
    }

    //Функция по нажатию далее
    function handleNext() {
        const idx = componentIdx + 1;
        setComponentIdx(componentIdx + 1);
        sessionStorage.setItem('idx', idx);
        setSearch('');
        setCount(1);
        setSearchComponents([])
    }

    return (
        <div className='create-assembly-box'>
            <div className={windowIdx !== 0 && deviceSize < 1024 ? 'none' : 'create-assembly-box_assembly-msg-box'}>
                {
                    component_status.map((s, idx) => {
                        return <ComponentStatusBox key={idx} type={s} error={errorComponent[s]} />
                    })
                }
            </div>
            <AddComponent
                className={windowIdx !== 1 && deviceSize < 1024 ? 'none' : 'create-assembly-box_add-component-box'}
                header={add_component_head[component_status[componentIdx]]}
                type={component_status[componentIdx]}
                load={load}
                components={searchComponents}
                onChange={handleSearchComponents}
                onChangeCount={handleChangeCount}
                idx={componentIdx}
                addComponent={handleAddComponent}
                search={search}
                count={count}
                next={handleNext}
                back={handleBack}
            />
            <SaveAssembly
                className={windowIdx !== 2 && deviceSize < 1024 ? 'none' : 'create-assembly-box_assembly-form'}
                info={componentsInfo}
                clear={handleClear}
                error={errorComponent}
                name={name}
                handleChangeName={handleChangeName}
                handleSubmit={handleSubmit}
                load={load}
            />
            {
                deviceSize < 1024 && (
                    <div className='create-assembly-box_choose-box'>
                        <AppSvg onClick={() => slideWindow(false)} className="create-assembly-box_choose-box_row-svg" type='left-row' />
                        <AppSvg onClick={() => slideWindow(true)} className="create-assembly-box_choose-box_row-svg" type='right-row' />
                    </div>
                )
            }
        </div>
    )
}