import BeatGTApi from "./api";

export function CreateUser(data) {
    return BeatGTApi.post('/registration/', JSON.stringify(data))
}

export function AuthUser(data) {
    return BeatGTApi.post('/auth_user/', JSON.stringify(data))
}

export function GetComponent(id = 0, type = '') {
    return BeatGTApi.get(`/component/?id=${id}&type=${type}`);
}

export function GetAssembly(id = 0) {
    return BeatGTApi.get(`/assembly/?id=${id}`);
}

export function postComponent(type = '', row = {}) {
    return BeatGTApi.post('/create_component/', JSON.stringify({ type, row }));
}

export function assembLike(data){
    return BeatGTApi.post('/assembly_like/', JSON.stringify(data));
}

export function getStatsCount(){
    return BeatGTApi.get('/count_stats');
}

export function delAssemb(id){
    return BeatGTApi.delete(`/delete_assembly/?id=${id}`);
}

export function getAssamblies(searchParam){
    return BeatGTApi.get(`/get_assemblies/${searchParam}`);
}

export function getAddComponents(brand = '', model = '', type){
    return BeatGTApi.get(`/get_filter_component/?type=${type}&brand=${brand}&model=${model}`)
}

export function addAssembly(data){
    return BeatGTApi.post('/create_assembly/', JSON.stringify(data))
}