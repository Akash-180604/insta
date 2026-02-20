import React from 'react'

const shortCount = (number) => {
    if(number==undefined || number==null){
        return number
    }

let result;

if(number>=1000000000){
  const i =  (number/1000000000).toFixed(2)
  result = i + 'B'
}else if (number>=1000000) {
  const i =  (number/1000000).toFixed(2)
  result = i + 'M'
  }else if(number>=1000){
 const i =  (number/1000).toFixed(2)
  result = i + 'K'
 }else{
  result = number.toString()
 }

  return result
}

export default shortCount