export const getInformation = (data) => {
    return data.map(_data => ({
        name: _data.getName(),
        sensors: _data.getSensors(),
        custom_field: _data.getCustomFields(),
        position: _data.getPosition(),
        last_message: _data.getLastMessage(),
    }));
}
