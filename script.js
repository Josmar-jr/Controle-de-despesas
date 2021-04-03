const transactionsUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
)

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : []

const removeTransaction = (ID) => {
  transactions = transactions.filter(({ id }) => id !== ID)
  updateLocalStorage()
  init()
}

const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? "-" : " "
  const CSSclass = amount < 0 ? "minus" : "plus"
  const amountWithoutOperator = Math.abs(amount)
  const li = document.createElement("li")

  li.classList.add(CSSclass)
  li.innerHTML = `
        ${name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `

  transactionsUl.prepend(li)
}

const getIncome = transactionsAmounts => transactionsAmounts
  .filter((value) => value > 0)
  .reduce((accumulator, value) => accumulator + value, 0)
  .toFixed(2)

const getExpense = transactionsAmounts => Math.abs(
  transactionsAmounts
    .filter((value) => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0)
).toFixed(2)

const updateBalanceValues = () => {
  // Create new array with the transactions amount
  const transactionsAmounts = transactions.map(
    ({ amount }) => amount
  )
  // Filter and sum the values in income
  const income = getIncome(transactionsAmounts)
  // Filter and sum the values in expense
  const expense = getExpense(transactionsAmounts)
  // Sum the transactions amount
  const total = transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
  transactionsUl.innerHTML = ""
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()
}

init();

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addTransactionArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ""
  inputTransactionAmount.value = ""
}

const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const isSomeInputEmpty = transactionName === "" || transactionAmount === ""

  if (isSomeInputEmpty) {
    alert("Por favor, preencha tanto o nome quanto o valor da transação")
    return
  }

  addTransactionArray(transactionName, transactionAmount)
  init()
  updateLocalStorage()
  cleanInputs()
}

form.addEventListener("submit", handleFormSubmit)

