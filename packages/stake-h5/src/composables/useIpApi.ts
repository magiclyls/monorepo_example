import { ApiMemberLocation } from '@tg/apis'

export interface IIPApiDdata {
  ip: string
  network: string
  version: string
  city: string
  region: string
  region_code: string
  country: string
  country_name: string
  country_code: string
  country_code_iso3: string
  country_capital: string
  country_tld: string
  continent_code: string
  in_eu: boolean
  postal?: any
  latitude: number
  longitude: number
  timezone: string
  utc_offset: string
  country_calling_code: string
  currency: string
  currency_name: string
  languages: string
  country_area: number
  country_population: number
  asn: string
  org: string
}

export const useIpApi = createGlobalState(() => {
  const phonePrefix = ref('')
  const { userInfo } = storeToRefs(useAppStore())
  const ipAddress = ref('')
  const country_name = ref('')
  const country_capital = ref('')
  const city = ref('')
  const countryCallingCode = computed(() => {
    const _prefix = userInfo.value?.phone ? userInfo.value?.phone.split('-')[0] : ''
    if (_prefix)
      return _prefix

    return phonePrefix.value
  })

  useRequest(ApiMemberLocation, {
    manual: false,
    onSuccess: (res) => {
      phonePrefix.value = res.code
      ipAddress.value = res.ip
      country_name.value = res.name
      city.value = res.city
    },
  })

  // axios.get('https://ipapi.co/json/').then((res: AxiosResponse<IIPApiDdata, IIPApiDdata>) => {
  //   const { data } = res
  //   // phonePrefix.value = data.country_calling_code
  //   ipAddress.value = data.ip
  //   country_name.value = data.country_name
  //   country_capital.value = data.country_capital
  //   city.value = data.city
  // })
  //   .catch((err) => {
  //     console.log('🦺🦺🦺 ~ useIpApi ~ err:', err)
  //   })

  return {
    countryCallingCode,
    ipAddress,
    country_name,
    country_capital,
    city,
  }
})
