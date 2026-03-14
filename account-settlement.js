/**
 * 
 * @param transactions 
 * @returns 
 * 
 * [[A,B,10],[C,A,5]]
 * 
 * from_person, to_person, amount
 */
function minTransfers(transactions) {

  // Step 1: Calculate net balance for each person
  const balance = new Map();

  for (const [from, to, amount] of transactions) {
    balance.set(from, (balance.get(from) || 0) - amount); // payer loses money
    balance.set(to, (balance.get(to) || 0) + amount);     // receiver gains money
  }

  balance = {
    A: "A's current balance" - amount,
    B: "B's current balance" + amount
  }

  // Step 2: Keep only non-zero balances
  const debts = [];
  for (const val of balance.values()) {
    if (val !== 0) debts.push(val);
  }

  // Step 3: DFS function to settle debts starting from index
  function dfs(start) {

    // Skip people whose balance is already settled
    while (start < debts.length && debts[start] === 0) {
      start++;
    }

    // If all balances are settled
    if (start === debts.length) {
      return 0;
    }

    let minTransactions = Infinity;

    // Try settling debts[start] with every opposite balance
    for (let i = start + 1; i < debts.length; i++) {

      // Only settle if signs are opposite (one owes, one receives)
      if (debts[start] * debts[i] < 0) {

        // Temporarily settle start with i
        debts[i] += debts[start];
        // -20 = -20 + 10

        // Recursively solve for remaining people
        minTransactions = Math.min(minTransactions, 1 + dfs(start + 1));

        // Backtrack (undo the transaction)
        debts[i] -= debts[start];

        // Optimization: if exact match found, stop early
        if (debts[i] + debts[start] === 0) {
          break;
        }
      }
    }

    return minTransactions;
  }

  return dfs(0);
}