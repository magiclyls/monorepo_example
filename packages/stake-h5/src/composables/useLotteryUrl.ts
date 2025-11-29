export function useLotteryUrl() {

  function getLotteryUrl (){
        return `${location.origin}/lottery`
  }

  return {
    getLotteryUrl,
  }
}
