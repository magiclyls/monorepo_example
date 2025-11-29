import AppSportsMarketInfoPopup from '~/components/AppSportsMarketInfoPopup.vue'

export function useSportsMarketInfoPopup() {
  const {
    openDialog: openHelpPopup,
    closeDialog: closeHelpPopup,
  } = useBasePopup({ default: props => h(AppSportsMarketInfoPopup, props) })

  return {
    openHelpPopup,
    closeHelpPopup,
  }
}
