'use client';
import { set } from 'firebase/database';
import { useState, useEffect } from 'react';
const useDeliveryAddress = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvinceId, setSelectedProvinceId] = useState(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);
    const [selectedWardId, setSelectedWardId] = useState(null);
    const transformIdToNameProvince = (id) => {
        const province = provinces.find((province) => province.PROVINCE_ID == id);
        return province ? province.PROVINCE_NAME : '';
    }
    const transformIdToNameDistrict = (id) => {
        const district = districts.find((district) => district.DISTRICT_ID == id);
        return district ? district.DISTRICT_NAME : '';
    }
    const transformIdToNameWard = (id) => {
        const ward = wards.find((ward) => ward.WARDs_ID == id);
        return ward ? ward.WARDS_NAME : '';
    }
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
                    return district.PROVINCE_ID == selectedProvinceId;
                });
                setDistricts(filterDistricts);
                setSelectedDistrictId(null);
            })
            .catch((error) =>
                console.error('Error fetching districts:', error),
            );
    }, [selectedProvinceId]);

    const handleProvinceChange = (provinceId) => {
        setSelectedDistrictId(null);
        setSelectedProvinceId(provinceId);
    };

    // const handleDistrictChange = (districtId) => {
    //     setSelectedDistrictId(districtId);
    //     fetch('/data/PDW/wards.json')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             const filterWards = data.filter(
    //                 (ward) => ward.DISTRICT_ID == districtId,
    //             );
    //             setWards(filterWards);
    //             setSelectedWardId(null);
    //         })
    //         .catch((error) => console.error('Error fetching wards:', error));
    // };
    useEffect(() => {
        fetch('/data/PDW/wards.json')
            .then((response) => response.json())
            .then((data) => {
                const filterWards = data.filter(
                    (ward) => {                     return ward.DISTRICT_ID == selectedDistrictId },
                );
                setWards(filterWards);
            })
            .catch((error) => console.error('Error fetching wards:', error));
    }, [selectedDistrictId]);

    const handleDistrictChange = (districtId) => {
        setSelectedDistrictId(districtId);
    }

    const handleWardChange = (wardId) => {
        setSelectedWardId(wardId);
    }
    return {
        provinces,
        districts,
        wards,
        selectedProvinceId,
        selectedDistrictId,
        selectedWardId,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        transformIdToNameProvince,
        transformIdToNameDistrict,
        transformIdToNameWard,
    };
};
export default useDeliveryAddress;
