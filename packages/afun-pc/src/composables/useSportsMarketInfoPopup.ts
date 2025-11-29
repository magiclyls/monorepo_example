import AppSportsMarketInfoPopup from '~/components/AppSportsMarketInfoPopup.vue'

export function useSportsMarketInfoPopup() {
  const {
    openDialog: openSportsMarketInfoPopup,
    closeDialog: closeSportsMarketInfoPopup,
  } = useBasePopup({ default: props => h(AppSportsMarketInfoPopup, props) })

  return {
    openSportsMarketInfoPopup,
    closeSportsMarketInfoPopup,
  }
}
