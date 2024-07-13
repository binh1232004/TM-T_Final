'use client';
import { useState, useEffect } from 'react';
const useDeliveryAddress = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvinceId, setSelectedProvinceId] = useState(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);
    const [selectedWardId, setSelectedWardId] = useState(null);
    useEffect(() => {
        fetch('/data/PDW/provinces.json')
            .then((response) => response.json())
            .then((data) => {
                setProvinces(data);
            })
            .catch((error) =>
                console.error('Error fetching provinces: ', error),
            );
    }, []);
    useEffect(() => {
        fetch('/data/PDW/districts.json')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const filterDistricts = data.filter((district) => {
                    return district.PROVINCE_ID === selectedProvinceId;
                });
                console.log('filterDistricts', filterDistricts);
                setDistricts(filterDistricts);
                setSelectedDistrictId(null);
            })
            .catch((error) =>
                console.error('Error fetching districts:', error),
            );
    }, [selectedProvinceId]);

    const handleProvinceChange = (provinceId) => {
        setSelectedProvinceId(provinceId);
    };

    const handleDistrictChange = (districtId) => {
        setSelectedDistrictId(districtId);
        fetch('/data/PDW/wards.json')
            .then((response) => response.json())
            .then((data) => {
                const filterWards = data.filter(
                    (ward) => ward.DISTRICT_ID == districtId,
                );
                setWards(filterWards);
                setSelectedWardId(null);
            })
            .catch((error) => console.error('Error fetching wards:', error));
    };
    return {
        provinces,
        districts,
        wards,
        selectedProvinceId,
        selectedDistrictId,
        selectedWardId,
        handleProvinceChange,
        handleDistrictChange,
    };
};
export default useDeliveryAddress;
