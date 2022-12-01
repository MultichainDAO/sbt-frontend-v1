
import { ethers, BigNumber } from "ethers"

import networks from "./networks"


enum Units {
  gwei = "gwei",
  ether = "ether"
}



const ZERO = BigNumber.from("0")
const ZERO_ADDR = "0x0000000000000000000000000000000000000000"
const ONE_ETHER = BigNumber.from("1000000000000000000")
const MAX_UINT = BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")

const parseUnits = (value: string, unit: Units | number): BigNumber => {
  return ethers.utils.parseUnits(value, unit)
}

const formatUnits = (value: BigNumber | null, units: Units | number): string => {
  if(!value) return "0.0"
  return ethers.utils.formatUnits(value, units)
}

const validChain = (id: number) => {
  for(let i = 0; i < networks.length; i++) {
    if(networks[ i ].chainId === id) return true
  }
  return false
}

const checkIsShortEnough = (amount: string): boolean => {
  const isDecimal = amount.includes(".")
  const decimalPlaces = isDecimal ? amount.slice(amount.indexOf(".") + 1).length : 0
  const isShortEnough = isDecimal ? decimalPlaces <= 18 : amount.length <= 20
  return isShortEnough
}

const significantDigits = (value: string, sig: number): string => {
  const isDecimal = value.includes(".")
  const decimalPlaces = isDecimal ? value.slice(value.indexOf(".") + 1).length : 0
  const valueLength = isDecimal ? value.slice(0, value.indexOf(".")).length : value.length
  let returnVal
  if(valueLength >= sig) {
    returnVal = (Number(value)).toFixed(0)
  } else if((decimalPlaces + valueLength) > sig) {
    const decimalsToShow = sig - valueLength
    returnVal = (Number(value)).toFixed(decimalsToShow)
  } else {
    returnVal = value
  }

  if(Number(returnVal) === 0 && Number(value) !== 0) {
    return Number(value).toFixed(10)
  }

  return returnVal
}

const formatAddr = (addr: string) => {
  const start = addr.slice(2, 6)
  const end = addr.slice(38, 42)
  return "0x" + (start + "..." + end)
}

const tsToTime = () => {
  const date = new Date(Date.now())
  const hours = (date.getUTCHours() + 1).toString()
  const minutes = date.getUTCMinutes().toString()
  const seconds = date.getUTCSeconds().toString()
  return (
    "(" +
    (hours.length < 2 ? "0" + hours : hours) +
    ":" +
    (minutes.length < 2 ? "0" + minutes : minutes) +
    ":" +
    (seconds.length < 2 ? "0" + seconds : seconds) +
    ")"
  )
}

const tsToDate = (ts: string) => {
  const timestampMs = 1000 * Number(ts)
  const date = (new Date(timestampMs)).toDateString()
  return date
}

const minutesToSeconds = (minutes: string): BigNumber => {
  return BigNumber.from(minutes).mul("60")
}

const nowPlusTime = (minutes: string) => {
  const secondsToTime = minutesToSeconds(minutes)
  const nowSeconds = ((Date.now())/1000).toFixed(0)
  return secondsToTime.add(nowSeconds).toString()
}

export {
  ZERO,
  ZERO_ADDR,
  ONE_ETHER,
  MAX_UINT,
  Units,
  parseUnits,
  formatUnits,
  validChain,
  checkIsShortEnough,
  significantDigits,
  formatAddr,
  tsToTime,
  tsToDate,
  minutesToSeconds,
  nowPlusTime
}
