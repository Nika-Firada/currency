import { useEffect, useState } from "react";
import CurrencyRow from "./CurrencyRow";


function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if(amountInFromCurrency){
    fromAmount = amount
    toAmount = amount * exchangeRate
  }else{
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  const myHeaders = new Headers();
  myHeaders.append("apikey", "Y9vlT8ECqj1HzMLp5KpLo0u5wyzzIie7");
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };

  useEffect(()=>{
    fetch("https://api.apilayer.com/exchangerates_data/latest", requestOptions)
    .then(res=>res.json())
    .then(data=> {
      const firstCurrency = Object.keys(data.rates)[0];
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
  }, [])

  useEffect(()=>{
    if(fromCurrency != null && toCurrency != null){
      fetch(`https://api.apilayer.com/exchangerates_data/latest?symbols=${toCurrency}&base=${fromCurrency}`, requestOptions)
      .then(res=>res.json())
      .then(data=>setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }
  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }
  return (
    <div className="contain">
      <h1>Currency Convert</h1>
      <CurrencyRow
      amount={fromAmount} 
      currencyOptions={currencyOptions} 
      selectedCurrency={fromCurrency}
      onChangeCurrency={e => setFromCurrency(e.target.value)}
      onChangeAmount={handleFromAmountChange}
      />
      <div className="equals">=</div>
      <CurrencyRow
      amount={toAmount} 
      currencyOptions={currencyOptions} 
      selectedCurrency={toCurrency}
      onChangeAmount={handleToAmountChange}
      onChangeCurrency={e => setToCurrency(e.target.value)}
      />
    </div>
  );
}

export default App;
