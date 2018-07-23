import {iso3166_data} from "phone";


export let countryCodeMap = {};
iso3166_data.map(i => {
    countryCodeMap[i.alpha3] = i.country_code;
    return i;
});

export let countryLongNameMap = {};
iso3166_data.map(i => {
    countryLongNameMap[i.alpha2] = i.alpha3;
    return i;
});


